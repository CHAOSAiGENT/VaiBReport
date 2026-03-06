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

---

## Session: 2026-03-06 (Cowork — deploy fix + multi-platform planning)

**What happened:**
- March 6 digest WAS generated by the automation chain (Fetch #5 → Generate #5, both green)
- But the blog didn't rebuild — discovered root cause: GITHUB_TOKEN pushes from workflows don't trigger other workflows (GitHub's anti-recursion protection)
- Fixed deploy-blog.yml: added `workflow_run` trigger chaining off "Generate daily digest", with success check
- Peter pushed the fix; deploy triggered; March 6 digest now live on blog
- March 6 digest still shows old (pre-V1.5) UGC results because the digest was generated before the V1.5 patch landed — March 7 will be the real test

**V2 punchlist updates based on Peter's decisions:**
- Items 7 (owned platform migration) and 8 (email digest) → moved to Phase 3-4
- Item 10 expanded to "Multi-Platform Data Sources":
  - 10a: HuggingFace — Spaces, Models, AND Datasets (all three). HF API key available. Independent limits from GitHub. Separate `seen-hf.json` ledger.
  - 10b: Product Hunt — daily launches, GraphQL API, high audience overlap
  - 10c: GitLab Explore — lightweight add-on for repos that live exclusively on GitLab
  - 10d: Watch list — Replicate, Ollama Library, DevHunt, npm/PyPI trending, Papers with Code, Awesome Lists
- Item 11 (staggered runs) → DEFERRED unless rate limiting becomes a problem
- Digest layout will shift to subcategorize by platform (GitHub sections + HF Spaces/Models/Datasets + PH Launches)
- Each platform gets independent quality standards and limits

**Files modified:**
- .github/workflows/deploy-blog.yml — added workflow_run trigger to complete automation chain
- V2-PUNCHLIST.md — expanded Item 10, deferred Items 7/8/11, updated priority order
- CONTEXT.md — this entry

**Next steps:**
- March 7: verify V1.5 UGC fixes produce a clean digest
- Wire Claude API (Sonnet 4.6) into generate-digest.yml for editorial voice
- Start HuggingFace integration (fetch-hf.yml workflow + digest sections)
- Begin Core V2: bento card grid running results page

---

## Session: 2026-03-06 (Cowork — V2 Phase 1 prompt + multi-platform expansion)

**What happened:**
- Peter confirmed V1.5 patch deployed (git log shows fe3b342), all workflows green
- March 6 digest live on blog but shows pre-V1.5 content (timing: digest generated before patch landed)
- Peter requested maximum progress before tomorrow's cron + re-trigger today's digest after changes

**Major platform strategy revision:**
Peter deprioritized Product Hunt and elevated these to Phase 2 (HIGH priority):
- Uneed / OpenHunts (indie maker product discovery)
- Papers with Code (research → implementations)
- npm / PyPI trending (package adoption signals)
- DevHunt (PH for dev tools specifically)
- Ollama Library (local AI models)
- Replicate (hosted AI models via API)
- GitLab Explore

Also added startup/beta launch platform category:
- BetaList, BetaPage, Launching Next, Microlaunch, Peerlist Launchpad
- Hacker News Show HN (Firebase API)
- Indie Hackers

Product Hunt demoted to Phase 3 (below the above platforms).

**Files created/modified:**
- CLAUDE-CODE-V2-PHASE1.md — 7-task prompt covering: Claude API voice, hotness tracking, HuggingFace fetch + digest integration, re-trigger today's digest
- V2-PUNCHLIST.md — Expanded Item 10 from 4 sub-items to 11 (10a through 10k), revised priority order
- CONTEXT.md — this entry

**Decisions documented:**
- Claude API model: claude-sonnet-4-6-* (with fallback to 4-5)
- HF fetch cron: 13:10 UTC (10 min after GitHub fetch)
- HF independent limits: seen-hf.json, separate from GitHub seen.json
- HF thresholds: Spaces ≥10 likes, Models ≥1K downloads, Datasets ≥500 downloads
- Hotness tracking: data/hotness.json with appearances, streak, first_seen, last_seen
- digest re-trigger strategy: delete existing post → re-run fetch-hf → re-run generate-digest

**Secrets needed (Peter to add):**
- ANTHROPIC_API_KEY — already set ✅
- HF_API_TOKEN — Peter to run: `gh secret set HF_API_TOKEN --repo CHAOSAiGENT/VaiBReport`

**Next steps:**
- Peter runs CLAUDE-CODE-V2-PHASE1.md in Claude Code
- Peter sets HF_API_TOKEN secret
- Claude Code re-triggers today's digest with new features
- Verify: Claude-voiced blurbs + HF sections in March 6 regenerated digest
- Tomorrow (March 7): first fully automated V2 digest

---

## Session: 2026-03-06 (Cowork — post-V2 Phase 1 status check)

**What happened:**
- Claude Code successfully executed V2 Phase 1. Confirmed all major items complete:
  - `generate-digest.yml` now has full Claude API integration (model fallback, editorial blurbs, graceful degradation)
  - `fetch-hf.yml` created and operational (Spaces top 50, Models across 8 pipeline types, Datasets top 50)
  - HuggingFace digest sections wired into `generate-digest.yml` (Spaces, Models, Datasets with quality thresholds)
  - `data/seen-hf.json` and `data/hotness.json` scaffolded
  - UGC_EXCLUSIONS, mega-repo filter, global trim all in place from V1.5
- Rebuilt V2-PREREQUISITES.md as Peter's actionable "to do / we owe" list with step-by-step instructions
- Identified remaining Peter actions: set HF_API_TOKEN secret (immediate), optionally test HF fetch and re-trigger digest

**Current state:**
- V2 Phase 1 is code-complete. Claude API voice + HuggingFace integration are wired up.
- March 7 will be the first digest with: V1.5 UGC fixes + Claude-voiced blurbs + HuggingFace sections (if HF_API_TOKEN is set and HF fetch runs before digest generation)
- Phase 2 platforms (Uneed, Papers with Code, npm/PyPI, DevHunt, Ollama, Replicate, GitLab, beta launch sites) and core V2 site features (bento grid, search, screenshots) all need Claude Code prompts written

**Files modified:**
- V2-PREREQUISITES.md — complete rewrite as Peter's action item checklist with instructions
- CONTEXT.md — this entry

**What Peter needs to do NOW:**
1. `gh secret set HF_API_TOKEN --repo CHAOSAiGENT/VaiBReport` (paste HF token) — DONE ✅
2. Verify `ANTHROPIC_API_KEY` secret exists
3. (Optional) Manually trigger HF fetch to test
4. (Optional) Re-trigger today's digest for a preview

---

## Session: 2026-03-06 (Cowork — Gemini API swap)

**What happened:**
- Discovered Anthropic API key is set but account has no credits — editorial blurbs won't generate
- Peter asked for a free alternative. Evaluated two options:
  - Option 3: Pre-generate blurbs via Claude Code (uses Pro subscription, needs scheduling)
  - Option 5: Swap to Google Gemini free tier API (250+ RPD, same prompt, fully automated)
- Peter chose Option 5 (Gemini) for lower friction
- Peter set `GEMINI_API_KEY` secret in the repo
- Created CLAUDE-CODE-GEMINI-SWAP.md — 5-task prompt to replace Anthropic API call with Gemini 2.5 Flash

**Decision:** Use Gemini 2.5 Flash free tier instead of Anthropic Claude API for editorial blurbs. Same prompt, same JSON output format, same fallback-to-template logic. Cost: $0/month vs ~$1/month.

**Files created:**
- CLAUDE-CODE-GEMINI-SWAP.md — Claude Code prompt for the API swap

**Secrets status:**
- ANTHROPIC_API_KEY — set but unfunded (will be unused after swap)
- GEMINI_API_KEY — set ✅ (Peter added)
- HF_API_TOKEN — set ✅ (Peter added)
- GITHUB_TOKEN — automatic

**What Peter needs to do NOW:**
1. Run CLAUDE-CODE-GEMINI-SWAP.md in Claude Code
2. (Optional) Re-trigger today's digest to test Gemini blurbs
3. Tomorrow (March 7): first fully automated digest with Gemini voice + HuggingFace sections

---

## Session: 2026-03-06 (Cowork + Claude Code — massive progress burst)

**What happened:**
- Peter went on a credentials blitz. All major API secrets now set:
  - ANTHROPIC_API_KEY (set ~18hrs ago, unfunded — unused after Gemini swap)
  - GEMINI_API_KEY ✅
  - HF_API_TOKEN ✅
  - PH_API_KEY + PH_API_SECRET ✅
  - REPLICATE_API_TOKEN ✅
- Claude Code executed Gemini swap AND added Product Hunt integration
- HF fetch workflow ran successfully — `seen-hf.json` has 13 featured items
- Hotness tracking accumulating — `hotness.json` has 200+ repos from March 6
- Digest generator ran successfully twice via workflow_dispatch (both green)

**Current operational status:**
- ✅ GitHub repo fetch (daily cron)
- ✅ HuggingFace fetch (Spaces, Models, Datasets)
- ✅ Product Hunt fetch (newly added)
- ✅ Digest generation with Gemini editorial voice
- ✅ HF sections in digest
- ✅ Hotness tracking accumulating
- ✅ Deploy chain (workflow_run trigger)
- ✅ V1.5 UGC fixes (tighter queries, exclusions, mega-repo filter, trim)

**All secrets provisioned — zero credential blockers remaining.**

**What's next:**
- Phase 2 platform fetch workflows: Uneed/OpenHunts, Papers with Code, npm/PyPI, DevHunt, Ollama, Replicate, GitLab, beta launch platforms
- Core V2 site features: bento card grid, sort/search/tagging, screenshots

**V2 Phase 2 mega prompt written:** CLAUDE-CODE-V2-PHASE2-PLATFORMS.md — 13-task prompt covering:
- 7 new fetch workflows (Replicate, Papers with Code, npm/PyPI, GitLab, Ollama, launches/DevHunt/HN/BetaList/Uneed)
- Full digest integration (load all platforms, new sections, cooldown filtering)
- Cron schedule change: digest runs at 14:00 UTC (after all fetches complete by 13:40)
- Health-check summary log in digest generation
- Platform-specific limits in preferences.json
- All seen ledger scaffolding
- APM deferred — GitHub Actions UI is sufficient monitoring for now; health-check summary in logs covers daily status
