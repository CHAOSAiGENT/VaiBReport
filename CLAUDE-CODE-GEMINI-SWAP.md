# Claude Code Prompt: Swap Anthropic API → Gemini Free Tier

**Goal:** Replace the Claude API call in `generate-digest.yml` with Google Gemini's free tier API. Same editorial voice, same JSON output format, zero cost.

**Why:** The Anthropic API requires funded credits. Gemini 2.5 Flash free tier allows 250+ requests/day — we need 1.

---

## Task 1: Update the env vars in generate-digest.yml

In `.github/workflows/generate-digest.yml`, find the `env:` block that references `ANTHROPIC_API_KEY` and **replace** it with `GEMINI_API_KEY`:

```yaml
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Remove the `ANTHROPIC_API_KEY` line entirely from this workflow.

---

## Task 2: Rewrite the `generateEditorialBlurbs()` function

Find the existing `generateEditorialBlurbs()` function (starts around the comment `// ── Claude API editorial blurbs`). Replace the ENTIRE function with this Gemini-based version. **Keep the same function signature, same return type (object mapping full_name to blurb string, or null on failure), and same prompt.**

Key differences from the old version:
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}`
- Request body format: `{ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }`
- Response parsing: `data.candidates[0].content.parts[0].text`
- Model fallback: try `gemini-2.5-flash` first, then `gemini-2.0-flash` as backup
- Environment variable: `process.env.GEMINI_API_KEY` instead of `process.env.ANTHROPIC_API_KEY`

The function should:
1. Check for `GEMINI_API_KEY` env var — if missing, log and return null (same as before)
2. Build the SAME prompt (repo list grouped by section, same voice instructions, same JSON return format)
3. Try `gemini-2.5-flash` first via the Gemini REST API
4. If that fails (404/error), try `gemini-2.0-flash`
5. Parse the response text, strip any markdown code fences, JSON.parse it
6. Return the blurbs object, or null on failure
7. Log which model was used and how many blurbs were generated

**IMPORTANT:** The prompt text itself (voice, tone, format instructions) should remain EXACTLY the same as the current version. Only the API call mechanism changes.

Here is the replacement function for reference:

```javascript
async function generateEditorialBlurbs(repos, sections) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('No GEMINI_API_KEY — falling back to template blurbs');
    return null;
  }

  // Build the prompt with all repos grouped by section (SAME AS BEFORE)
  let repoList = '';
  for (const [section, items] of Object.entries(sections)) {
    if (items.length === 0) continue;
    repoList += `\n## ${section}\n`;
    for (const r of items) {
      repoList += `- ${r.full_name} (${r.language || 'Multi'}, ${r.stargazers_count}★): ${r.description || 'No description'}\n`;
      if (r.topics && r.topics.length > 0) {
        repoList += `  Topics: ${r.topics.slice(0, 8).join(', ')}\n`;
      }
    }
  }

  const prompt = [
    'You are writing one-liner editorial blurbs for a daily GitHub digest blog called VaiBReport. The audience is solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators.',
    '',
    'Your voice: casual, dry humor, opinionated. You are a fellow builder who has seen a lot of repos and knows what matters. Think "the friend who texts you hey check this out with actually good stuff." Be concise - each blurb is ONE sentence, max two. No fluff, no hype words like "revolutionary" or "game-changing." Say what it actually does and why someone building a product would care.',
    '',
    'Here are the repos grouped by section. Write a blurb for each one. Return ONLY a JSON object mapping full_name to blurb string. No markdown, no explanation.',
    '',
    repoList,
    '',
    'Return format:',
    '{"owner/repo": "Your one-liner blurb here.", ...}'
  ].join('\n');

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096
            }
          })
        }
      );

      if (!res.ok) {
        const body = await res.text();
        console.error(`Gemini API error (${model}): ${res.status} ${res.statusText}`);
        console.error(body);
        if (res.status === 404) continue; // model not available, try next
        return null;
      }

      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const blurbs = JSON.parse(cleaned);
      console.log(`Got ${Object.keys(blurbs).length} editorial blurbs from Gemini (${model})`);
      return blurbs;
    } catch (e) {
      console.error(`Gemini API call failed (${model}):`, e.message);
    }
  }
  return null;
}
```

---

## Task 3: Update the fallback check log message

In the `writeOneLiner()` function, no changes needed — it already gracefully handles `blurbs` being null (falls back to repo description). Just confirm this is still intact.

---

## Task 4: Clean up references

Search the entire repo for any remaining references to `ANTHROPIC_API_KEY`:
- If it appears in any other workflow files, leave it (it might be used elsewhere)
- If it ONLY appears in `generate-digest.yml`, the swap is clean
- Update any comments that reference "Claude API" to say "Gemini API" for clarity
- Do NOT remove the `ANTHROPIC_API_KEY` secret from GitHub — Peter can do that manually if he wants

---

## Task 5: Verify

After making the changes:

1. Read `generate-digest.yml` and confirm:
   - `GEMINI_API_KEY` is in the env block
   - `ANTHROPIC_API_KEY` is NOT in the env block
   - `generateEditorialBlurbs()` calls Gemini, not Anthropic
   - The prompt text is preserved exactly
   - The fallback chain is: gemini-2.5-flash → gemini-2.0-flash → template blurbs (null)
   - `writeOneLiner()` still works with the blurbs object

2. Check that no other files were accidentally modified

3. Report what was changed

---

## Notes

- The `GEMINI_API_KEY` secret should already be set in the repo (Peter added it)
- Gemini 2.5 Flash free tier: 250 RPD, 250K TPM — we need ~1 request/day with ~6K tokens. Well within limits.
- The editorial voice quality from Gemini Flash for short punchy blurbs is comparable to Sonnet for this use case
- If Google changes free tier terms later, we can always swap back to Claude or try another provider
