---
file: VaiBReport-roadmap.md
project: VaiBReport
updated: 2026-05-31
---

# VaiBReport — Project Roadmap

## Done

- 9-platform daily data pipeline (GitHub, HuggingFace, Replicate, Papers with Code, npm/PyPI, GitLab, Ollama, Product Hunt, DevHunt/HN/BetaList/Uneed)
- Jekyll blog on GitHub Pages — live at chaosaigent.github.io/VaiBReport/
- LLM cascade for editorial blurbs (Local Qwen → NVIDIA NIM → Gemini → OpenRouter → Groq → Haiku)
- Compare-to editorial layer — code shipped (replaces/similar_to fields, adversarial NIM validator, backfill script, hero-card homepage, feature flag live)
- Me2 tool enrichment pages with Playwright screenshots
- Research report workflow (Brave Search + Perplexity + Claude synthesis)
- Leaderboard page
- \_repos/ catalog (1000+ entries)
- RSS feed
- NVIDIA NIM added as Tier 2 (2026-04-30)
- Product Hunt data source integrated (2026-03-28)
- Stitch design system created — "Sophisticated Technical" (Chivo/Inter/JetBrains Mono, dot grid, tonal elevation)
- 23 Stitch screens generated covering all major page types (Home, Digest, Product Detail, Leaderboard, Trending, Catalog, Search, Subscribe, About, Settings, RSS/Feeds, Platform Insights, Component Reference)

## In Progress

- **Site redesign (Stitch-first)** — reviewing 23 existing screens for Sponsor blocks and Chaos Desktop promotion (direct + subtle). Canonizing design styling for consistency. Then generating missing pages (Research, Picks, Sponsor). Then downloading HTML and building Next.js.
- **Compare-to backfill is blocked** — 3 dead NIM endpoints + blurb truncation bug + NVIDIA_API_KEY lost from local env. Fix fully documented in `tasks/nvidia-cascade-and-backfill.md`. Hero cards and Replaces/Similar sections render nothing without this.
- **GitHub token consolidation** — user-level and machine-level GITHUB_TOKEN co-exist. Steps in `tasks/github-token-consolidation.md`. Blocking only local MCP GitHub server reliability.

## To Do

- **Custom domain** — acquire and configure custom domain for VaiBReport (report.vaibos.com or similar). Required before email delivery.
- **Generate missing Stitch screens** — Research/[slug], Picks/[slug], Sponsor page
- **Download Stitch HTML** — extract all approved screens to `.stitch/designs/` for Next.js implementation reference
- **Next.js project init** — scaffold Next.js App Router project, migrate content from Jekyll, implement from Stitch designs. Enable Vercel MCP when ready.
- **Email digest delivery** — depends on custom domain. Resend API key, sending domain, subscriber collection via Resend audience API.
- **PostHog analytics** — add after Next.js deployment. Enable PostHog MCP when ready.
- **Housekeeping: stale PRD index** — `docs/prd/README.md` shows shipped items as "Ready to build." Archive or close out.
- **Housekeeping: document research-report workflow** — `research-report.yml` has no docs outside the workflow file itself.

## Decisions Made

- 2026-05-31: Site redesign promoted to active — Stitch-first workflow (design → review → code). MCP registry created.
- 2026-05-31: Supabase dropped from architecture — subscribers via Resend audience API, sponsors via config/sponsors.json.
- 2026-05-31: Design skills activate on-request, not blanket-enabled. Stitch skills always-on.
- 2026-05-31: Stitch MCP registered with project ID 6458998332659659501.
- 2026-05-31: Context pruning — disabled 10 MCPs + 97 skills irrelevant to current stack. Written to `.claude/settings.local.json`.
- 2026-05-31: Design HTML files untracked from git (were tracked before gitignore pattern existed). Files remain on disk.
- 2026-04-30: NVIDIA NIM added as Tier 2 in LLM cascade. Preview tier — endpoints may be deprecated/renamed.
- 2026-03-06: Swapped from Anthropic (unfunded) to Gemini as primary LLM. Cascade order established.
- 2026-03-05: Jekyll over blog-action (unmaintained). Cheerio over GiTrends (unreliable). Native fetch over node-fetch.
- 2026-03-05: Inline Node.js heredoc pattern in workflow YAML files — intentional, documented in TECHNICAL.md.
- 2026-03-05: \_tools/ pages are guessable (public: false still generates pages) — intentional security tradeoff.
- 2026-05-01: Feature flag JEKYLL_ENV=compare_to_live baked permanently into deploy-blog.yml. Currently rendering empty (data not backfilled).
