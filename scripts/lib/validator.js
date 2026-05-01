// scripts/lib/validator.js
// Adversarial cross-family validation of compare-to data emitted by the
// generator cascade. The validator must come from a different model family
// than the generator so its hallucination patterns are uncorrelated.

const NIM_MODELS = [
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mixtral-8x22b-instruct-v0.1',
  'qwen/qwen2.5-72b-instruct',
  'meta/llama-3.1-405b-instruct',
];

export function pickValidatorModel(generatorModel) {
  if (generatorModel.startsWith('meta/llama')) {
    return Math.random() < 0.5
      ? 'mistralai/mixtral-8x22b-instruct-v0.1'
      : 'qwen/qwen2.5-72b-instruct';
  }
  if (generatorModel.startsWith('mistralai/')) {
    return Math.random() < 0.5
      ? 'nvidia/llama-3.1-nemotron-70b-instruct'
      : 'qwen/qwen2.5-72b-instruct';
  }
  if (generatorModel.startsWith('qwen/')) {
    return Math.random() < 0.5
      ? 'meta/llama-3.3-70b-instruct'
      : 'mistralai/mixtral-8x22b-instruct-v0.1';
  }
  if (generatorModel === 'local/qwen3-14b') {
    return Math.random() < 0.5
      ? 'mistralai/mixtral-8x22b-instruct-v0.1'
      : 'meta/llama-3.3-70b-instruct';
  }
  if (generatorModel.startsWith('gemini') ||
      generatorModel.includes('llama-3.3-70b-instruct:free') ||
      generatorModel.includes('llama-3.3-70b-versatile') ||
      generatorModel.startsWith('claude-')) {
    return NIM_MODELS[Math.floor(Math.random() * NIM_MODELS.length)];
  }
  return NIM_MODELS[0];
}

export async function validateCompareTo(generated, generatorModel, env) {
  if (!env.NVIDIA_API_KEY) {
    return markAllUnvalidated(generated);
  }
  const validator = pickValidatorModel(generatorModel);
  const prompt = buildAdversarialPrompt(generated);
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: validator,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      console.warn(`[validator] ${validator} returned ${res.status}; shipping unvalidated`);
      return markAllUnvalidated(generated);
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const verdicts = JSON.parse(cleaned);
    return applyVerdicts(generated, verdicts);
  } catch (err) {
    console.warn(`[validator] failed: ${err.message}; shipping unvalidated`);
    return markAllUnvalidated(generated);
  }
}

function buildAdversarialPrompt(generated) {
  const items = [];
  for (const [key, entry] of Object.entries(generated)) {
    items.push(
      `## ${key}\n` +
      `replaces:\n${(entry.replaces || []).map((r, i) => `  [${i}] ${r.name} — ${r.url}${r.note ? ' (' + r.note + ')' : ''}`).join('\n') || '  (none)'}\n` +
      `similar_to:\n${(entry.similar_to || []).map((s, i) => `  [${i}] ${s}`).join('\n') || '  (none)'}`
    );
  }
  return [
    'You are an adversarial reviewer. Below are LLM-generated lists of commercial products that open-source repos allegedly replace, plus similar repos in our catalog.',
    '',
    'Your job is to FIND WHAT IS WRONG. For each item:',
    '- For each `replaces` entry: drop it if the commercial product does not exist, is defunct, or the displacement claim is implausible (an OSS repo could not realistically substitute for that SaaS).',
    '- For each `similar_to` entry: drop it unless you are confident the slug refers to a functionally similar tool.',
    '',
    'Return ONLY valid JSON in this exact shape (no markdown, no commentary):',
    '{"<key>": {"keep_replaces": [<surviving indexes>], "keep_similar_to": [<surviving indexes>], "reasons": {"<dropped_index>": "<short reason>"}}}',
    '',
    'Items to review:',
    '',
    items.join('\n\n'),
  ].join('\n');
}

function applyVerdicts(generated, verdicts) {
  const out = {};
  for (const [key, entry] of Object.entries(generated)) {
    const v = verdicts[key];
    if (!v) {
      out[key] = { ...entry, compare_to_validated: false };
      continue;
    }
    const keepR = new Set(v.keep_replaces || []);
    const keepS = new Set(v.keep_similar_to || []);
    out[key] = {
      ...entry,
      replaces: (entry.replaces || []).filter((_, i) => keepR.has(i)),
      similar_to: (entry.similar_to || []).filter((_, i) => keepS.has(i)),
      compare_to_validated: true,
    };
  }
  return out;
}

function markAllUnvalidated(generated) {
  const out = {};
  for (const [key, entry] of Object.entries(generated)) {
    out[key] = { ...entry, compare_to_validated: false };
  }
  return out;
}
