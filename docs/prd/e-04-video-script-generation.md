# PRD: Video Script Generation via Claude API
**ID:** E-04  
**Status:** Depends on E-02  
**Priority:** High  
**Effort:** ~3 hours  
**Last updated:** 2026-04-01

---

## Problem
Peter needs ready-to-film video scripts for each tool he adds to Me2, but writing them manually for every tool is the exact time sink that makes consistent TikTok/Reels/Shorts output unsustainable. Without automated script generation, the video content side of Me2 never scales beyond occasional one-offs.

## Goal
As part of `generate-tool-page.yml` (E-02), Claude API generates both a faceless narration script (Format A) and a Peter-on-camera UGC script (Format B) for each submitted tool. Scripts are written into `script_faceless` and `script_ugc` frontmatter fields so Peter can review, edit, and film directly from the tool detail page.

## Success Metrics
- Both script fields populated in `_tools/{slug}.md` within the same run as E-02 page generation (no extra trigger needed)
- Script A consistently hits 60–90s read length (≈140–200 words at average narration pace)
- Script B consistently hits 80–120s (≈175–260 words), with action cues in [brackets] clearly separated from spoken lines
- Claude API call succeeds on first attempt for >90% of submissions; LLM cascade fallback fires for remainder with no workflow failure
- Scripts are parseable YAML multi-line strings (no broken frontmatter)

## Scope
### In
- Script generation added as steps inside `generate-tool-page.yml`, executing after the skeleton file is written
- Two API calls to Claude (one per format), or one combined call with both formats in the response
- Input context passed to Claude: name, url, one_liner (if already known), why_interesting, primary_icp, category, pricing, compare_to[]
- LLM cascade: Gemini Flash free tier → Gemini Pro free tier → OpenRouter → Groq → Claude Sonnet 4.6 (paid fallback)
- Output written to `script_faceless` and `script_ugc` YAML fields using `|` block scalar (multiline-safe)
- Final commit includes scripts alongside the rest of the generated content

### Out
- Rendering scripts in the public Jekyll site — scripts are in frontmatter, not templated for public view (see E-06/E-07)
- Teleprompter or timing overlay tooling
- Audio generation or text-to-speech
- Script versioning or A/B variants (Peter edits in-file; future feature could add version history)
- Script generation for `_repos/` (public catalog) — Me2 only

## Technical Spec

**Where it lives:** Inline Node.js steps appended to `generate-tool-page.yml` after file creation

**LLM cascade implementation:**
```js
async function callLLM(prompt) {
  // 1. Try Gemini Flash (free)
  // 2. Try Gemini Pro (free)
  // 3. Try OpenRouter (cheapest available model)
  // 4. Try Groq (llama-3 family)
  // 5. Fallback: Claude Sonnet 4.6 via Anthropic SDK
  // Throw only if all five fail
}
```

**Format A — Faceless narration prompt:**
```
Generate a 60–90 second faceless narration video script for a tool called "{name}".
One-liner: {one_liner}. Primary audience: {primary_icp}. Pricing: {pricing}.
Category: {category}.

Structure (use these exact section labels):
[HOOK - 5s]: One punchy question or surprising stat. No filler.
[WHAT IT IS - 15s]: Plain-language explanation. No jargon.
[USE CASE - 25s]: Specific scenario for a {primary_icp}. Concrete, not vague.
[HONEST TAKE - 15s]: One real limitation or caveat. Not a sales pitch.
[CTA - 10s]: One action. Link in bio or search the name.

Voice: casual, dry humor, direct. No "in today's video" or "don't forget to like".
Return only the script text, no metadata.
```

**Format B — UGC/Peter on camera prompt:**
```
Generate an 80–120 second on-camera UGC script for Peter reviewing "{name}".
One-liner: {one_liner}. Primary audience: {primary_icp}. Compare to: {compare_to}.

Structure:
[HOOK - 5s]: Direct address, bold claim or question.
[QUICK SHOW - 25s]: Walk through the product UI. Use [ACTION: ...] cues in brackets for screen actions.
[MY TAKE - 30s]: Personal opinion. What Peter would use it for. Be specific.
[VS ALTERNATIVE - 20s]: Compare to {compare_to[0] or "the obvious alternative"}. One winner, one loser.
[SIGN OFF - 15s]: Recap the one thing to remember. Where to learn more.

Format rules: action notes in [brackets], all spoken words as plain prose sentences.
Voice: conversational, opinionated, not salesy.
Return only the script, no metadata.
```

**YAML serialization:** Scripts written as `|` block scalars. Any literal `---` inside Claude's output is stripped to prevent frontmatter boundary collisions. Quotes within scripts are escaped.

**Secrets required:** `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY` — all stored in GitHub Actions secrets.

**Error handling:** If all cascade levels fail, write `script_faceless: "GENERATION_FAILED"` and `script_ugc: "GENERATION_FAILED"` as sentinel values so Peter can see what needs manual attention in the E-07 dashboard.

## Dependencies
- E-02: `generate-tool-page.yml` must exist and be the host workflow for these steps
- GitHub Actions secrets must be configured for all cascade API keys
- LLM cascade utility (shared across E-04 and E-05 — extract to a reusable `.github/scripts/llm-cascade.js` module)

## Open Questions
- [TBD-PETER] One combined Claude call (both formats in one response, JSON output) vs two separate calls? Combined is cheaper; separate is easier to retry individually.
- [TBD-PETER] Should scripts be generated even when `one_liner` and `why_interesting` are empty (i.e., before E-05 runs)? Or should E-04 wait for E-05 use cases to use as richer context?
- [ASSUMPTION: LLM cascade order] — Gemini Flash → Gemini Pro → OpenRouter → Groq → Claude. Confirm cost/quality preference with Peter before wiring.
- [TBD-PETER] Word count guard? Should the workflow re-request if a returned script is under 100 words (clearly truncated)?
