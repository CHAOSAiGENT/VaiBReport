---
file: VaiBReport-roadmap.md
project: VaiBReport
updated: 2026-06-01
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
- 23 Stitch screens generated covering all major page types
- Design system canonized — extracted Tailwind config, base CSS, and component patterns from 4 component ref screens into `.stitch/` files
- Design system v2 created in Stitch (asset 13925274661809790673) with WCAG AA slate-gray, mobile typography, sponsor/Chaos Desktop component specs
- Home page edited with 6 additions: sponsor slot, Chaos Desktop in nav/footer/hero, Peter's Picks, Subscribe strip
- Full audit of all 15 page screens completed — sponsor slots, Chaos Desktop promotion, design consistency
- All screen screenshots + HTML downloaded to `.stitch/designs/`

## In Progress

- **Site redesign — P0 screen edits** — 7 screens missing sponsor slots, 3 missing Chaos Desktop presence, 4 Product Detail screens missing dot grid. Edit queue documented in context lock.
- **3 missing screens** — Research/[slug], Picks/[slug], Sponsor page. Stitch CLI generation times out. Build as code during Next.js init or generate via Stitch web UI.
- **Compare-to backfill is blocked** — 3 dead NIM endpoints + blurb truncation bug + NVIDIA_API_KEY lost from local env. Fix in `tasks/nvidia-cascade-and-backfill.md`.
- **GitHub token consolidation** — user-level and machine-level GITHUB_TOKEN co-exist. Steps in `tasks/github-token-consolidation.md`.

## To Do

- **Apply P0 screen edits** — add sponsor slots to Product Detail Intelligence/Technical, Digest Email, Subscribe, About, HuggingFace Insights. Add Chaos Desktop to Leaderboard, HuggingFace, Product Detail Intelligence. Add dot grid to all 4 Product Detail screens.
- **Next.js project init** — scaffold Next.js App Router project from `.stitch/tailwind.canonical.json` + `base.canonical.css`. Implement pages from downloaded HTML. Enable Vercel MCP when ready.
- **Custom domain** — acquire and configure custom domain (report.vaibos.com). Required before email delivery.
- **Email digest delivery** — depends on custom domain. Resend API key, sending domain, subscriber collection via Resend audience API.
- **PostHog analytics** — add after Next.js deployment. Enable PostHog MCP when ready.
- **Housekeeping: stale PRD index** — `docs/prd/README.md` shows shipped items as "Ready to build."
- **Housekeeping: document research-report workflow** — `research-report.yml` has no docs.

## Decisions Made

- 2026-06-01: Design system canonized into `.stitch/` files — tailwind.canonical.json + base.canonical.css + DESIGN-SYSTEM.md. slate-gray darkened to #4B5563 for WCAG AA.
- 2026-06-01: Home Variant 2 (Complete Integration) chosen as canonical base. Edited with sponsor slot, Chaos Desktop nav/footer/hero, Peter's Picks, Subscribe strip.
- 2026-06-01: Full 15-screen audit completed. P0 edit queue: 7 missing sponsor slots, 3 missing Chaos Desktop, 4 missing dot grids.
- 2026-06-01: Stitch CLI generation consistently times out. 3 missing screens (Research, Picks, Sponsor) to be built as code or via web UI.
- 2026-05-31: Site redesign promoted to active — Stitch-first workflow. MCP registry created.
- 2026-05-31: Supabase dropped — subscribers via Resend, sponsors via config JSON.
- 2026-05-31: Design skills activate on-request. Stitch skills always-on.
- 2026-05-31: Stitch MCP registered with project ID 6458998332659659501.
- 2026-05-31: Context pruning — disabled 10 MCPs + 97 skills.
- 2026-04-30: NVIDIA NIM added as Tier 2 in LLM cascade.
- 2026-03-06: Swapped from Anthropic to Gemini as primary LLM.
- 2026-03-05: Jekyll over blog-action. Cheerio over GiTrends. Native fetch over node-fetch.
- 2026-03-05: Inline Node.js heredoc pattern in workflow YAML files — intentional.
- 2026-05-01: Feature flag JEKYLL_ENV=compare_to_live baked permanently into deploy-blog.yml. Currently rendering empty.
