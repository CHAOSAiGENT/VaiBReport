# VaiBReport — Context Log

This file tracks project state across chat sessions. Read this + VaiBReport-SPEC.md before making any changes.

---

## Session: 2026-03-04 (Cowork — initial planning)

**What happened:**
- Reviewed Perplexity conversation that designed the V0 architecture
- Identified resilience gaps: GiTrends dependency, unmaintained blog action, no dedup, no rate limiting, missing spotlight mechanism
- Researched alternatives: Cheerio scraping for trending, Jekyll for blog (native GitHub Pages), native fetch in Node 20
- Added new category: UGC / Social Media and creator tools, with 5 dedicated search queries
- Produced hardened spec (VaiBReport-SPEC.md) covering full architecture

**Current state:**
- Repo exists on GitHub (CHAOSAiGENT/VaiBReport) but is EMPTY
- Spec is written and ready for review
- No code has been committed yet

**Next steps (for Claude Code session):**
1. Scaffold repo structure per spec
2. Create all config files (queries.json, preferences.json, spotlight.json, seen.json)
3. Create fetch-repos.yml workflow
4. Set up Jekyll (_config.yml, index.md, about.md)
5. Enable GitHub Pages in repo settings
6. Run first manual workflow_dispatch to test data fetch
7. Run first Cowork digest to test the full loop

**Files created this session:**
- `VaiBReport-SPEC.md` — Full hardened project spec (source of truth)
- `CONTEXT.md` — This file (session continuity log)
- `CLAUDE-CODE-SETUP-PROMPT.md` — Copy-paste prompt for Claude Code to scaffold the repo
- `COWORK-DIGEST-PROMPT.md` — Copy-paste prompt for Cowork digest generation (manual or scheduled)

**Key decisions made:**
- Jekyll over kamranahmedse/github-pages-blog-action (unmaintained)
- Cheerio scraping over GiTrends API (unreliable)
- Native fetch() over node-fetch npm package
- `_posts/` directory (Jekyll convention) not `posts/`
- seen.json dedup ledger with 14-day cooldown
- spotlight.json for manual Perplexity finds
- Daily fetch is automated; digest curation is Cowork (manual or scheduled)
- UGC/Social Media is a first-class category with its own query group

---

## Session: 2026-03-05 (Claude Code — repo scaffolding)

**What happened:**
- Claude Code scaffolded the entire repo from CLAUDE-CODE-SETUP-PROMPT.md
- All config files, workflows, Jekyll setup, and seed post created and committed
- GitHub Pages enabled (source: GitHub Actions)
- deploy-blog.yml ran successfully — blog is live at https://chaosaigent.github.io/VaiBReport/
- fetch-repos.yml ran successfully via workflow_dispatch — first data snapshot committed
- data/repos-2026-03-05.json contains 110 repos (93 from search, 22 from trending)

**Current state:**
- Repo is fully scaffolded and operational
- Blog is live with seed post
- Daily fetch cron is active (runs at 1pm UTC / 8am ET daily)
- First real data snapshot exists and is ready for digest generation
- Scheduled Cowork digest task still needs setup

**Next steps:**
1. Push the local commit (digest + seen.json) to GitHub — Cowork sandbox lacks git push auth, so do this via Claude Code or terminal
2. Set up Cowork scheduled task for daily digest generation (daily-repo-digest, 9am ET)
3. Review the first digest output on the live blog, tune preferences.json if needed
4. Investigate why ugc_social_queries returned 0 results — may need query tuning
5. V2 planning: migration to owned platform (Umami, PostHog, Resend integration)

---

## Session: 2026-03-05 (Cowork — first digest generation)

**What happened:**
- Generated first real digest from data/repos-2026-03-05.json (110 repos: 88 search, 22 trending)
- Selected 14 repos across 4 sections + 2 "also trending" brief mentions
- Created _posts/2026-03-05-github-digest.md
- Updated data/seen.json with all 14 featured repos
- Commit succeeded locally (558035b) but push failed (no GitHub auth in Cowork sandbox)
- Attempted to set up scheduled task but create_scheduled_task tool not available in this environment

**Data observations:**
- ugc_social_queries returned 0 repos — likely the GitHub topic combinations don't match well. Needs query tuning.
- Trending included very large established repos (build-your-own-x at 472K★) that aren't really "trending today" — the Cheerio scraper captures whatever GitHub puts on the trending page regardless of novelty.
- Default + extra search queries produced strong SaaS/template results

**Digest stats:**
- 14 repos featured (12 full writeups + 2 brief trending mentions)
- 3 trending repos with full writeups (khoj, plane, posthog)
- 2 trending repos with brief mentions (inngest, evershop)
- 0 spotlight repos (none in queue)
- Sections used: SaaS starters (4), AI/LLM (3), Ops/analytics (3), Marketing/GTM (2), Also trending (2)
- UGC/Social section skipped (no qualifying repos)

---

## Session: 2026-03-05 (Cowork — generate-digest workflow)

**What happened:**
- Created .github/workflows/generate-digest.yml — a GitHub Action that generates digest posts algorithmically
- Triggers via workflow_run (chains after fetch-repos.yml) or manual workflow_dispatch
- Implements full filtering: preferences.json thresholds, seen.json cooldown, spotlight.json injection
- Auto-categorizes repos into sections using keyword matching on topics/description/query_group
- Handles trending: picks top 5, features 3, brief-mentions 2
- Commits and pushes with GITHUB_TOKEN auth — no Cowork/local push needed
- This makes the pipeline fully hands-off: fetch → filter → post → deploy, all in GitHub Actions

**Architecture change:**
- Previously: fetch (Actions) → digest (Cowork, manual) → deploy (Actions)
- Now: fetch (Actions) → digest (Actions, algorithmic) → deploy (Actions)
- Cowork role shifts from "required for every digest" to "optional override for polished/opinionated writeups"
- V2 upgrade path: swap the algorithmic templating for a Claude API call to get AI-quality writeups

**What Peter needs to do:**
1. Push local changes to GitHub (includes the unpushed first digest + this new workflow)
   - Via Claude Code: `cd VaiBReport && git add . && git commit -m "Add generate-digest workflow" && git push`
   - Or via terminal
2. The new workflow will auto-run tomorrow after the daily fetch completes
3. Can also trigger manually via workflow_dispatch to test

---

## Session: 2026-03-05 (Claude Code — V1 finalization)

**What happened:**
- Claude Code completed all 9 tasks from CLAUDE-CODE-V1-FINALIZE.md
- All 3 workflows verified operational (fetch-repos, generate-digest, deploy-blog)
- Blog live at https://chaosaigent.github.io/VaiBReport/
- UGC queries fixed: 0 → 142 repos returned
- Full automation chain verified: fetch → digest → deploy, all chained via workflow_run and push triggers
- Planning files added to .gitignore
- V1 is fully operational and hands-off

---

## Session: 2026-03-05 (Cowork — V2 punchlist)

**What happened:**
- Created V2-PUNCHLIST.md consolidating all scattered V2 ideas from across multiple sessions
- 12 features documented with implementation approaches and priority ordering

**V2 features cataloged:**
1. Claude API writeups (replace algorithmic templating with AI editorial voice)
2. Running results page (individual repo entries as a browsable catalog)
3. Screenshots and video previews (OpenGraph images, README media extraction)
4. Sort/search/tagging (Lunr.js, tag filters, sort options)
5. Hotness streak (track repo appearance frequency as a relevancy signal)
6. Leaderboard view (hall of fame by streak, appearances, times featured)
7. Owned platform migration (Umami, PostHog, Resend on own domain)
8. Email digest delivery (Resend integration)
9. RSS feed verification and promotion
10. Hugging Face as additional data source
11. Staggered category runs (spread fetches across morning hours)
12. Enhanced trending detection (filter out evergreen mega-repos)

**Files created:**
- V2-PUNCHLIST.md — comprehensive V2 feature punchlist with implementation notes

**Next steps:**
- Start with quick wins: RSS verification, Claude API writeups, hotness data collection
- Then core V2: running results page → sort/search → leaderboard → screenshots
- Platform migration can proceed in parallel as a separate track

---

## Session: 2026-03-05 (Cowork — V2 prerequisites + test session + V1.5 patch)

**What happened:**
- Peter furnished Quick Wins prereqs: Anthropic API key (stored as GitHub secret, NOT in files), model choice (Claude Sonnet 4.6), tone (casual dry humor, JPW'26 style preferred but not accessible this session)
- Peter furnished Core V2 prereqs: card/bento grid layout, default card contents approved, default URL structure approved, no custom tags yet
- Created V2-SCREENSHOTS-RESEARCH.md — detailed comparison of 4 screenshot approaches (OG images, README extraction, screenshot services, AI-generated cards) with pricing, effort, pros/cons
- Created V2-PREREQUISITES.md (updated) with Peter's answers checked off

**Test session findings (simulated digest from 2026-03-05 data):**
- Data pipeline healthy: 253 repos (238 search, 23 trending, 12 queries)
- Automation chain verified from workflow screenshot: all 3 workflows green, cron firing, chain triggers working
- Atom feed confirmed working
- Blog rendering confirmed

**5 issues identified:**
1. **UGC queries too broad** (CRITICAL) — pulling public-apis, fastapi, puppeteer, playwright as "UGC tools." Free-text search overcorrected from the topic: fix. Would produce embarrassing digest.
2. **UGC category regex too broad** — `content.creat` and `creator` match too many non-UGC repos
3. **Trending pulls mega-repos** — awesome-python (285K★), transformers (157K★) aren't "trending today"
4. **Global repo cap not enforced** — preferences says 15, simulation produced 28. Changed to 30 with trim logic.
5. **V2 planning files not excluded from Jekyll** — would generate unwanted pages

**Peter's UGC direction:** Focus on automation, art/design generation, digital twins, social scheduling — tools that make UGC easier for creators and small businesses. NOT generic API frameworks or web scraping tools.

**Files created:**
- V2-SCREENSHOTS-RESEARCH.md — screenshot service comparison and phased recommendation
- V2-PREREQUISITES.md — updated with Peter's answers
- CLAUDE-CODE-V1.5-PATCH.md — prompt for Claude Code to fix all 5 issues

**Decisions made:**
- Model for API writeups: Claude Sonnet 4.6 (`claude-sonnet-4-6-*`)
- Screenshots Phase 1: OG images + AI-generated cards (free, 100% coverage)
- Card grid layout: bento grid for running results page
- max_repos_total: 30 (up from 15, with trim logic)
- RSS: feed exists, NOT promoted in nav header

**Next steps:**
- ~~Run CLAUDE-CODE-V1.5-PATCH.md via Claude Code (before next cron at 1pm UTC)~~ DONE
- After V1.5 patch: add `ANTHROPIC_API_KEY` secret and wire Claude API into generate-digest.yml
- Then start Core V2: bento grid running results page

---

## Session: 2026-03-05 (Claude Code — V1.5 patch)

**What happened:**
- Executed all 6 tasks from CLAUDE-CODE-V1.5-PATCH.md
- Tested 19 UGC queries across 4 experiment sets against GitHub Search API
- Kept 7 queries scoring 6+/10 relevance, discarded 12 that returned junk or zero results
- Updated `pushed:>` dates to rolling 12-month window (2025-03-05) across ALL query groups

**Changes made:**
1. `config/queries.json` — Replaced 6 broad UGC queries with 7 tested, specific queries covering video gen, AI art, digital twins, image gen, social automation, social media tools. Updated all date filters to 2025-03-05.
2. `.github/workflows/generate-digest.yml` — Tightened UGC category regex (compound phrases only), added UGC_EXCLUSIONS negative filter, added mega-repo trending filter (>80K stars + >2yr old = skip), added global trim step (trims largest section first when over max_repos_total)
3. `config/preferences.json` — max_repos_total: 15 → 30
4. `_config.yml` — Added `V2-*.md` and `CLAUDE-CODE-*.md` glob excludes for Jekyll build

**UGC query test results (top repos from final set):**
- LivePortrait (17.9K★), Wan2.2 (14.5K★), CogVideo (12.5K★) — video generation
- AUTOMATIC1111/stable-diffusion-webui (161K★), InvokeAI (26.8K★) — AI art
- Duix-Avatar (12.4K★), Linly-Talker (3.2K★) — digital twins/avatars
- hey/Lens Protocol (29.5K★), postiz-app (27K★), growchief (3.3K★) — social media tools
- diffusers (32.9K★), Qwen-Image (7.5K★) — image generation
