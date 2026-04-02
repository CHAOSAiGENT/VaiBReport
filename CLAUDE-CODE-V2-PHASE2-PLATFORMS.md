# Claude Code Prompt: V2 Phase 2 — Multi-Platform Expansion

**Goal:** Add fetch workflows for 7 new platforms + integrate all into the digest generator + add a health-check summary. This is the biggest single expansion of VaiBReport.

**Current state:** GitHub repos, HuggingFace (Spaces/Models/Datasets), and Product Hunt are live. Gemini editorial blurbs working. All API keys set.

**Secrets available:**
- `GEMINI_API_KEY` — editorial blurbs
- `HF_API_TOKEN` — HuggingFace (already used by fetch-hf.yml)
- `PH_API_KEY` + `PH_API_SECRET` — Product Hunt (already used)
- `REPLICATE_API_TOKEN` — Replicate (new, use in this prompt)
- `GITHUB_TOKEN` — automatic

**Architecture rules:**
- Each platform gets its OWN fetch workflow (`fetch-{platform}.yml`)
- Each fetch workflow writes to `data/{platform}-YYYY-MM-DD.json`
- Each platform gets its OWN seen ledger (`data/seen-{platform}.json`) — independent cooldowns
- The digest generator (`generate-digest.yml`) reads ALL platform data files and produces ONE unified post
- Platform limits are independent — GitHub's 30-repo cap doesn't eat into HuggingFace's 5-space cap
- All fetch workflows run on schedule AND support `workflow_dispatch` for manual testing
- `generate-digest.yml` should trigger on `workflow_run` from ALL fetch workflows, not just GitHub

---

## Task 1: Create `fetch-replicate.yml`

Replicate has a REST API. Token is set as `REPLICATE_API_TOKEN`.

**Cron:** `15 13 * * *` (13:15 UTC, 15 min after GitHub fetch)

**What to fetch:**
- `GET https://api.replicate.com/v1/models` with header `Authorization: Bearer ${token}`
- Also try `GET https://api.replicate.com/v1/collections/text-to-image/models`, `/collections/language-models/models`, etc. if available
- If the `/v1/models` endpoint requires pagination, fetch first 2 pages (cursor-based)

**Output schema (`data/replicate-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "replicate",
  "models": [
    {
      "id": "owner/model-name",
      "url": "https://replicate.com/owner/model-name",
      "description": "...",
      "run_count": 12345,
      "likes": 0,
      "created_at": "...",
      "last_modified": "...",
      "default_example": null,
      "tags": [],
      "_source": "replicate",
      "_platform": "replicate"
    }
  ]
}
```

**Filtering:** Focus on models with >100 runs that were created or updated in the last 6 months. Skip models from `replicate` org (internal/demo models).

**Seen ledger:** `data/seen-replicate.json` with same `{ featured: { "id": { times_featured, last_featured } } }` structure.

---

## Task 2: Create `fetch-paperswithcode.yml`

Papers with Code has a public REST API. No auth needed.

**Cron:** `20 13 * * *` (13:20 UTC)

**What to fetch:**
- `GET https://paperswithcode.com/api/v1/papers/?ordering=-proceeding&items_per_page=50` — recent papers
- For each paper, check if it has a linked GitHub repo via `GET https://paperswithcode.com/api/v1/papers/{paper_id}/repositories/`
- Only keep papers where the linked repo has >50 GitHub stars
- Focus areas: filter by tasks related to text-generation, image-generation, video-generation, object-detection, question-answering, summarization. Use the `task` query parameter if supported, otherwise filter client-side by `tasks` field.

**Output schema (`data/paperswithcode-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "paperswithcode",
  "papers": [
    {
      "id": "paper-slug",
      "title": "Paper Title",
      "url": "https://paperswithcode.com/paper/...",
      "abstract": "...",
      "github_url": "https://github.com/...",
      "github_stars": 1234,
      "published": "2026-01-15",
      "tasks": ["text-generation", "summarization"],
      "_source": "paperswithcode",
      "_platform": "paperswithcode"
    }
  ]
}
```

**Rate limiting:** Add 1-second delays between API calls. PwC API is rate-limited.

**Seen ledger:** `data/seen-paperswithcode.json`

---

## Task 3: Create `fetch-npm-pypi.yml`

Fetch trending/popular packages from npm and PyPI. Both have public APIs.

**Cron:** `25 13 * * *` (13:25 UTC)

**npm approach:**
- Use the npm registry search: `GET https://registry.npmjs.org/-/v1/search?text=keywords:ai+saas+cli+automation&size=50&popularity=1.0`
- Also search for: `keywords:llm`, `keywords:agent`, `keywords:generative-ai`
- Get download counts via: `GET https://api.npmjs.org/downloads/point/last-week/{package}`
- Filter: >1000 weekly downloads, published/updated in last 6 months

**PyPI approach:**
- Use PyPI JSON API: `GET https://pypi.org/pypi/{package}/json` for individual packages
- For discovery, use the PyPI simple index or scrape `https://pypistats.org/top` for top packages
- Alternatively, search via `GET https://pypi.org/search/?q=ai+agent+llm&o=-created` (HTML scraping with cheerio)
- Get stats via: `GET https://pypistats.org/api/packages/{package}/recent`
- Filter: >500 recent downloads, relevant categories

**Output schema (`data/npm-pypi-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "npm-pypi",
  "npm": [
    {
      "id": "package-name",
      "url": "https://www.npmjs.com/package/package-name",
      "description": "...",
      "weekly_downloads": 5000,
      "version": "1.2.3",
      "published": "2026-01-01",
      "keywords": ["ai", "agent"],
      "_source": "npm",
      "_platform": "npm"
    }
  ],
  "pypi": [
    {
      "id": "package-name",
      "url": "https://pypi.org/project/package-name/",
      "description": "...",
      "recent_downloads": 3000,
      "version": "0.5.0",
      "published": "2026-02-15",
      "keywords": ["llm", "rag"],
      "_source": "pypi",
      "_platform": "pypi"
    }
  ]
}
```

**Seen ledger:** `data/seen-npm-pypi.json`

---

## Task 4: Create `fetch-gitlab.yml`

GitLab has a public REST API (v4). No auth needed for public projects.

**Cron:** `30 13 * * *` (13:30 UTC)

**What to fetch:**
- `GET https://gitlab.com/api/v4/projects?order_by=stars&sort=desc&per_page=50&last_activity_after=YYYY-MM-DD` (6 months ago)
- Also search with topics: `GET https://gitlab.com/api/v4/projects?topic=ai,saas,automation&order_by=stars&sort=desc&per_page=30`
- Filter: >20 stars, pushed in last 6 months

**Output schema (`data/gitlab-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "gitlab",
  "repos": [
    {
      "id": "namespace/project",
      "full_name": "namespace/project",
      "url": "https://gitlab.com/namespace/project",
      "description": "...",
      "star_count": 500,
      "forks_count": 50,
      "language": "Python",
      "topics": ["ai", "ml"],
      "created_at": "...",
      "last_activity_at": "...",
      "_source": "gitlab",
      "_platform": "gitlab"
    }
  ]
}
```

**Seen ledger:** `data/seen-gitlab.json`

---

## Task 5: Create `fetch-ollama.yml`

Ollama doesn't have a public API. Scrape the library page.

**Cron:** `35 13 * * *` (13:35 UTC)

**What to fetch:**
- Scrape `https://ollama.com/library` — list of available models
- For each model, scrape `https://ollama.com/library/{model}` to get details (description, tags, sizes, pull count if visible)
- Use cheerio for HTML parsing (already a dependency in fetch-repos.yml)
- Focus on: models updated in last 3 months, popular models

**Output schema (`data/ollama-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "ollama",
  "models": [
    {
      "id": "model-name",
      "url": "https://ollama.com/library/model-name",
      "description": "...",
      "pull_count": "100K+",
      "tags": ["7b", "13b", "instruct"],
      "updated": "2 days ago",
      "_source": "ollama",
      "_platform": "ollama"
    }
  ]
}
```

**Note:** Ollama may block scraping or change their layout. Add robust error handling — if scraping fails, log a warning and write an empty models array. Don't fail the workflow.

**Seen ledger:** `data/seen-ollama.json`

---

## Task 6: Create `fetch-launches.yml`

Unified scraper for indie product launch platforms. These are all scraping-based.

**Cron:** `40 13 * * *` (13:40 UTC)

**Platforms to scrape:**

### 6a. DevHunt
- Scrape `https://devhunt.org` — daily featured dev tools
- Extract: product name, URL, description, upvotes, launch date
- Tag with `_source: "devhunt"`

### 6b. Hacker News Show HN
- Firebase API: `GET https://hacker-news.firebaseio.com/v0/showstories.json`
- Returns array of item IDs. Fetch top 30 items: `GET https://hacker-news.firebaseio.com/v0/item/{id}.json`
- Filter: >10 points, has URL
- Tag with `_source: "hackernews_showhn"`

### 6c. BetaList
- Try RSS feed first: `https://betalist.com/feed`
- If no RSS, scrape `https://betalist.com/startups` for recently listed startups
- Tag with `_source: "betalist"`

### 6d. Uneed
- Scrape `https://www.uneed.best` — AI/indie product directory
- Extract: product name, URL, description, category
- Tag with `_source: "uneed"`

**Output schema (`data/launches-YYYY-MM-DD.json`):**
```json
{
  "generated_at": "ISO timestamp",
  "source": "launches",
  "launches": [
    {
      "id": "product-slug-platform",
      "name": "Product Name",
      "url": "https://product-url.com",
      "description": "...",
      "upvotes": 42,
      "launch_date": "2026-03-06",
      "platform_url": "https://devhunt.org/tool/...",
      "_source": "devhunt",
      "_platform": "launches"
    }
  ]
}
```

**IMPORTANT for scraping:** All scraped sites may change layout or block bots. Every scraper function should:
1. Wrap in try/catch
2. Log the error but don't fail the workflow
3. Return an empty array on failure
4. Use `delay(2000)` between requests to be respectful

**Seen ledger:** `data/seen-launches.json`

---

## Task 7: Update `generate-digest.yml` to consume all new platforms

This is the biggest task. The digest generator must now:

1. **Load all platform data files** — add loading blocks for: replicate, paperswithcode, npm-pypi, gitlab, ollama, launches. Follow the same pattern as the existing HuggingFace loader (find latest dated file, parse, handle missing gracefully).

2. **Load all seen ledgers** — load `seen-replicate.json`, `seen-paperswithcode.json`, `seen-npm-pypi.json`, `seen-gitlab.json`, `seen-ollama.json`, `seen-launches.json`. Each has the same `{ featured: {} }` structure.

3. **Apply cooldown filtering** — for each platform, filter out items that are on cooldown (same logic as `isHfOnCooldown`).

4. **Add new digest sections** — after the HuggingFace sections, add:

```markdown
## GitLab Repos
(same format as GitHub repos — name, blurb, stars, language)

## Papers → Code
(paper title, one-liner about what it does, linked GitHub repo + stars)

## Replicate Models
(model name, blurb, run count)

## Ollama Models
(model name, blurb, parameter count/sizes)

## npm Packages
(package name, blurb, weekly downloads)

## PyPI Packages
(package name, blurb, recent downloads)

## New Launches
(product name, blurb, upvotes, source platform)
```

5. **Pass all new items to `generateEditorialBlurbs()`** — add them to `allSectioned` so Gemini writes blurbs for everything, not just GitHub repos.

6. **Update all seen ledgers on commit** — after writing the post, update every `seen-*.json` file with the items that were featured.

7. **Update the `git add` step** to include all new seen files:
```yaml
git add _posts/ data/seen.json data/seen-hf.json data/seen-replicate.json data/seen-paperswithcode.json data/seen-npm-pypi.json data/seen-gitlab.json data/seen-ollama.json data/seen-launches.json config/spotlight.json
```

8. **Update the `workflow_run` trigger** — the digest should trigger when ANY fetch workflow completes. Update the top of `generate-digest.yml`:
```yaml
on:
  workflow_run:
    workflows:
      - "Fetch GitHub repos for digest"
      - "Fetch HuggingFace content"
      - "Fetch Replicate models"
      - "Fetch Papers with Code"
      - "Fetch npm and PyPI packages"
      - "Fetch GitLab repos"
      - "Fetch Ollama models"
      - "Fetch product launches"
    types: [completed]
  workflow_dispatch:
```

**IMPORTANT:** The digest should NOT regenerate every time a fetch completes if the post already exists for that date. The existing `if (fs.existsSync(postPath))` check handles this — BUT we need a way to incorporate late-arriving platform data. Solution: if the post exists but was generated before all platform data arrived, consider a `--force` flag or just accept that tomorrow's digest will have the full platform spread. For V2, keep it simple: first fetch to complete triggers digest generation, latecomers appear next day.

Actually, CHANGE the approach: Instead of triggering on workflow_run from each fetch, have ALL fetch workflows run at staggered times (13:00-13:40 UTC), and then the digest runs at **14:00 UTC** via cron, giving all fetches time to complete:

```yaml
on:
  schedule:
    - cron: "0 14 * * *"   # 14:00 UTC — after all fetch workflows complete
  workflow_dispatch:
```

Remove the `workflow_run` trigger from generate-digest.yml. This is simpler and ensures all platform data is available.

BUT KEEP the `workflow_run` trigger on deploy-blog.yml chaining from generate-digest — that still works.

---

## Task 8: Update `deploy-blog.yml` trigger

Since generate-digest.yml name hasn't changed, deploy-blog.yml should still chain correctly. Verify this is intact.

---

## Task 9: Add health-check summary to digest generation

At the end of the digest generation script (after all files are written, before the SCRIPT heredoc closes), add a summary log block:

```javascript
// ── Health Check Summary ──────────────────────────
const summary = {
  date: digestDate,
  github_repos: featured.length,
  hf_items: hfFeatured.length,
  replicate_models: replicateFeatured.length,
  papers: papersFeatured.length,
  npm_packages: npmFeatured.length,
  pypi_packages: pypiFeatured.length,
  gitlab_repos: gitlabFeatured.length,
  ollama_models: ollamaFeatured.length,
  launches: launchesFeatured.length,
  gemini_blurbs: blurbs ? Object.keys(blurbs).length : 0,
  total_items: /* sum of all above */,
  sections: Object.keys(allSectioned).filter(k => allSectioned[k].length > 0)
};

console.log('\n═══ DIGEST HEALTH CHECK ═══');
console.log(JSON.stringify(summary, null, 2));
console.log('═══════════════════════════\n');
```

This gives Peter a one-glance status in the Actions log.

---

## Task 10: Initialize all new seen ledgers

Create these files if they don't exist:
- `data/seen-replicate.json` → `{"featured": {}}`
- `data/seen-paperswithcode.json` → `{"featured": {}}`
- `data/seen-npm-pypi.json` → `{"featured": {}}`
- `data/seen-gitlab.json` → `{"featured": {}}`
- `data/seen-ollama.json` → `{"featured": {}}`
- `data/seen-launches.json` → `{"featured": {}}`

---

## Task 11: Update `_config.yml` excludes

Make sure any new markdown planning files are excluded from Jekyll builds. The existing globs should cover it (`V2-*.md`, `CLAUDE-CODE-*.md`), but verify.

---

## Task 12: Update `preferences.json`

Add platform-specific limits:

```json
{
  "min_stars": 40,
  "min_stars_trending": 10,
  "recent_months": 12,
  "max_repos_total": 30,
  "max_repos_per_section": 5,
  "max_trending_candidates": 5,
  "max_trending_featured": 3,
  "max_trending_also": 2,
  "cooldown_days": 14,
  "max_hf_spaces": 5,
  "max_hf_models": 5,
  "max_hf_datasets": 3,
  "max_replicate_models": 5,
  "max_papers": 5,
  "max_npm": 5,
  "max_pypi": 5,
  "max_gitlab": 5,
  "max_ollama": 5,
  "max_launches": 8
}
```

The digest generator should read these limits from preferences.json instead of hardcoding slice values.

---

## Task 13: Test and verify

After making ALL changes:

1. **Read every new workflow file** and confirm it's syntactically valid YAML with proper structure
2. **Read `generate-digest.yml`** and confirm:
   - All platform data is loaded
   - All seen ledgers are loaded and updated
   - All new sections are rendered in the markdown
   - Health check summary prints at the end
   - `git add` includes all new seen files
   - Cron is set to 14:00 UTC
3. **Read `preferences.json`** and confirm new limits are added
4. **List `data/` directory** and confirm all new seen ledger files exist
5. **Report a summary** of all files created/modified

---

## Execution order

Tasks 1-6 can be done in any order (independent fetch workflows). Task 7 depends on knowing the output schemas from 1-6. Tasks 8-12 are small follow-ups. Task 13 is verification.

Recommended: do Tasks 10, 12 first (scaffolding), then 1-6 (fetch workflows), then 7 (the big digest integration), then 8-9, 11, 13.
