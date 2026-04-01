# PRD: Playwright Screenshot Capture for Me2 Tools
**ID:** E-03  
**Status:** Depends on E-02  
**Priority:** High  
**Effort:** ~3 hours  
**Last updated:** 2026-04-01

---

## Problem
Me2 tool pages have frontmatter fields for `screenshot_desktop`, `screenshot_mobile`, and `og_image`, but no automated process populates them. Without real screenshots, the detail page and Peter's Picks (/picks/) are visually bare, reducing the credibility and scan-ability of the content Peter publishes for consulting and social audiences.

## Goal
After a `_tools/{slug}.md` file is created (E-02), a separate workflow automatically visits the tool's product homepage using Playwright, captures three screenshot variants, commits them to the repo, and updates the corresponding frontmatter fields in the tool file — all without requiring any manual action from Peter.

## Success Metrics
- Screenshots are committed to `static/screenshots/{slug}/` within 3 minutes of `generate-tool-page.yml` completing
- Desktop and mobile captures render actual product UI (not a blank/error page) for at least 80% of submitted tools
- Fallback to OG image fires correctly on login-walled, 403, and 404 URLs — zero workflow failures from unresolvable URLs
- Frontmatter fields `screenshot_desktop`, `screenshot_mobile` are populated with correct relative paths after the workflow runs

## Scope
### In
- New `capture-tool-screenshots.yml` workflow, triggered by `generate-tool-page.yml` completing (`workflow_run`)
- Targets `demo_url` if present; falls back to `url` (product homepage); explicitly does NOT use `github_url`
- Three capture variants:
  - `desktop.png` — 1280×800 viewport, visible area only
  - `mobile.png` — 390×844 viewport (iPhone 14 equivalent), visible area only
  - `desktop-full.png` — 1280×800, full-page scroll capture
- Cookie banner handling: detect and click common Accept/Allow/Got it selectors before capturing
- `waitForLoadState('networkidle')` with 15s timeout before each capture
- Fallback on error (403, 404, navigation timeout, login redirect detection): fetch OG image from `<meta property="og:image">` and save as `og_image.png`; set `og_image` frontmatter field
- Output stored in `static/screenshots/{slug}/`
- Updates `_tools/{slug}.md` frontmatter fields: `screenshot_desktop`, `screenshot_mobile`, `readme_image` (desktop-full), `og_image` (fallback only)
- Commits with `[skip ci]`

### Out
- Scheduled re-capture of existing screenshots (future maintenance feature)
- Video recording or GIF capture
- Authentication flows (tools requiring login to see the product — fallback handles these)
- Image optimization/compression pipeline (can be added later)
- Capturing GitHub repository pages (those are for `_repos/`, not `_tools/`)

## Technical Spec

**Workflow file:** `.github/workflows/capture-tool-screenshots.yml`

**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Generate Tool Page"]
    types: [completed]
```

**Runner:** `ubuntu-latest` with Node.js

**Key dependencies:**
```json
"playwright": "^1.x",
"@playwright/test": "^1.x"
```
Install browsers step: `npx playwright install chromium --with-deps`

**Inline Node.js script logic:**
```js
// 1. Read slug and target URL from artifact (passed from generate-tool-page.yml)
// 2. Launch Chromium (headless)
// 3. Desktop capture
const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await desktop.newPage();
await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 15000 });
await handleCookieBanner(page); // click Accept if found
await page.screenshot({ path: `static/screenshots/${slug}/desktop.png`, fullPage: false });
await page.screenshot({ path: `static/screenshots/${slug}/desktop-full.png`, fullPage: true });

// 4. Mobile capture
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
// ... same pattern

// 5. Error/fallback handler
// Catches: page.goto throws, response.status() 403/404,
//          final URL contains 'login'/'signin'/'auth'
// Fallback: page.goto(targetUrl), extract og:image meta, download and save as og_image.png
```

**Cookie banner selector list (try in order):**
```
button[id*="accept"], button[class*="accept"],
button[id*="cookie"], button[class*="cookie"],
[aria-label*="Accept"], [aria-label*="Got it"],
#onetrust-accept-btn-handler, .cc-accept
```

**Frontmatter update:** Node.js reads the existing `_tools/{slug}.md`, uses a simple regex/yaml parser to update only the four screenshot fields, rewrites the file.

**Commit message:** `chore(me2): add screenshots for {slug} [skip ci]`

**Artifact consumed:** Same artifact from `parse-submission.yml` (slug + urls), or re-read directly from the committed `_tools/{slug}.md` file.

## Dependencies
- E-02: `_tools/{slug}.md` must exist with `demo_url`/`url` populated before this workflow can run
- GitHub Actions runner must support Playwright/Chromium (ubuntu-latest does with `--with-deps`)

## Open Questions
- [TBD-PETER] Should `desktop-full.png` be used as `readme_image` or stored separately? Full-page captures can be very long for marketing-heavy sites.
- [ASSUMPTION: networkidle + 15s is sufficient] — some SPAs may need a longer wait or a specific `waitForSelector`. Monitor first 10 submissions and tune if needed.
- [TBD-PETER] Max file size cap? Large full-page screenshots can exceed 5MB — should the workflow compress with `sharp` before committing?
- [TBD-PETER] What happens if `demo_url` and `url` are both the GitHub URL? Should the workflow skip desktop-full in that case and go straight to OG fallback?
