# PRD: Private/Public Toggle and Peter's Picks Page
**ID:** E-06  
**Status:** Depends on E-02  
**Priority:** Medium  
**Effort:** ~2 hours  
**Last updated:** 2026-04-01

---

## Problem
Me2 tools sit in `_tools/` but there is currently no mechanism to selectively surface them to the public. Without a toggle and a dedicated page, Peter has no way to curate a "what I actually recommend" view separate from the automated daily digest — which means the consulting and social audience never sees his personal endorsement layer.

## Goal
Peter can flip a single `public: true` field in any `_tools/{slug}.md` file to make that tool appear on `/picks/` — a branded "Peter's Picks" page that is visually and structurally distinct from the automated digest. All other tools remain private and are excluded from the Jekyll build output and search indexing.

## Success Metrics
- Tools with `public: false` produce no output URL in the built Jekyll site
- Tools with `public: true` appear on `/picks/` within the next GitHub Pages build after the field is changed
- `/picks/` page renders correctly with 0, 1, and 20+ public tools
- `_tools/` collection does not appear in Jekyll's default search index (Lunr/Algolia or similar) when `public: false`
- No `_repos/` entries appear on `/picks/` (collections must remain separate)

## Scope
### In
- `_config.yml` update: add `tools` collection with `output: true`
- Jekyll layout: `_layouts/tool.html` — detail page for a single tool (uses frontmatter schema from E-02)
- Jekyll page: `picks.html` (or `picks/index.html`) — lists all `_tools/` entries where `public == true` using `where` filter
- `/picks/` page design: branded header ("Peter's Picks"), card grid or list, each card shows: name, screenshot_desktop (or og_image fallback), one_liner, primary_icp tag, pricing badge, link to detail page
- `public: false` guard in `_layouts/tool.html`: if page is accessed directly and `public == false`, redirect to 404 or show a private placeholder (handles direct URL guessing)
- `sitemap.xml` exclusion: add `sitemap: false` to private tool frontmatter (or handle via `jekyll-sitemap` plugin config)

### Out
- Authentication or password-protection for private tools — Jekyll is static; private means "not built", not "access-controlled"
- Admin UI for toggling public/private — Peter edits the frontmatter directly in GitHub or locally
- Scheduled or automated promotion of tools to public status
- Merging `/picks/` with the automated digest (`_posts/`) — these are intentionally separate surfaces
- Analytics or click-tracking on /picks/ cards (future)

## Technical Spec

**`_config.yml` change:**
```yaml
collections:
  repos:
    output: true
    permalink: /repos/:slug/
  tools:
    output: true
    permalink: /tools/:slug/
```

**`picks.html` core logic:**
```liquid
{% assign public_tools = site.tools | where: "public", true | sort: "date_added" | reverse %}
{% for tool in public_tools %}
  <!-- render card -->
{% endfor %}
{% if public_tools.size == 0 %}
  <p>Nothing here yet — check back soon.</p>
{% endif %}
```

**`_layouts/tool.html` private guard:**
```liquid
{% if page.public == false %}
  <!-- Render a minimal "private" page or redirect -->
  <meta http-equiv="refresh" content="0;url=/404.html">
{% endif %}
```
Note: This only guards against accidental direct navigation — a determined user could still find the URL if they know the slug. True privacy requires not building the file, which Jekyll's `output: true` collection does not natively support per-document. [ASSUMPTION: Not building private tool HTML files requires a custom generator plugin or pre-build script that temporarily removes private entries. Evaluate complexity before deciding approach.]

**Alternative approach (simpler):** Keep `output: false` on the `tools` collection by default; only switch to `output: true` when `public: true`. This requires a Jekyll custom generator. [TBD-PETER] Confirm which approach is acceptable.

**Sitemap exclusion (simpler path):** Add to each private tool's frontmatter: `sitemap: false`. The `jekyll-sitemap` plugin respects this field natively.

**Search exclusion:** If using Lunr-based search, exclude `_tools/` from the search index JSON generation script unless `public == true`.

## Dependencies
- E-02: `_tools/` collection and frontmatter schema must exist before Jekyll config changes make sense
- Jekyll `jekyll-sitemap` plugin (already present in most GitHub Pages setups — confirm in `Gemfile`)

## Open Questions
- [TBD-PETER] Should the `/picks/` page be filterable by ICP tag or category, or is a flat list + card grid sufficient for the initial version?
- [TBD-PETER] Should private tool detail pages not be built at all (requires custom generator), or built but not linked/indexed (simpler but not truly private)?
- [TBD-PETER] Page branding: "Peter's Picks" is the working name — confirm or rename before building templates
- [ASSUMPTION: `jekyll-sitemap` is in the Gemfile] — verify before relying on `sitemap: false` for exclusion
- [TBD-PETER] Should `/picks/` have its own RSS feed separate from the digest feed?
