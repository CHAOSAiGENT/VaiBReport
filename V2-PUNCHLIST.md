# VaiBReport V2 — Punchlist

**Last updated:** 2026-03-05
**Status:** V1 operational. This document captures all V2 ideas discussed across sessions.

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

### 10. Hugging Face as a Data Source

Add Hugging Face model/space search alongside GitHub search and trending scrape. HF has relevant AI models, spaces, and datasets for the audience.

**Implementation:**
- Use the HF API (`huggingface_hub` Python library or their REST API) to search for trending models and spaces
- Filter by relevance: text generation, image generation, video generation, embeddings, RAG-related
- Tag results with `_source: "huggingface"` in the daily JSON
- The digest generator would need a new section or integrate HF finds into "AI agents, LLM infra and RAG"

**Considerations:**
- HF items aren't GitHub repos — they need different metadata (model card, pipeline type, downloads vs. stars)
- May want a separate "Models & Spaces" section in the digest
- Start with HF Spaces (more product-like) before adding models (more research-oriented)

---

### 11. Staggered Category Runs

Instead of one big daily fetch that grabs everything, run category-specific fetches at different times throughout the day. This spreads API load and lets each category get its own freshness window.

**Proposed schedule (all ET):**
- 7:00 AM — SaaS starters and templates
- 8:00 AM — AI agents, LLM infra and RAG
- 9:00 AM — Ops, analytics and automation
- 10:00 AM — Marketing, sales and GTM tools
- 11:00 AM — UGC, social media and creator tools
- 12:00 PM — Trending scrape + digest generation

**Why:** Each category runs with fresh rate-limit budget. If one fails, the others still succeed. Also allows category-specific scheduling (e.g., run UGC queries twice daily since that space moves fast).

**Implementation:** Split `fetch-repos.yml` into multiple workflows or use a matrix strategy with scheduled cron entries. Each writes to the same daily JSON (append mode) or separate per-category JSONs that get merged before digest generation.

---

### 12. Enhanced Trending Detection

The current Cheerio scraper captures whatever GitHub puts on the trending page, which sometimes includes massive established repos (build-your-own-x at 472K★) that aren't genuinely "trending today" in any meaningful sense.

**Improvements:**
- Filter trending results by repo age: if created more than 2 years ago AND has >100K stars, it's not "trending" in a useful sense — it's just popular
- Track daily star velocity: store yesterday's star count, compare to today's, surface repos with the biggest percentage gains
- Weight by recency of last push: a trending repo that was last pushed 6 months ago is less interesting than one pushed yesterday
- Cross-reference with GitHub's "stars received today" data if available

---

## Priority Order (Suggested)

The features above are listed by topic, not priority. Here's a suggested execution order based on impact and dependency:

**Quick wins (do first):**
- Item 9: RSS feed verification and promotion
- Item 1: Claude API writeups (biggest quality impact, relatively simple)
- Item 5: Hotness streak data collection (start accumulating data now, display later)

**Core V2 features:**
- Item 2: Running results page (individual repo entries)
- Item 4: Sort/search/tagging (depends on item 2)
- Item 6: Leaderboard (depends on item 5 data accumulation)
- Item 3: Screenshots/previews (enhances items 2 and 6)

**Platform evolution:**
- Item 7: Owned platform migration (Phase 1: custom domain first)
- Item 8: Email digest delivery
- Item 10: Hugging Face data source
- Item 11: Staggered category runs
- Item 12: Enhanced trending detection
