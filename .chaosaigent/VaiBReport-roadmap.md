---
file: VaiBReport-roadmap.md
project: VaiBReport
updated: 2026-06-05
---

# VaiBReport — Project Roadmap

## Done

- Consolidated two diverged clones into one canonical repo (deleted `__platforms/VaibOS/VaiBReport` mirror; merged 197 commits of live pipeline history into the redesign line).
- Shed ~289 MB of regenerable weight (`next/node_modules`); repo ~355 MB → ~76 MB.
- Repaired: stale git index.lock, broken CLAUDE.md import, out-of-sync bun.lock, orphan submodule gitlinks.
- Deployed the Next.js redesign to GitHub Pages as a static export (`deploy-site.yml`), replacing the Jekyll deploy.
- Made `content.ts` content-root portable (works in CI / any machine).
- Switched the live site to the custom domain **report.vaibos.com** (basePath dropped, CNAME set, DNS live).
- CI maintenance: bumped Pages actions to Node-24-native versions; removed the recurring git-128 warning.
- Verified the automated XSS finding on `markdown.ts` is a false positive (remark-html sanitizes by default).
- 2026-06-26: Fixed the GitHub storage "ding" — purged 30 accumulated `github-pages` artifacts (399 MB → 0) and added `retention-days: 1` to the Pages deploy so build blobs stop piling against the account's 500 MB shared quota. (Public repo ⇒ Actions _minutes_ were never the cost; storage was.)
- 2026-06-26: Consolidated 9 daily `fetch-*.yml` workflows into one `fetch-all.yml` (one job, 9 continue-on-error steps, one commit/day, one push race). Fetch JS preserved verbatim; cheerio installed once `--no-save`; `pull --rebase --autostash` + loud `exit 1` on push failure. Bumped to checkout@v6 / setup-node@v5 / node 24. Verified green end-to-end via workflow_dispatch (run 28270724211).

## In Progress

- HTTPS enforcement on report.vaibos.com — waiting on GitHub's Let's Encrypt cert; background poller `btfu5uk4z` will enable Enforce HTTPS automatically when it issues.

## To Do

- Address redesign content gaps: compare-to backfill (hero cards / Replaces / Similar render nothing), feature-flag-with-empty-data heroes.
- Add `.gitattributes` EOL normalization to stop CRLF churn and spurious merge conflicts.
- Bump remaining 6 workflows from `@v4` to current action versions (capture-screenshots, capture-tool-screenshots, generate-digest, parse-submission, research-report, tool-page-generate). Not urgent — `@v4` runs on Node-20 and still works; only `@v3`/Node-16 was the hard cutover, and none remain. fetch-all + deploy-site are already current.
- Consider pausing/locking the external auto-sync daemon during multi-commit work.
- 3 missing Stitch screens (Research, Picks, Sponsor) — build as Next.js pages if still wanted.

## Decisions Made

- 2026-06-05: report.vaibos.com chosen as the custom domain (subdomain, CNAME → chaosaigent.github.io); cutover done immediately ("switch now").
- 2026-06-05: Next.js redesign replaces Jekyll as the GitHub Pages deploy; Jekyll `deploy-blog.yml` removed (recoverable from git history).
- 2026-06-05: Folder `S:\Chaos_Skunkworks\Apps\VaiBReport` is the single canonical local clone; `__platforms` mirror deleted.
- 2026-06-05: Static export over a git content store (no runtime server) is the deploy model.
- 2026-06-05: Gotcha — external auto-sync daemon auto-commits+pushes main on a timer.
- 2026-06-05: Gotcha — remark-html@16 sanitizes by default; treat automated security findings as hypotheses to verify.
