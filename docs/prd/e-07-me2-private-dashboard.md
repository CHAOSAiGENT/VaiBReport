# PRD: Me2 Private Dashboard (Local Only)
**ID:** E-07  
**Status:** Depends on E-02, E-03, E-04, E-05  
**Priority:** Medium  
**Effort:** ~3 hours  
**Last updated:** 2026-04-01

---

## Problem
As `_tools/` grows, Peter has no single view to answer "what's production-ready and what still needs work?" He has to open individual markdown files to check whether screenshots were captured, scripts were generated, use cases exist, and whether he's reviewed and filmed anything. That friction compounds per tool and makes the workflow feel unmanaged.

## Goal
A local-only HTML page (`me2/dashboard.html`) that Peter opens in a browser to see all `_tools/` entries as a management view — status indicators, per-tool checklists, and a clear "ready to film" signal — without deploying anything to GitHub Pages.

## Success Metrics
- Dashboard loads in a browser by opening `me2/dashboard.html` directly (no dev server required for basic use)
- All `_tools/` entries appear in the dashboard; none are missing
- Per-tool checklist accurately reflects the actual state of each field in the frontmatter and file system
- "Ready to film" status is correct for tools that have all required fields populated
- Dashboard renders accurately after running `ruby -e "require 'yaml'; ..."` or equivalent local parsing — no build step required
- Page is excluded from GitHub Pages deployment (not in Jekyll's build path)

## Scope
### In
- Single static HTML file: `me2/dashboard.html`
- Local build script: `me2/build-dashboard.js` (Node.js) — reads all `_tools/*.md` files, parses frontmatter, checks `static/screenshots/{slug}/` for file existence, outputs a self-contained `me2/dashboard.html`
- Per-tool status card showing:
  - Tool name, slug, URL
  - `public` status (badge: Private / Public)
  - `primary_icp` tag
  - `date_added`
  - Per-tool checklist (see below)
  - "Ready to film" indicator (green/red based on checklist completeness)
- Per-tool checklist items:
  1. Screenshots captured (`screenshot_desktop` not empty AND `static/screenshots/{slug}/desktop.png` exists)
  2. Use cases generated (`use_cases` array has >0 entries)
  3. Script A generated (`script_faceless` not empty and not `"GENERATION_FAILED"`)
  4. Script B generated (`script_ugc` not empty and not `"GENERATION_FAILED"`)
  5. Peter reviewed/edited scripts (manual flag — `scripts_reviewed: true` in frontmatter, default false)
  6. Ready to film (all above = true)
  7. Filmed/published (`filmed: true` in frontmatter, default false)
- Summary row at the top: total tools, X ready to film, X filmed, X public
- `me2/` directory added to `_config.yml` `exclude:` list so Jekyll never builds it
- npm script: `"dashboard": "node me2/build-dashboard.js"` in `package.json`

### Out
- Real-time updates — this is a build-on-demand dashboard, not a live-reloading app
- Deployment to GitHub Pages — explicitly local only
- Editing tool frontmatter from the dashboard UI — read-only view; edits happen in the markdown files
- Authentication or access control
- Mobile layout — this is a local tool for Peter's desktop use only

## Technical Spec

**File structure:**
```
me2/
  build-dashboard.js    # Node.js build script
  dashboard.html        # Generated output (gitignored or committed — TBD)
```

**`build-dashboard.js` logic:**
```js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // or hand-roll YAML parsing

const toolsDir = path.resolve(__dirname, '../_tools');
const screenshotsDir = path.resolve(__dirname, '../static/screenshots');

const tools = fs.readdirSync(toolsDir)
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const raw = fs.readFileSync(path.join(toolsDir, f), 'utf8');
    const { data } = matter(raw);
    const slug = path.basename(f, '.md');
    const hasDesktopScreenshot = fs.existsSync(
      path.join(screenshotsDir, slug, 'desktop.png')
    );
    return { slug, ...data, hasDesktopScreenshot };
  });

// Build checklist state per tool
// Generate HTML string
// Write to me2/dashboard.html
```

**Checklist logic:**
```js
function getChecklist(tool) {
  return {
    screenshots: tool.screenshot_desktop && tool.hasDesktopScreenshot,
    use_cases: Array.isArray(tool.use_cases) && tool.use_cases.length > 0,
    script_a: tool.script_faceless && tool.script_faceless !== 'GENERATION_FAILED',
    script_b: tool.script_ugc && tool.script_ugc !== 'GENERATION_FAILED',
    reviewed: tool.scripts_reviewed === true,
    filmed: tool.filmed === true,
  };
}
function isReadyToFilm(checklist) {
  return checklist.screenshots && checklist.use_cases &&
         checklist.script_a && checklist.script_b && checklist.reviewed;
}
```

**HTML output:** Single self-contained file. Inline CSS (Tailwind CDN or minimal hand-written styles). No external JS dependencies at runtime — all data is baked into the HTML at build time as a JS object or rendered as static markup.

**Dependency:** `gray-matter` npm package for YAML frontmatter parsing. Already used in most Jekyll/Node hybrid projects; add to `package.json` devDependencies if not present.

**`_config.yml` exclusion:**
```yaml
exclude:
  - me2/
  - node_modules/
```

**New frontmatter fields added to `_tools/` schema (extend E-02):**
- `scripts_reviewed: false` — Peter sets to `true` after reviewing/editing scripts
- `filmed: false` — Peter sets to `true` after filming

**`.gitignore` consideration:** [TBD-PETER] Should `me2/dashboard.html` be gitignored (purely local output) or committed (so it's always accessible on any machine after a pull)?

## Dependencies
- E-02: `_tools/` collection and frontmatter schema must exist
- E-03: Screenshot file paths must follow `static/screenshots/{slug}/desktop.png` convention for checklist item 1 to work
- E-04: `script_faceless`, `script_ugc`, sentinel value convention must match
- E-05: `use_cases[]` array must be the field name in frontmatter
- `gray-matter` npm package

## Open Questions
- [TBD-PETER] Should `me2/dashboard.html` be committed to the repo or gitignored? Committing means it's always available but adds noise to the git log; gitignoring means Peter must run the build script locally each time.
- [TBD-PETER] Should the dashboard be sortable (e.g., by date_added, by readiness)? Simple JS sort on the baked-in data array is low-effort.
- [TBD-PETER] Add a "copy script to clipboard" button per tool so Peter can paste directly into TikTok/CapCut? That's a small JS addition.
- [ASSUMPTION: `gray-matter` is or can be added to devDependencies] — if the project has no `package.json` yet, this is a forcing function to create one.
- [TBD-PETER] Should the two new frontmatter fields (`scripts_reviewed`, `filmed`) be backfilled into existing `_tools/` files, or only added to new ones going forward?
