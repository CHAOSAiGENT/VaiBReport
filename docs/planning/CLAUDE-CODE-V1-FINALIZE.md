# Claude Code V1 Finalize Prompt

Copy everything below the line into a Claude Code session with GitHub access, pointed at the `CHAOSAiGENT/VaiBReport` repo.

---

## Prompt

You are finalizing V1 of the VaiBReport GitHub blogroll digest. The repo is at `github.com/CHAOSAiGENT/VaiBReport`.

Read `CONTEXT.md` and `VaiBReport-SPEC.md` first to understand the full project state. Then complete these tasks in order.

### Task 1: Sync local and remote

The local repo and remote may be out of sync. There may be uncommitted local changes, unpushed local commits, and/or remote commits from GitHub Actions that aren't pulled yet.

1. Stage any uncommitted changes: `git add -A`
2. If there are staged changes, commit them: `git commit -m "Sync Cowork session changes"`
3. Pull with rebase to get any remote changes: `git pull --rebase origin main`
4. Push: `git push origin main`
5. Verify the push succeeded.

If there are merge conflicts, resolve them sensibly (prefer the newer/more complete version of any file). The most likely conflict files are `data/seen.json` and `CONTEXT.md`.

### Task 2: Verify generate-digest.yml exists and is correct

Check that `.github/workflows/generate-digest.yml` exists in the repo. It should be a GitHub Action that:

- Triggers on `workflow_run` (after "Fetch GitHub repos for digest" completes successfully)
- Also supports `workflow_dispatch` for manual runs
- Reads the latest `data/repos-*.json` file
- Reads `config/preferences.json` for thresholds
- Reads `data/seen.json` for dedup cooldown
- Reads `config/spotlight.json` for manual repo additions
- Filters repos by stars, recency, and cooldown
- Categorizes repos into sections (SaaS, AI, Ops, Marketing, UGC/Social, Trending)
- Generates a Jekyll-compatible markdown post at `_posts/YYYY-MM-DD-github-digest.md`
- Updates `data/seen.json` and cleans `config/spotlight.json`
- Commits and pushes with the github-actions[bot] identity
- Skips gracefully if no interesting repos or if today's digest already exists

If the file exists, verify the YAML is valid and the Node script is syntactically correct. If it does NOT exist, create it following the spec in `VaiBReport-SPEC.md` and the architecture notes in `CONTEXT.md`.

### Task 3: Fix the UGC/social media queries

The `ugc_social_queries` in `config/queries.json` returned 0 repos on the first run. The GitHub `topic:` tags used don't match real repos well enough.

Replace the `ugc_social_queries` array with queries that use broader matching. Use description-based keyword search instead of relying solely on topic tags:

```json
"ugc_social_queries": [
  "social media management stars:>30 pushed:>2025-01-01 sort:stars",
  "social media scheduling stars:>30 pushed:>2025-01-01 sort:stars",
  "content creation tool stars:>50 pushed:>2025-01-01 sort:stars",
  "video generation ai stars:>100 pushed:>2025-01-01 sort:stars",
  "instagram OR tiktok OR youtube api stars:>50 pushed:>2025-01-01 language:TypeScript sort:stars",
  "instagram OR tiktok OR youtube api stars:>50 pushed:>2025-01-01 language:Python sort:stars"
]
```

These use free-text search (which matches repo names and descriptions) rather than strict `topic:` tags. This should catch repos like postiz-app, socioboard, instagrapi, Open-Sora, etc.

After editing, verify the JSON is valid.

### Task 4: Update fetch-repos.yml to tag UGC queries correctly

Verify that the fetch-repos.yml workflow reads all three query arrays from `config/queries.json` — including `ugc_social_queries` — and tags repos from that array with `_query_group: "ugc_social"`. This is already in the spec but confirm it's wired correctly.

### Task 5: Trigger a manual test run

Run the fetch workflow manually to get fresh data with the updated UGC queries:

```bash
gh workflow run fetch-repos.yml
```

Wait for it to complete (check with `gh run list --workflow=fetch-repos.yml --limit=1`).

Then run the digest workflow manually:

```bash
gh workflow run generate-digest.yml
```

Wait for it to complete. Verify:
- A new `data/repos-*.json` was committed with UGC repos present
- A new `_posts/*-github-digest.md` was committed (or skipped gracefully if duplicate date)
- `data/seen.json` was updated
- The blog deploy triggered and the site updated

### Task 6: Verify the live blog

Check that the blog is accessible at `https://chaosaigent.github.io/VaiBReport/` and that digest posts render correctly. You can verify via:

```bash
gh api repos/CHAOSAiGENT/VaiBReport/pages --jq '.html_url'
curl -s https://chaosaigent.github.io/VaiBReport/ | head -50
```

### Task 7: Verify the full automation chain

Confirm the chain is wired correctly:
1. `fetch-repos.yml` runs daily at 13:00 UTC (or via workflow_dispatch)
2. When fetch completes, `generate-digest.yml` triggers automatically via `workflow_run`
3. When generate-digest pushes a new `_posts/*.md`, `deploy-blog.yml` triggers via push path filter
4. GitHub Pages deploys the updated site

List any gaps or issues found.

### Task 8: Clean up prompt files

The repo root has some working files from the planning phase that don't need to be in the repo long-term. Do NOT delete them, but add them to `.gitignore` so they stop showing up in diffs:

```
# Planning / session files
CLAUDE-CODE-SETUP-PROMPT.md
CLAUDE-CODE-V1-FINALIZE.md
COWORK-DIGEST-PROMPT.md
CHAOSAiGENT_VaiBReport*.pdf
trackers for interesting github repos*.md
```

Keep `VaiBReport-SPEC.md` and `CONTEXT.md` tracked — those are permanent project documentation.

Commit the `.gitignore` changes.

### Task 9: Final status report

Print a summary:
- Whether all workflows are operational
- Whether the blog is live and rendering
- Whether UGC queries now return results
- Any issues or warnings
- The full automation chain: what runs when, what triggers what
