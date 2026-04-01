# PRD: Playwright Screenshots for Public Catalog
**ID:** U-03  
**Status:** Ready to build  
**Priority:** Medium  
**Effort:** ~4 hours  
**Last updated:** 2026-04-01

---

## Problem
Catalog cards for non-GitHub tools (`item_url` pointing to external sites) have no visual preview. Owner avatars are generic; OG images are often absent or low quality. Without a real screenshot, catalog cards for SaaS tools look blank compared to repo cards that at least show a README image. This reduces catalog browsability and perceived quality.

## Goal
A new GitHub Actions workflow captures desktop and mobile Playwright screenshots for each new catalog entry that has an external `item_url`, stores them in the repo under `static/screenshots/`, and writes the path to frontmatter. Cards immediately look real and usable.

## Success Metrics
- 90%+ of non-GitHub `item_url` entries added in the past 30 days have a screenshot within one weekly run
- Zero workflow failures that block the weekly screenshot run (failures on individual URLs should be caught and skipped)
- Desktop screenshots render correctly in catalog cards at standard card widths
- Total workflow runtime stays under 15 minutes for up to 100 new URLs

## Scope
### In
- New workflow file: `.github/workflows/capture-screenshots.yml`
- Runs Playwright with Chromium (no Firefox/WebKit needed for MVP)
- Captures desktop viewport: 1280×800, above-the-fold only (full-page scroll not required)
- Captures mobile viewport: 390×844 (iPhone 14 equivalent)
- Skips any `item_url` that contains `github.com` — OG image is sufficient for those
- Skips entries where `screenshot` frontmatter is already set (idempotent)
- Saves screenshots to `static/screenshots/{slug}-desktop.png` and `static/screenshots/{slug}-mobile.png`
- Writes `screenshot: "static/screenshots/{slug}-desktop.png"` to the frontmatter of the corresponding `_repos/` or `_tools/` file
- Commits screenshots and updated frontmatter back to the repo
- Trigger: weekly cron `0 6 * * 0` (Sunday 6am UTC) + `workflow_dispatch` for manual runs
- On per-URL failure (timeout, navigation error, non-2xx): log warning, write `screenshot_error: true` to frontmatter, continue to next URL

### Out
- Full-page scrolling screenshots (above-the-fold only for MVP)
- Firefox or WebKit capture
- Cloud storage (R2/S3) — screenshots stored in repo for now; migrate during platform migration
- Video capture or animated GIF of page interactions
- Screenshot diffing or change detection
- Scheduled re-capture of already-screenshotted entries (manual `workflow_dispatch` only)

## Technical Spec

### Workflow File
`.github/workflows/capture-screenshots.yml`

```yaml
name: Capture Screenshots
on:
  schedule:
    - cron: '0 6 * * 0'
  workflow_dispatch:

jobs:
  capture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install playwright gray-matter
      - run: npx playwright install chromium --with-deps
      - run: node scripts/capture-screenshots.js
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: screenshot-errors
          path: logs/
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add static/screenshots/ _repos/ _tools/
          git diff --staged --quiet || git commit -m "Add screenshots [skip ci]"
          git push
```

### Capture Script
`scripts/capture-screenshots.js`:
1. Glob all `_repos/*.md` and `_tools/*.md` files
2. For each file, parse frontmatter with `gray-matter`
3. Skip if `screenshot` is already set or `item_url` contains `github.com`
4. Launch Chromium with Playwright, navigate to `item_url` with 15-second timeout
5. Wait for `networkidle` or `load` event, then screenshot
6. Save desktop (1280×800) and mobile (390×844) PNGs to `static/screenshots/`
7. Update frontmatter with `screenshot` path
8. On error: log to `logs/screenshot-errors.json`, set `screenshot_error: true` in frontmatter

### Frontmatter Fields Added
```yaml
screenshot: "static/screenshots/{slug}-desktop.png"
screenshot_mobile: "static/screenshots/{slug}-mobile.png"
screenshot_captured: "2026-04-06"   # ISO date of capture
# On failure only:
screenshot_error: true
```

### Card Template Integration
```liquid
{% if page.screenshot %}
  <img src="{{ page.screenshot | relative_url }}" alt="{{ page.name }} screenshot" loading="lazy">
{% elsif page.readme_image %}
  <img src="{{ page.readme_image }}" alt="{{ page.name }} preview" loading="lazy">
{% elsif page.og_image %}
  <img src="{{ page.og_image }}" alt="{{ page.name }}" loading="lazy">
{% else %}
  <img src="{{ page.owner_avatar }}" alt="{{ page.name }}" loading="lazy">
{% endif %}
```

### Storage Note
Screenshots are committed into `static/screenshots/` in the repo. GitHub Pages serves them as static assets. At ~50KB per PNG average and 200 tools, this is ~10MB — acceptable for now. Plan to migrate to R2/S3 during platform migration.

## Dependencies
- `GITHUB_TOKEN` with write permissions (default Actions token is sufficient for pushing back to the same repo)
- Playwright `chromium` install on ubuntu-latest runner (~300MB download, cached after first run)
- `gray-matter` npm package

## Open Questions
- Should mobile screenshots be captured in the MVP or deferred to reduce runtime?
- What is the retry strategy for transient failures (e.g., a tool site that was temporarily down on Sunday)?
- Should screenshots be compressed (e.g., via `sharp` to convert PNG to WebP) to reduce repo size?
- At what catalog size should the migration to R2/S3 be triggered — 500 screenshots? 1000?
