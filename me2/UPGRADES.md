# VaiBReport Me2 — Upgrades

**Scope:** Improvements to the EXISTING public platform (digest, catalog, leaderboard).
**Companion:** `me2/EXTENSIONS.md` covers the new private UGC layer.
**Last updated:** 2026-03-24

Upgrades enhance what's already live. Nothing here requires new infrastructure.
Items are ordered by impact-to-effort ratio.

---

## U-01 — Switch editorial blurbs from Gemini to Claude

**Status:** Ready to build — no prereqs needed
**Priority:** High
**Effort:** ~1 hour

**What:** `generate-digest.yml` currently calls Gemini for editorial one-liners. Switch to Claude Sonnet (via `ANTHROPIC_API_KEY` already stored as a GitHub secret per V2-PREREQUISITES.md).

**Why:** Peter approved Claude Sonnet for this in the V2 prereqs session. Consistency with the rest of the CHAOSAiGENT stack. Gemini was a placeholder.

**Voice target:** Casual dry humor, opinionated solo-founder voice. Not hype. Direct. (See CLAUDE.md "Peter's Editorial Voice" section.)

**Model to use:** `claude-sonnet-4-6` (or latest available — check at build time)

**Implementation:**
- In `generate-digest.yml`, replace the `generateEditorialBlurbs()` function's Gemini fetch with an Anthropic API call
- Same fallback logic (if API fails, use template blurb)
- Update the prompt to include audience context (solo founders, AI builders, small business) and voice guidance
- Estimated tokens per digest: ~2000 in + ~500 out. Cost: <$0.01/day

**Prompt template:**
```
You write short, opinionated tool descriptions for solo founders, AI builders, and small business owners.
Voice: casual, dry humor, direct. No hype words. Honest about limitations.
For each repo below, write ONE sentence (max 20 words) that tells the reader exactly what it does and who it's for.
Return JSON: {"owner/repo": "one sentence", ...}

Repos:
{list}
```

---

## U-02 — README media extraction for existing catalog cards

**Status:** Ready to build — no prereqs needed
**Priority:** High
**Effort:** ~3 hours

**What:** For repos already in `_repos/`, fetch the GitHub README and extract the first non-badge image/GIF as a hero preview. Store the URL in the frontmatter as `readme_image`.

**Why:** OG images (current) are generic. README media shows the actual product. ~30–40% of repos will have something useful. Free, no screenshot service needed.

**Implementation:**
- Add a step to `generate-digest.yml` (or a new `enrich-repos.yml` that runs weekly)
- For each newly featured repo: `GET /repos/{owner}/{repo}/readme` → decode base64 → parse markdown → extract first non-badge image URL
- Badge filter: skip shields.io, img.shields.io, badge.fury.io, github.com/workflows, actions/workflows
- Store in repo frontmatter: `readme_image: "https://..."`
- Card template falls back: `readme_image` → `og_image` → owner avatar

**Badge filter regex (reuse from V2-SCREENSHOTS-RESEARCH.md):**
```javascript
const BADGE_PATTERNS = [
  /shields\.io/,/img\.shields\.io/,
  /badge\.fury\.io/,
  /github\.com\/.*\/workflows\//,
  /actions\/workflows/,
  /travis-ci/,
  /circleci/,
  /codecov/,
  /snyk\.io/
];
```

---

## U-03 — Playwright screenshots for public catalog

**Status:** Ready to build — no prereqs needed
**Priority:** Medium
**Effort:** ~4 hours

**What:** Add `capture-screenshots.yml` GitHub Action that runs Playwright against the `item_url` of each new repo and saves desktop (1280×800) + mobile (390×844) screenshots.

**Why:** Live screenshots show the actual product/homepage, not just a generic OG card. Dramatically improves catalog visual quality.

**Implementation:**
```yaml
- name: Install Playwright
  run: npx playwright install chromium --with-deps

- name: Capture screenshots
  run: |
    node --input-type=module << 'SCRIPT'
    import { chromium } from 'playwright';
    // For each new repo in _repos/ without a screenshot:
    // browser.newPage() → goto(item_url) → waitForLoadState('networkidle')
    // → screenshot({ path: `static/screenshots/${slug}-desktop.png`, fullPage: false })
    // → setViewportSize({width: 390, height: 844}) → screenshot(mobile)
    SCRIPT
```

**Error handling:** Many repos link to GitHub (not a live product). In that case, the OG image is already good. Only attempt screenshot for repos where `item_url` is NOT a github.com URL.

**Storage:** `static/screenshots/{slug}-desktop.png` and `-mobile.png`
Committed back to repo. Migrate to R2/S3 during platform migration.

**Trigger:** Weekly batch (Sunday 6am UTC) + on-demand `workflow_dispatch`.

**Frontmatter field added:** `screenshot: "static/screenshots/{slug}-desktop.png"`

---

## U-04 — ICP tagging in catalog and digest

**Status:** Ready to build — no prereqs needed
**Priority:** Medium
**Effort:** ~2 hours

**What:** Add ICP relevance tags to each catalog item. The digest generator and Claude blurb call already know the section/category — extend that to map to which ICP personas would care most.

**Why:** Makes the catalog filterable by audience. Makes blurbs more targeted. Powers the Me2 content targeting (EXTENSIONS.md E-05).

**ICP tag values:** `founding-team`, `solopreneur`, `small-business`, `pre-mvp`, `entreprecurious`, `non-technical`

**Implementation:**
- Add `icp_tags` field to `_repos/` and `_tools/` frontmatter
- Auto-assign based on category + source in the digest generator (rough heuristic):
  - AI/LLM tools → `founding-team`, `pre-mvp`, `solopreneur`
  - Ops/analytics → `founding-team`, `small-business`, `solopreneur`
  - UGC/Social → `solopreneur`, `entreprecurious`
  - Infrastructure/DevOps → `founding-team`, `pre-mvp`
  - No-code/low-code → `non-technical`, `small-business`, `entreprecurious`
- Claude blurb prompt updated to include the ICP context
- Filter chips on `/repos/` page extended to include ICP filters

---

## U-05 — RSS feed promotion

**Status:** Ready to build — no prereqs needed
**Priority:** Low
**Effort:** 30 minutes

**What:** The `minima` theme includes `jekyll-feed` which already generates `feed.xml`. Verify it works and add an RSS icon to the site header.

**Why:** RSS readers are still a primary consumption method for this exact audience (developers, builders). Some digest aggregators require RSS.

**Implementation:**
- Check `https://chaosaigent.github.io/VaiBReport/feed.xml` loads
- Add `<link rel="alternate" type="application/rss+xml" href="/VaiBReport/feed.xml">` to `_layouts/` if not already present
- Add RSS icon link to navigation (`_config.yml` `header_pages` doesn't support this directly — needs a layout override or `_includes/header.html` partial)

---

## U-06 — Product Hunt data source

**Status:** Blocked on PH API key
**Priority:** Medium
**Effort:** ~2 hours once unblocked

**What:** Add Product Hunt to the fetch pipeline as a 9th data source.

**Prereq:** Register an OAuth application at producthunt.com/v2/oauth/applications. Get client ID + secret. Add as GitHub secrets `PH_CLIENT_ID` and `PH_CLIENT_SECRET`.

**Implementation:**
- New `fetch-producthunt.yml` (or add to `fetch-launches.yml`)
- Product Hunt GraphQL API endpoint: `https://api.producthunt.com/v2/api/graphql`
- Query: today's top posts, filter to categories: Developer Tools, Artificial Intelligence, SaaS, Productivity
- Quality filter: min 50 upvotes (reduces pure-marketing launches)
- Dedup: `data/seen-producthunt.json`
- Tag: `_source: "producthunt"`

---

## U-07 — Custom domain (Phase 1 platform migration)

**Status:** Blocked on Peter's decision
**Priority:** Low — can proceed without it
**Effort:** ~1 hour once domain is chosen

**What:** Point a custom domain at the GitHub Pages site. Keeps Jekyll, adds branding.

**Prereq from Peter:**
- Domain name (new purchase or subdomain of existing property?)
- DNS provider access

**Implementation:**
- Add `CNAME` file to repo root with the domain
- Add `custom_domain` to `_config.yml`
- DNS: CNAME record pointing to `chaosaigent.github.io`
- GitHub repo settings → Pages → Custom domain
- Enable HTTPS (GitHub handles cert via Let's Encrypt)

---

## Priority Order

| # | Upgrade | Effort | Prereqs |
|---|---------|--------|---------|
| U-01 | Claude blurbs | 1h | None — do this next |
| U-02 | README media extraction | 3h | None |
| U-03 | Playwright screenshots | 4h | None |
| U-04 | ICP tagging | 2h | None |
| U-05 | RSS promotion | 30m | None |
| U-06 | Product Hunt | 2h | PH API key |
| U-07 | Custom domain | 1h | Peter: domain decision |
