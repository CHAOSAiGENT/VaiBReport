# VaiBReport Content Engine — Design Spec

**Date:** 2026-06-26
**Scope (this phase):** #1 the real home (live data display) + #4 enrichment (images + articles).
**Deferred (later TheStudio phase):** video (Remotion), and #2/#3/#5 (newsletter delivery, syndication, social posting) — produced as cowork from this phase's outputs.

---

## 1. Problem

The Next.js redesign shipped Stitch _layouts_ populated with **hardcoded mock data**. The home page hero, "Peter's Picks", Chaos releases, platform-health, and sponsor are constants; platform pages show `--` for every metric. Only the digest list and repo count are wired to the pipeline. Meanwhile the daily fetch pipeline produces rich per-source data (`data/*.json`) that **nothing displays** — `content.ts:getLatestDataSnapshot()` exists but has zero callers.

Result: the site "doesn't change", there are "no writeups", and the pipeline's richness is invisible.

## 2. Goals / Non-goals

**Goals**

- The home + platform pages display **live** pipeline data that changes daily.
- Every _unique_ item gets a **real article** in Peter Wheeler's voice, plus a condensed newsletter cut.
- Every item gets **screenshots** (all available URLs) hosted off-repo.
- Enrichment runs on **TheStudio** (reliable, always-on, free local inference).

**Non-goals (this phase)**

- No email/SMTP/newsletter _delivery_ tooling. No social posting. No video.
- No host migration: stay on GitHub Pages static export. Vercel/CF-Workers held in reserve.
- No re-generation of already-enriched items (enrich-once).

## 3. Architecture — resource roles

| Resource                                                       | Role                                                                                     |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **TheStudio** (RTX 4070, 164 GB, Ollama, Tailscale, always-on) | Enrichment **worker**: drafting, local editing, Playwright capture, R2 upload, git push. |
| **Cloudflare R2**                                              | **Binary asset store** (screenshots now, video later). Repo holds only URLs.             |
| **git repo**                                                   | Source of truth for _text_: listings (`data/`), articles (`_articles/`), asset URLs.     |
| **GitHub Pages**                                               | Display. Static rebuild on push publishes new articles + data automatically.             |
| **JPW26 voice canon**                                          | **Referenced live, never copied.** `brand-voice-guidelines.md` + `method-and-style.md`.  |
| Cloud LLM (Gemini/Claude)                                      | Editor pass for _featured_ items only (this phase).                                      |
| Vercel / CF AI Workers                                         | Reserved. Not used this phase.                                                           |

**Storage discipline (load-bearing principle):** _binaries to R2, text to git._ Keeps the repo lean (honors the prior 289 MB shed + 399 MB artifact lessons) and preserves the static-rebuild deploy model.

## 4. Component: enrichment worker (#4)

Runs on TheStudio on a schedule (cron or a Claude `/loop`; see Open Question O-1). One pass:

```
git pull
for each source in data/<source>-<today>.json:
  for each item NOT already in enriched-<source>.json:      # enrich-once, keyed off item id
    urls       = all available URLs for the item            # product homepage + source/repo page
    shots[]    = Playwright.capture(urls)                    # all available
    imageUrls  = R2.upload(shots)                            # binaries leave git
    draft      = Ollama.draft(item)                          # local, free, bulk
    article    = LocalBigModel.edit(draft, voiceCanon)       # local voice pass, ALL items
    if item.featured: article = Cloud.edit(article, voiceCanon)   # paid, few/day
    newsletterCut = condense(article)                        # short derivative
    write _articles/<source>/<id>.md  (front matter: title, item id, imageUrls, newsletterCut)
    record id in enriched-<source>.json
git commit + push   (text only)
```

- **Enrich-once** reuses the existing `data/seen-*.json` dedup discipline; daily work = new items only; articles accumulate into a growing library. This is what makes "articles on all items, period" tractable.
- **Voice canon is read at generation time** from a configured path (`VOICE_CANON_DIR`, Tailscale-mounted on TheStudio → JPW26 space). VaiBReport stores a pointer/config, not a copy. Voice edits in JPW propagate automatically.
- **Editor tiers (this phase):** local big-model edits _all_ items (free); cloud editor only for `featured`. Escalation to cloud-on-everything is a config flip, designed for from day one.
- **Worker consolidation:** this worker absorbs/replaces the flaky Mac-side auto-sync daemon so there is **one** reliable writer on the reliable machine.

### Voice enforcement (the editor prompt is a linter)

From JPW26 canon, hard rules carried in: **no em-dashes** (use parentheses / commas / ellipses / split), no exclamation points, no hype, no result-guarantees, banned clichés (empower, unlock, supercharge, leverage-as-verb, disrupt, thought leader, …). Tone: direct, warm-not-soft, dense, coach-not-boss. Subject stays on the AI tooling — the Revelocity/sales phrasebank is JPW-business-specific and excluded.

## 5. Component: real home + display (#1)

- **`content.ts`**: add an enriched-item shape `{ ...listing, articleSlug?, imageUrls?, newsletterCut? }`, backed by `getLatestDataSnapshot()` (already written) joined to `_articles/`.
- **New collection** `_articles/<source>/<id>.md`; **new route** `articles/[id]/page.tsx` renders the full piece (markdown via existing `markdown.ts`).
- **Home** (`page.tsx`): replace `HERO_REPO`, `PETERS_PICKS`, `CHAOS_RELEASES`, platform-health constants with live reads (hero = top-signal item of the day, etc.); each links to its article with an R2 screenshot.
- **Platform pages** (`platforms/[id]`): replace `--` metrics with real counts/last-run from the snapshot; replace the one-line description with linked recent articles for that platform.
- Static rebuild on push = home changes daily as the library grows.

## 6. Data flow

```
data/*.json (cloud pipeline, unchanged)
        │
        ▼
TheStudio worker ── screenshots ──▶ R2 (binaries)
        │  articles+cuts (text)
        ▼
git repo (_articles/, enriched-*.json, data/)
        │  push
        ▼
GitHub Pages build ── content.ts reads data + _articles + R2 URLs ──▶ live site
```

## 7. Error handling

- **Per-item isolation:** one item's failure (dead URL, model timeout) skips that item, logs it, continues — never aborts the batch. Mirrors the `continue-on-error` discipline in `fetch-all.yml`.
- **R2 upload failure:** skip the screenshot, keep the article (text still ships); retry next pass.
- **Cloud editor unreachable:** fall back to the local-edited article (cascade ethos: first success wins).
- **Voice canon path missing:** hard-fail the run with a clear error (don't silently generate off-voice). Voice is not optional.
- **Push race vs cloud pipeline:** `git pull --rebase --autostash` + retry (the pattern just hardened in `fetch-all.yml`).

## 8. Testing

- Unit: `content.ts` enriched-item join (item with/without article/images); newsletter-cut condenser bounds.
- Voice linter: a deterministic check (no em-dash, no banned words, no `!`) run on generated articles in CI as a gate — catches model drift without a human.
- Render: `articles/[id]` builds for a sample; `jekyll`/next build validation (existing validators).
- Worker dry-run mode: generate to a scratch dir without committing, for local iteration.

## 9. Decisions made (during brainstorming)

1. Scope = #1 + #4 (images/articles). Video + #2/#3/#5 deferred to a later TheStudio phase.
2. No delivery/SMTP tooling; work in-stack.
3. Binaries → R2, text → git.
4. Stay on GitHub Pages (Vercel reserved).
5. Enrichment runs on TheStudio as a scheduled worker (option B); retire the Mac auto-sync daemon.
6. Inference: Ollama draft + **local** big-model editor for all items (free); **cloud** editor for featured only this phase; escalate later by config.
7. Playwright captures **all available** URLs per item.
8. Articles on **every unique** item (enrich-once, library grows) + a condensed newsletter cut.
9. Voice **referenced live** from JPW26 canon (`brand-voice-guidelines.md` + `method-and-style.md`), never copied.

## 10. Open questions (resolve in planning)

- **O-1:** Worker mechanism on TheStudio — plain cron + script, vs an agentic Claude `/loop` (editorial judgment on `featured`). Leaning hybrid: scripted orchestration, model calls for draft/edit.
- **O-2:** `featured` selection rule — what promotes an item to the cloud editor tier (top signal? Peter's manual pick list? platform diversity?).
- **O-3:** R2 bucket/credentials provisioning + how TheStudio authenticates (token as Studio env, not in repo).
- **O-4:** `VOICE_CANON_DIR` resolution on TheStudio (Tailscale mount path vs a synced clone of the JPW canon).
- **O-5:** Article URL/id scheme stable across days (so links don't break as snapshots roll).
