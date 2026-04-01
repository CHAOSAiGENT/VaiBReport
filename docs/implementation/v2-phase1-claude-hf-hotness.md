# Claude Code V2 Phase 1 Prompt

**Context:** VaiBReport is a daily GitHub digest blog on GitHub Pages (Jekyll). V1.5 is live with tightened UGC queries, mega-repo trending filter, and global trim. The automation chain works: `fetch-repos.yml` → `generate-digest.yml` → `deploy-blog.yml`. Read `VaiBReport-SPEC.md`, `CONTEXT.md`, and `V2-PUNCHLIST.md` for full context.

**Goal:** Wire up Claude API editorial voice, hotness streak data collection, and HuggingFace as first additional data source. Then re-trigger today's digest so we can test everything before tomorrow's cron.

**Important:** Do NOT delete or archive any pages or files. Commit after each major task so partial progress is safe.

---

## Task 1: Wire Claude API into generate-digest.yml (Item 1 — highest impact)

Replace the template-based one-liners with Claude-generated editorial blurbs. The `ANTHROPIC_API_KEY` secret is already set in the repo.

**What to change in `.github/workflows/generate-digest.yml`:**

1. Add `ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}` to the env of the "Generate digest post" step.

2. Replace the `writeOneLiner()` function with a Claude API call. After filtering and categorizing all repos, batch them into a single API request:

```javascript
async function generateEditorialBlurbs(repos, sections) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('No ANTHROPIC_API_KEY — falling back to template blurbs');
    return null; // fallback to template
  }

  // Build the prompt with all repos grouped by section
  let repoList = '';
  for (const [section, items] of Object.entries(sections)) {
    if (items.length === 0) continue;
    repoList += `\n## ${section}\n`;
    for (const r of items) {
      repoList += `- ${r.full_name} (${r.language || 'Multi'}, ${r.stargazers_count}★): ${r.description || 'No description'}\n`;
      if (r.topics && r.topics.length > 0) {
        repoList += `  Topics: ${r.topics.slice(0, 8).join(', ')}\n`;
      }
    }
  }

  const prompt = `You are writing one-liner editorial blurbs for a daily GitHub digest blog called VaiBReport. The audience is solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators.

Your voice: casual, dry humor, opinionated. You're a fellow builder who's seen a lot of repos and knows what matters. Think "the friend who texts you 'hey check this out' with actually good stuff." Be concise — each blurb is ONE sentence, max two. No fluff, no hype words like "revolutionary" or "game-changing." Say what it actually does and why someone building a product would care.

Here are the repos grouped by section. Write a blurb for each one. Return ONLY a JSON object mapping full_name to blurb string. No markdown, no explanation.

${repoList}

Return format:
{"owner/repo": "Your one-liner blurb here.", ...}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      console.error(`Claude API error: ${res.status} ${res.statusText}`);
      const body = await res.text();
      console.error(body);
      return null;
    }

    const data = await res.json();
    const text = data.content[0].text;

    // Parse the JSON response — Claude sometimes wraps in ```json blocks
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Claude API call failed:', e.message);
    return null;
  }
}
```

3. **IMPORTANT — Model string:** Use `claude-sonnet-4-6-20250514` as the model. If that exact string fails (404), try `claude-sonnet-4-5-20250929` as fallback. Check the Anthropic API docs or test with a curl call first:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-6-20250514","max_tokens":100,"messages":[{"role":"user","content":"Say hello"}]}'
```
Use whichever model string returns a 200.

4. After getting blurbs, update the markdown generation to use them:

```javascript
function writeOneLiner(repo, blurbs) {
  const lang = repo.language || 'Multi';
  const stars = formatStars(repo.stargazers_count);
  // Use Claude blurb if available, fall back to description
  const blurb = (blurbs && blurbs[repo.full_name])
    ? blurbs[repo.full_name]
    : (repo.description || 'No description provided.');
  return `- [${repo.full_name}](${repo.html_url}) – ${blurb} (${lang}, ${stars})`;
}
```

5. Call `generateEditorialBlurbs()` after categorization, before markdown generation. Pass the blurbs map to `writeOneLiner()`. If the API call fails, the template fallback produces the same output as today — no regression.

**Graceful degradation:** If `ANTHROPIC_API_KEY` is missing or the API call fails, fall back to the existing template. The digest always ships, even if the AI voice is unavailable.

---

## Task 2: Add Hotness Streak Data Collection (Item 5)

Modify `fetch-repos.yml` to track how often repos appear in search results over time.

**Add after the dedup step, before writing the daily JSON:**

```javascript
// ── Hotness tracking ──────────────────────────────
let hotness = {};
try {
  hotness = JSON.parse(fs.readFileSync('data/hotness.json', 'utf8'));
} catch (e) { /* fresh start */ }

const todayStr = new Date().toISOString().slice(0, 10);
const yesterdayStr = hotness._last_run || null;

for (const r of deduped) {
  const name = r.full_name;
  if (!hotness[name]) {
    hotness[name] = { appearances: 0, streak: 0, last_seen: null, first_seen: todayStr };
  }
  const entry = hotness[name];
  entry.appearances++;
  entry.last_seen = todayStr;

  // Streak: consecutive days appearing
  if (yesterdayStr && entry.last_seen_prev === yesterdayStr) {
    entry.streak++;
  } else if (!yesterdayStr) {
    entry.streak = 1; // first run
  } else {
    entry.streak = 1; // streak broken
  }
  entry.last_seen_prev = todayStr; // for tomorrow's comparison
}

// Decay streaks for repos NOT in today's results
for (const [name, entry] of Object.entries(hotness)) {
  if (name.startsWith('_')) continue; // skip metadata keys
  if (entry.last_seen !== todayStr) {
    entry.streak = 0; // not seen today = streak broken
  }
}

hotness._last_run = todayStr;
fs.writeFileSync('data/hotness.json', JSON.stringify(hotness, null, 2));
console.log(`Updated hotness.json (${Object.keys(hotness).length - 1} repos tracked)`);
```

**Also add `data/hotness.json` to the git add/commit step:**
```yaml
git add data/ config/
```
(This should already cover it since data/ is added.)

**Create initial `data/hotness.json`:**
```json
{}
```

---

## Task 3: Add HuggingFace Fetch Workflow (Item 10a)

Create a new workflow `.github/workflows/fetch-hf.yml` that fetches trending/popular Spaces, Models, and Datasets from HuggingFace.

**The `HF_API_TOKEN` secret needs to be set.** Peter will do this:
```
gh secret set HF_API_TOKEN --repo CHAOSAiGENT/VaiBReport
```

**Workflow: `.github/workflows/fetch-hf.yml`**

```yaml
name: Fetch HuggingFace content

on:
  schedule:
    - cron: "10 13 * * *"   # daily at 13:10 UTC (10 min after GitHub fetch)
  workflow_dispatch:

jobs:
  fetch-hf:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Fetch HuggingFace content
        env:
          HF_TOKEN: ${{ secrets.HF_API_TOKEN }}
        run: |
          node --input-type=module << 'SCRIPT'
          import fs from 'fs';

          const delay = (ms) => new Promise(r => setTimeout(r, ms));
          const headers = {};
          if (process.env.HF_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
          }

          // ── Fetch Spaces ────────────────────────────────
          async function fetchSpaces() {
            const categories = [
              'text-generation', 'image-generation', 'video-generation',
              'audio', 'computer-vision', 'text-to-image', 'text-to-video'
            ];
            const spaces = [];

            // Trending spaces (sorted by likes, recent)
            try {
              const res = await fetch(
                'https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=50',
                { headers }
              );
              if (res.ok) {
                const data = await res.json();
                spaces.push(...data.map(s => ({
                  id: s.id,
                  url: `https://huggingface.co/spaces/${s.id}`,
                  description: s.cardData?.short_description || s.id.split('/')[1] || '',
                  likes: s.likes || 0,
                  created_at: s.createdAt,
                  last_modified: s.lastModified,
                  sdk: s.sdk || null,
                  tags: s.tags || [],
                  _source: 'huggingface',
                  _hf_type: 'space'
                })));
              }
            } catch (e) {
              console.error('Spaces fetch error:', e.message);
            }
            await delay(1000);

            return spaces;
          }

          // ── Fetch Models ────────────────────────────────
          async function fetchModels() {
            const pipelines = [
              'text-generation', 'text-to-image', 'image-to-text',
              'text-to-video', 'text-to-audio', 'feature-extraction',
              'automatic-speech-recognition', 'image-classification'
            ];
            const models = [];

            for (const pipeline of pipelines) {
              try {
                const res = await fetch(
                  `https://huggingface.co/api/models?pipeline_tag=${pipeline}&sort=downloads&direction=-1&limit=20`,
                  { headers }
                );
                if (res.ok) {
                  const data = await res.json();
                  models.push(...data.map(m => ({
                    id: m.id,
                    url: `https://huggingface.co/models/${m.id}`,
                    description: m.cardData?.short_description || m.id.split('/').pop() || '',
                    downloads: m.downloads || 0,
                    likes: m.likes || 0,
                    pipeline_tag: m.pipeline_tag || pipeline,
                    created_at: m.createdAt,
                    last_modified: m.lastModified,
                    tags: m.tags || [],
                    _source: 'huggingface',
                    _hf_type: 'model'
                  })));
                }
              } catch (e) {
                console.error(`Models fetch error (${pipeline}):`, e.message);
              }
              await delay(1000);
            }

            // Dedup by id
            const seen = new Set();
            return models.filter(m => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            });
          }

          // ── Fetch Datasets ──────────────────────────────
          async function fetchDatasets() {
            const datasets = [];
            try {
              const res = await fetch(
                'https://huggingface.co/api/datasets?sort=downloads&direction=-1&limit=50',
                { headers }
              );
              if (res.ok) {
                const data = await res.json();
                datasets.push(...data.map(d => ({
                  id: d.id,
                  url: `https://huggingface.co/datasets/${d.id}`,
                  description: d.cardData?.short_description || d.id.split('/').pop() || '',
                  downloads: d.downloads || 0,
                  likes: d.likes || 0,
                  created_at: d.createdAt,
                  last_modified: d.lastModified,
                  tags: d.tags || [],
                  _source: 'huggingface',
                  _hf_type: 'dataset'
                })));
              }
            } catch (e) {
              console.error('Datasets fetch error:', e.message);
            }

            return datasets;
          }

          // ── Main ────────────────────────────────────────
          (async () => {
            const spaces = await fetchSpaces();
            const models = await fetchModels();
            const datasets = await fetchDatasets();

            const date = new Date().toISOString().slice(0, 10);
            const payload = {
              generated_at: new Date().toISOString(),
              source: 'huggingface',
              counts: {
                spaces: spaces.length,
                models: models.length,
                datasets: datasets.length
              },
              spaces,
              models,
              datasets
            };

            if (!fs.existsSync('data')) {
              fs.mkdirSync('data', { recursive: true });
            }
            fs.writeFileSync(
              `data/hf-${date}.json`,
              JSON.stringify(payload, null, 2)
            );

            console.log(
              `Wrote ${spaces.length} spaces, ${models.length} models, ${datasets.length} datasets`
            );
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
          SCRIPT

      - name: Commit and push
        run: |
          date=$(date -u +"%Y-%m-%d")
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git diff --cached --quiet && echo "No changes" && exit 0
          git commit -m "Add HuggingFace snapshot for ${date}"
          git push
```

---

## Task 4: Add HuggingFace Sections to generate-digest.yml

Update the digest generator to read the HF data file and add HuggingFace sections to the post.

**After loading the GitHub data file, add:**

```javascript
// ── Load HuggingFace data ─────────────────────────
let hfData = { spaces: [], models: [], datasets: [] };
try {
  const hfFiles = fs.readdirSync('data')
    .filter(f => f.match(/^hf-\d{4}-\d{2}-\d{2}\.json$/))
    .sort()
    .reverse();
  if (hfFiles.length > 0) {
    hfData = JSON.parse(fs.readFileSync(`data/${hfFiles[0]}`, 'utf8'));
  }
} catch (e) {
  console.log('No HuggingFace data available');
}

// Load HF seen ledger (independent from GitHub)
let seenHf = { featured: {} };
try {
  seenHf = JSON.parse(fs.readFileSync('data/seen-hf.json', 'utf8'));
} catch (e) { /* fresh start */ }

function isHfOnCooldown(id) {
  const entry = seenHf.featured[id];
  if (!entry) return false;
  const lastDate = new Date(entry.last_featured);
  const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
  return diff < prefs.cooldown_days;
}

// Filter and pick top HF items
const hfSpaces = (hfData.spaces || [])
  .filter(s => !isHfOnCooldown(s.id) && s.likes >= 10)
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 5);

const hfModels = (hfData.models || [])
  .filter(m => !isHfOnCooldown(m.id) && m.downloads >= 1000)
  .sort((a, b) => b.downloads - a.downloads)
  .slice(0, 5);

const hfDatasets = (hfData.datasets || [])
  .filter(d => !isHfOnCooldown(d.id) && d.downloads >= 500)
  .sort((a, b) => b.downloads - a.downloads)
  .slice(0, 3);
```

**Add HF sections to the markdown generation (after the GitHub sections):**

```javascript
// HuggingFace sections
const hfFeatured = [];

if (hfSpaces.length > 0) {
  md += `## HuggingFace Spaces\n\n`;
  for (const s of hfSpaces) {
    const blurb = (blurbs && blurbs[s.id]) ? blurbs[s.id] : (s.description || s.id);
    md += `- [${s.id}](${s.url}) – ${blurb} (${s.sdk || 'Space'}, ${s.likes} ❤️)\n\n`;
    hfFeatured.push(s.id);
  }
}

if (hfModels.length > 0) {
  md += `## HuggingFace Models\n\n`;
  for (const m of hfModels) {
    const blurb = (blurbs && blurbs[m.id]) ? blurbs[m.id] : (m.description || m.id);
    const dl = m.downloads >= 1000000 ? `${(m.downloads / 1000000).toFixed(1)}M` : `${(m.downloads / 1000).toFixed(0)}K`;
    md += `- [${m.id}](${m.url}) – ${blurb} (${m.pipeline_tag}, ${dl} downloads)\n\n`;
    hfFeatured.push(m.id);
  }
}

if (hfDatasets.length > 0) {
  md += `## HuggingFace Datasets\n\n`;
  for (const d of hfDatasets) {
    const blurb = (blurbs && blurbs[d.id]) ? blurbs[d.id] : (d.description || d.id);
    const dl = d.downloads >= 1000000 ? `${(d.downloads / 1000000).toFixed(1)}M` : `${(d.downloads / 1000).toFixed(0)}K`;
    md += `- [${d.id}](${d.url}) – ${blurb} (${dl} downloads)\n\n`;
    hfFeatured.push(d.id);
  }
}
```

**Update seen-hf.json after writing the post:**

```javascript
// Update HF seen ledger
for (const id of hfFeatured) {
  const entry = seenHf.featured[id] || { times_featured: 0 };
  entry.last_featured = digestDate;
  entry.times_featured = (entry.times_featured || 0) + 1;
  seenHf.featured[id] = entry;
}
fs.writeFileSync('data/seen-hf.json', JSON.stringify(seenHf, null, 2));
```

**Add `data/seen-hf.json` to the git add step.**

**Also pass HF items to the Claude API blurb generator** — add them to the prompt alongside GitHub repos so they get editorial voice too.

**Create initial `data/seen-hf.json`:**
```json
{"featured": {}}
```

---

## Task 5: Update deploy-blog.yml Chain

Add `fetch-hf.yml` to the deploy chain. The digest should trigger after BOTH fetch workflows complete. The simplest approach: have `generate-digest.yml` also trigger on the HF fetch completion:

**In `.github/workflows/generate-digest.yml`, update the trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Fetch GitHub repos for digest", "Fetch HuggingFace content"]
    types: [completed]
  workflow_dispatch:
```

This means the digest generates after either fetch completes. Since GitHub fetch runs at :00 and HF fetch runs at :10, the digest will run twice — but the second run will see the existing post and skip (the "already exists" check handles this). OR, adjust timing so HF runs first (:05) and GitHub runs at :10, with digest only chaining off the GitHub fetch.

**Recommended: Keep it simple.** Chain digest off GitHub fetch only. The HF data file from the previous day (or same day if HF fetch ran first) gets picked up whenever the digest generates. The 10-minute offset means today's HF data is usually available.

---

## Task 6: Delete Today's Digest and Re-trigger

After all changes are committed and pushed:

1. Delete the existing March 6 digest post so the generator creates a fresh one:
```bash
rm _posts/2026-03-06-github-digest.md
git add _posts/
git commit -m "Remove March 6 digest for regeneration with V2 features"
git push
```

2. Trigger `fetch-hf.yml` manually to populate HF data:
```bash
gh workflow run "Fetch HuggingFace content" --repo CHAOSAiGENT/VaiBReport
```

3. Wait for HF fetch to complete (~1 min), then trigger the digest:
```bash
gh workflow run "Generate daily digest" --repo CHAOSAiGENT/VaiBReport
```

4. Verify:
   - Check Actions tab: all workflows green?
   - Check `_posts/2026-03-06-github-digest.md`: does it have Claude-voiced blurbs? HuggingFace sections?
   - Check blog: does the regenerated March 6 post look right?

---

## Task 7: Verify and Report

Print a summary:

| Check | Result |
|-------|--------|
| Claude API blurbs (not template) | ? |
| Blurb tone (casual/dry humor) | ? |
| HuggingFace Spaces section present | ? |
| HuggingFace Models section present | ? |
| HuggingFace Datasets section present | ? |
| UGC section (V1.5 tightened) | ? |
| No mega-repos in trending | ? |
| Total repos in digest | ? |
| hotness.json created | ? |
| seen-hf.json created | ? |
| Blog deployed and live | ? |

---

## Commit Strategy

Commit after each major task:
1. `feat: add Claude API editorial voice to digest generator`
2. `feat: add hotness streak tracking to fetch workflow`
3. `feat: add HuggingFace fetch workflow (spaces, models, datasets)`
4. `feat: add HuggingFace sections to digest generator`
5. `chore: regenerate March 6 digest with V2 features`
