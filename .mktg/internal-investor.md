---
file: internal-investor.md
audience: Internal / investor briefing
last updated: 2026-03-29
---

# VaiBReport — Internal Brief

## What It Is

VaiBReport is a **daily AI tool intelligence layer** built for the builders, founders, and consultants who advise them. It ingests signal from 9 live sources — GitHub, HuggingFace, Replicate, GitLab, npm/PyPI, Ollama, Papers with Code, product launches, and Product Hunt — runs it through a multi-provider LLM pipeline, and delivers curated, opinionated output: a daily digest, a browsable catalog, and on-demand research reports.

It is not a newsletter aggregator. It is not a bookmark tool. It is an **intelligence pipeline with a private consulting layer on top**.

---

## The Problem It Solves

The AI tools landscape moves faster than any human can track. New libraries, new models, new launches — dozens daily across a dozen platforms. The people who need this signal the most (founders, solopreneurs, consultants) have the least time to find it.

Existing solutions fail in one of two ways:
- **Too broad** — generic tech news that isn't filtered for builders
- **Too thin** — single-source feeds (GitHub trending, PH daily) with no synthesis

VaiBReport solves both. Multi-source ingest with opinionated filtering, AI editorial synthesis, and ICP-aware output.

---

## Architecture (The Unfair Advantage)

**Zero infrastructure cost.** The entire pipeline runs on GitHub Actions — no servers, no databases, no hosting bill. Data is stored in the repository as versioned JSON. The site is static Jekyll on GitHub Pages.

**This is not a limitation. It is a structural moat.**

A competitor replicating this would pay for compute, storage, hosting, and orchestration from day one. VaiBReport's marginal cost per additional data source is approximately one GitHub Actions workflow file and ~$0/month.

**LLM cost structure (as of 2026-03-29):**
- Editorial blurbs: Gemini Flash (free via Workspace) → OpenRouter free tier → Groq free tier → Claude Haiku (last resort)
- Research synthesis: Gemini Pro (free) → OpenRouter → Claude Sonnet (last resort)
- Typical day: $0 LLM spend when Gemini quota is healthy. Claude spend only on quota exhaustion

**Pipeline:**
```
9 fetch workflows (staggered 13:10–13:40 UTC)
    ↓
generate-digest.yml (selects candidates, deduplicates, calls LLM for editorial voice)
    ↓
_posts/ (daily digest) + _repos/ (individual catalog pages)
    ↓
deploy-blog.yml (Jekyll build → GitHub Pages)
```

---

## The Me2 Layer (Private Competitive Advantage)

On top of the public pipeline sits a private enrichment layer used by Peter for consulting and content production.

When a tool is submitted (via GitHub Issue), the system:
1. Creates a structured tool record (`_tools/{slug}.md`)
2. Captures desktop + mobile screenshots via Playwright
3. Generates two video scripts (faceless automation format + on-camera UGC format)
4. Generates ICP-specific use cases for 6 audience profiles
5. Generates consulting prep notes (who it's for, pitch, red flags, objections, pricing reality)

This produces a **production-ready asset** from a single URL submission. The consulting notes alone replace 30–60 minutes of pre-meeting research per tool.

**Private research on demand:** Any topic can be submitted as a GitHub Issue. The system runs Brave Search + Gemini Pro synthesis and returns a structured research report with tool comparison table, ICP-specific recommendations, and Peter's pick. Stored privately, optionally made public.

---

## Data Flywheel

The catalog compounds. Every day, new tools are added to `_repos/`. Every manual submission adds to `_tools/`. The research library in `_research/` grows with every request.

After 6 months:
- `_repos/` contains a versioned, searchable record of everything that surfaced as signal in the AI/dev tools space
- `_tools/` is a personally curated and deeply enriched private tool library
- `_research/` is a proprietary research archive covering categories at the depth Peter directs

This data is not available anywhere else in this form. It is the output of a continuously running intelligence pipeline tuned to a specific audience.

---

## Current State

| Area | Status |
|------|--------|
| Daily digest pipeline | Live, automated, running daily |
| 9-source ingest | Live |
| Public catalog + leaderboard | Live |
| Me2 enrichment pipeline | Live (scripts, use cases, consulting notes) |
| On-demand research reports | Live |
| LLM cascade (cost-optimised) | Live as of 2026-03-29 |
| Platform cost | Near-zero |
| Custom domain | Pending decision |
| Email distribution | Pending decision |
| Platform migration (Next.js/Astro) | Pending decision |

---

## Growth Levers (When Ready)

1. **Email digest** — Resend-powered daily/weekly delivery. The content is already produced. Subscription list = direct distribution.
2. **Custom domain** — Branding step. Required before any public push.
3. **Platform migration** — Jekyll served GitHub Pages well at zero cost. The next version (Vercel + Next.js/Astro) unlocks analytics, search, personalisation, and paid tiers.
4. **ICP expansion** — The pipeline is source-agnostic. Extending to new verticals (e-commerce tools, legal tech, fintech) requires adding fetch workflows, not re-architecting.
5. **API access** — The enriched data in `_repos/`, `_tools/`, and `_research/` has standalone value. A paid API tier is a natural extension.

---

## The One-Line Version

> A zero-infrastructure AI intelligence pipeline that turns 9 live data sources into a daily curated digest, a growing tools catalog, and a private consulting research layer — all running on GitHub Actions at near-zero cost.
