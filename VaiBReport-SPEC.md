# VaiBReport — GitHub Blogroll Digest

## Project Spec v1.0 (Hardened)

**Owner:** Peter Wheeler (CHAOSAiGENT)
**Repo:** github.com/CHAOSAiGENT/VaiBReport
**Last updated:** 2026-03-04

---

## What This Is

A daily-updating public "blogroll" of curated GitHub repositories, aimed at solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators. The system fetches candidate repos automatically, then uses Claude Cowork to apply editorial judgment and produce opinionated digest posts. The result is a clean static blog hosted on GitHub Pages.

**Core principle:** If there's nothing interesting on a given day, there's no post. Quality over volume.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Actions (daily cron)                     │
│  ┌───────────────┐    ┌───────────────────────┐ │
│  │ GitHub Search  │    │ Trending Scraper      │ │
│  │ API (queries)  │    │ (cheerio + gh/trending│ │
│  └───────┬───────┘    └──────────┬────────────┘ │
│          └──────────┬────────────┘               │
│                     ▼                            │
│          data/repos-YYYY-MM-DD.json              │
│          (committed to repo daily)               │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Claude Cowork (manual or scheduled)             │
│                                                  │
│  Reads latest JSON + config/preferences.json     │
│  + data/seen.json (dedup ledger)                 │
│  → Filters, ranks, writes opinionated digest     │
│  → _posts/YYYY-MM-DD-github-digest.md            │
│  → Updates data/seen.json                        │
│  → OR exits silently if nothing worth posting    │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  GitHub Actions (on push to _posts/)             │
│  Jekyll build → gh-pages branch                  │
│  GitHub Pages serves the static blog             │
└─────────────────────────────────────────────────┘
```

### Responsibility Split

| Layer | Tool | Runs | Human involvement |
|-------|------|------|-------------------|
| Data fetch | GitHub Actions | Daily cron (automated) | None — does its thing |
| Digest curation | Claude Cowork | On-demand or scheduled | Optional review before commit |
| Blog build + deploy | GitHub Actions + Jekyll | On push to _posts/ (automated) | None |
| Ad-hoc deep dives | Perplexity Pro | Manual | Peter drives these |
| Repo setup + infra changes | Claude Code | One-time / as needed | Peter drives these |

---

## Repo Structure

```
VaiBReport/
├── .github/
│   └── workflows/
│       ├── fetch-repos.yml          # Daily data collection
│       └── deploy-blog.yml          # Jekyll build + Pages deploy
├── config/
│   ├── queries.json                 # GitHub search queries (editable)
│   ├── preferences.json             # Thresholds, caps, tuning knobs
│   └── spotlight.json               # Manual repo additions (optional)
├── data/
│   ├── repos-YYYY-MM-DD.json        # Daily snapshots (auto-generated)
│   └── seen.json                    # Dedup ledger (Cowork-managed)
├── _posts/                          # Jekyll post directory
│   └── YYYY-MM-DD-github-digest.md  # Digest posts (Cowork-generated)
├── _config.yml                      # Jekyll config
├── _layouts/                        # Jekyll layout overrides (optional)
├── index.md                         # Blog index page
├── about.md                         # About page
├── static/                          # Images, CSS overrides
├── README.md                        # Project documentation
└── CONTEXT.md                       # Context log for session continuity
```

**Note on Jekyll:** We use `_posts/` (with underscore) because that's what Jekyll expects natively. GitHub Pages builds Jekyll automatically — no custom build action needed.

---

## Why Jekyll (Not the Blog Action)

The Perplexity conversation used `kamranahmedse/github-pages-blog-action@v0.0.10`. That action is **unmaintained** — last release was May 2022, 4 open issues, 3 unmerged PRs, no activity since.

Jekyll is the right choice because:

- GitHub Pages builds it **natively** with zero GitHub Actions config for the blog itself
- Huge theme ecosystem (100+ clean themes)
- Battle-tested with millions of sites
- Posts are just Markdown files with YAML front matter in `_posts/`
- No npm, no Node, no build step — just push and it works

For the blog deploy workflow, we simply need to ensure GitHub Pages is set to build from the `main` branch (or use the newer GitHub Actions Pages deploy if we want more control).

---

## Why Cheerio Scraping (Not GiTrends)

GiTrends has 2 stars, 8 commits, one maintainer, and a placeholder API. It's not production-grade.

Instead, the fetch workflow scrapes `github.com/trending` directly using Cheerio (HTML parser). This is:

- The most common approach in the ecosystem (multiple reference implementations exist)
- Not rate-limited (it's a regular HTTP request, not an API call)
- Captures the actual GitHub Trending algorithm output
- Battle-tested pattern ("git scraping" per Simon Willison)

Fallback: if scraping breaks due to HTML changes, the system still works — search-sourced repos carry the digest, and the trending section just goes empty until the scraper is fixed.

---

## Config Files

### config/queries.json

```json
{
  "default_queries": [
    "topic:saas language:TypeScript stars:>40 pushed:>2025-06-01 sort:stars",
    "topic:llm OR topic:agents stars:>80 pushed:>2025-06-01 sort:stars",
    "topic:crm OR topic:marketing-automation stars:>40 pushed:>2025-06-01 sort:stars"
  ],
  "extra_queries": [
    "topic:billing OR topic:subscriptions stars:>30 pushed:>2025-06-01 sort:stars",
    "topic:analytics OR topic:business-intelligence stars:>40 pushed:>2025-06-01 sort:stars",
    "language:typescript stars:>80 pushed:>2025-06-01 topic:template sort:stars"
  ],
  "ugc_social_queries": [
    "topic:social-media-management stars:>50 pushed:>2025-01-01 sort:stars",
    "topic:content-creation OR topic:ai-content-creation stars:>80 pushed:>2025-01-01 sort:stars",
    "(topic:instagram-api OR topic:tiktok-api OR topic:youtube-api) stars:>30 pushed:>2024-06-01 sort:stars",
    "topic:video-generation OR topic:ai-video-generation stars:>200 pushed:>2025-01-01 sort:stars",
    "(topic:social-scheduling OR topic:social-media-automation) stars:>30 pushed:>2025-01-01 sort:stars"
  ]
}
```

**Design decisions:**

- `pushed:>` dates use a rolling ~9-12 month window. These should be bumped periodically (quarterly is fine) — or the fetch script can compute them dynamically.
- `ugc_social_queries` is a separate array so Cowork can tag these repos for the UGC/Social Media section.
- Star thresholds are intentionally low because Cowork applies the real quality filter. Better to have candidates than miss things.

### config/preferences.json

```json
{
  "min_stars": 40,
  "min_stars_trending": 10,
  "recent_months": 12,
  "max_repos_total": 15,
  "max_repos_per_section": 5,
  "max_trending_candidates": 5,
  "max_trending_featured": 3,
  "max_trending_also": 2,
  "cooldown_days": 14
}
```

- `cooldown_days`: How long a repo must wait after being featured before it can appear again (dedup). 14 days means a repo can reappear roughly every other week if it stays relevant.
- `max_repos_total` bumped to 15 (from 12) to accommodate the new UGC category.

### config/spotlight.json

```json
{
  "repos": [
    {
      "full_name": "gitroomhq/postiz-app",
      "html_url": "https://github.com/gitroomhq/postiz-app",
      "note": "Self-hosted social media scheduling — found via Perplexity",
      "added": "2026-03-04"
    }
  ]
}
```

This is your manual injection point. When you find something great via Perplexity or browsing, drop it here. Cowork will check this file and consider these repos alongside the automated candidates. Remove entries after they've been featured (or Cowork can do this).

### data/seen.json

```json
{
  "featured": {
    "acme/some-repo": {
      "last_featured": "2026-03-04",
      "times_featured": 1
    }
  }
}
```

Cowork reads this before selecting repos and skips any repo whose `last_featured` is within `cooldown_days`. After generating a digest, Cowork updates this file.

---

## Audience Categories (Digest Sections)

The digest groups repos into sections. Only sections with picks get included:

| Section | Targets |
|---------|---------|
| **SaaS starters and templates** | Boilerplates, starter kits, full-stack templates for B2B SaaS |
| **AI agents, LLM infra and RAG** | Agent frameworks, LLM gateways, RAG stacks, vector DBs, MLOps |
| **Ops, analytics and automation** | Billing, finance, dashboards, internal tools, workflow automation |
| **Marketing, sales and GTM tools** | Email, landing pages, CRM, outreach, sales enablement |
| **UGC, social media and creator tools** | Social scheduling, content creation, video generation, platform APIs, creator analytics |
| **Trending oddballs worth a look** | Quirky/novel trending repos that don't fit neatly elsewhere |

The UGC section draws from:
- `ugc_social_queries` results
- Trending repos that match social/content/creator keywords
- Spotlight entries tagged for this category

### Notable open-source tools in the UGC/Social space (reference)

These are known-good repos to calibrate quality expectations:

- **gitroomhq/postiz-app** — Self-hosted social scheduling (X, Bluesky, Mastodon, Discord) with REST API
- **socioboard/Socioboard-5.0** — Open-source social media management across 9+ networks
- **hpcaitech/Open-Sora** — Open-source AI video generation (text-to-video)
- **subzeroid/instagrapi** — Fast Python Instagram Private API library
- **qeeqbox/social-analyzer** — Profile analysis across 1000+ social platforms

Awesome lists to watch-list:
- `awesomelistsio/awesome-social-media`
- `smoopersocial/social-media-tools`
- `showlab/Awesome-Video-Diffusion`
- `ad-si/awesome-video-production`

---

## GitHub Actions: fetch-repos.yml

### Key hardening vs. the Perplexity version

1. **Native `fetch()`** — Node 20 has built-in fetch. No `node-fetch` dependency.
2. **Cheerio scraper** for trending — replaces the non-existent GiTrends API.
3. **Rate-limit delay** — 2-second pause between GitHub Search API calls.
4. **Query categories preserved** — repos tagged with `_query_group` so Cowork knows which category they came from.
5. **Graceful degradation** — if trending scrape fails, the workflow still succeeds with search-only data.

```yaml
name: Fetch GitHub repos for digest

on:
  schedule:
    - cron: "0 13 * * *"   # daily at 13:00 UTC
  workflow_dispatch:

jobs:
  fetch-and-commit:
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

      - name: Install deps
        run: npm install cheerio@1

      - name: Fetch repos
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node --input-type=module << 'SCRIPT'
          import fs from 'fs';
          import { load } from 'cheerio';

          const delay = (ms) => new Promise(r => setTimeout(r, ms));

          // ── Read config ──────────────────────────────────
          function readQueries() {
            const raw = fs.readFileSync('config/queries.json', 'utf8');
            const parsed = JSON.parse(raw);
            return {
              default_queries: parsed.default_queries || [],
              extra_queries: parsed.extra_queries || [],
              ugc_social_queries: parsed.ugc_social_queries || []
            };
          }

          // ── GitHub Search API ────────────────────────────
          async function searchGithub(q) {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.set('q', q);
            url.searchParams.set('sort', 'stars');
            url.searchParams.set('order', 'desc');
            url.searchParams.set('per_page', '50');

            const res = await fetch(url, {
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GH_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });

            if (!res.ok) {
              console.error(`Search failed for "${q}": ${res.status}`);
              return [];
            }
            const json = await res.json();
            return json.items || [];
          }

          // ── Scrape GitHub Trending ───────────────────────
          async function scrapeTrending() {
            try {
              const res = await fetch(
                'https://github.com/trending?since=daily&spoken_language_code=en'
              );
              if (!res.ok) {
                console.error(`Trending scrape failed: ${res.status}`);
                return [];
              }
              const html = await res.text();
              const $ = load(html);
              const repos = [];

              $('article.Box-row').each((_, el) => {
                const titleEl = $(el).find('h2 a');
                const slug = titleEl.attr('href')?.replace(/^\//, '') || '';
                if (!slug.includes('/')) return;

                const desc = $(el).find('p.col-9').text().trim() || null;
                const lang = $(el).find('[itemprop="programmingLanguage"]')
                  .text().trim() || null;
                const starsText = $(el).find('a[href$="/stargazers"]')
                  .text().trim().replace(/,/g, '');
                const stars = parseInt(starsText, 10) || 0;

                repos.push({
                  full_name: slug,
                  html_url: `https://github.com/${slug}`,
                  description: desc,
                  stargazers_count: stars,
                  language: lang,
                  topics: [],
                  pushed_at: null,
                  created_at: null,
                  forks_count: 0,
                  _source: 'trending'
                });
              });

              return repos;
            } catch (e) {
              console.error('Trending scrape error:', e.message);
              return [];
            }
          }

          // ── Slim helper ──────────────────────────────────
          function slimRepo(r, source = 'search', queryGroup = 'default') {
            return {
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              stargazers_count: r.stargazers_count,
              language: r.language,
              topics: r.topics || [],
              pushed_at: r.pushed_at,
              created_at: r.created_at,
              forks_count: r.forks_count,
              _source: source,
              _query_group: queryGroup
            };
          }

          // ── Main ─────────────────────────────────────────
          (async () => {
            const config = readQueries();
            const allRepos = [];

            // Run each query group with tagging
            const groups = [
              ['default', config.default_queries],
              ['extra', config.extra_queries],
              ['ugc_social', config.ugc_social_queries]
            ];

            for (const [groupName, queries] of groups) {
              for (const q of queries) {
                const items = await searchGithub(q);
                allRepos.push(
                  ...items.map(r => slimRepo(r, 'search', groupName))
                );
                await delay(2000);  // rate-limit courtesy
              }
            }

            // Trending (best-effort)
            const trending = await scrapeTrending();
            allRepos.push(...trending);

            // Deduplicate by full_name, keep higher-star entry
            const map = {};
            for (const r of allRepos) {
              const existing = map[r.full_name];
              if (!existing ||
                  (r.stargazers_count || 0) > (existing.stargazers_count || 0)) {
                // Merge _query_group if both exist
                if (existing && existing._query_group !== r._query_group) {
                  r._query_group = `${existing._query_group},${r._query_group}`;
                }
                map[r.full_name] = r;
              }
            }
            const deduped = Object.values(map);

            // Write output
            const date = new Date().toISOString().slice(0, 10);
            const payload = {
              generated_at: new Date().toISOString(),
              config: {
                default_queries: config.default_queries,
                extra_queries: config.extra_queries,
                ugc_social_queries: config.ugc_social_queries
              },
              sources: {
                github_search: {
                  query_count:
                    config.default_queries.length +
                    config.extra_queries.length +
                    config.ugc_social_queries.length,
                  repo_count: allRepos.filter(
                    r => r._source === 'search'
                  ).length
                },
                trending: {
                  method: 'cheerio-scrape',
                  repo_count: trending.length
                }
              },
              repos: deduped
            };

            if (!fs.existsSync('data')) {
              fs.mkdirSync('data', { recursive: true });
            }
            fs.writeFileSync(
              `data/repos-${date}.json`,
              JSON.stringify(payload, null, 2)
            );

            console.log(
              `Wrote ${deduped.length} repos ` +
              `(${allRepos.filter(r => r._source === 'search').length} search, ` +
              `${trending.length} trending)`
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
          git commit -m "Add repos snapshot for ${date}" || echo "No changes"
          git push
```

---

## GitHub Actions: deploy-blog.yml

Since we're using Jekyll (natively supported by GitHub Pages), we have two options:

**Option A — Zero-config (recommended for V1):**
Just enable GitHub Pages in repo settings → Source: "Deploy from a branch" → Branch: `main`, folder: `/ (root)`. Done. GitHub builds Jekyll automatically on every push. No workflow file needed.

**Option B — GitHub Actions Pages deploy (more control):**

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]
    paths:
      - "_posts/**"
      - "_config.yml"
      - "index.md"
      - "about.md"

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Recommendation:** Start with Option A. Move to Option B only if you need build customization.

---

## Jekyll Config: _config.yml

```yaml
title: VaiBReport
description: >-
  Daily GitHub repo picks for solo founders, AI/B2B SaaS builders,
  and small business tools.
url: "https://chaosagent.github.io"
baseurl: "/VaiBReport"

# Build settings
markdown: kramdown
theme: minima
permalink: /:year/:month/:day/:title/

# Excludes
exclude:
  - data/
  - config/
  - static/
  - README.md
  - CONTEXT.md
  - node_modules/
  - package.json
  - package-lock.json
```

The `minima` theme ships with GitHub Pages and is clean out of the box. Can swap to any GitHub Pages-supported theme later.

---

## Cowork Prompts

### Setup Prompt (run once via Claude Code)

This is handled by Claude Code with GitHub skills. The spec above IS the setup guide — Claude Code should create the repo structure, config files, workflows, and Jekyll config exactly as specified.

### Digest Prompt (run regularly via Cowork)

```
You are helping me generate a GitHub repo digest post for my Jekyll blog
hosted on GitHub Pages.

FIRST, read these files:
- config/preferences.json (thresholds and caps)
- config/spotlight.json (manual repo additions)
- data/seen.json (previously featured repos and dates)
- The latest file in data/ matching repos-YYYY-MM-DD.json

AUDIENCE:
- Solo founder / solopreneur building AI/B2B SaaS and small business tools
- Content creators and social media managers at small companies
- Technical, comfortable reading GitHub repos
- Limited time: wants concise, opinionated curation

FILTERING RULES:
1. From the JSON "repos" array, select projects useful for this audience.
2. Apply preferences.json thresholds:
   - stargazers_count >= min_stars (for search repos)
   - stargazers_count >= min_stars_trending (for _source: "trending")
   - pushed_at within recent_months of today
3. Check seen.json: skip any repo whose last_featured date is within
   cooldown_days of today.
4. Include any repos from spotlight.json that haven't been featured
   within cooldown_days.

ZERO-RESULT RULE:
If after filtering there are ZERO interesting repos, STOP.
Do not create or modify any files. Exit gracefully.
Some days intentionally have no digest.

SELECTION:
- Pick at most max_repos_total of the strongest repos.
- Aim for category diversity, not max_repos_per_section of the same type.
- Use _query_group to help assign repos to sections:
  - "default" or "extra" → SaaS, AI, Ops, or Marketing sections
  - "ugc_social" → UGC, social media and creator tools section

TRENDING HANDLING:
- From repos where _source == "trending", pick up to
  max_trending_candidates that look interesting.
- Rank them. Top max_trending_featured get full writeups (integrated
  into the best-fit section, or in "Trending oddballs worth a look").
- Remaining up to max_trending_also go in "Also trending today"
  with ultra-short blurbs (5-10 words each).
- If fewer than 3 good trending repos, feature only what meets
  the quality bar. Do not force it.

OUTPUT:
Create _posts/YYYY-MM-DD-github-digest.md with:

---
layout: post
title: "GitHub Digest – YYYY-MM-DD"
date: YYYY-MM-DD
tags: [github, digest, ai, saas, solopreneur, ugc]
---

Intro (2-4 sentences): who this is for, any theme today.

Then sections with ## headings. Only include sections that have picks:

## SaaS starters and templates
## AI agents, LLM infra and RAG
## Ops, analytics and automation
## Marketing, sales and GTM tools
## UGC, social media and creator tools
## Trending oddballs worth a look

Under each section, bullet items:
- [owner/repo](URL) – opinionated one-liner on why this matters
  for a solo founder (Language, 1.2k★)

For "Also trending today" (if applicable):
### Also trending today
- [owner/repo](URL) – ultra-short phrase (Language, stars)

AFTER WRITING THE POST:
1. Update data/seen.json: add each featured repo with today's date
   and increment times_featured.
2. Remove any entries from config/spotlight.json that were just featured.
3. Print a summary: created or skipped, filename, repo count,
   trending count.
```

---

## Dedup Strategy

The `seen.json` ledger prevents the same repos from dominating every digest:

- **Before selecting:** Cowork reads `seen.json` and filters out repos featured within `cooldown_days` (default: 14).
- **After writing:** Cowork updates `seen.json` with the repos it just featured.
- **Cooldown is soft:** A repo can reappear after the cooldown if it's still showing up in search/trending results. This handles genuinely important repos that stay relevant.
- **No permanent blocklist:** If a repo keeps appearing and is always good, that's fine — the cooldown just prevents back-to-back repeats.

---

## Spotlight Mechanism

When Peter finds interesting repos via Perplexity or browsing:

1. Add them to `config/spotlight.json` with name, URL, and a note.
2. Cowork checks this file during digest generation.
3. Spotlight repos bypass the normal search/trending pipeline — they're considered alongside everything else but with a "hand-picked" signal.
4. After featuring a spotlight repo, Cowork removes it from the file.

This keeps the "Perplexity deep dive" workflow connected to the automated digest without requiring any code changes.

---

## Maintenance Cadence

| Task | Frequency | Who/What |
|------|-----------|----------|
| Fetch repos JSON | Daily | GitHub Actions (automated) |
| Generate digest post | When you want (daily-ish) | Cowork (manual or scheduled) |
| Blog rebuild | On push | GitHub Pages / Jekyll (automated) |
| Bump `pushed:>` dates in queries | Quarterly | Peter or Cowork |
| Review/tune preferences.json | Monthly-ish | Peter |
| Add spotlight repos | Ad-hoc | Peter (via Perplexity finds) |
| Prune seen.json | Never (self-managing via cooldown) | — |

---

## Open Questions / V2 Ideas

- **RSS feed:** Jekyll generates one by default with the `jekyll-feed` plugin (included in `minima` theme). Free RSS for subscribers.
- **Email digest:** Could add a GitHub Action that emails the HTML version. Defer for now.
- **Hugging Face integration:** HF has relevant models/spaces for content creation. Could add HF model search as an additional data source in a future version.
- **Analytics:** GitHub Pages doesn't have analytics. Could add a lightweight tracker (Plausible, Umami) if Peter wants to see traffic.
- **Custom domain:** Easy to configure via GitHub Pages settings + a CNAME file.

---

## Context for New Chat Sessions

This spec lives at `VaiBReport-SPEC.md` in the repo root. The `CONTEXT.md` file tracks session-by-session changes. Any new Cowork or Claude Code session should read both files before making changes.
