#!/usr/bin/env node
// scripts/backfill-compare-to.js
// One-shot backfill of replaces + similar_to fields across all _repos/*.md.
// Idempotent: skips items already populated. Resumable via --resume.

import fs from 'fs';
import path from 'path';
import { validateCompareTo } from './lib/validator.js';
import { mergeOverrides, validateSlugs } from './lib/overrides.js';

const REPOS_DIR = '_repos';
const LOG_PATH = 'data/backfill-compare-to.log';
const LOCK_PATH = 'data/digest-running.lock';
const BATCH_SIZE = 15;

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const resume = args.includes('--resume');
const dryRun = args.includes('--dry-run');

function parseFrontMatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { fm: {}, body: content };
  const fm = {};
  let currentArrayKey = null;
  for (const line of m[1].split('\n')) {
    const arrayItem = line.match(/^\s*-\s+(.+)$/);
    if (arrayItem && currentArrayKey) {
      if (!Array.isArray(fm[currentArrayKey])) fm[currentArrayKey] = [];
      fm[currentArrayKey].push(arrayItem[1]);
      continue;
    }
    const kv = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
    if (kv) {
      currentArrayKey = null;
      const key = kv[1];
      let val = kv[2].trim();
      if (val === '') { currentArrayKey = key; fm[key] = []; continue; }
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      else if (val.startsWith('[')) {
        try { val = JSON.parse(val); } catch (e) { /* leave as string */ }
      }
      else if (/^\d+$/.test(val)) val = parseInt(val, 10);
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      fm[key] = val;
    }
  }
  return { fm, body: content.slice(m[0].length).replace(/^\n+/, '') };
}

function loadRepoFiles() {
  return fs.readdirSync(REPOS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const slug = f.replace(/\.md$/, '');
      const fullPath = path.join(REPOS_DIR, f);
      const content = fs.readFileSync(fullPath, 'utf8');
      const parsed = parseFrontMatter(content);
      return { slug, fullPath, ...parsed };
    });
}

function isPopulated(fm) {
  return Array.isArray(fm.replaces) || (typeof fm.compare_to_source === 'string');
}

function loadCheckpoint() {
  if (!resume || !fs.existsSync(LOG_PATH)) return new Set();
  return new Set(fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean));
}

function appendCheckpoint(slug) {
  fs.appendFileSync(LOG_PATH, slug + '\n');
}

function waitForLock() {
  return new Promise(resolve => {
    const check = () => {
      if (!fs.existsSync(LOCK_PATH)) return resolve();
      console.log('[backfill] digest is running; pausing 60s...');
      setTimeout(check, 60000);
    };
    check();
  });
}

function buildBatchPrompt(items) {
  const list = items.map(it => {
    const fm = it.fm;
    return `- ${it.slug}: ${fm.name || it.slug} (${fm.source || 'unknown'}, ${fm.language || 'multi'}): ${fm.description || it.body.slice(0, 200)}`;
  }).join('\n');
  return [
    'For each open-source item below, return THREE fields:',
    '1. blurb: a one-line editorial sentence (<=20 words, no hype words).',
    '2. replaces: array of up to 5 real, currently-active commercial products this could plausibly substitute for. Each {name, url, note?}. Return [] if unsure. DO NOT invent products.',
    '3. similar_to: array of up to 4 slugs of similar items in our catalog (format "owner--repo"). Return [] if unsure.',
    '',
    'Return ONLY valid JSON: {"<slug>": {"blurb": "...", "replaces": [...], "similar_to": [...]}}',
    '',
    list,
  ].join('\n');
}

const NIM_MODELS = [
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mixtral-8x22b-instruct-v0.1',
  'qwen/qwen2.5-72b-instruct',
];

async function generateBatch(items) {
  const prompt = buildBatchPrompt(items);
  for (const model of NIM_MODELS) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) {
        console.warn(`[backfill] ${model} returned ${res.status}; trying next`);
        continue;
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? '';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return { generated: parsed, generatorModel: model };
    } catch (err) {
      console.warn(`[backfill] ${model} threw: ${err.message}; trying next`);
    }
  }
  throw new Error('All NIM models exhausted for backfill batch');
}

function rewriteFile(item, compareEntry) {
  const fm = { ...item.fm };
  fm.replaces = compareEntry.replaces || [];
  fm.similar_to = compareEntry.similar_to || [];
  fm.compare_to_source = compareEntry.compare_to_source || 'llm';
  fm.compare_to_validated = compareEntry.compare_to_validated !== false;

  const lines = ['---'];
  const orderedKeys = [
    'layout', 'name', 'source', 'item_url', 'description', 'category',
    'language', 'stars', 'downloads', 'likes', 'og_image', 'readme_image',
    'first_featured', 'last_featured', 'times_featured', 'streak', 'appearances',
    'star_velocity', 'tags', 'icp_tags',
    'replaces', 'similar_to', 'compare_to_source', 'compare_to_validated',
  ];
  const seen = new Set();
  for (const key of orderedKeys) {
    if (!(key in fm)) continue;
    seen.add(key);
    const val = fm[key];
    if (key === 'replaces') {
      lines.push(`replaces: ${JSON.stringify(val)}`);
    } else if (key === 'similar_to') {
      lines.push(`similar_to: [${(val || []).map(s => JSON.stringify(s)).join(', ')}]`);
    } else if (Array.isArray(val)) {
      lines.push(`${key}: [${val.join(', ')}]`);
    } else if (typeof val === 'string') {
      lines.push(`${key}: "${val.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${key}: ${val}`);
    }
  }
  for (const [k, v] of Object.entries(fm)) {
    if (seen.has(k)) continue;
    if (typeof v === 'string') lines.push(`${k}: "${v.replace(/"/g, '\\"')}"`);
    else if (Array.isArray(v)) lines.push(`${k}: [${v.join(', ')}]`);
    else lines.push(`${k}: ${v}`);
  }
  lines.push('---', '', item.body);
  return lines.join('\n');
}

(async () => {
  if (!process.env.NVIDIA_API_KEY) {
    console.error('NVIDIA_API_KEY not set. Aborting.');
    process.exit(1);
  }
  await waitForLock();

  const all = loadRepoFiles();
  const checkpoint = loadCheckpoint();
  const todo = all.filter(it => !isPopulated(it.fm) && !checkpoint.has(it.slug)).slice(0, limit);

  console.log(`[backfill] ${all.length} total, ${todo.length} pending (limit=${limit}, resume=${resume}, dryRun=${dryRun})`);

  let overrides = {};
  try { overrides = JSON.parse(fs.readFileSync('config/compare-to-overrides.json', 'utf8')); }
  catch (e) { /* empty overrides */ }

  const knownSlugs = new Set(all.map(it => it.slug));

  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    console.log(`[backfill] batch ${Math.floor(i / BATCH_SIZE) + 1}: items ${i + 1}-${i + batch.length}`);

    let generated, generatorModel;
    try {
      ({ generated, generatorModel } = await generateBatch(batch));
    } catch (err) {
      console.error(`[backfill] batch failed: ${err.message}; skipping`);
      continue;
    }

    let compareToData = await validateCompareTo(generated, generatorModel, process.env);
    compareToData = mergeOverrides(compareToData, overrides);
    compareToData = validateSlugs(compareToData, knownSlugs);

    for (const item of batch) {
      const entry = compareToData[item.slug] || compareToData[item.fm.name];
      if (!entry) {
        console.warn(`[backfill] no entry returned for ${item.slug}`);
        continue;
      }
      if (dryRun) {
        console.log(`[dry-run] would write ${item.slug}: replaces=${(entry.replaces || []).length}, similar_to=${(entry.similar_to || []).length}`);
      } else {
        const rewritten = rewriteFile(item, entry);
        fs.writeFileSync(item.fullPath, rewritten);
        appendCheckpoint(item.slug);
      }
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('[backfill] done');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
