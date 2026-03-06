# VaiBReport V2 — Punchlist

**Last updated:** 2026-03-06
**Status:** V2 Phase 3 complete. Multi-platform expansion + site experience upgrade shipped.

---

## Where V1 Stands

The full automation chain is live: `fetch-repos.yml` (daily 1pm UTC) → `generate-digest.yml` (auto-triggers) → `deploy-blog.yml` (auto-triggers) → GitHub Pages serves the site. Blog is at https://chaosaigent.github.io/VaiBReport/. UGC queries are fixed and returning results. Dedup, cooldown, spotlight, and config-driven tuning all work. The digest is currently generated algorithmically (keyword matching + template), not with AI judgment.

---

## V2 Features

### 1. AI-Quality Writeups (Claude API)

The current `generate-digest.yml` uses a simple template: `[owner/repo] – description (Language, Stars)`. This is functional but generic. The upgrade is to call the Claude API from the GitHub Action to produce opinionated, editorial-quality one-liners — the kind of judgment Cowork applies when doing it manually.

**What this looks like:**
- Add `ANTHROPIC_API_KEY` as a GitHub Actions secret
- After filtering and categorizing repos, send the batch to Claude with the audience context and ask for opinionated blurbs
- Fall back to the template approach if the API call fails (rate limit, outage, etc.)
- This turns every daily digest into something worth reading, not just a list

**Why it matters:** This is the single biggest quality-of-life upgrade. The difference between "a list of repos" and "a curated newsletter" is the editorial voice.

---

### 2. Running Results Page (Individual Repo Entries)

Right now, the blog only shows daily digest posts. Each post bundles 10-15 repos into a single page. Peter wants a second view: individual repo entries that persist and accumulate over time — a living catalog, not just daily snapshots.

**Implementation approach:**
- Create a Jekyll collection (`_repos/`) alongside `_posts/`
- Each featured repo gets its own markdown file: `_repos/wasp-lang-open-saas.md`
- The file contains: repo metadata, the editorial blurb, date first featured, category, stars at time of feature, hotness streak (see below)
- `generate-digest.yml` creates/updates these files alongside the daily post
- Add a `/repos/` page to the site with a card-based layout showing all repos ever featured
- This becomes the "browse the catalog" experience vs. "read today's digest"

**Jekyll specifics:**
- Add to `_config.yml`: `collections: repos: output: true permalink: /repos/:name/`
- Create `_layouts/repo.html` for individual repo pages
- Create `repos.md` as the index page with filtering/sorting (see item 4)

---

### 3. Screenshots and Video Previews

Add visual previews for featured repos. A repo listing with a screenshot or demo video is dramatically more engaging than text alone.

**Approaches (in order of complexity):**

**3a. GitHub OpenGraph images (easiest):** GitHub generates OG images for every repo. URL pattern: `https://opengraph.githubassets.com/<hash>/<owner>/<repo>`. These can be embedded as thumbnails in repo cards. No API calls needed — just construct the URL. Limitation: these are generic and don't show the actual product.

**3b. Screenshot service (medium):** Use a headless browser service (Playwright, Puppeteer, or a SaaS like screenshotone.com) to capture the repo's homepage URL or README preview. Run as a separate GitHub Action that processes new repos and saves screenshots to `static/screenshots/`. This gives actual product visuals.

**3c. README video/GIF extraction (medium):** Many repos include demo GIFs or videos in their README. Parse the README markdown, extract `![](*.gif)` and `<video>` tags, and store references. This gives authentic product demos when available.

**3d. AI-generated preview cards (advanced):** Use the Claude API or an image generation API to create branded preview cards with the repo name, description, key stats, and category badge. Consistent visual style across all repos.

**Recommended V2 path:** Start with 3a (OpenGraph images) for all repos, supplement with 3c (README media extraction) where available. Graduate to 3b for the running results page in V2.1.

---

### 4. Sort, Search, and Tagging

The running results page (item 2) needs discovery features so people can find repos relevant to them.

**Search:**
- Client-side search using Lunr.js (works with Jekyll, no backend needed)
- Index repo name, description, category, language, and tags
- Search bar at the top of the `/repos/` page

**Sort options:**
- Stars (highest first) — default
- Date featured (newest first)
- Hotness streak (see item 5)
- Alphabetical

**Tagging/filtering:**
- Category tags (SaaS, AI, Ops, Marketing, UGC — already exist)
- Language tags (TypeScript, Python, Go, etc. — already in data)
- Source tags (search, trending, spotlight)
- Multi-select filter UI: click tags to narrow results

**Jekyll implementation:**
- Lunr.js for search (generate a `search.json` at build time)
- Tag pages generated via `jekyll-tagging` plugin or a custom collection
- Filter UI can be vanilla JS or a lightweight library (Alpine.js is a good fit for Jekyll sites)

---

### 5. Hotness Streak

This is Peter's idea for evolving the `seen.json` dedup ledger into a relevancy signal. Instead of just "was this repo featured before? skip it," track how often a repo appears in search results over time and surface that as a ranking factor.

**How it works:**
- Every time `fetch-repos.yml` runs, it records which repos appeared in results
- A new field in `seen.json` (or a separate `hotness.json`): `appearances` — a counter incremented each time the repo shows up in a daily fetch
- A second field: `streak` — consecutive days the repo has appeared in results
- The digest generator can use these signals: repos with high appearance counts and long streaks are genuinely trending in the ecosystem, not just one-day spikes
- Display as a badge or indicator on the repo card: "🔥 12-day streak" or "Appeared in 23 of last 30 fetches"

**Implementation in fetch-repos.yml:**
- After dedup, before writing the daily JSON, load `data/hotness.json`
- For each repo in today's results, increment `appearances` and update `streak` (reset to 1 if the repo wasn't in yesterday's results, otherwise increment)
- Write updated `hotness.json`

**Implementation in generate-digest.yml:**
- Read `hotness.json` alongside other config files
- Use streak/appearances as a tiebreaker when ranking repos within a section
- Include the streak badge in the repo's markdown entry

---

### 6. Leaderboard View

A dedicated page showing the "hall of fame" — repos ranked by their hotness metrics over time.

**Page: `/leaderboard/`**

**Sections:**
- **Longest active streaks** — repos currently on a consecutive-day appearance run
- **Most appearances (all time)** — repos that keep showing up in search results month after month
- **Most featured** — repos that have been selected for digests the most times (already tracked in `seen.json` via `times_featured`)
- **Rising fast** — repos with rapidly increasing star counts between appearances (requires storing `stargazers_count` snapshots over time)

**Data source:** Combines `data/hotness.json` (streaks/appearances) with `data/seen.json` (times featured). May also want to snapshot star counts over time for the "rising fast" metric — could add a `star_history` field to hotness.json.

---

### 7. Owned Platform Migration

Currently hosted on GitHub Pages (free, simple, but limited). The plan is to migrate to an owned platform that gives control over analytics, email, and monetization.

**Target stack:**
- **Hosting:** Own domain, own server (or Vercel/Netlify/Cloudflare Pages)
- **Analytics:** Umami (self-hosted, privacy-friendly, already in Peter's stack)
- **Product analytics:** PostHog (event tracking, funnels — already in Peter's stack)
- **Email:** Resend (transactional + marketing email — already in Peter's stack)

**Migration path:**
- Phase 1: Custom domain on GitHub Pages (CNAME file, DNS config) — keeps Jekyll, adds branding
- Phase 2: Move to Next.js or Astro on Vercel — unlocks SSR, API routes, dynamic features (search, filtering, leaderboard become server-side)
- Phase 3: Wire up Umami script tag, PostHog SDK, and Resend for email digests
- Phase 4: Retire GitHub Pages, keep the repo as the data/content source

---

### 8. Email Digest Delivery

Send a daily or weekly email version of the digest to subscribers.

**V2.0 (GitHub-native, minimal):**
- Add a GitHub Action that runs after digest generation
- Reads the day's `_posts/*.md` file, converts to HTML
- Sends via Resend API (or SendGrid, Mailgun) to a subscriber list
- Subscriber management: a simple JSON file or Google Form → Sheet → API pipeline

**V2.1 (owned platform):**
- Proper email signup form on the blog
- Resend integration with templates
- Weekly digest option (aggregates the week's daily posts into one email)
- Unsubscribe handling

---

### 9. RSS Feed

Jekyll with the `minima` theme already includes `jekyll-feed`, so an RSS feed likely already exists at `/VaiBReport/feed.xml`. Verify and promote it.

**Tasks:**
- Confirm the feed generates correctly
- Add an RSS icon/link to the blog header
- Submit to feed aggregators if desired
- Consider a separate feed for the running results page (item 2) — one feed per collection

---

### 10. Multi-Platform Data Sources

Expand beyond GitHub to catalog tools, models, and products from multiple platforms. Each platform gets its own independent limits — GitHub doesn't eat into HuggingFace's budget and vice versa. The digest layout shifts to subcategorize by platform.

#### 10a. Hugging Face (Priority: HIGH — API key available)

Scope: Spaces, Models, AND Datasets. All three.

**Implementation:**
- Use the HF API (REST: `https://huggingface.co/api/models`, `/api/spaces`, `/api/datasets`) with `HF_API_TOKEN` secret
- Fetch trending/popular across all three types, filtered by relevance to the audience
- Tag results with `_source: "huggingface"`, `_hf_type: "space|model|dataset"`
- Different quality metrics per type: Spaces = likes + runs, Models = downloads + likes, Datasets = downloads
- Apply same quality standards as GitHub (minimum thresholds, recency filters, dedup/cooldown) but tracked independently in a separate `data/seen-hf.json`

**Digest layout — new sections:**
```
### HuggingFace Spaces
(deployed apps/tools relevant to the audience)

### HuggingFace Models
(models solo founders and AI builders would actually use)

### HuggingFace Datasets
(training data, benchmarks, domain-specific datasets)
```

**Filtering approach:**
- Spaces: filter to categories like "text-generation," "image-generation," "audio," "computer-vision" — skip research-only demos
- Models: filter by pipeline type (text-generation, image-to-text, text-to-image, etc.) and min downloads
- Datasets: filter by task type and min downloads, focus on practically useful (not academic benchmark-only)

#### 10b. Uneed / OpenHunts (Priority: HIGH)

**Why:** Curated product discovery for indie makers. More relevant to the solo founder audience than Product Hunt (less marketing noise, more genuine tools). Uneed gets 200K+ monthly visits; OpenHunts has 14.3% conversion rates.

**Implementation:**
- Scrape daily/trending feeds from both sites
- Filter by tech/AI/SaaS categories
- Tag with `_source: "uneed"` or `_source: "openhunts"`
- Independent cooldown in `data/seen-launches.json`

#### 10c. Papers with Code (Priority: HIGH)

**Why:** Links academic papers to their open-source implementations. The "what's coming next in AI" signal. Filter to papers with working, starred GitHub repos to keep it practical, not academic.

**Implementation:**
- REST API: `https://paperswithcode.com/api/v1/papers/` and `/api/v1/repositories/`
- Filter: papers with GitHub repos that have >50 stars, recent (last 6 months)
- Focus on: text generation, image generation, video, agents, RAG, embeddings
- Tag with `_source: "paperswithcode"`

#### 10d. npm / PyPI Trending (Priority: HIGH)

**Why:** Package adoption signals — "what libraries are people actually installing this week." Different angle from repo discovery. Surfaces tools at the moment they hit critical mass.

**Implementation:**
- npm: `https://api.npmjs.org/downloads/point/last-week/{package}` + registry search
- PyPI: `https://pypistats.org/api/` for download stats + `https://pypi.org/search/`
- Filter: weekly downloads spike, relevant categories (ai, saas, cli, automation)
- Tag with `_source: "npm"` or `_source: "pypi"`

#### 10e. DevHunt (Priority: HIGH)

**Why:** Product Hunt specifically for developer tools. 50K+ GitHub-verified engineers. Exact audience overlap with VaiBReport readers. Higher signal-to-noise than PH.

**Implementation:**
- Scrape daily/trending feed from devhunt.org
- All listings are dev tools by definition — light filtering needed
- Tag with `_source: "devhunt"`

#### 10f. Ollama Library (Priority: HIGH)

**Why:** "What can I run on my laptop" — directly relevant to solo founders experimenting with local AI. The local-first AI movement is huge.

**Implementation:**
- Scrape `https://ollama.com/library` and `/search`
- Track: model name, parameter count, quantization, pull count, last updated
- Filter: recently updated, popular pulls, relevant model types
- Tag with `_source: "ollama"`, different metadata schema (parameters, quant, pulls vs. stars)

#### 10g. Replicate (Priority: HIGH)

**Why:** "Deploy AI models via API without MLOps." Solo founders use Replicate to add AI features to their products. The trending models signal what people are actually building with.

**Implementation:**
- REST API: `https://api.replicate.com/v1/models` (requires API token)
- Track: model name, run count, owner, description, cover image
- Filter: trending/popular, recently created, relevant categories
- Tag with `_source: "replicate"`

#### 10h. GitLab Explore (Priority: HIGH)

**Why:** Some significant projects live exclusively on GitLab (GNOME, KDE, Inkscape, etc.). Small effort for incremental repo coverage.

**Implementation:**
- GitLab REST API: `https://gitlab.com/api/v4/projects?order_by=stars&sort=desc`
- Filter similarly to GitHub (stars, recency, topics)
- Tag with `_source: "gitlab"`
- Can piggyback on the existing GitHub fetch workflow

#### 10i. Startup / Beta Launch Platforms (Priority: MEDIUM)

Aggregate new product launches from multiple startup discovery sites. These surface tools at the earliest stage — before they hit GitHub trending or Product Hunt.

**Platforms to scrape:**

| Platform | What it is | Scale | Access |
|----------|-----------|-------|--------|
| **BetaList** | Pre-launch/beta products, curated | 387-1K visitors/listing, newsletter | RSS feed + scrape |
| **BetaPage** | Any-stage products, lenient listing | 57-65K monthly, 40K+ products | Scrape |
| **Launching Next** | Startup directory | 44K+ startups | Scrape |
| **Microlaunch** | Month-long launch cycles | Newer, growing | Scrape |
| **Peerlist Launchpad** | Weekly Monday launches | Community-driven | Scrape |
| **Hacker News Show HN** | The OG launch venue | Massive reach | Firebase API (real-time) |
| **Indie Hackers** | Community + product directory | Massive | Scrape |

**Implementation:**
- Unified scraper workflow (`fetch-launches.yml`) that hits all platforms
- Normalize to common schema: product name, URL, description, category, upvotes/engagement, launch date
- Tag each with `_source: "betalist"`, `_source: "hackernews_showhn"`, etc.
- Independent cooldown in `data/seen-launches.json`
- Hacker News Show HN gets special treatment: use the Firebase API (`https://hacker-news.firebaseio.com/v0/showstories.json`) for real-time data

#### 10j. Product Hunt (Priority: MEDIUM — lower priority than above)

**Why:** Still the biggest launch platform but more marketing-heavy. Good for catching mainstream tool launches.

**Implementation:**
- Product Hunt GraphQL API (requires API key from producthunt.com/v2/oauth/applications)
- Fetch daily top posts, filter by tech/developer/AI categories
- Quality filter: min upvotes threshold, skip obvious marketing-only launches
- Tag with `_source: "producthunt"`

#### 10k. Future Platforms (Priority: WATCH LIST)

| Platform | What it adds | API? | Audience fit |
|----------|-------------|------|-------------|
| **Awesome Lists** | Meta-curation signals | GitHub diffs | "Just added to awesome-selfhosted" as social proof |
| **Docker Hub** | Containerized self-hosted tools | Yes (REST) | Medium — overlaps with GitHub |
| **Vercel Templates** | Next.js/React templates | Scrape | Medium — overlaps with SaaS starters |

---

### 11. Staggered Category Runs

**Status: DEFERRED** — Only implement if rate limiting becomes a problem. Current single-batch approach handles 12 queries + trending scrape in under a minute with 2-second delays. GitHub's rate limit is 30 requests/minute for authenticated search, and we're well under that.

If needed later: split `fetch-repos.yml` into multiple workflows or use a matrix strategy with scheduled cron entries spread across 7am–noon ET.

---

### 12. Enhanced Trending Detection

**Partially addressed in V1.5 patch** — mega-repo filter (>80K★ + >2 years old = skip) is now in generate-digest.yml.

**Remaining improvements:**
- Track daily star velocity: store yesterday's star count, compare to today's, surface repos with the biggest percentage gains
- Weight by recency of last push: a trending repo last pushed 6 months ago is less interesting than one pushed yesterday
- Cross-reference with GitHub's "stars received today" data if available

---

## Priority Order (Updated 2026-03-06)

**Phase 1 — Quick wins: DONE**
- Item 9: RSS feed — DONE (jekyll-feed built-in)
- Item 1: AI-quality writeups — DONE (Gemini editorial blurbs)
- Item 5: Hotness streak — DONE (data collection in fetch-repos + badges in catalog cards)

**Phase 2 — Multi-platform expansion: DONE**
- Item 10a: HuggingFace — DONE (Spaces, Models, Datasets)
- Item 10b: Uneed — DONE (via fetch-launches.yml)
- Item 10c: Papers with Code — DONE
- Item 10d: npm / PyPI — DONE
- Item 10e: DevHunt — DONE (via fetch-launches.yml)
- Item 10f: Ollama — DONE
- Item 10g: Replicate — DONE
- Item 10h: GitLab — DONE
- Item 10i: Startup/beta launches — DONE (HN Show HN, BetaList, DevHunt, Uneed)

**Phase 3 — Site experience upgrade: DONE**
- Item 2: Running results page — DONE (bento card grid catalog at /repos/)
- Item 3 Phase 1: Screenshots — DONE (OG images in catalog cards)
- Item 4: Sort/search/tagging — DONE (client-side search, 6 sort options, source + category filter chips)

**Phase 4 — Leaderboard + enhanced trending: DONE**
- Item 6: Leaderboard view — DONE (5-section leaderboard at /leaderboard/)
- Item 12: Enhanced trending detection — DONE (star velocity tracking + velocity-boosted trending)

**Remaining:**
- Item 10j: Product Hunt
- Item 7: Owned platform migration
- Item 8: Email digest delivery
- Item 11: Staggered runs (only if rate-limited)
