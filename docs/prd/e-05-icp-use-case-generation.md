# PRD: ICP-Specific Use Case Generation via Claude API
**ID:** E-05  
**Status:** Depends on E-02  
**Priority:** High  
**Effort:** ~2 hours  
**Last updated:** 2026-04-01

---

## Problem
Me2 tool pages have a `use_cases[]` array in their schema, but without automated generation it stays empty. Empty use cases means the detail page has no ICP-specific positioning, filter chips on /picks/ have nothing to power them, and Peter has no ready-made angle for targeting specific consulting audiences with each tool.

## Goal
As part of `generate-tool-page.yml` (E-02), Claude API generates 2–4 ICP-specific use case objects per tool and writes them into the `use_cases[]` frontmatter array. Each use case pairs a persona tag with a concrete scenario, measurable outcome, and adoption effort rating — giving the detail page and future ICP-targeted content a factual, usable foundation.

## Success Metrics
- `use_cases[]` is populated with 2–4 objects for every tool generated via E-02
- Each use case contains all four fields (`icp`, `scenario`, `outcome`, `effort`) with no empty values
- ICPs represented span at least 2 distinct personas per tool (not all the same tag)
- Output parses as valid YAML without manual cleanup in >95% of runs
- At least one use case targets `primary_icp` for every tool

## Scope
### In
- Use case generation added as steps inside `generate-tool-page.yml`, after skeleton file creation (runs alongside E-04 or immediately after)
- Input context passed to Claude: name, url, one_liner, category, pricing, primary_icp, icp_tags[]
- Claude generates a JSON array of 2–4 use case objects
- Each object must contain:
  - `icp`: one of the 6 canonical persona tags (`founding-team`, `solopreneur`, `small-business`, `pre-mvp`, `entreprecurious`, `non-technical`)
  - `scenario`: one sentence — a specific situation the persona is in, not a generic description of the tool
  - `outcome`: one sentence — what the persona gets or achieves
  - `effort`: `low`, `medium`, or `high` — how hard adoption is for a non-technical person
- Uses same LLM cascade as E-04 (`llm-cascade.js` shared module)
- Output serialized as YAML list under `use_cases:` in frontmatter
- Sentinel value `use_cases: []` written on total cascade failure (same pattern as E-04)

### Out
- Rendering use cases as filter chips or cards on the public site — that is a Jekyll template concern, not this workflow
- Generating use cases for `_repos/` (public catalog) — Me2 only
- More than 6 use cases per tool (keep prompts tight; quality over quantity)
- User-editable use case UI — Peter edits directly in the markdown file

## Technical Spec

**Where it lives:** Inline Node.js steps in `generate-tool-page.yml`, sharing `llm-cascade.js` with E-04

**Prompt:**
```
You are writing ICP-specific use cases for a developer/ops tool called "{name}".
Category: {category}. Pricing: {pricing}. Primary audience: {primary_icp}.

The 6 possible ICP tags are:
- founding-team: 2–5 person startups, move fast, limited bandwidth
- solopreneur: one person, extremely cost-sensitive, time is everything
- small-business: main street + services, not always tech-native
- pre-mvp: evaluating stacks before building
- entreprecurious: employed, curious, low urgency
- non-technical: decision-makers, investors, ops/marketing

Generate 2–4 use case objects as a JSON array. Rules:
1. Always include one use case for "{primary_icp}".
2. Cover at least 2 different ICP tags total.
3. Each scenario must name a specific situation (not just "they can use this tool").
4. effort must be "low", "medium", or "high" based on how hard it is for a non-technical person.

Return ONLY a valid JSON array, no prose, no markdown fences:
[
  {
    "icp": "founding-team",
    "scenario": "...",
    "outcome": "...",
    "effort": "low"
  }
]
```

**Parsing and serialization:**
```js
const useCases = JSON.parse(llmResponse); // validate it's an array
// Convert to YAML list for frontmatter:
// use_cases:
//   - icp: founding-team
//     scenario: "..."
//     outcome: "..."
//     effort: low
```

JSON is requested (not YAML) from the LLM because JSON is easier to validate programmatically. The script converts to YAML for frontmatter.

**Validation guard:** If `JSON.parse()` fails or the array is empty, retry the cascade once with a stricter prompt before writing the sentinel. Do not silently write malformed YAML.

**ICP tag allowlist enforcement:** After parsing, any `icp` value not in the canonical list of 6 is replaced with `primary_icp` with a console warning.

## Dependencies
- E-02: `generate-tool-page.yml` must be the host workflow
- E-04: LLM cascade module (`llm-cascade.js`) — E-04 and E-05 should share this, so build or stub it in E-04 first
- GitHub Actions secrets for all cascade API keys (same set as E-04)

## Open Questions
- [TBD-PETER] Should use cases be regenerated if Peter edits `primary_icp` or `icp_tags` after submission? Or is first-generation final?
- [TBD-PETER] Is 2–4 use cases the right range? Could go up to 6 (one per ICP) if Peter wants full coverage per tool — but that may dilute quality.
- [ASSUMPTION: JSON output from LLM is reliable enough with a single retry] — if parse failures are frequent in practice, consider adding a structured output / function-calling approach for the Claude fallback specifically.
- [TBD-PETER] Should `effort` ratings be reviewed/overridden by Peter before a tool goes public? Add to E-07 dashboard checklist if so.
