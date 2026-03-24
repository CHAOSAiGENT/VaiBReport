# VaiBReport Me2 — Extensions

**Scope:** New capabilities for the private personal UGC layer ("Me2").
**Companion:** `me2/UPGRADES.md` covers improvements to the existing public platform.
**Context:** `me2/CLAUDE.md` for full vision, ICPs, voice guide, and architecture.
**Last updated:** 2026-03-24

Extensions are net-new. They don't touch the public digest pipeline.
They build the private tool library Peter uses for consulting content and UGC creation.

---

## E-01 — Submission mechanism: GitHub Issue → tool entry

**Status:** ✅ Built 2026-03-24 — GitHub Issue template live
**Decision:** Option A (GitHub Issue template) — confirmed by Peter
**Priority:** Critical — all other extensions depend on this
**Effort:** ~2 hours

**What:** A way for Peter to submit a repo or tool URL and trigger the enrichment pipeline. The result is a new `_tools/{slug}.md` file in the repo.

**Options:**

### Option A: GitHub Issue Template (recommended)
Peter opens a GitHub Issue using a "Submit Tool" template. A `parse-submission.yml` workflow triggers on `issues` → `opened` with the label `tool-submission`.

**Pros:** Zero new infrastructure. Works from GitHub mobile app. Queryable (Issues as a queue). Free.

**Template fields:**
```markdown
## Tool Submission

**URL:** [https://...]
**Name:** [What do you call it?]
**Why interesting:** [One sentence — your hook]
**Primary ICP:** [founding-team / solopreneur / small-business / pre-mvp / entreprecurious / non-technical]
**Secondary ICPs:** [comma-separated, optional]
**Compare to:** [What does this compete with or replace?]
**Make public:** [yes / no / later]
```

### Option B: config/submissions.json (fallback)
Peter adds entries to a JSON file manually. Simpler but no mobile, no UI.

### Option C: Web form (future)
Netlify/Vercel form or Typeform → GitHub API → Issue. Needed once platform migrates off GitHub Pages.

**Decision needed from Peter:** Option A, B, or C?
Mark `[TBD-PETER]` until decided.

---

## E-02 — Tool enrichment: full detail page generation

**Status:** Depends on E-01
**Priority:** Critical
**Effort:** ~3 hours

**What:** When a submission is received, a `generate-tool-page.yml` workflow creates `_tools/{slug}.md` with a richer frontmatter and content schema than the public `_repos/` entries.

**`_tools/` frontmatter schema:**
```yaml
---
layout: tool
name: "tool name"
url: "https://..."
source: "submitted"
submitted_by: "peter"
submitted_date: "YYYY-MM-DD"
public: false

# Metadata
category: ""
language: ""
license: ""         # MIT, Apache, proprietary, etc.
pricing: ""         # free / freemium / paid / open-source
github_url: ""
demo_url: ""
docs_url: ""

# Visuals
screenshot_desktop: "static/screenshots/{slug}-desktop.png"
screenshot_mobile: "static/screenshots/{slug}-mobile.png"
readme_image: ""
og_image: ""

# ICP targeting
primary_icp: ""
icp_tags: []        # founding-team, solopreneur, small-business, pre-mvp, entreprecurious, non-technical

# Content (AI-generated, Peter-editable)
hook: ""            # The opening line — what makes this interesting
one_liner: ""       # Public catalog blurb (20 words max)
why_interesting: "" # Peter's submitted reason + Claude's expansion
use_cases: []       # ICP-specific use case objects (see below)
compare_to: []      # Competitor/alternative objects (see below)
honest_take: ""     # What it doesn't do well / who it's wrong for

# Video scripts (AI-generated, Peter-editable)
script_faceless: "" # Format A script (see CLAUDE.md)
script_ugc: ""      # Format B script (see CLAUDE.md)

# Tracking
times_featured: 0
date_added: ""
---
```

**Use case object schema:**
```yaml
use_cases:
  - icp: solopreneur
    scenario: "Running a one-person agency and need to..."
    outcome: "...instead of hiring or using [X]"
    effort: low         # low / medium / high (to adopt)
  - icp: founding-team
    scenario: "Pre-seed team shipping fast, need..."
    outcome: "..."
    effort: medium
```

**Compare-to object schema:**
```yaml
compare_to:
  - name: "Competitor Name"
    url: "https://..."
    vs: "VaiBReport tool is better for X, worse for Y"
    pricing_comparison: "This is free, competitor is $X/mo"
    switching_effort: low    # how hard to switch from competitor
```

---

## E-03 — Playwright screenshot capture for Me2 tools

**Status:** Depends on E-01 and E-02
**Priority:** High
**Effort:** ~3 hours

**What:** When a tool is submitted, automatically run Playwright to capture screenshots of the live URL. More targeted than the public catalog version (U-03) — captures the actual product page, not just the repo.

**Difference from U-03:** Me2 screenshots target the `demo_url` or product homepage, not the GitHub URL. Captures what a user actually sees when they land on the product.

**Captures:**
1. Desktop full-viewport (1280×800, non-full-page — above-the-fold hero)
2. Mobile viewport (390×844)
3. Full-page desktop (for reference / scrollable content)

**Workflow:** `capture-tool-screenshots.yml`
- Triggered by: `workflow_run` after `generate-tool-page.yml` completes, or `workflow_dispatch` with slug input
- Chromium via `npx playwright install chromium --with-deps`
- Handles: cookie banners (click "Accept all" if detected), loading states (`waitForLoadState('networkidle')`)
- Fallback: if page errors (403, 404, login wall), fall back to OG image
- Output stored in `static/screenshots/{slug}/`

**Script outline:**
```javascript
const browser = await chromium.launch();
const page = await browser.newPage();

// Desktop
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
// Dismiss common cookie banners
for (const sel of ['#onetrust-accept-btn-handler', '[aria-label="Accept cookies"]', '.cc-accept']) {
  if (await page.$(sel)) { await page.click(sel); await page.waitForTimeout(500); break; }
}
await page.screenshot({ path: `static/screenshots/${slug}/${slug}-desktop.png` });

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `static/screenshots/${slug}/${slug}-mobile.png` });

await browser.close();
```

---

## E-04 — Video script generation (Claude API)

**Status:** Depends on E-02 (tool page exists with metadata)
**Priority:** High
**Effort:** ~2 hours

**What:** As part of `generate-tool-page.yml`, call Claude API to generate both video script formats for each submitted tool. Scripts are stored in the `_tools/` frontmatter and can be edited by Peter before filming.

**Format A: Faceless script**
60–90 seconds. Narration-only (no Peter on camera). Structure per CLAUDE.md.

**Prompt A:**
```
You write short video scripts for a faceless YouTube/TikTok/Reels channel about developer tools and software for solo founders and small business owners.

Tool: {name}
URL: {url}
Description: {description}
Primary ICP: {primary_icp}
Why interesting: {why_interesting}
Honest limitations: {honest_take}
Compare to: {compare_to[0].name} ({compare_to[0].vs})

Write a 60–90 second narration script in this structure:
1. HOOK (5s): One punchy sentence. Not "today we're looking at". Start with what it DOES or what problem it solves.
2. WHAT IT IS (15s): Explain the tool in plain language.
3. USE CASE (25s): Walk through a specific scenario for {primary_icp}. Be concrete — name the task, name the outcome.
4. HONEST TAKE (15s): What it doesn't do well. Who should NOT use it.
5. CTA (10s): Simple call to action.

Voice: casual, dry humor, direct. No hype. No "game-changing".
Return the script as plain text with section labels.
```

**Format B: UGC / Peter on camera script**
80–120 seconds. Peter talking to camera. Structure per CLAUDE.md.

**Prompt B:**
```
You write short on-camera video scripts for Peter, a consultant who talks to small founding teams, solopreneurs, and small business owners about tools that help them move faster.

Peter's voice: casual, dry humor, direct and opinionated, honest about what doesn't work.

Tool: {name}
URL: {url}
Description: {description}
Primary ICP: {primary_icp}
Why interesting: {why_interesting}
Compare to: {compare_to[0].name} — {compare_to[0].vs}

Write an 80–120 second on-camera script in this structure:
1. HOOK (5s): Personal angle — "I found this while..." or "Nobody is talking about..." or a relatable pain point.
2. QUICK SHOW (25s): Peter describes what's on screen as he demos it. Conversational.
3. MY TAKE (30s): Who Peter would specifically recommend this to. Name the ICP. Reference a real use case.
4. VS THE ALTERNATIVE (20s): One comparison. Honest trade-off.
5. SIGN OFF (15s): CTA + Peter's personality.

Format: action notes in [brackets], spoken words in plain text.
```

**Post-generation:** Scripts stored in `script_faceless` and `script_ugc` fields. Peter reviews and edits in the `_tools/*.md` file before filming.

---

## E-05 — ICP-specific use case generation (Claude API)

**Status:** Depends on E-02
**Priority:** High
**Effort:** ~1 hour (part of generate-tool-page.yml)

**What:** For each submitted tool, Claude generates 2–4 ICP-specific use case objects covering the most relevant personas.

**Why separate from E-04:** Use cases power multiple outputs — the detail page, filter chips, future ICP-targeted digest variants, and consulting prep material.

**Prompt:**
```
For the tool below, write 2–4 specific use cases. Each use case targets a different audience persona.

Tool: {name}
Description: {description}
Primary ICP: {primary_icp}
All ICPs to consider: founding-team, solopreneur, small-business, pre-mvp, entreprecurious, non-technical

For each relevant persona, write:
- icp: [persona tag]
- scenario: One sentence — the specific situation this person is in when they'd reach for this tool
- outcome: What they get / what problem it solves
- effort: low / medium / high (how hard to adopt for someone non-technical)

Return as JSON array. Only include personas where this tool is genuinely relevant — don't force it.
```

---

## E-06 — Private/public toggle and Peter's Picks page

**Status:** Decision made 2026-03-24 — build queued
**Decision:** Option B — separate `/picks/` page branded "Peter's Picks", distinct from auto-digest
**Priority:** Medium
**Effort:** ~1 hour

**What:** Me2 tools default to `public: false` in `_tools/` frontmatter. Peter sets `public: true` on individual items to feature them on a dedicated `/picks/` page — separate from the automated digest, branded as Peter's personal curation.

**Implementation regardless of option:**
- `_config.yml`: add `tools` collection with `output: true`
- Jekyll `where` filter to separate public vs. private at build time
- `_tools/` excluded from search indexing when `public: false`

---

## E-07 — Me2 private dashboard (local only)

**Status:** Ideas phase
**Priority:** Low
**Effort:** ~3 hours

**What:** A local-only HTML page (`me2/dashboard.html`) that renders all `_tools/` entries as a management view — showing status, whether screenshots exist, whether scripts are generated, ICP coverage, and a "ready to film" checklist.

**Why:** Peter needs to know at a glance: "What tools are in my library? Which ones are ready to film? Which need more work?"

**Checklist per tool:**
- [ ] Screenshots captured (desktop + mobile)
- [ ] Use cases generated
- [ ] Script A (faceless) generated
- [ ] Script B (UGC) generated
- [ ] Peter has reviewed/edited scripts
- [ ] Ready to film
- [ ] Filmed / published

**Implementation:** Static HTML that reads `_tools/*.md` frontmatter at build time (Jekyll renders it locally). Not deployed to GitHub Pages.

---

## E-08 — Consulting context layer

**Status:** Ideas phase — needs more input from Peter
**Priority:** Medium (high value for consulting use cases)
**Effort:** [TBD-PETER — needs scope definition]

**What:** Each tool entry has a `consulting_notes` field: rough notes on how Peter would position this tool in a consulting engagement. Not for public consumption — just for Peter's reference when working with clients.

**Schema addition to `_tools/`:**
```yaml
consulting_notes:
  pitch: "When a client asks about X, lead with this..."
  red_flags: "Don't recommend if they..."
  integration_notes: "Works well with Y, conflicts with Z"
  pricing_reality: "The free tier is actually good / The free tier is bait"
  client_readiness: low / medium / high  # how ready is a typical client to adopt this?
```

**How it gets populated:** Mix of Peter writing it manually + Claude drafting based on the tool's metadata and the consulting ICPs. Peter edits.

**[TBD-PETER]:** What other consulting-specific fields would be useful?

---

## Build Order

Me2 has a clear dependency chain. Build in this order:

```
E-01 (submission mechanism)
  └─ E-02 (tool page schema + generation)
       ├─ E-03 (Playwright screenshots)
       ├─ E-04 (video scripts)
       ├─ E-05 (ICP use cases)
       └─ E-06 (public toggle)
            └─ E-07 (local dashboard) [optional, any time]
                 └─ E-08 (consulting layer) [needs Peter input first]
```

**First session target:** E-01 + E-02 skeleton. Get one tool through the full pipeline end-to-end (even with placeholder screenshots/scripts) so Peter can see the shape of the output and give feedback before we build the rest.

---

## Open Questions for Peter

| # | Question | Blocks |
|---|----------|--------|
| ~~Q-01~~ | ~~Submission method~~ | ✅ GitHub Issue template |
| ~~Q-02~~ | ~~Public visibility~~ | ✅ Separate `/picks/` page — "Peter's Picks" |
| Q-03 | ICP priority order for content targeting — which persona comes first? | E-04, E-05 |
| Q-04 | Consulting notes scope — what fields do you actually need for client work? | E-08 |
| Q-05 | Video script review workflow — edit in the `.md` file directly, or do you want a separate draft file? | E-04 |
| Q-06 | Should the faceless and UGC scripts be separate files or embedded in the tool frontmatter? | E-04 |
