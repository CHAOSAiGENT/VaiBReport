# Lessons — VaiBReport

- 2026-06-05: External auto-sync daemon auto-commits AND pushes `main` on a timer. Rebase over its commits; consider pausing it before any multi-commit sequence to avoid non-fast-forward push rejections.
- 2026-06-05: Verify automated security findings empirically before acting. The XSS flag on `markdown.ts` was a false positive — `remark-html@16` sanitizes by default (proven by probing `<script>`/`onerror=`/`javascript:` payloads). Treat scanner findings as hypotheses.
- 2026-06-05: CRLF/LF normalization on this repo inflates diffs and creates spurious `add/add` merge conflicts. Add a `.gitattributes` (`* text=auto eol=lf`) to fix permanently.
- 2026-06-05: Before deleting/merging anything irreversible, create a backup branch and use ancestry checks (`merge-base --is-ancestor`, `rev-list A..B` both ways) — not `cat-file -t`, which only tests object presence, not reachability.
- 2026-06-05: For Next.js on GitHub Pages — project page needs `basePath: '/<repo>'`; a custom domain needs basePath dropped. The two are mutually exclusive; the switch must coincide with DNS. Add `.nojekyll`; the cert can lag past DNS (remove/re-add domain to nudge issuance).
