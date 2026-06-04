# NVIDIA cascade fix + compare-to backfill — TODO

**Status:** open
**Created:** 2026-05-07
**Owner:** Peter

Two things need doing, in order. (1) is blocking (2). The site won't suffer if neither happens — daily digests still ship, just with empty `replaces` / `similar_to` data — but compare-to is currently 0% effective in production until (1) is fixed.

---

## Part 1 — Fix the dead NIM endpoints in the cascade

### Background

Daily digest ran today (2026-05-07). Cascade behavior observed:

```
[LLM blurbs] nim-meta/llama-3.3-70b-instruct failed: fetch failed
[LLM blurbs] nim-nvidia/llama-3.1-nemotron-70b-instruct failed: 404 "Not found for account ..."
[LLM blurbs] Used nim-mistralai/mixtral-8x22b-instruct-v0.1
Got 5 editorial entries (with compare-to)        ← only 5 of 62 candidates
[validator] qwen/qwen2.5-72b-instruct returned 404; shipping unvalidated
```

Three root causes:

| Model | Status | Action |
|---|---|---|
| `nvidia/llama-3.1-nemotron-70b-instruct` | In catalog, but **account doesn't have function access** | Swap |
| `qwen/qwen2.5-72b-instruct` | **Pulled from catalog entirely** | Swap |
| `meta/llama-3.1-405b-instruct` | **Pulled from catalog entirely** | Swap |

### Recommended swaps (verified live in NVIDIA catalog 2026-05-07)

Edit two files. Both swaps in one commit.

#### File 1: `.github/workflows/generate-digest.yml`

Find this block (around line 161):

```javascript
              const nimModels = [
                'meta/llama-3.3-70b-instruct',
                'nvidia/llama-3.1-nemotron-70b-instruct',
                'mistralai/mixtral-8x22b-instruct-v0.1',
                'qwen/qwen2.5-72b-instruct',
                'meta/llama-3.1-405b-instruct',
              ];
```

Replace with:

```javascript
              const nimModels = [
                'meta/llama-3.3-70b-instruct',
                'nvidia/llama-3.3-nemotron-super-49b-v1.5',
                'mistralai/mixtral-8x22b-instruct-v0.1',
                'qwen/qwen3-next-80b-a3b-instruct',
                'meta/llama-4-maverick-17b-128e-instruct',
              ];
```

#### File 2: `scripts/lib/validator.js`

Same model list lives at the top (`NIM_MODELS` constant) and inside `pickValidatorModel`. Update both.

**Top of file** — find:

```javascript
const NIM_MODELS = [
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mixtral-8x22b-instruct-v0.1',
  'qwen/qwen2.5-72b-instruct',
  'meta/llama-3.1-405b-instruct',
];
```

Replace with:

```javascript
const NIM_MODELS = [
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.3-nemotron-super-49b-v1.5',
  'mistralai/mixtral-8x22b-instruct-v0.1',
  'qwen/qwen3-next-80b-a3b-instruct',
  'meta/llama-4-maverick-17b-128e-instruct',
];
```

**Inside `pickValidatorModel`** — the body has explicit references to `qwen/qwen2.5-72b-instruct`. Update them all to `qwen/qwen3-next-80b-a3b-instruct`. There are about 4 occurrences across the family-pairing branches.

Also: the existing test at `tests/lib/validator.test.js` references `qwen/qwen2.5-72b-instruct`. Update those test assertions to use the new Qwen 3 ID, or the suite will fail.

#### Also: `scripts/backfill-compare-to.js`

The backfill has its OWN `NIM_MODELS` array near the top (different from the validator's — the backfill's omits the 405B). Find it and apply the same swaps so backfill doesn't try the dead Qwen 2.5 either.

### Verification

```bash
# 1. YAML still parses
python -c "import yaml; yaml.safe_load(open('.github/workflows/generate-digest.yml'))" && echo "YAML OK"

# 2. Backfill script syntax
node --check scripts/backfill-compare-to.js && echo "syntax OK"

# 3. Validator tests still pass with updated model IDs
npm test
```

### Commit + push

```bash
git add .github/workflows/generate-digest.yml scripts/lib/validator.js scripts/backfill-compare-to.js tests/lib/validator.test.js
git commit -m "fix(cascade): swap dead NIM endpoints (qwen2.5-72b, llama-3.1-405b, nemotron-70b account-gated)"
git push origin main
```

### Verify in production

After push, manually trigger a digest run to confirm the new cascade works without waiting for the 14:00 UTC cron:

```bash
gh workflow run generate-digest.yml
gh run watch
```

Then check the run log:

```bash
gh run list --workflow=generate-digest.yml --limit 1 --json databaseId -q '.[0].databaseId' | xargs -I {} gh run view {} --log | grep -E "LLM blurbs|validator|Got [0-9]+ editorial|Created"
```

You want to see:
- `[LLM blurbs] Used nim-...` (one of the new models — ideally not Mixtral every time, that would indicate the others are still dead)
- `Got N editorial entries (with compare-to)` where N matches the candidate count, not just 5
- A `[validator] ... approved` or no validator-error line (silent success)

If you still see only 5 editorial entries: the truncation issue (Part 2 below) is the real bottleneck and the model swap alone won't fix it.

---

## Part 2 — Run the catalog-wide backfill

### Prerequisite: persistent `NVIDIA_API_KEY` in your shell env

The backfill script reads `process.env.NVIDIA_API_KEY` at runtime. The key was lost from your terminal session during the PowerShell mishap. Pick one of three methods to set it durably:

#### Method A: `~/.bashrc` (Git Bash) — recommended

```bash
echo 'export NVIDIA_API_KEY="<paste your nvapi-... key here>"' >> ~/.bashrc
source ~/.bashrc
echo "${NVIDIA_API_KEY:0:8}..."   # confirm: should print first 8 chars
```

Pros: every new Git Bash terminal inherits it. Survives reboot. Easy to update later.
Cons: lives in plaintext in `~/.bashrc`. Add `~/.bashrc` to a backup-excluded list if you sync your home dir.

#### Method B: Windows User-level env var (PowerShell, one time)

```powershell
setx NVIDIA_API_KEY "<paste your nvapi-... key here>"
```

Then **close and reopen** the terminal — `setx` doesn't update the current session.

```bash
echo "${NVIDIA_API_KEY:0:8}..."   # should print first 8 chars
```

Pros: usable from PowerShell, cmd.exe, AND Git Bash. Survives reboot. No file to back up.
Cons: harder to rotate (have to re-run `setx` and reopen all terminals).

#### Method C: One-shot prefix (no persistence)

If you don't want it persisted at all, prefix every backfill command:

```bash
NVIDIA_API_KEY="<key>" node scripts/backfill-compare-to.js --limit 50
```

Pros: never written anywhere. Cons: have to paste every time.

**I recommend Method A** for ongoing dev work — it's the standard Unix pattern and keeps the key out of the Windows registry.

### Run the staged backfill

```bash
# Sanity check the script can load without crashing
node --check scripts/backfill-compare-to.js && echo "syntax OK"

# Spot-check pass: first 50 items only
node scripts/backfill-compare-to.js --limit 50

# Eyeball the diff
git diff _repos/ | head -200

# If quality looks reasonable (~80% of items have plausible `replaces` and `similar_to` —
# real product names you recognize, similar slugs that actually point to real catalog items):
git add _repos/ data/backfill-compare-to.log
git commit -m "data(compare-to): backfill first 50 catalog items (spot-check pass)"

# Continue with the rest (~1003 items remaining; ~25-30 min wall clock)
node scripts/backfill-compare-to.js --resume

# Commit in chunks every ~50 items if you want, OR one big commit at the end
git add _repos/ data/backfill-compare-to.log
git commit -m "data(compare-to): complete catalog backfill"
git push origin main
```

### If quality is bad on the first 50

Roll back and refine:

```bash
git restore _repos/
rm -f data/backfill-compare-to.log
# Edit scripts/backfill-compare-to.js — `buildBatchPrompt` function — sharpen the language
# Then retry --limit 50
```

### After backfill: verify the homepage and a repo page

The feature flag (`JEKYLL_ENV=compare_to_live`) is already on in production. Once any repo entry has populated `replaces` and `compare_to_validated: true`, those chips render on:
- `https://chaosaigent.github.io/VaiBReport/` (homepage hero cards)
- `https://chaosaigent.github.io/VaiBReport/repos/<slug>/` (Replaces + Similar in catalog sections)
- `https://chaosaigent.github.io/VaiBReport/repos/` (Replaces filter chip row)

GitHub Pages takes a few minutes to redeploy after the backfill push.

---

## Part 3 — Optional follow-up: fix the truncation issue

Today's run had Mixtral 8x22B return only 5 editorial entries when the prompt had 62 candidates. The new prompt asks for 3 nested fields per item (~3× the output of the legacy single-string version), so the model is hitting a context or output limit.

The backfill script already batches at 15 items per prompt. The daily digest workflow does NOT — it sends all candidates in one go. So the daily digest is silently truncating.

**Fix sketch** (not blocking):

In `.github/workflows/generate-digest.yml`'s `generateEditorialBlurbs` function, split `sections` into batches of ~15 items, call `tryCascadeBlurb` per batch, merge the results. Each batch is independent so failures of one batch don't kill others. Adds maybe 2-3× wall clock to the daily run (still <2 minutes) but recovers the missing 50+ items.

This is roughly 30 lines of code in the workflow. Worth doing once the cascade is healthy again.

---

## Quick cleanup notes (low priority)

- `data/backfill-compare-to.log` will grow with each backfill run. Currently small. Could be added to `.gitignore` if size becomes a concern.
- The `compare-to-overrides.json` file at `config/compare-to-overrides.json` is currently `{}`. Once you spot LLM-generated `replaces` entries that are clearly wrong (which you will), add overrides there per the spec.
- After backfill completes, ~80% of catalog should have `compare_to_validated: true`. The 20% with `false` will be cases where the validator dropped them. Worth checking `data/compare-to-disputes-*.json` (if any) to see what was dropped and why.
