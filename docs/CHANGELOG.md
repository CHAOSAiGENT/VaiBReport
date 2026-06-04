# Stack Changelog

**File:** `docs/CHANGELOG.md`
**Repo:** `github.com/CHAOSAiGENT/VaiBReport`
**Last updated:** 2026-03-29

Derived from `git log` history and current code. Grouped by logical feature areas.
Individual daily data snapshot commits (`Add repos snapshot for YYYY-MM-DD`, etc.) are omitted — they are automated pipeline output, not stack changes.

---

## [Current] — 2026-03-29

### Added

- **LLM cascade across all three workflows:** Gemini first, free fallbacks second, paid Claude last. Provider order: Gemini Flash/Pro → OpenRouter (Llama 70B / Nemotron 253B :free) → Groq Llama 70B → Claude Haiku/Sonnet. Implemented as `tryCascadeBlurb()` in `generate-digest.yml`, `callLLM()` in `research-report.yml`, and updated `callClaude()` in `tool-page-generate.yml`. All providers skip gracefully if key is absent.
- **Brave Search as primary web search:** `research-report.yml` now uses Brave Search API (`freshness=pw`, 15 results) as primary search provider. Perplexity retained as fallback. Two-step pattern: Brave results → LLM synthesis. Brave attribution added to `_layouts/research.html` footer (required by Brave API terms).
- **Pre-flight balance check:** `research-report.yml` pings Claude Haiku (5 tokens) before doing any real work. On 402, comments on the GitHub issue with retry instructions and exits cleanly. Non-402 errors proceed.
- **Session documentation:** Three session documents were produced: `VaiBReport-stack.md` (full stack reference, 11 categories), `VaiBReport-pm-retro.md` (PM retrospective with bugs, decisions, opinion), `VaiBReport-tech-log.md` (technical anecdote log, gotchas, non-obvious decisions). Originally written to a local `.notes/` directory outside the repo; those files are no longer available.

### Changed

- **Editorial blurbs model:** `generate-digest.yml` blurbs now use `claude-haiku-4-5-20251001` as last-resort Claude model (previously `claude-sonnet-4-6`). Primary is Gemini Flash (free).
- **New GitHub Actions secrets required:** `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `BRAVE_SEARCH_API_KEY` — all added to repository secrets.

### Fixed

- **`research-report.yml` (B-05) never fired since creation (2026-03-28):** Root cause same as B-04 — 35 lines of multiline template literal content at 0-space indentation inside `run: |` block scalar terminated YAML parsing before the workflow trigger registered. Fixed by padding all affected lines to 10-space indentation. Also fixed: `GITHUB_TOKEN` → `GH_TOKEN` env alias (reserved name constraint).
- **`generate-tool-page.yml` (B-04) never fired since creation (2026-03-24):** Same YAML block scalar bug. 62 affected lines. File renamed to `tool-page-generate.yml` to force new GitHub workflow ID. Also fixed: `permissions:` moved to job level, `env:` moved to step level, workflow name special character removed.

---

## [2026-03-28] — Consulting notes, Me2 dashboard, Product Hunt

### Added

- **Consulting notes layer (E-08):** `generate-tool-page.yml` now makes a fifth Claude API call to produce structured consulting prep notes (`who_best_for`, `pitch`, `red_flags`, `integration_notes`, `pricing_reality`, `client_readiness`, `typical_objections`). Stored in `consulting_notes:` YAML mapping in `_tools/{slug}.md`. `_layouts/tool.html` renders a gold consulting notes panel visible only when `consulting_notes.who_best_for` is populated.
- **Me2 pipeline dashboard (E-07):** `my-picks.md` page added as a private status view of all `_tools/` entries. Shows enrichment completion per item (screenshots captured, scripts generated, content created flags).
- **Product Hunt data source (U-06):** `fetch-producthunt.yml` workflow added. Queries PH GraphQL API daily at 07:00 UTC. Filters by topic relevance and minimum 20 votes. Uses a 30-hour lookback window to handle Pacific midnight reset. Deduplicates against `data/seen-producthunt.json` with a 7-day cooldown. Merges output into `data/launches-YYYY-MM-DD.json`.

### Fixed

- `fetch-producthunt.yml`: working secret renamed to `PH_DEV_TOKEN2` after key rotation; fallback diagnostics and debug logging added and then removed after stabilization.
- `.gitignore`: `.claude/worktrees/` added to prevent worktree directories from being treated as submodules by GitHub Actions checkout.

---

## [2026-03-24] — Me2 layer, Claude migration, screenshot workflows, ICP tagging

### Added

- **Me2 planning folder:** `me2/` directory created with `CLAUDE.md` (full vision, ICPs, voice guide, architecture), `UPGRADES.md` (public platform improvements), `EXTENSIONS.md` (Me2 private layer specs).
- **GitHub Issue template + parse-submission workflow (E-01):** `.github/ISSUE_TEMPLATE/` form template added. `parse-submission.yml` workflow triggers on `peters-pick` label; parses issue body fields; generates `_tools/{slug}.md`; comments on issue; closes it.
- **Peter's Picks public pages:** `picks.md` page (public grid, filters by `public: true`), `_layouts/tool.html` (full tool detail page with status chips, ICP badges, hook quote, screenshot, scripts). `_config.yml` updated with `tools` collection (`output: true`, `permalink: /picks/:name/`).
- **generate-tool-page workflow (E-04 + E-05):** `generate-tool-page.yml` added. `workflow_dispatch` with slug input. Makes 4 Claude API calls: `one_liner`, `script_faceless` (Format A narration), `script_ugc` (Format B on-camera for Peter), `use_cases` (ICP-specific JSON array). Updates `_tools/{slug}.md` in-place.
- **Screenshot capture workflows:** `capture-tool-screenshots.yml` (E-03) for `_tools/` items — Playwright captures desktop (1280×800), mobile (390×844), and full-page; per-tool subdirectory under `static/screenshots/{slug}/`. `capture-screenshots.yml` (U-03) for `_repos/` items — weekly batch (Sundays 05:00 UTC), capped at 20, skips GitHub/GitLab/HuggingFace URLs.
- **ICP audience tagging (U-04):** `icp_tags` frontmatter field added to `_repos/` and `_tools/` entries. `SECTION_ICP` map in `generate-digest.yml` assigns 2–3 persona tags per digest section. Filter chips for ICP on `/repos/` catalog page.
- **RSS feed promotion (U-05):** RSS feed confirmed available at `/VaiBReport/feed.xml` via `jekyll-feed` gem included in minima theme.
- **Claude Code automations:** `.claude/settings.json` (PreToolUse + PostToolUse hooks), `.mcp.json` (GitHub + Playwright MCP servers) added.
- **Peter's Picks section in digest:** `generate-digest.yml` updated to include a "Peter's Picks" section at the end of each daily post, pulling from `_tools/` items where `public: true`.

### Changed

- **Editorial blurbs: Gemini → Claude (U-01):** `generate-digest.yml` `generateEditorialBlurbs()` function rewritten to call Anthropic API (`claude-sonnet-4-6`) instead of Gemini. Updated prompt includes audience context (solo founders, AI builders, small business) and voice guidance (casual dry humor, max 20 words, no hype). Fallback to raw description if API fails.
- **README hero image enrichment (U-02):** `generate-digest.yml` now calls GitHub API per featured repo to extract the first non-badge image from README. Stored as `readme_image` in `_repos/` frontmatter. Badge filter regex covers shields.io, CI status badges, Snyk, Codecov, etc.

### Fixed

- **B-01 `digestDate` scope bug:** `digestDate` was defined inside async IIFE but referenced by `createRepoEntry()` at module scope. Fixed by passing it as explicit parameter.
- **B-02 GitHub Pages 404:** `_config.yml` URL corrected from `chaosagent.github.io` (typo) to `chaosaigent.github.io`.
- **B-03 Leaderboard links broken:** `repo.slug` was null in Liquid. Fixed by using `repo.url` (Jekyll's computed URL) instead.

---

## [2026-03-24] — Hotness tracking, leaderboard, multi-source digest

### Added

- **Leaderboard page:** `leaderboard.md` added at `/leaderboard/`. Renders ranked views: hottest streak, rising fast (star velocity), most featured, recently added. Data from `_repos/` frontmatter.
- **Star velocity tracking:** `fetch-repos.yml` now maintains `star_snapshots` (rolling 30-day array per repo) and computes `star_velocity` (stars/day over trailing 7 days). Written to `hotness.json` and propagated to `_repos/` frontmatter.
- **`postmvp/` tracking folder:** `postmvp/BACKLOG.md` created to track bugs, remaining V2 items, and future ideas after all phases shipped.

### Changed

- **Multi-source digest generation:** `generate-digest.yml` fully rewritten to consume all 8 data sources. Each source has its own section in the digest post and its own dedup ledger. `createRepoEntry()` handles platform-specific field mapping for all source types.
- **Hotness tracking in fetch-repos:** `data/hotness.json` tracking added: `appearances`, `streak` (with decay), `first_seen`, `last_seen`, `star_snapshots`. Streak decays to 0 for repos absent from today's results.

---

## [2026-03-06 to 2026-03-08] — V2: 7 new data sources, catalog, redesigned digest

### Added

- **7 new fetch workflows:** `fetch-hf.yml`, `fetch-replicate.yml`, `fetch-gitlab.yml`, `fetch-npm-pypi.yml`, `fetch-ollama.yml`, `fetch-paperswithcode.yml`, `fetch-launches.yml`. Each runs on a staggered schedule (13:10–13:40 UTC) to avoid GitHub Actions queue congestion.
- **`_repos/` catalog collection:** Jekyll collection added in `_config.yml`. `generate-digest.yml` now writes one `_repos/{slug}.md` file per featured item in addition to the daily post.
- **`/repos/` catalog page:** `repos.md` added with bento card grid, client-side search (debounced 200ms), sort dropdown (recently featured, most starred, most downloaded, hottest streak, alphabetical, oldest first), source filter chips, category filter chips, ICP filter chips. All card data embedded as JSON in a `<script>` block via Jekyll Liquid.
- **`fetch-launches.yml`:** Aggregates HN Show HN (Firebase API), DevHunt (cheerio scrape), BetaList (RSS/cheerio), Uneed (cheerio scrape). Unified output format with `_source` and `_platform` fields.
- **HuggingFace Spaces:** Three sub-types (space, model, dataset) with `_hf_type` field. Models fetched per-pipeline (8 pipeline types). All deduped by ID.
- **Category assignment (`assignCategory()`):** Function in `generate-digest.yml` that maps repo topics + description + query group to one of 5 categories via regex. Respects `UGC_EXCLUSIONS` pattern to prevent web-scraping frameworks from being miscategorized.
- **`SECTION_ICP` map:** Initial version added mapping each digest section to 2–3 persona tags.
- **Seen ledgers:** Per-source dedup ledgers (`data/seen-hf.json`, `data/seen-replicate.json`, etc.) added with cooldown-days logic.

### Changed

- **`generate-digest.yml` fully rewritten** for multi-source architecture. `loadLatestDataFile(prefix)` helper loads most recent dated file for each source. All section candidates go through `isOnCooldown()` and category filters before selection.
- **Digest format expanded:** Each daily post now has 15+ sections covering all data sources.

---

## [2026-03-06] — V1.5: editorial voice, deploy fix, query tuning

### Added

- **Claude API editorial blurbs (initial version):** `generate-digest.yml` calls Anthropic Claude API for one-liner editorial blurbs. This was the first AI integration.
- **Deploy chain fix:** `deploy-blog.yml` updated to use `workflow_run` trigger (triggered by `generate-digest.yml` completing) because GITHUB_TOKEN pushes from Actions don't trigger `on: push` workflows.

### Changed

- **UGC social queries tightened:** Free-text search replaced topic-only queries to reduce false positives.
- **Category assignment tightened:** `UGC_EXCLUSIONS` regex added to prevent web frameworks (FastAPI, Playwright, Puppeteer) from being classified as UGC/social tools.
- **Global trim added:** Maximum repo count enforced across all sections.
- **Planning files excluded from Jekyll build:** `_config.yml` exclude list expanded to prevent spec/planning documents from appearing in the site.

### Fixed

- YAML parsing error in `generate-digest.yml` (multiline strings in inline heredoc).

---

## [2026-03-06] — Gemini API substitution

### Changed

- **Claude → Gemini (temporary):** Anthropic API swapped for Gemini free-tier API due to API key availability at that point. This was later reverted on 2026-03-24 (U-01) when Claude was confirmed as the intended provider.

---

## [2026-03-05 to 2026-03-06] — V1: initial scaffold, first digest, GitHub fetch

### Added

- **Initial scaffold:** Repo created (`c3f3f7f`). Jekyll `_config.yml` with minima theme, `_posts/` collection, `permalink: /:year/:month/:day/:title/`. `config/preferences.json` and `config/queries.json` created.
- **`fetch-repos.yml`:** First version fetching GitHub repos via Search API from configured queries. Outputs `data/repos-YYYY-MM-DD.json`. Includes hotness tracking (initial version, appearances only).
- **`generate-digest.yml`:** First version generating daily Markdown post from `_repos/` data. Single-source (GitHub only). Inline Node.js via `--input-type=module` heredoc pattern established.
- **`deploy-blog.yml`:** GitHub Pages deployment via `actions/jekyll-build-pages@v1` + `actions/deploy-pages@v4`.
- **GitHub Trending scraper:** Cheerio-based scraper for `github.com/trending` added to `fetch-repos.yml`. `slimRepo()` helper normalizes trending items to same schema as Search API results.
- **`config/spotlight.json`:** Manual injection config created (initially empty).
- **`.gitignore`:** Added with Node.js and OS patterns.
- **First digest published:** `_posts/2026-03-05-github-digest.md`

### Architecture decisions made at V1

- All workflow logic as inline heredoc Node.js scripts (no separate `.js` files)
- No npm package dependencies except `cheerio` where needed
- Regex-based frontmatter parsing instead of js-yaml
- Dedup via dated JSON ledger files in `data/`
- Data files stored in repo (not external database/storage)
- GitHub Actions as the only infrastructure (no Vercel, no Lambda, no cron service)
