# VaiBReport Me2 — Session Context & Memory

**Read this at the start of every session touching Me2 work.**
**Last updated:** 2026-03-29
**Companion files:** `me2/UPGRADES.md`, `me2/EXTENSIONS.md`, `postmvp/BACKLOG.md`

---

## What VaiBReport Is (Current State)

A fully automated daily digest pipeline + private Me2 enrichment layer:

```
GitHub Actions fetch (9 sources) → generate-digest.yml (Node.js inline script)
→ commits _posts/*.md + _repos/*.md → deploy-blog.yml → Jekyll → GitHub Pages

Peter submits issue → parse-submission.yml → _tools/{slug}.md
→ tool-page-generate.yml (Gemini Pro → Sonnet, 5 calls) → enriched tool page
→ research-report.yml (Brave Search → Gemini Pro → Sonnet) → _research/{slug}.md
```

**Live site:** https://chaosaigent.github.io/VaiBReport/
**Repo:** https://github.com/CHAOSAiGENT/VaiBReport
**Stack:** Jekyll + GitHub Pages, GitHub Actions (Node.js 20 inline scripts), LLM cascade (Gemini → OpenRouter → Groq → Claude)

**LLM provider order (all workflows):** Gemini Flash/Pro (free, default) → OpenRouter free tier → Groq free tier → Claude Haiku/Sonnet (paid, last resort). Any missing key is skipped gracefully.

**Search provider order (research):** Brave Search (primary, $5/mo) → Perplexity (fallback)

**Data sources active:** GitHub, HuggingFace (Spaces/Models/Datasets), Replicate, GitLab, npm/PyPI, Ollama, Papers with Code, product launches (HN Show HN, BetaList, DevHunt, Uneed), Product Hunt

**Key config files:**
- `config/preferences.json` — star thresholds, cooldown days, section limits
- `config/queries.json` — GitHub search queries by category
- `config/spotlight.json` — manual "must feature" injections
- `data/seen-*.json` — dedup ledgers per source
- `data/hotness.json` — streak/appearances/star velocity per repo

**Current public output:**
- `/` — daily digest posts (editorial blog)
- `/repos/` — bento card grid of all featured repos (browsable catalog)
- `/leaderboard/` — ranked views (hottest streak, rising fast, most featured, etc.)

---

## What Me2 Is

Me2 is a **private personal layer** built on top of the public VaiBReport pipeline.

The public layer stays: daily automated digest, bento catalog, leaderboard. That doesn't change.

Me2 adds a second track: **Peter manually submits repos and tools** → the system enriches them with screenshots, video scripts, ICP-specific use cases, and competitive notes → Peter uses that enriched content to produce consulting content, TikTok/Reels/Shorts, and ICP-targeted assets.

**Two modes of content, one library:**

| Mode | Audience | Trigger | Output |
|------|----------|---------|--------|
| Public digest | VaiBReport readers (automated) | Daily cron | Daily post + catalog cards |
| Me2 private enrichment | Peter (manual) | Peter submits a repo | Full detail page + video script + ICP notes |

Me2 content lives in `_tools/` (a separate Jekyll collection from `_repos/`), is excluded from public Jekyll output by default, and can be toggled public per item.

---

## The Me2 Vision in Peter's Words

> "A private UGC-building version for me. Building out a larger library mechanism that includes a way for ME to submit repos/links for buildout, with detail pages on each that have screenshots, video scripts for faceless and UGC (me) content — 60–120 second TikTok/Reels/Shorts style, 'compare to' notes, 'use for' cases, all targeted towards my personal key ICPs for consulting, as well as the ICP for CHAOSAiGENT."

Key phrase: **"library mechanism"** — this is a living tool database, not a digest. Items accumulate, get enriched over time, and become reusable assets for content production.

---

## ICPs (Audience Profiles) — Know These Cold

These are the people Peter talks to, consults for, and creates content for. Every piece of Me2 output should be filtered through one or more of these lenses.

### ICP-1: Small Founding Teams
- 2–5 person startups, usually technical founder + non-technical co-founder
- Have budget, have urgency, lack bandwidth
- Decisions: "What tools let us move faster without hiring?"
- Content angle: time-to-value, integration ease, replaces a hire

### ICP-2: Solopreneurs
- One person wearing every hat
- Extremely cost-sensitive, time is everything
- Decisions: "Can I run this myself? How much does it actually cost?"
- Content angle: solo-operator workflows, what breaks without a team, honest pricing

### ICP-3: Small Business Owners
- Main street + services businesses, not always tech-native
- Looking for tools that work without technical setup
- Decisions: "Will my team actually use this?"
- Content angle: adoption friction, ROI clarity, non-technical admin

### ICP-4: Pre-MVP Orgs
- Have an idea, haven't shipped yet
- Evaluating stacks before they build
- Decisions: "What should we bet our MVP on?"
- Content angle: stack selection reasoning, what you'll regret later, what's overengineered

### ICP-5: Entreprecurious
- Employed, curious about building something, not committed yet
- Low urgency, high interest in "what's possible"
- Decisions: "What would I even use to start?"
- Content angle: low-risk exploration, "here's what this unlocks", inspiration over prescription

### ICP-6: Non-Technical Investigators
- Often decision-makers, investors, ops/marketing people
- Want signal without needing to understand the implementation
- Decisions: "Is this category worth paying attention to?"
- Content angle: why it matters, what it replaces, momentum/adoption signals

---

## Screenshot Approach Decision

**Chosen method: Playwright in GitHub Actions (Layer C)**

Rationale:
- First-party support in GH Actions (chromium included in ubuntu-latest)
- More modern/maintained than Puppeteer
- Full-page and viewport-specific captures (mobile/desktop)
- Can script interactions (dismiss cookie banners, scroll to content)
- Free — no external service cost

**Fallback stack (layered, not either/or):**
1. Playwright live capture (primary — for repos with live URLs)
2. README media extraction (secondary — authentic demo GIFs/screenshots from READMEs)
3. GitHub OG image (tertiary — always available, guaranteed coverage)

**Storage:** `static/screenshots/{slug}/{slug}-desktop.png`, `...-mobile.png`
Migrate to R2/S3 during platform migration (Item V-02 in postmvp/BACKLOG.md).

**Playwright workflow:** Separate `capture-screenshots.yml` — runs on-demand (triggered by Peter submitting a tool, or on a weekly batch for new catalog items). Not part of the daily digest chain.

---

## Video Script Formats

Two distinct formats. Every Me2 tool entry gets both.

### Format A: Faceless (Automation-style)
- Tone: informative, fast-paced, slightly editorial
- No personal presence — narration + screen recording / screenshot montage
- Structure:
  1. Hook (0–5s): "This open-source tool does X that [paid tool] charges $Y/month for"
  2. What it is (5–20s): one sentence + show the UI
  3. The use case (20–45s): specific workflow walkthrough for the primary ICP
  4. The catch / honest take (45–70s): what it doesn't do well, who it's wrong for
  5. CTA (70–90s): "Link in bio / follow for more tools like this"

### Format B: UGC / Peter on camera
- Tone: casual, dry humor, direct — Peter's voice (see "Tone" section below)
- Personal presence — Peter talking to camera
- Structure:
  1. Hook (0–5s): personal story hook or "I found this while..." or "Nobody is talking about..."
  2. Quick demo (5–30s): Peter screen-sharing or showing the tool
  3. My take (30–60s): who Peter would recommend this to (name the ICP), how it fits a real use case
  4. Compare/contrast (60–80s): one competitor or alternative, honest trade-off
  5. CTA + personality (80–100s): call to action, Peter's sign-off style

---

## Peter's Editorial Voice (Applies to All Me2 Content)

- **Casual, dry humor.** Not performative. The kind of thing you say at a whiteboard, not a keynote.
- **Direct.** Lead with the point. Never: "In today's video, we're going to explore..."
- **Opinionated.** Takes a position. "This is the right tool for X. It's wrong for Y."
- **Honest about limitations.** Doesn't oversell. If something is half-baked, say so.
- **Not hype.** No "game-changing", "revolutionary", "you need to see this". Earned enthusiasm only.
- Reference: JPW'26 project style (accessible on TheStudio at S:\CHAOSAiGENT\09_managers_office)

---

## Technical Architecture Notes

### Jekyll Collections
- `_repos/` — existing public catalog (auto-populated by digest workflow)
- `_tools/` — Me2 private library (Peter-submitted, manually enriched)
- Both excluded from public build by default; `_tools/` has a `public: false` frontmatter default

### Submission Mechanism (to be built — see EXTENSIONS.md)
Options in order of preference:
1. GitHub Issue template → Actions workflow parses it, creates `_tools/{slug}.md`
2. Simple web form → Netlify/Vercel function → same result
3. `config/submissions.json` — Peter adds entries manually, workflow processes them

Decision: **GitHub Issue template** is the right call for now. Zero new infrastructure, stays in the existing repo, Peter can submit from mobile via GitHub app.

### Me2 Enrichment Pipeline
```
Peter submits (GitHub Issue) →
  parse-submission.yml extracts URL + metadata →
  capture-screenshots.yml runs Playwright →
  generate-tool-page.yml calls Claude API for scripts/notes →
  commits _tools/{slug}.md + static/screenshots/{slug}/ →
  deploy-blog.yml rebuilds
```

---

## Anti-Drift Rules (Inherited from CHAOS CLAUDE.md)

1. Placeholders, never inventions — use `[TBD-PETER]` for anything Peter hasn't decided
2. Provenance headers on every new file
3. Assumptions flagged inline — `[ASSUMPTION: X]`
4. Stop and ask when unknown — never fill forward
5. No scope additions during execution — goes to backlog
6. Me2 work is a separate track from the public digest — don't mix concerns

---

## What Requires Peter's Input Before Building

| Item | What's Needed | Where Tracked |
|------|--------------|---------------|
| Submission UI | GitHub Issue template vs. form vs. JSON — decision needed | EXTENSIONS.md E-01 |
| Public toggle | How/when Me2 items get published publicly | EXTENSIONS.md E-06 |
| Platform migration | Domain, DNS, hosting choice | postmvp/BACKLOG.md V-02 |
| Email | Resend key, domain, from address | postmvp/BACKLOG.md V-03 |
| Video script tone refinement | Review first generated script, approve or adjust format | EXTENSIONS.md E-04 |
| ICP priority order | Which ICPs to target first in generated content | [TBD-PETER] |

---

## Change Log

| Date | Summary |
|------|---------|
| 2026-03-24 | me2/ folder created. CLAUDE.md, UPGRADES.md, EXTENSIONS.md written. Me2 vision captured from Peter's description. ICP profiles defined. Screenshot approach decided (Playwright). Video script formats A and B defined. |
| 2026-03-28 | E-07, E-08, research system shipped. Both `generate-tool-page.yml` and `research-report.yml` confirmed broken since creation (YAML block scalar bug) — both fixed. |
| 2026-03-29 | LLM cascade implemented across all three workflows. Gemini primary, free fallbacks, Claude last resort. Brave Search replaces Perplexity as primary research search. Pre-flight balance check added to research workflow. Stack updated to 9 data sources (Product Hunt added). Session docs created in `.notes/`. |
