# VaiBReport — Technical Documentation

**File:** `docs/TECHNICAL.md`
**Repo:** `github.com/CHAOSAiGENT/VaiBReport`
**Live site:** `https://chaosaigent.github.io/VaiBReport/`
**Last updated:** 2026-03-28

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        DATA FETCH LAYER                          │
│  (GitHub Actions — runs daily 13:00–14:00 UTC, staggered)        │
│                                                                  │
│  fetch-repos.yml          → data/repos-YYYY-MM-DD.json           │
│    GitHub Search API                                             │
│    GitHub Trending (cheerio scrape)                              │
│                                                                  │
│  fetch-hf.yml             → data/hf-YYYY-MM-DD.json              │
│    HuggingFace /api/spaces                                       │
│    HuggingFace /api/models (8 pipeline types)                    │
│    HuggingFace /api/datasets                                     │
│                                                                  │
│  fetch-replicate.yml      → data/replicate-YYYY-MM-DD.json       │
│  fetch-gitlab.yml         → data/gitlab-YYYY-MM-DD.json          │
│  fetch-npm-pypi.yml       → data/npm-pypi-YYYY-MM-DD.json        │
│  fetch-ollama.yml         → data/ollama-YYYY-MM-DD.json          │
│  fetch-paperswithcode.yml → data/paperswithcode-YYYY-MM-DD.json  │
│  fetch-launches.yml       → data/launches-YYYY-MM-DD.json        │
│    HN Show HN (Firebase API)                                     │
│    DevHunt (cheerio scrape)                                      │
│    BetaList (RSS)                                                │
│    Uneed (cheerio scrape)                                        │
│  fetch-producthunt.yml    → data/launches-YYYY-MM-DD.json        │
│    Product Hunt (GraphQL API — appended to launches file)        │
│                                                                  │
│  All fetchers also update: data/hotness.json                     │
│  All fetchers also update: data/seen-*.json (dedup ledgers)      │
└───────────────────────┬──────────────────────────────────────────┘
                        │ commits to main
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│                     DIGEST GENERATION                            │
│                                                                  │
│  generate-digest.yml  (daily at 14:00 UTC)                       │
│    Reads: data/repos-latest.json + all other latest data files   │
│    Reads: config/preferences.json (thresholds, limits)          │
│    Reads: config/spotlight.json (manual injections)             │
│    Reads: data/seen-*.json (cooldown dedup per source)          │
│    Reads: data/hotness.json (streak/velocity signals)           │
│    Calls: Anthropic Claude API (claude-sonnet-4-6)              │
│      → generates editorial one-liners per item                  │
│    Calls: GitHub API (per-repo README fetch for hero images)     │
│    Writes: _posts/YYYY-MM-DD-github-digest.md                   │
│    Writes: _repos/{slug}.md (one per featured item)             │
│    Updates: data/seen-*.json (marks items as featured)          │
└───────────────────────┬──────────────────────────────────────────┘
                        │ commits to main
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│                      JEKYLL + GITHUB PAGES                       │
│                                                                  │
│  deploy-blog.yml                                                 │
│    Triggered by: generate-digest.yml completing OR push to main  │
│    Builds Jekyll site from repo root                            │
│    Collections: _repos/ (public catalog) + _tools/ (Me2 layer)  │
│    Theme: minima                                                 │
│    Outputs: GitHub Pages at chaosaigent.github.io/VaiBReport/   │
│                                                                  │
│  Public pages:                                                   │
│    /             — daily digest posts                           │
│    /repos/       — bento card catalog (search/filter/sort)      │
│    /leaderboard/ — ranked views (streak, velocity, etc.)        │
│    /picks/       — Peter's Picks public view                    │
└──────────────────────────────────────────────────────────────────┘
                        │
                        │  PARALLEL: Me2 Private Layer
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│                        ME2 LAYER (manual)                        │
│                                                                  │
│  Peter submits a GitHub Issue (label: peters-pick)              │
│    └─ parse-submission.yml                                       │
│         Creates: _tools/{slug}.md (full frontmatter skeleton)   │
│         Comments on issue with next-step instructions           │
│         Closes issue                                            │
│                                                                  │
│  capture-tool-screenshots.yml  (workflow_dispatch, slug input)   │
│    Playwright chromium capture                                   │
│    Desktop (1280×800) + mobile (390×844) + full-page            │
│    Writes: static/screenshots/{slug}/{slug}-desktop.png etc.    │
│    Updates frontmatter in _tools/{slug}.md                      │
│                                                                  │
│  generate-tool-page.yml  (workflow_dispatch, slug input)         │
│    5 Claude API calls per tool:                                  │
│      one_liner, script_faceless, script_ugc,                    │
│      use_cases (JSON array), consulting_notes (JSON object)     │
│    Updates _tools/{slug}.md in-place                            │
│                                                                  │
│  _tools/{slug}.md with public: true → visible at /picks/        │
│  _tools/{slug}.md with public: false → private (Jekyll filter)  │
└──────────────────────────────────────────────────────────────────┘

  SUPPLEMENTAL:
  capture-screenshots.yml  — weekly batch (Sundays 05:00 UTC)
    Playwright screenshots for _repos/ items with non-GitHub URLs
    Batch cap: 20 per run
    Skips github.com, gitlab.com, huggingface.co URLs
```

---

## 2. Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Site generator | Jekyll | via `actions/jekyll-build-pages@v1` | Builds static site from Markdown collections + Liquid templates |
| Theme | minima | GitHub Pages default | Base layout, navigation, RSS feed |
| Hosting | GitHub Pages | — | Free static hosting via `deploy-blog.yml` |
| CI/CD | GitHub Actions | — | All automation, data fetching, content generation |
| Node.js runtime | Node.js | 20 (LTS) | All inline workflow scripts via `node --input-type=module` |
| HTML parsing | cheerio | 1.x | GitHub Trending scrape, Ollama library scrape, DevHunt/Uneed scrapes |
| Browser automation | Playwright | latest via `npx playwright install chromium` | Screenshot capture for both public catalog and Me2 tools |
| AI editorial | Anthropic Claude API | `claude-sonnet-4-6` | Editorial blurbs in digest, video scripts, use cases, consulting notes |
| Version control | Git + GitHub | — | Source of truth; Actions push commits back to main |
| Screenshot storage | `static/screenshots/` in repo | — | Committed alongside code; migrate to R2/S3 planned (V-02) |
| Config format | JSON | — | `config/*.json`, `data/*.json`, `data/hotness.json` |
| Content format | Markdown + YAML frontmatter | — | `_posts/`, `_repos/`, `_tools/` |
| MCP servers (local dev) | `@modelcontextprotocol/server-github`, `@playwright/mcp` | latest | Claude Code local tooling — GitHub API access and browser control |

---

## 3. Workflows Reference

### 3.1 `fetch-repos.yml` — Fetch GitHub repos

**Trigger:** Schedule `0 13 * * *` (13:00 UTC daily) + `workflow_dispatch`

**Secrets required:** `GITHUB_TOKEN` (read-only, auto-provided)

**What it does:**
1. Checks out repo
2. Installs Node 20 + `cheerio@1`
3. Reads `config/queries.json` — three query groups: `default_queries`, `extra_queries`, `ugc_social_queries`
4. Runs GitHub Search API (`/search/repositories`) for each query (50 results per query, sorted by stars). 2-second delay between queries as rate-limit courtesy
5. Scrapes `github.com/trending?since=daily` via cheerio to extract repo names, descriptions, stars, language
6. Deduplicates all results by `full_name`; keeps higher-star entry; merges `_query_group` tags if repo appeared in multiple queries
7. Updates `data/hotness.json`: increments `appearances`, updates `streak` (consecutive-day tracking), computes `star_velocity` from a rolling 30-day star snapshot window
8. Decays `streak` to 0 for repos not in today's results
9. Writes `data/repos-YYYY-MM-DD.json` with full repo list + source metadata
10. Commits to `data/`

**Output file schema:**
```json
{
  "generated_at": "ISO timestamp",
  "config": { "default_queries": [...], ... },
  "sources": { "github_search": { "query_count": N, "repo_count": N }, "trending": { "method": "cheerio-scrape", "repo_count": N } },
  "repos": [ { "full_name": "owner/repo", "html_url": "...", "description": "...", "stargazers_count": N, "language": "...", "topics": [...], "pushed_at": "...", "created_at": "...", "forks_count": N, "_source": "search|trending", "_query_group": "default|extra|ugc_social" } ]
}
```

**Error handling:** Each query failure is logged; script continues. Trending scrape failure is caught and logged; script continues with search results only.

---

### 3.2 `fetch-hf.yml` — Fetch HuggingFace content

**Trigger:** Schedule `10 13 * * *` (13:10 UTC daily) + `workflow_dispatch`

**Secrets required:** `HF_API_TOKEN` (optional — used for Authorization header if present; unauthenticated works too)

**What it does:**
1. Fetches top-50 Spaces sorted by likes from `huggingface.co/api/spaces`
2. Fetches top-20 Models per pipeline type across 8 pipeline types: `text-generation`, `text-to-image`, `image-to-text`, `text-to-video`, `text-to-audio`, `feature-extraction`, `automatic-speech-recognition`, `image-classification`. Deduplicates by model ID
3. Fetches top-50 Datasets sorted by downloads
4. 1-second delay between API calls
5. Writes `data/hf-YYYY-MM-DD.json` with counts and arrays for `spaces`, `models`, `datasets`

**Output fields per item:** `id`, `url`, `description`, `likes`, `downloads`, `created_at`, `last_modified`, `sdk` (spaces only), `pipeline_tag` (models only), `tags`, `_source: "huggingface"`, `_hf_type: "space|model|dataset"`

---

### 3.3 `fetch-replicate.yml` — Fetch Replicate models

**Trigger:** Schedule `15 13 * * *` (13:15 UTC daily) + `workflow_dispatch`

**Secrets required:** `REPLICATE_API_TOKEN` (required — exits with 0 if not set)

**What it does:**
1. Paginates `api.replicate.com/v1/models` for 2 pages
2. Filters: excludes `owner === 'replicate'`, `run_count < 100`, models not updated in last 6 months
3. Sorts by `run_count` descending
4. Writes `data/replicate-YYYY-MM-DD.json`

**Output fields per item:** `id`, `url`, `description`, `run_count`, `likes` (mapped from `github_stars`), `created_at`, `last_modified`, `tags: []`, `_source: "replicate"`

---

### 3.4 `fetch-gitlab.yml` — Fetch GitLab repos

**Trigger:** Schedule `30 13 * * *` (13:30 UTC daily) + `workflow_dispatch`

**Secrets required:** None (GitLab public API, unauthenticated)

**What it does:**
1. Runs 6 queries against `gitlab.com/api/v4/projects`: top starred with recent activity, plus topic filters for `ai`, `machine-learning`, `saas`, `automation`, `devops`
2. Filters: `star_count >= 20`, last activity within 6 months
3. Deduplicates by `path_with_namespace`
4. Writes `data/gitlab-YYYY-MM-DD.json`

**Output fields per item:** `id`, `full_name`, `url`, `description`, `star_count`, `forks_count`, `language: null`, `topics`, `created_at`, `last_activity_at`, `_source: "gitlab"`

---

### 3.5 `fetch-npm-pypi.yml` — Fetch npm and PyPI packages

**Trigger:** Schedule `25 13 * * *` (13:25 UTC daily) + `workflow_dispatch`

**Secrets required:** None (public APIs)

**npm fetch:**
1. Searches npm registry for 7 keywords: `ai`, `llm`, `agent`, `generative-ai`, `saas`, `cli`, `automation` (30 results each)
2. Deduplicates by name; filters to packages updated within 6 months
3. Fetches download counts from `api.npmjs.org/downloads/point/last-week/{name}` for top-50 by score
4. Filters to packages with `weekly_downloads >= 1000`

**PyPI fetch:**
1. Fetches metadata for a hardcoded list of ~45 known AI/ML packages via `pypi.org/pypi/{name}/json`
2. Fetches download stats from `pypistats.org/api/packages/{name}/recent`
3. Filters to packages with `recent_downloads >= 500`

**Output:** `data/npm-pypi-YYYY-MM-DD.json` with `npm` and `pypi` arrays

---

### 3.6 `fetch-ollama.yml` — Fetch Ollama models

**Trigger:** Schedule `35 13 * * *` (13:35 UTC daily) + `workflow_dispatch`

**Secrets required:** None

**What it does:**
- Scrapes `ollama.com/library` with cheerio
- Extracts: model name, description, pull count, tags, last updated date
- Writes `data/ollama-YYYY-MM-DD.json`

---

### 3.7 `fetch-paperswithcode.yml` — Fetch Papers with Code

**Trigger:** Schedule `20 13 * * *` (13:20 UTC daily) + `workflow_dispatch`

**Secrets required:** None (public API)

**What it does:**
1. Fetches 50 recent papers from `paperswithcode.com/api/v1/papers/` ordered by proceeding date
2. For each paper, fetches linked GitHub repos via `/api/v1/papers/{id}/repositories/` (1-second delay)
3. Keeps only papers where best linked repo has `stars >= 50`
4. Filters by relevant ML tasks (text-generation, image-generation, etc.)
5. Caps at 20 results
6. Writes `data/paperswithcode-YYYY-MM-DD.json`

**Output fields per item:** `id`, `title`, `url` (abstract page), `abstract` (first 300 chars), `github_url`, `github_stars`, `published`, `tasks`, `_source: "paperswithcode"`

---

### 3.8 `fetch-launches.yml` — Fetch product launches

**Trigger:** Schedule `40 13 * * *` (13:40 UTC daily) + `workflow_dispatch`

**Secrets required:** None

**Sources fetched:**
- **HN Show HN:** Firebase Realtime Database API (`/v0/showstories.json`); top 30 items; filters `score < 10`
- **DevHunt:** Cheerio scrape of `devhunt.org`; extracts tools from `a[href*="/tool/"]` links
- **BetaList:** RSS feed (`betalist.com/feed`); parses up to 20 `<item>` elements
- **Uneed:** Cheerio scrape of `uneed.best`; extracts from `a[href*="/tool/"]` links

All items tagged with `_source` and `_platform: "launches"`. Writes `data/launches-YYYY-MM-DD.json`.

---

### 3.9 `fetch-producthunt.yml` — Fetch Product Hunt launches

**Trigger:** Schedule `0 7 * * *` (07:00 UTC daily, after main fetch window) + `workflow_dispatch`

**Secrets required:** `PH_DEV_TOKEN2` (Product Hunt OAuth developer token)

**What it does:**
1. Queries PH GraphQL API for top-50 posts from the last 30 hours (30h window ensures yesterday's launches are captured regardless of PH's midnight Pacific reset)
2. Filters: `votesCount >= 20`; post topics must intersect with `['developer tools', 'artificial intelligence', 'saas', 'productivity', 'maker tools', 'open source']`
3. Loads `data/seen-producthunt.json`; deduplicates items seen within last 7 days
4. Loads existing `data/launches-YYYY-MM-DD.json` (if present); strips old PH entries; appends new PH items
5. Updates `data/seen-producthunt.json` with today's new items

**Output format:** Items appended to the `launches` array in the launches file with `_source: "producthunt"`. Counts rebuilt from scratch after merge.

---

### 3.10 `generate-digest.yml` — Generate daily digest

**Trigger:** Schedule `0 14 * * *` (14:00 UTC daily) + `workflow_dispatch`

**Secrets required:** `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`

**What it does (step by step):**

1. **Commit guard:** Reads latest `data/repos-*.json` file. Derives `digestDate` from the filename. Checks if `_posts/{digestDate}-github-digest.md` already exists — exits 0 if so (idempotent).

2. **Loads all data:** Uses `loadLatestDataFile(prefix)` to find the most recent dated file for each of: `hf`, `replicate`, `paperswithcode`, `npm-pypi`, `gitlab`, `ollama`, `launches`.

3. **Loads dedup ledgers:** `data/seen.json` (GitHub), `data/seen-hf.json`, `data/seen-replicate.json`, `data/seen-paperswithcode.json`, `data/seen-npm-pypi.json`, `data/seen-gitlab.json`, `data/seen-ollama.json`, `data/seen-launches.json`. Each ledger holds `{ featured: { id: { last_featured, times_featured } } }`.

4. **Loads hotness:** `data/hotness.json` for streak/velocity signals.

5. **Section selection:** For each section (e.g., "SaaS starters and templates", "AI agents, LLM infra and RAG", etc.), candidates are filtered by:
   - `isOnCooldown()`: checks if item was featured within `cooldown_days` (default: 14) of `digestDate`
   - `assignCategory()`: regex-based category assignment from topics + description + query group
   - `monthsAgo()`: ensures content is within `recent_months` (default: 12) of today
   - `min_stars` / `min_stars_trending` thresholds from `preferences.json`
   - Spotlight injections from `config/spotlight.json` (manual must-feature list)

6. **Claude API call:** `generateEditorialBlurbs()` sends all selected items to `claude-sonnet-4-6` via `POST /v1/messages`. Prompt specifies VaiBReport audience (solo founders, AI builders, small business), voice (casual dry humor, max 20 words, no hype). Returns JSON map of `id → one-liner`. Falls back to item description if API fails.

7. **README hero image extraction:** `fetchReadmeImage()` calls GitHub API (`/repos/{owner}/{repo}/readme`) for each GitHub repo. Decodes base64 README, extracts first non-badge image URL from markdown or HTML `<img>` tags. Badge patterns filtered via `BADGE_PATTERNS` array.

8. **Catalog entry writes:** `createRepoEntry()` creates or updates `_repos/{slug}.md` for each featured item. Updates `times_featured`, `first_featured`, `last_featured`, `streak`, `appearances`, `star_velocity`, `icp_tags` from SECTION_ICP map.

9. **Digest post write:** Builds `_posts/{digestDate}-github-digest.md` with YAML frontmatter and Markdown body containing all sections. Includes a "Peter's Picks" section for public `_tools/` items.

10. **Updates dedup ledgers:** `markSeen()` records `last_featured` and increments `times_featured` for every item included in the digest.

11. **Commits:** All changed files (`_posts/`, `_repos/`, `data/seen-*.json`) committed and pushed.

**Error handling:** Claude API failure → falls back to template blurbs (item description). README fetch failure per-repo → `og_image` used instead. Each section selection is independent.

---

### 3.11 `parse-submission.yml` — Parse Peter's Pick submission

**Trigger:** `issues` event, type `labeled`, when label `peters-pick` is applied

**Secrets required:** `GITHUB_TOKEN`

**What it does:**
1. Parses GitHub issue body using `parseField()` regex (`### Field Name\n\ncontent`) and `parseCheckboxes()` for multi-select fields
2. Extracts: `url`, `name`, `hook`, `primaryIcp`, `compareTo`, `honestTake`, `makePublic`, `secondaryIcps`
3. Generates slug via `toSlug()`: lowercases, strips protocol/www, replaces non-alphanumeric with hyphens, truncates at 60 chars
4. Builds full YAML frontmatter with all Me2 fields initialized (empty strings, `false` for booleans, `0` for counters)
5. Writes `_tools/{slug}.md`
6. Commits with message `feat: add Peter's Pick — {slug} [issue #{number}]`
7. Comments on issue with file path, next-step instructions (screenshot workflow + script generation workflow with slug)
8. Closes issue

**Exits with error** if `url` or `name` fields are missing.

---

### 3.12 `generate-tool-page.yml` — Generate tool page content (E-04 + E-05)

**Trigger:** `workflow_dispatch` with required input `slug` (filename without `.md` from `_tools/`)

**Secrets required:** `ANTHROPIC_API_KEY`

**What it does:**
1. Reads `_tools/{slug}.md`; parses frontmatter via regex (handles both `key: "value"` and `key: value` forms); parses `icp_tags` array separately
2. Makes 5 sequential Claude API calls (model: `claude-sonnet-4-6`):
   - `one_liner` (100 max tokens): 20-word plain-text description
   - `script_faceless` (800 max tokens): 60–90s narration script in 5-section format (HOOK/WHAT IT IS/USE CASE/HONEST TAKE/CTA)
   - `script_ugc` (1000 max tokens): 80–120s on-camera script for Peter in 5-section format (HOOK/QUICK SHOW/MY TAKE/VS THE ALTERNATIVE/SIGN OFF)
   - `use_cases` (600 max tokens): JSON array of 2–4 ICP-specific use case objects
   - `consulting_notes` (800 max tokens): JSON object with 7 consulting prep fields
3. Updates `_tools/{slug}.md` in-place using regex replacement for each field. Scripts written as YAML block scalars (`|`). Nested objects rebuilt as indented YAML blocks.
4. Commits `_tools/` and pushes

**Error handling:** Each Claude call is wrapped in its own try/catch; failures for individual calls are logged but don't abort the others.

---

### 3.13 `capture-screenshots.yml` — Capture screenshots for public catalog (U-03)

**Trigger:** Schedule `0 5 * * 0` (Sundays 05:00 UTC) + `workflow_dispatch`

**Secrets required:** None

**What it does:**
1. Reads all `_repos/*.md` files
2. For each: checks `item_url` — skips if URL contains `github.com`, `gitlab.com`, or `huggingface.co`
3. Skips items where `screenshot_desktop` frontmatter field is already non-empty
4. Caps batch at 20 items per run
5. Playwright chromium: `goto(url, { timeout: 15000, waitUntil: 'networkidle' })`, attempts to dismiss cookie banners via 5 known selectors
6. Captures `1280×800` viewport screenshot to `static/screenshots/{slug}-desktop.png`
7. Updates `screenshot_desktop` frontmatter field via `setFrontmatterField()` regex helper
8. Commits `static/screenshots/` and updated `_repos/` files

---

### 3.14 `capture-tool-screenshots.yml` — Capture screenshots for Me2 tools (E-03)

**Trigger:** `workflow_dispatch` with required input `slug`

**Secrets required:** None

**What it does:**
1. Reads `_tools/{slug}.md`; resolves URL as `demo_url` if set, otherwise `url`
2. Creates `static/screenshots/{slug}/` directory
3. Playwright chromium:
   - Desktop (1280×800, above-the-fold): `{slug}-desktop.png`
   - Mobile (390×844): `{slug}-mobile.png`
   - Full-page desktop: `{slug}-full.png`
4. Cookie banner dismissal via 5 selectors
5. If navigation fails: logs warning, does not update frontmatter
6. Updates `screenshot_desktop` and `screenshot_mobile` in `_tools/{slug}.md`
7. Commits; writes capture result to `/tmp/capture-result.env` for GitHub Step Summary

---

### 3.15 `deploy-blog.yml` — Deploy Blog

**Trigger:** `workflow_run` on "Generate daily digest" completing (success only) + `push` to `main` on paths `_posts/**`, `_config.yml`, `index.md`, `about.md`

**Permissions:** `contents: read`, `pages: write`, `id-token: write`

**What it does:**
1. `actions/jekyll-build-pages@v1` builds site from repo root to `./_site`
2. `actions/upload-pages-artifact@v3` uploads artifact
3. `actions/deploy-pages@v4` deploys to GitHub Pages environment

**Note:** GITHUB_TOKEN pushes from Actions do NOT trigger this workflow via `push` event (GitHub security restriction). The `workflow_run` trigger is what keeps the deploy chain working after `generate-digest.yml` commits.

---

## 4. Data Sources

| Source | Fetch workflow | Output file | Dedup ledger | Key signal | Min threshold |
|--------|---------------|-------------|-------------|-----------|---------------|
| GitHub Search | `fetch-repos.yml` | `repos-YYYY-MM-DD.json` | `data/seen.json` | `stargazers_count` | `min_stars: 40` (trending: 10) |
| GitHub Trending | `fetch-repos.yml` | same | same | daily trending position | n/a |
| HuggingFace Spaces | `fetch-hf.yml` | `hf-YYYY-MM-DD.json` | `data/seen-hf.json` | `likes` | top 50 by likes |
| HuggingFace Models | `fetch-hf.yml` | same | same | `downloads` | top 20/pipeline |
| HuggingFace Datasets | `fetch-hf.yml` | same | same | `downloads` | top 50 |
| Replicate | `fetch-replicate.yml` | `replicate-YYYY-MM-DD.json` | `data/seen-replicate.json` | `run_count` | 100 runs, updated ≤6mo |
| GitLab | `fetch-gitlab.yml` | `gitlab-YYYY-MM-DD.json` | `data/seen-gitlab.json` | `star_count` | ≥20 stars, active ≤6mo |
| npm | `fetch-npm-pypi.yml` | `npm-pypi-YYYY-MM-DD.json` | `data/seen-npm-pypi.json` | `weekly_downloads` | ≥1000/week |
| PyPI | `fetch-npm-pypi.yml` | same | same | `recent_downloads` | ≥500/week |
| Ollama | `fetch-ollama.yml` | `ollama-YYYY-MM-DD.json` | `data/seen-ollama.json` | `pull_count` | no minimum |
| Papers with Code | `fetch-paperswithcode.yml` | `paperswithcode-YYYY-MM-DD.json` | `data/seen-paperswithcode.json` | `github_stars` | ≥50 stars on linked repo |
| HN Show HN | `fetch-launches.yml` | `launches-YYYY-MM-DD.json` | `data/seen-launches.json` | `score` | ≥10 upvotes |
| DevHunt | `fetch-launches.yml` | same | same | `upvotes` | none |
| BetaList | `fetch-launches.yml` | same | same | — | top 20 from RSS |
| Uneed | `fetch-launches.yml` | same | same | — | top 20 |
| Product Hunt | `fetch-producthunt.yml` | same (appended) | `data/seen-producthunt.json` | `votesCount` | ≥20 votes, relevant topic, not seen in 7 days |

**Dedup mechanism (per-source):** Each `data/seen-*.json` stores `{ featured: { id: { last_featured: "YYYY-MM-DD", times_featured: N } } }`. The `isOnCooldown()` function checks if `(today - last_featured) < cooldown_days` (default: 14). Items on cooldown are not eligible for inclusion.

**Hotness tracking** (`data/hotness.json`): Maintained by `fetch-repos.yml`. Tracks per-repo: `appearances` (total times seen in fetch results), `streak` (consecutive-day appearances), `last_seen`, `first_seen`, `star_snapshots` (rolling 30-day), `star_velocity` (stars/day over trailing week). Streak is decayed to 0 on any day a repo is absent from results.

---

## 5. Jekyll Collections

### 5.1 `_repos/` — Public catalog entries

Auto-generated by `generate-digest.yml`. One file per featured item. Filename is the item slug.

**Frontmatter schema:**

| Field | Type | Description |
|-------|------|-------------|
| `layout` | string | Always `repo` |
| `name` | string | Display name (e.g., `"owner/repo"` for GitHub items) |
| `source` | string | Data source: `github`, `huggingface-space`, `huggingface-model`, `huggingface-dataset`, `replicate`, `gitlab`, `npm`, `pypi`, `ollama`, `paperswithcode`, `launch` |
| `item_url` | string | Direct URL to the item |
| `description` | string | Editorial one-liner (Claude-generated or fallback to raw description) |
| `category` | string | Assigned category from `assignCategory()`: e.g., `"AI agents, LLM infra and RAG"` |
| `language` | string | Programming language (empty for npm/PyPI/Ollama) |
| `stars` | integer | Star count (0 for non-GitHub sources) |
| `downloads` | integer | Download count (npm, PyPI, HuggingFace datasets/models) |
| `likes` | integer | Like/upvote count (HuggingFace spaces, Replicate, launches) |
| `og_image` | string | Preview image URL (GitHub OG URL, HuggingFace screenshot API, or empty) |
| `readme_image` | string | First non-badge image found in README (GitHub repos only) |
| `screenshot_desktop` | string | Path to Playwright screenshot (populated by `capture-screenshots.yml`) |
| `first_featured` | string | ISO date string (`YYYY-MM-DD`) of first appearance in digest |
| `last_featured` | string | ISO date string of most recent appearance |
| `times_featured` | integer | Total number of times this item has appeared in a digest |
| `streak` | integer | Current consecutive-day streak from hotness tracking |
| `appearances` | integer | Total appearances in fetch results (from hotness.json) |
| `star_velocity` | integer | Stars gained per day over trailing 7 days |
| `tags` | array | Source tag + up to 8 topic/keyword tags |
| `icp_tags` | array | Audience persona tags from `SECTION_ICP` map; values: `founding-team`, `solopreneur`, `small-business`, `pre-mvp`, `entreprecurious`, `non-technical` |

**Slug generation:** `toSlug(id)` in `generate-digest.yml`: `id.toLowerCase().replace(/\//g, '--').replace(/[^a-z0-9-]/g, '')`. Forward slashes become double hyphens (e.g., `owner/repo` → `owner--repo`).

---

### 5.2 `_tools/` — Me2 private enrichment library

Created by `parse-submission.yml`, enriched by `generate-tool-page.yml`. One file per tool Peter has submitted. Defaults to `public: false`.

**Frontmatter schema:**

| Field | Type | Description |
|-------|------|-------------|
| `layout` | string | Always `tool` |
| `name` | string | Display name from submission |
| `url` | string | Primary tool URL |
| `source` | string | Always `submitted` |
| `submitted_date` | string | ISO date of submission |
| `issue` | integer | GitHub issue number that triggered creation |
| `public` | boolean | `true` = visible on `/picks/`; `false` = Jekyll-filtered private |
| `peters_pick` | boolean | Always `true` for Me2 tools |
| `create_content` | boolean | Intent flag: content is planned |
| `content_created` | boolean | Completion flag: content has been filmed/published |
| `category` | string | Manual enrichment field |
| `language` | string | Primary programming language |
| `license` | string | License type |
| `pricing` | string | `free`, `freemium`, `paid`, `open-source` |
| `github_url` | string | GitHub repo URL if separate from main URL |
| `demo_url` | string | Live demo URL (used by screenshot workflow if set) |
| `screenshot_desktop` | string | Path: `static/screenshots/{slug}/{slug}-desktop.png` |
| `screenshot_mobile` | string | Path: `static/screenshots/{slug}/{slug}-mobile.png` |
| `readme_image` | string | README hero image URL |
| `og_image` | string | OG image URL |
| `primary_icp` | string | Primary audience persona (from submission) |
| `icp_tags` | array | All relevant persona tags including secondary ICPs |
| `hook` | string | Peter's submitted hook sentence |
| `one_liner` | string | Claude-generated 20-word description |
| `compare_to` | string | Competitor/alternative name from submission |
| `honest_take` | string | Honest limitations from submission |
| `script_faceless` | YAML block scalar | Claude-generated 60–90s narration script (Format A) |
| `script_ugc` | YAML block scalar | Claude-generated 80–120s on-camera script for Peter (Format B) |
| `use_cases` | YAML sequence | Array of ICP-specific use case objects: `{icp, scenario, outcome, effort}` |
| `consulting_notes` | YAML mapping | Nested object: `{who_best_for, pitch, red_flags, integration_notes, pricing_reality, client_readiness, typical_objections, consulting_public}` |
| `times_featured` | integer | Initialized to 0 |
| `date_added` | string | ISO date |

---

## 6. Config Files

### `config/preferences.json`

Controls digest generation thresholds and section limits. All values read in `generate-digest.yml`.

| Field | Type | Description |
|-------|------|-------------|
| `min_stars` | integer | Minimum stars for a GitHub repo to be eligible (default: 40) |
| `min_stars_trending` | integer | Lower minimum for trending repos (default: 10) |
| `recent_months` | integer | Maximum age in months for an item to be eligible (default: 12) |
| `max_repos_total` | integer | Total GitHub repos across all sections (default: 30) |
| `max_repos_per_section` | integer | Max items per category section (default: 5) |
| `max_trending_candidates` | integer | Trending repos considered for the Trending section |
| `max_trending_featured` | integer | Trending repos actually featured in digest |
| `max_trending_also` | integer | Trending repos shown in secondary "also trending" list |
| `cooldown_days` | integer | Days before an item can be re-featured (default: 14) |
| `max_hf_spaces` | integer | Max HuggingFace Spaces per digest |
| `max_hf_models` | integer | Max HuggingFace Models per digest |
| `max_hf_datasets` | integer | Max HuggingFace Datasets per digest |
| `max_replicate_models` | integer | Max Replicate models per digest |
| `max_papers` | integer | Max Papers with Code items per digest |
| `max_npm` | integer | Max npm packages per digest |
| `max_pypi` | integer | Max PyPI packages per digest |
| `max_gitlab` | integer | Max GitLab repos per digest |
| `max_ollama` | integer | Max Ollama models per digest |
| `max_launches` | integer | Max launch items per digest |

### `config/queries.json`

GitHub Search API queries, organized into three groups:

| Group | Purpose |
|-------|---------|
| `default_queries` | Core SaaS, LLM/agents, CRM/marketing queries |
| `extra_queries` | Billing, analytics, TypeScript templates |
| `ugc_social_queries` | Video generation, AI art, social media automation |

Each query uses GitHub Search syntax (`topic:`, `language:`, `stars:>N`, `pushed:>YYYY-MM-DD`, `sort:`). All queries tagged with their group name, which propagates to `_query_group` field used by `assignCategory()`.

### `config/spotlight.json`

Manual injection list for must-feature repos. Schema: `{ "repos": [] }`. Currently empty. When populated, items in the `repos` array bypass cooldown and selection filters to always appear in the next digest.

---

## 7. Me2 Layer

Me2 is Peter's private enrichment pipeline layered on top of the public VaiBReport digest. Public digest content is automated; Me2 content is manually triggered.

### The Two-Track Model

| Track | Collection | Audience | Trigger | Pages |
|-------|-----------|---------|---------|-------|
| Public digest | `_repos/` | VaiBReport readers | Daily cron | `/repos/`, `/leaderboard/`, daily posts |
| Me2 private library | `_tools/` | Peter (consulting + content) | Peter submits GitHub Issue | `/picks/` (public items only), `my-picks.md` (dashboard) |

### Submission Flow

1. Peter opens GitHub Issue using the "Submit Tool" issue template with label `peters-pick`
2. `parse-submission.yml` triggers on label application; parses issue body; creates `_tools/{slug}.md`
3. Workflow comments on the issue with the file path and manual next-step instructions for screenshot and script workflows
4. Issue is closed automatically

### Screenshot Capture

- `capture-tool-screenshots.yml` is run manually via `workflow_dispatch` with the tool's slug
- Prefers `demo_url` over `url` for capture target
- Produces three files: `{slug}-desktop.png` (1280×800), `{slug}-mobile.png` (390×844), `{slug}-full.png` (full-page)
- Stored at `static/screenshots/{slug}/`
- Updates `screenshot_desktop` and `screenshot_mobile` frontmatter fields

### Script and Content Generation

- `generate-tool-page.yml` is run manually via `workflow_dispatch` with the tool's slug
- Makes 5 Claude API calls to populate: `one_liner`, `script_faceless`, `script_ugc`, `use_cases`, `consulting_notes`
- Scripts embed directly in frontmatter as YAML block scalars — Peter edits the `.md` file directly before filming
- `consulting_notes.consulting_public` controls whether consulting section is visible on the public page

### Visibility Toggle

- Default: `public: false` (set in `_config.yml` collection defaults)
- Peter sets `public: true` in the frontmatter to expose the item on `/picks/`
- Jekyll `where` filter in `picks.md` renders only `public: true` tools
- `my-picks.md` (Me2 dashboard) renders all `_tools/` items regardless of public flag, showing status chips

### ICPs (Audience Profiles)

Six target personas used throughout the system:

| Tag | Description |
|-----|-------------|
| `founding-team` | 2–5 person startups; bandwidth-constrained; decisions: what tools let us move faster |
| `solopreneur` | One-person operation; cost-sensitive; decisions: can I run this solo |
| `small-business` | Main street + services; not always tech-native; decisions: will my team use this |
| `pre-mvp` | Have an idea, haven't shipped; evaluating stacks; decisions: what to bet the MVP on |
| `entreprecurious` | Employed, curious about building; low urgency; decisions: what's possible |
| `non-technical` | Decision-makers, investors, ops; want signal without implementation; decisions: is this category worth attention |

---

## 8. Claude Code Automations

### `.claude/settings.json` — Hooks

**PreToolUse hook** (on `Edit|Write`):
- Intercepts writes to `data/*.json` files
- Blocks with error: `"BLOCK: data/ JSON files are auto-generated by GitHub Actions. Edit config/ files instead."`
- Exit code 2 = hard block

**PostToolUse hook** (on `Edit|Write`):
- Validates `config/*.json` files for JSON syntax after edit
- Validates `_tools/*.md` files for required frontmatter fields: `name:`, `url:`, `date_added:`, `peters_pick:`, `create_content:`, `content_created:`, `public:`
- Validates that boolean fields (`peters_pick`, `create_content`, `content_created`, `public`) have only `true` or `false` values
- Prints warnings to stderr (does not block)

### `.mcp.json` — MCP Servers (local Claude Code)

Two MCP servers configured for local development with Claude Code:

| Server | Package | Purpose |
|--------|---------|---------|
| `github` | `@modelcontextprotocol/server-github` | GitHub API access from Claude Code (issues, PRs, repos, files) |
| `playwright` | `@playwright/mcp@latest` | Browser control from Claude Code (can navigate, screenshot, interact) |

Both use `type: stdio` and are invoked via `npx` (no pre-install required).

---

## 9. Key Patterns

### `parseFrontMatter(content)` — Regex-based YAML parser

Used throughout workflows instead of a YAML library. Extracts top-level scalar fields only. Handles both `key: "value"` (quoted strings) and `key: value` (unquoted) forms. Does not handle arrays, nested objects, or multi-line values — these are handled with separate targeted regexes where needed (e.g., `icp_tags` array extraction in `generate-tool-page.yml`).

```javascript
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w_]*)\s*:\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (/^\d+$/.test(val)) val = parseInt(val, 10);
      fm[m[1]] = val;
    }
  }
  return fm;
}
```

**Why regex not js-yaml:** `js-yaml` is not installed (no `package.json` dependencies for inline workflow scripts). All JS runs via `node --input-type=module` with no npm install step in most workflows. Only `cheerio@1` is installed ad-hoc where needed. Regex is sufficient for the flat-key frontmatter patterns in use.

### `toSlug(id)` — ID to filename slug

Two variants exist:

- **Catalog (`generate-digest.yml`):** `id.toLowerCase().replace(/\//g, '--').replace(/[^a-z0-9-]/g, '')` — slashes become double hyphens
- **Me2 submission (`parse-submission.yml`):** Strips protocol/www, replaces non-alphanumeric with hyphens, truncates at 60 chars

### Dedup / Cooldown Pattern

```javascript
// Load ledger
const seen = JSON.parse(fs.readFileSync('data/seen.json', 'utf8')) || { featured: {} };

// Check cooldown
function isOnCooldown(seen, id, today, days) {
  const entry = seen.featured[id];
  if (!entry) return false;
  return (today - new Date(entry.last_featured)) / 86400000 < days;
}

// Mark as seen
function markSeen(seen, id, digestDate) {
  const entry = seen.featured[id] || { times_featured: 0 };
  entry.last_featured = digestDate;
  entry.times_featured = (entry.times_featured || 0) + 1;
  seen.featured[id] = entry;
}
```

### Commit Guard Pattern

Every digest-generating script checks for the output file's existence before doing any work:

```javascript
const postPath = `_posts/${digestDate}-github-digest.md`;
if (fs.existsSync(postPath)) {
  console.log(`Digest for ${digestDate} already exists. Skipping.`);
  process.exit(0);
}
```

This makes the workflow idempotent — safe to re-run or trigger multiple times on the same day.

### Claude API Call Pattern

Used in both `generate-digest.yml` and `generate-tool-page.yml`:

```javascript
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: N,
    messages: [{ role: 'user', content: prompt }]
  })
});
```

Response extraction: `data.content[0].text`. For structured JSON responses (use_cases, consulting_notes), the response text is searched with `/\[[\s\S]*\]/` or `/\{[\s\S]*\}/` to extract the JSON block in case Claude wraps it in prose.

### Inline Node.js Script Pattern

All JavaScript runs as inline heredoc scripts:

```yaml
run: |
  node --input-type=module << 'SCRIPT'
  import fs from 'fs';
  // ...
  SCRIPT
```

This avoids needing separate `.js` files committed to the repo. The `--input-type=module` flag enables ES module syntax (`import`/`export`) without a `package.json` with `"type": "module"`. `fetch` is available natively in Node.js 18+.

---

## 10. Anti-patterns and Gotchas

### `repo.slug` null issue (B-03 — fixed)

Leaderboard page was referencing `repo.slug` in Liquid templates, but Jekyll assigns `.slug` based on the filename with date-prefix stripping logic that didn't match expectations. Fixed by using `repo.url` (Jekyll's computed URL for the collection item) instead of constructing links from `.slug`.

### `digestDate` scope bug (B-01 — fixed)

In an earlier version of `generate-digest.yml`, `digestDate` was defined inside an async IIFE but referenced by `createRepoEntry()` at the outer module scope. JavaScript hoisting made the reference `undefined` at call time. Fixed by passing `digestDate` as an explicit parameter to `createRepoEntry()`.

**Pattern to follow:** All date/config values computed at startup should be passed as parameters to functions, never accessed from outer scope inside async callbacks.

### Why inline Node.js, not separate files

All workflow scripts are written as inline heredoc `node --input-type=module` scripts. This is intentional:
- Keeps the entire workflow logic in one file (the `.yml`)
- No risk of scripts getting out of sync with the workflow that calls them
- `git blame` on a workflow file shows the full context of a change
- Downside: large files, harder to test locally. Accepted trade-off for this repo's scale.

### Why regex not js-yaml for frontmatter

`js-yaml` requires `npm install` in the workflow. Most workflows don't install any packages (except `cheerio` where needed). Avoiding the install step saves ~30 seconds per run. The frontmatter patterns in use are simple enough that line-by-line regex is sufficient. YAML block scalars (multi-line strings) in `_tools/` files are written but not parsed by these scripts — only the surrounding single-line fields are read back.

### GITHUB_TOKEN push does not trigger `on: push` workflows

GitHub Actions explicitly prevents GITHUB_TOKEN-authenticated pushes from triggering further workflow runs to prevent infinite loops. The `deploy-blog.yml` therefore uses `workflow_run` triggered by `generate-digest.yml` completing, not a `push` trigger. This is why the deploy workflow has the `workflow_run` trigger in addition to the direct `push` path (for manual commits).

### Product Hunt 30-hour lookback window

Product Hunt resets daily rankings at midnight Pacific time (07:00–08:00 UTC). The `fetch-producthunt.yml` runs at 07:00 UTC, which may run before or after the reset. A 30-hour lookback window (`new Date(now - 30 * 60 * 60 * 1000)`) ensures yesterday's top posts are always captured even if today's haven't been published yet.

### Product Hunt merges into launches file

`fetch-producthunt.yml` does not write to a separate file — it reads and modifies `data/launches-YYYY-MM-DD.json` to append PH items (and strips old PH entries first to avoid duplication on re-runs). This means the launches file may be written by two separate workflows in the same day.

### `_tools/` excluded from public build by default

`_config.yml` sets collection defaults: `public: false`, `content_created: false`, `peters_pick: true` for all `_tools/` items. The `picks.md` page renders only items where `public == true`. Items with `public: false` still have Jekyll pages generated (because `output: true` is set for the collection) but are not linked from any public page. This is intentional — the URL is guessable but not discoverable.
