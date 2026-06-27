# Phase 2 (Enrichment Worker) — TheStudio Carryover

**Date:** 2026-06-26 · **From:** theMac session "vaibreport0626" · **For:** the next session that builds Phase 2 (on TheStudio).

> Why this file exists: the detailed working context from the Phase-1 session was saved to **machine-local memory on theMac**, which does NOT travel to TheStudio. This committed doc carries the durable facts + decisions so Phase 2 can start cold on TheStudio. Read this, then the spec (`docs/superpowers/specs/2026-06-26-vaibreport-content-engine-design.md` §4).

---

## TL;DR — start here

1. Read this doc, then spec §4 (the worker design) and skim Plan 1 (`docs/superpowers/plans/2026-06-26-real-home.md`) for the patterns/contracts.
2. **Resolve the one open blocker first (see "Open blocker" below): does TheStudio read the JPW voice canon via `git pull` or via a Tailscale mount?** That decides the worker's voice-source code path.
3. Brainstorm any remaining gaps → `writing-plans` → subagent-driven build, in an isolated worktree (`.worktrees/` is gitignored). Same flow Phase 1 used.

## What Phase 1 already shipped (the slots you fill)

The home + platform pages now read live daily snapshots AND will automatically render enrichment when it exists. Phase 1 only **reads**; Phase 2 **produces**. No rework, purely additive.

**The data contract Phase 2 must write to:**

- One markdown file per enriched item: **`_articles/<source>/<slug>.md`** (text → git).
- Front-matter fields `content.ts:getArticleBySlug` expects: `title`, `source`, `item_id`, `image_urls` (array of R2 URLs), `newsletter_cut` (string), plus the article body as markdown.
- **Slug format (stable, date-independent):** `<source>__<sanitized-id>` where the id is lowercased and every non-`[a-z0-9]` run becomes `-`. Examples: `hf__qwen-qwen3-0-6b`, `github__kriasoft-react-starter-kit`, `launches__showhn-48688700`. This is `itemSlug(source, id)` in `next/src/lib/slug.ts` — reuse that exact function so links match.
- `source` values are the canonical ones from `normalize.ts`: `github, hf, replicate, paperswithcode, npm, pypi, ollama, gitlab, launches`.
- Images: **binaries to R2, only the URL into git.** The repo must never hold image/video binaries (the 289 MB / 399 MB storage lessons).
- When an article exists, the home/platform pages link to `/articles/<slug>` instead of the external URL automatically (the `hasArticle` join). Empty `_articles/` is the current, valid state.

## Phase 2 scope (this phase)

Images + **articles** on every unique item; **video deferred** to a later phase. (#2/#3/#5 — newsletter delivery, syndication, social posting — are cowork/manual off these outputs; no SMTP/delivery tooling.)

## Resolved decisions (carry these in)

- **Enrich-once:** key off the existing `data/seen-*.json` dedup so daily work = only NEW items; the article library grows over time. This is what makes "articles on all items" tractable.
- **Worker = Studio-side scheduled job** (option B), not a self-hosted GitHub runner (public-repo security). It absorbs/retires the flaky Mac-side auto-sync daemon so there's ONE reliable writer.
- **O-1 worker mechanism:** hybrid — scripted orchestration + model calls for draft/edit.
- **O-2 `featured` rule (cloud-editor tier):** diversity + uniqueness + hotness.
- **Article cascade:** Ollama **draft** (local, free, all items) → **local** big-model **edit** for voice (all items, free) → **cloud** editor (Gemini/Claude) for **featured only** this phase. Escalation to cloud-on-everything is a config flip (designed-for from day one).
- **O-3 R2 creds:** `.env.local` on TheStudio (not in repo).
- **O-4 voice canon path:** local on TheStudio (it IS the Tailscale endpoint); expose as `VOICE_CANON_DIR`.
- **O-5 slug:** done (see contract above).
- Plus a condensed **newsletter cut** derived from each article (`newsletter_cut` front-matter).

## Durable environment facts (were machine-local memory)

- **TheStudio** = always-on desktop: RTX 4070 (12 GB VRAM), 164 GB DDR5, Ollama, Claude + Claude Desktop, Remotion, Tailscale. It is the home for scheduled inference/render work. **theMac is NOT reliable for any scheduled/automated work** — put the worker on TheStudio.
- **Ecosystem roles:** Cloudflare R2 = binary asset store; Vercel = hosting in reserve (staying on GitHub Pages this phase); CF AI Workers = inference fallback in reserve. The VaiBReport LLM cascade is being copied to run VaiBOS in general — treat the inference layer as reusable.
- **GitHub cost reality:** VaiBReport is a PUBLIC repo ⇒ Actions minutes are free; the metered resource is storage (the 500 MB account quota). Keep binaries out of git.
- **Push discipline:** an external auto-sync daemon auto-commits+pushes `main` on a timer. Use `git pull --rebase --autostash` + retry, and fail loudly (`exit 1`) on push failure — the pattern in `fetch-all.yml`.

## The voice (referenced live from JPW26 — never copied)

Source files in the **JPW repo** (`_platforms/JPW/jpw26-working`): `.claude/brand-voice-guidelines.md` (enforcement source) + `.canon/method-and-style.md`. Load them at generation time so updates propagate. Carry the voice MECHANICS but keep the subject on the AI tooling (exclude the Revelocity/sales phrasebank — that's JPW-business-specific).

**Hard rules (treat the editor pass as a linter, gate generated articles on these):**

- **No em-dashes** (use parentheses, commas, ellipses, or split sentences) — the #1 rule.
- No exclamation points; no hype; no result guarantees.
- Banned clichés: empower, amplify, unlock, supercharge, elevate, transform, "next-level," unleash, synergy, disrupt, leverage (as verb), thought leader, guru.
- Tone: direct, honest, warm-not-soft, dense, coach-not-boss. Name is "Peter Wheeler" (never "J. Peter Wheeler"). "Revelocity" is always bare.

## Open blocker to resolve first

**How does TheStudio access the JPW voice canon — `git pull` of the JPW repo, or a Tailscale mount of theMac's live files?**

- As of this writing the JPW repo is **4 commits ahead of its `origin/main` (unpushed)**, including a canon change (a new `.canon/CANON.md`). The two files the worker reads (`brand-voice-guidelines.md`, `method-and-style.md`) ARE current on JPW's `origin`, but a new `CANON.md` is not.
- If the worker reads via **git pull** → ensure the JPW repo is pushed (and consider it may trigger a jpeterwheeler.com deploy — that's a JPW decision, get explicit consent before pushing another project's repo).
- If it reads via **Tailscale mount** of theMac's working tree → unpushed is moot; point `VOICE_CANON_DIR` at the mount.
  Decide this before writing Plan 2 so the voice-source path is unambiguous.

## Env prerequisites on TheStudio (so Plan 2 isn't blocked)

- R2 bucket + creds in `.env.local`.
- Voice canon reachable (mount or synced clone) → `VOICE_CANON_DIR`.
- Node ≥ 22 (the lib tests + tooling use native `.ts` type-stripping; pipeline uses node 24).
- Ollama with a draft model + a larger local editor model that fits 12 GB VRAM (or CPU/RAM-offloaded via the 164 GB).

## Pointers

- Spec: `docs/superpowers/specs/2026-06-26-vaibreport-content-engine-design.md` (§4 worker, §9 decisions, §10 open questions w/ inline answers).
- Plan 1 (patterns/contracts): `docs/superpowers/plans/2026-06-26-real-home.md`.
- Slug fn to reuse: `next/src/lib/slug.ts` · Article reader/shape: `next/src/lib/content.ts` (`getArticleBySlug`, `Article`).
