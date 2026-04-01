# PRD: ICP Tagging in Catalog and Digest
**ID:** U-04  
**Status:** Ready to build  
**Priority:** High  
**Effort:** ~3 hours  
**Last updated:** 2026-04-01

---

## Problem
The catalog has no way to filter by the type of builder a tool is best suited for. A solo founder looking for no-code tools and a technical founding team evaluating infrastructure options both land on the same undifferentiated list. Reader relevance is low; engagement on tool pages is surface-level.

## Goal
Introduce `icp_tags` frontmatter to `_repos/` and `_tools/` entries. Auto-assign tags based on category and source heuristics. Expose ICP filter chips on the `/repos/` page. Power downstream targeting in the Me2 enrichment layer (E-05).

## Success Metrics
- 100% of `_repos/` and `_tools/` entries have at least one `icp_tags` value within one enrichment run
- `/repos/` page has working ICP filter chips that correctly narrow the visible list
- Claude blurb prompt uses ICP context to produce more targeted one-liners
- Zero entries tagged with an ICP value not in the defined enum

## Scope
### In
- `icp_tags` frontmatter field on `_repos/` and `_tools/` entries (array, one or more values)
- Valid ICP enum: `founding-team`, `solopreneur`, `small-business`, `pre-mvp`, `entreprecurious`, `non-technical`
- Auto-assignment heuristics applied during `generate-digest.yml` or a new enrichment step:
  - `ai`, `llm`, `ml` category keywords → `founding-team`, `pre-mvp`, `solopreneur`
  - `ops`, `analytics`, `monitoring` → `founding-team`, `small-business`, `solopreneur`
  - `ugc`, `social`, `community` → `solopreneur`, `entreprecurious`
  - `infrastructure`, `devops`, `security` → `founding-team`, `pre-mvp`
  - `no-code`, `low-code`, `automation` → `non-technical`, `small-business`, `entreprecurious`
- Existing manually set `icp_tags` are never overwritten by the auto-assign step (idempotent)
- ICP filter chips on `/repos/` page (JavaScript or Jekyll-native filtering)
- Claude blurb system prompt extended to include the entry's `icp_tags` for context
- ICP tags rendered as visible badges on individual tool/repo pages

### Out
- Manual ICP assignment UI or admin panel — Peter can edit frontmatter directly
- Per-ICP curated landing pages (future scope)
- ICP-personalized digest emails (future scope)
- Probabilistic confidence scoring on auto-assigned tags

## Technical Spec

### Frontmatter Field
```yaml
icp_tags:
  - founding-team
  - solopreneur
```

### Auto-Assignment Heuristic (Node.js)
```javascript
const ICP_RULES = [
  { keywords: ['ai', 'llm', 'ml', 'gpt', 'embed'], icps: ['founding-team', 'pre-mvp', 'solopreneur'] },
  { keywords: ['ops', 'analytics', 'monitoring', 'dashboard'], icps: ['founding-team', 'small-business', 'solopreneur'] },
  { keywords: ['ugc', 'social', 'community', 'audience'], icps: ['solopreneur', 'entreprecurious'] },
  { keywords: ['infrastructure', 'devops', 'kubernetes', 'docker', 'security'], icps: ['founding-team', 'pre-mvp'] },
  { keywords: ['no-code', 'nocode', 'low-code', 'automation', 'zapier'], icps: ['non-technical', 'small-business', 'entreprecurious'] },
];

function assignIcpTags(entry) {
  if (entry.icp_tags && entry.icp_tags.length > 0) return entry.icp_tags; // never overwrite
  const source = `${entry.category || ''} ${entry.description || ''} ${entry.name || ''}`.toLowerCase();
  const tags = new Set();
  for (const rule of ICP_RULES) {
    if (rule.keywords.some(k => source.includes(k))) {
      rule.icps.forEach(t => tags.add(t));
    }
  }
  return tags.size > 0 ? [...tags] : ['founding-team']; // default fallback
}
```

### ICP Filter Chips — `/repos/` Page
Add to the `/repos/index.html` or equivalent layout:

```html
<div class="icp-filters">
  <button class="filter-chip active" data-icp="all">All</button>
  <button class="filter-chip" data-icp="founding-team">Founding Team</button>
  <button class="filter-chip" data-icp="solopreneur">Solopreneur</button>
  <button class="filter-chip" data-icp="small-business">Small Business</button>
  <button class="filter-chip" data-icp="pre-mvp">Pre-MVP</button>
  <button class="filter-chip" data-icp="entreprecurious">Entreprecurious</button>
  <button class="filter-chip" data-icp="non-technical">Non-Technical</button>
</div>
```

Each repo card gets `data-icps="{{ page.icp_tags | join: ',' }}"`. A small inline script (~20 lines) shows/hides cards on chip click.

### Claude Blurb Prompt Extension
Add to the user prompt passed to `generateEditorialBlurbs()`:
```
ICP context for this tool: {icp_tags.join(', ')}. Angle the blurb toward these personas.
```

### Badge Rendering
On tool/repo pages, render ICP tags as small badges in the sidebar or below the description:
```liquid
{% for tag in page.icp_tags %}
  <span class="icp-badge icp-{{ tag }}">{{ tag }}</span>
{% endfor %}
```

## Dependencies
- U-01 (Claude blurbs) should be built first so the ICP prompt extension goes into the Claude call, not a Gemini call — but U-04 can ship independently if U-01 is delayed
- E-05 (Me2 content targeting) depends on `icp_tags` being populated — U-04 is a prereq for E-05

## Open Questions
- Should heuristic matching run against `category` field only, or also `description` and `name`? Broader matching catches more but risks false positives.
- Should a tool with no keyword matches default to `founding-team` only, or get all ICPs as a catch-all?
- Should ICP filter chips use Jekyll-native data (Liquid loops + JavaScript) or a prebuilt JSON endpoint (`/repos.json`) for client-side filtering?
- Should the `/tools/` catalog page also get ICP filter chips, or only `/repos/`?
