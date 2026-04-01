# PRD: Consulting Context Layer
**ID:** E-08  
**Status:** Ideas phase  
**Priority:** Medium  
**Effort:** ~4 hours (implementation) + Peter review time  
**Last updated:** 2026-04-01

---

## Problem
Peter has no structured place to record client-facing intelligence about tools in the catalog — how to pitch them, what to warn clients about, pricing gotchas, and whether a given tool is ready to recommend. This knowledge lives in his head and is lost between client engagements.

## Goal
Add a `consulting_notes` structured block to each `_tools/` entry so Peter can build a private knowledge base of positioning and advisory context, usable when preparing client recommendations. Claude can draft initial content from existing tool metadata; Peter refines it.

## Success Metrics
- At least 20 `_tools/` entries have `consulting_notes` populated within 30 days of launch
- Peter can locate red-flag and pitch info for any tool in under 30 seconds
- Zero `consulting_notes` fields appear on any public-facing page or feed

## Scope
### In
- New `consulting_notes` frontmatter block on `_tools/` entries with the following fields:
  - `pitch` — one- or two-sentence positioning for client conversations
  - `red_flags` — conditions under which Peter would not recommend this tool
  - `integration_notes` — known compatible and conflicting tools/systems
  - `pricing_reality` — honest assessment of free tier limitations and true cost at scale
  - `client_readiness` — enum: `low` / `medium` / `high`
- Claude-assisted drafting workflow: a local script or manual prompt that reads tool metadata and produces a draft `consulting_notes` block for Peter to review and commit
- Jekyll `_layouts/` and `_includes/` changes to suppress `consulting_notes` from all public output (it must never render on the site or appear in `feed.xml`)

### Out
- No public UI for any `consulting_notes` field — this is strictly private frontmatter
- No automated population via GitHub Actions cron — Peter triggers drafting manually
- No client-portal or export feature (future scope)
- No versioning or change history for notes (git history is sufficient)

## Technical Spec

### Frontmatter Schema
Add the following block to `_tools/{slug}.md` files:

```yaml
consulting_notes:
  pitch: ""
  red_flags: ""
  integration_notes: ""
  pricing_reality: ""
  client_readiness: low  # low | medium | high
```

### Draft Generation
- A local Node.js or shell script (`scripts/draft-consulting-notes.js`) reads a `_tools/` file, extracts `name`, `description`, `category`, `pricing`, `item_url`, and passes them to Claude Sonnet 4.6 via the Anthropic API
- Claude returns a JSON object matching the schema above
- Script writes the block into the file's frontmatter (using `gray-matter` or equivalent)
- Peter reviews the diff and commits what is accurate

### Jekyll Suppression
- Add a guard in any layout that renders tool frontmatter: `{% unless page.consulting_notes %}` or explicitly list rendered fields
- Add a Liquid filter or `_config.yml` exclusion to ensure `consulting_notes` is stripped from `feed.xml` and any JSON output files
- Add a CI check (or pre-commit hook note) to grep for `consulting_notes` appearing in `_site/` output

### Validation
- `client_readiness` should only accept `low`, `medium`, or `high` — document this constraint; optionally add a lint step

## Dependencies
- `ANTHROPIC_API_KEY` available locally (not needed in CI since this is a local workflow)
- `gray-matter` npm package (already likely present given Jekyll workflow scripts)
- Peter's time to review and refine Claude-drafted content

## Open Questions
- [TBD-PETER] What additional fields beyond the five listed would be useful? Candidates: `use_case_fit` (free-text), `competing_tools` (list), `last_reviewed_date`, `client_names_used_with` (very private — consider separate file)
- [TBD-PETER] Should `client_readiness` be a scale (1–5) rather than three-value enum for more nuance?
- [TBD-PETER] Is a single `consulting_notes` block per tool sufficient, or do some tools need per-ICP notes?
- [TBD-PETER] Should the draft script run against all un-noted tools in bulk, or one at a time interactively?
- How should the CI guard be implemented — a GitHub Actions step that fails if `consulting_notes` leaks into `_site/`, or a pre-push hook?
