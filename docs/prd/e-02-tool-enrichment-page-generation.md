# PRD: Tool Enrichment — Full Detail Page Generation
**ID:** E-02  
**Status:** Ready to build  
**Priority:** Critical  
**Effort:** ~4 hours  
**Last updated:** 2026-04-01

---

## Problem
When Peter submits a tool via GitHub Issue (E-01), nothing happens downstream — there is no automated step that creates a structured file for that tool in the Me2 layer. Without a persisted, schema-conformant file, no subsequent enrichment (screenshots, scripts, use cases) has anywhere to write its output.

## Goal
After `parse-submission.yml` completes, a workflow automatically creates `_tools/{slug}.md` with the full Me2 frontmatter schema pre-populated from the submission data, sensible defaults, and placeholder fields for AI-generated content that downstream workflows will fill in.

## Success Metrics
- Every completed `parse-submission.yml` run produces exactly one `_tools/{slug}.md` file within 60 seconds
- File passes Jekyll front matter validation with no missing required keys
- Downstream workflows (E-03, E-04, E-05) can read and write to the file without schema errors
- No duplicate files created on re-submission of the same slug

## Scope
### In
- New `generate-tool-page.yml` workflow triggered by `parse-submission.yml` completing (via `workflow_run` event)
- Reads parsed submission data (name, url, category, submitted_by, etc.) from the triggering workflow's output or artifact
- Generates `slug` from tool name (lowercase, hyphens, strip special chars)
- Creates `_tools/{slug}.md` with full frontmatter schema (see Technical Spec)
- Sets `public: false` by default
- Sets `date_added` to current date (ISO 8601)
- Commits the new file to the repo with a standardized commit message
- Idempotency check: skip file creation if `_tools/{slug}.md` already exists; add a warning annotation instead

### Out
- AI content generation (scripts, use cases) — handled by E-04 and E-05
- Screenshot capture — handled by E-03
- Setting `public: true` — manual action by Peter; see E-06
- Any Jekyll rendering or build validation — that runs on the normal Pages build
- Editing or updating an existing tool page (re-submission flow is a future concern)

## Technical Spec

**Workflow file:** `.github/workflows/generate-tool-page.yml`

**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Parse Me2 Submission"]
    types: [completed]
```

**Steps:**
1. Checkout repo
2. Download artifact from triggering workflow run containing parsed JSON (name, url, category, language, license, pricing, github_url, demo_url, docs_url, submitted_by, primary_icp, icp_tags)
3. Run Node.js inline script to:
   - Generate slug: `name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')`
   - Check if `_tools/{slug}.md` already exists; if yes, exit with warning
   - Build frontmatter object with all schema fields
   - Write `_tools/{slug}.md`
4. `git add`, `git commit -m "feat(me2): add tool page for {slug} [skip ci]"`, `git push`

**Full frontmatter schema:**
```yaml
---
layout: tool
name: ""
url: ""
source: me2
submitted_by: ""
public: false
category: ""
language: ""
license: ""
pricing: ""
github_url: ""
demo_url: ""
docs_url: ""
screenshot_desktop: ""
screenshot_mobile: ""
readme_image: ""
og_image: ""
primary_icp: ""
icp_tags: []
hook: ""
one_liner: ""
why_interesting: ""
use_cases: []
compare_to: []
honest_take: ""
script_faceless: ""
script_ugc: ""
times_featured: 0
date_added: ""
---
```

**Commit strategy:** Uses `[skip ci]` tag to avoid triggering an unnecessary Pages rebuild on raw skeleton files.

**Artifact contract:** `parse-submission.yml` must upload a JSON artifact named `parsed-submission` containing a flat object with the fields listed in Step 3. [ASSUMPTION: parse-submission.yml already outputs this artifact — confirm before building E-02]

## Dependencies
- E-01: GitHub Issue submission template must be live and `parse-submission.yml` must be producing a consumable artifact

## Open Questions
- [TBD-PETER] Should re-submission of an existing slug overwrite the file, skip silently, or open a new PR with a diff?
- [ASSUMPTION: parse-submission.yml passes a JSON artifact] — verify artifact name and schema before wiring the `workflow_run` trigger
- [TBD-PETER] Should `[skip ci]` be used here, or is a lightweight build acceptable on each submission?
