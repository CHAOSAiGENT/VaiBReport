---
file: VaiBReport-session.md
project: VaiBReport
repo: https://github.com/CHAOSAiGENT/VaiBReport.git
---

# VaiBReport — Session Doc

## 2026-06-05 — Repo consolidation + Next.js redesign deployed to GitHub Pages on report.vaibos.com [Stack, Architecture, Tech Log, PM Notes]

### Stack

| Component | Technology | Version / Detail | Notes |
| --------- | ---------- | ---------------- | ----- |
| Live site | Next.js (App Router, Turbopack) | 16.2.6, `output: 'export'` | Redesign; replaced Jekyll as the Pages deploy this session |
| UI | React | 19.2.4 | |
| Styling | Tailwind CSS | v4 (`@tailwindcss/postcss`, `typography`) | |
| Content parse | gray-matter, remark, remark-html | remark-html@16 (sanitizes by default) | markdown → HTML for digest/repo pages |
| Pkg manager (next/) | Bun | 1.2.18 | `bun.lock` tracked; `package-lock.json` removed |
| Legacy site | Jekyll (minima) | — | Retired as the Pages deploy (`deploy-blog.yml` removed) |
| Data pipeline | Node.js | >=20, zero-dep ESM, inline heredoc JS in Actions YAML | Unchanged |
| Hosting | GitHub Pages | Custom domain **report.vaibos.com** (root) | Was project page `/VaiBReport` |
| CI/CD | GitHub Actions | `deploy-site.yml` (bun build → static export → Pages) | Node 24-native action versions |
| Data sources | GitHub, HuggingFace, Replicate, Ollama, GitLab, npm/PyPI, Papers with Code, Product Hunt | daily fetch workflows | Unchanged |

**Secrets in use:** none added or handled this session. (Pipeline uses GitHub Actions secrets for the LLM cascade + data-source APIs — not touched.)

**Claude Code config:** chaos-controller skill active; no MCP registry (pruned earlier); external auto-sync daemon active (auto-commits + pushes `main` on a timer).

### Architecture

**System Layers**

**Layer 1 — Data pipeline (GitHub Actions)**
What it does: fetches 8 sources daily → `data/` snapshots → `generate-digest` → `_posts/` + `_repos/`.
The pattern: zero-dependency inline JS in workflow YAML; git as the durable store.
Lift to: any scheduled content-aggregation product.

**Layer 2 — Content store (filesystem)**
What it does: holds `_posts/`, `_repos/`, `data/` as flat markdown + JSON at the repo root.
The pattern: git-as-database; no DB to run or back up.
Lift to: any SSG/content system.

**Layer 3 — Presentation (Next.js static export)**
What it does: `content.ts` reads the store via `CONTENT_ROOT`; `generateStaticParams` pre-renders ~1,425 pages at build.
The pattern: SSG over a git content store, zero runtime server — deployable to any static host.
Lift to: docs sites, catalogs, any read-mostly content app.

**Layer 4 — Deploy (GitHub Pages via Actions)**
What it does: `bun build` → `next/out` → `upload-pages-artifact` → `deploy-pages`; custom domain at root.
The pattern: framework-agnostic static publish; content commits auto-trigger rebuilds.
Lift to: any static-export site on Pages.

**Full Chain**

`8 data sources → daily Actions fetch → data/ + _posts/ + _repos/ → next build (SSG) → next/out → GitHub Pages (report.vaibos.com)`

**What You'd Swap for a Different Domain**

| This project's element | Swap for |
| ---------------------- | -------- |
| 8 AI-tool data fetchers | your domain's source APIs |
| LLM digest generator | your summarization/curation logic |
| `_repos/` catalog schema | your entity catalog |
| report.vaibos.com Pages deploy | any static host (Vercel/Netlify/S3) |

### Tech Log

**Bugs**

- [B-01] Stale `git index.lock` (3 days old) — blocked local commits + the auto-sync daemon since 06-01; root cause: interrupted sync. Fix: removed the stale lock. Status: fixed.
- [B-02] Broken `CLAUDE.md` `@`-import to pruned `VaiBReport-roadmap.md`. Fix: removed the dead import. Status: fixed.
- [B-03] `next/bun.lock` out of sync with `package.json` (missing remark, remark-html, @tailwindcss/typography) — would fail `bun install --frozen-lockfile` in CI. Fix: resynced. Status: fixed.
- [B-04] Orphan submodule gitlinks `.claude/worktrees/agent-*` (mode 160000, no `.gitmodules`) — caused `git exit 128` on every Actions checkout. Fix: `git rm --cached`. Status: fixed.
- [B-05] Next site would build empty in CI (hardcoded macOS NAS `CONTENT_ROOT`). Fix: default to repo root (`cwd/..`) + explicit `CONTENT_ROOT` in workflow. Status: fixed.
- [B-06] `basePath` wrong for custom domain (served at root, not `/VaiBReport`). Fix: dropped `basePath` at cutover. Status: fixed.

**Pivots**

- Two diverged clones → consolidated to one canonical repo (deleted the `__platforms/VaibOS/VaiBReport` mirror; merged 197 commits of live pipeline history into the redesign line).
- Jekyll → Next.js redesign as the GitHub Pages deploy.
- Project-page URL (`/VaiBReport`) → custom domain `report.vaibos.com` at root.

**Gotchas**

- External auto-sync daemon auto-commits **and pushes** working-tree changes on a timer → races manual work; rebase over it (hit it 3×).
- CRLF/LF normalization creates spurious `add/add` merge conflicts (86 files in the merge were near-pure EOL diffs).
- `remark-html@16` sanitizes by default → the automated XSS finding on `markdown.ts` was a **FALSE POSITIVE** (verified by probe: strips `<script>`, `onerror=`, `javascript:`).
- GitHub Pages Let's Encrypt cert can lag well past DNS propagation (`cert_state: null` 45+ min); remove/re-add domain nudges issuance.
- Next export emits `_next/` → Pages' Jekyll layer strips `_`-dirs → added `.nojekyll` (belt-and-suspenders; Actions-artifact deploy doesn't run Jekyll anyway).

**Worth it / waste of time**

- Empirical XSS probe (`bun install` + payload test) → worth it: avoided 3 needless deps AND surfaced the real `bun.lock` defect.
- Backup branch + verify-before-delete on the merge/clone deletion → worth it: zero-risk irreversible ops.

**Tech debt flagged**

- HTTPS enforcement pending GitHub cert issuance (background poller `btfu5uk4z` watching).
- `content.ts` `CONTENT_ROOT` relies on cwd default (mitigated by explicit env in workflow).
- ~15 other pipeline workflows still on Node-20 actions — GitHub forces Node 24 on 2026-06-16.
- Redesign content gaps carried from prior brief (compare-to backfill, feature-flag-with-empty-data heroes) — not addressed.

### PM Notes

**Structure used:** freeform, with brainstorming + AskUserQuestion gates before each irreversible/outward op (clone delete, history merge, live-domain cutover).

**What went well:** safe git surgery (backup branch, ancestry checks, verify-before-delete); empirical verification over assumption (XSS probe, local build, CI watch); autonomous deploy-and-verify loop.

**What was skipped or unnecessary:** redesign content gaps left untouched (out of scope); deliberately did NOT sweep the ~15 pipeline workflows' Node bump (scoped to the deploy workflow to protect the data pipeline).

**Pivots or disagreements:** user corrected Vercel→GitHub Pages assumption; user chose "switch now" over the safer "prepare-and-flip" cutover for the custom domain.

**What structured process would have caught earlier:** the auto-sync daemon racing manual commits — pausing/locking it before a multi-commit sequence would have avoided 3 rebases.

**Claude's assessment:** smooth, high-delegation session; user set direction and confirmed the handful of genuinely risky decisions. Verification-first paid off repeatedly.

**Next time:**
1. Pause/disable the external auto-sync daemon before multi-commit sequences (or detect + warn).
2. Add `.gitattributes` with EOL normalization to permanently kill CRLF churn and spurious merge conflicts.
3. Sweep the ~15 pipeline workflows to Node-24 action versions before 2026-06-16.
4. Address redesign content gaps (compare-to backfill, feature-flag empty-data heroes).
5. Confirm HTTPS enforced on report.vaibos.com once the cert issues.
