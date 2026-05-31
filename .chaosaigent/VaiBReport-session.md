---
file: VaiBReport-session.md
project: VaiBReport
repo: https://github.com/CHAOSAiGENT/VaiBReport.git
---

# VaiBReport — Session Doc

## 2026-05-31 — First chaos-controller checkpoint: context pruning, QA fixes, initial roadmap [Stack, Architecture, Tech Log, PM Notes]

### Stack

| Component          | Technology                | Version / Detail                                                                    | Notes                                                                             |
| ------------------ | ------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Language           | Node.js                   | >=20 (ESM)                                                                          | Zero npm dependencies — native fetch, test runner                                 |
| SSG                | Jekyll                    | minima theme                                                                        | Ruby-based, deployed to GitHub Pages                                              |
| CI/CD              | GitHub Actions            | 16 workflows                                                                        | 9 fetch + digest + deploy + screenshots + research + parse-submission + tool-page |
| Hosting            | GitHub Pages              | chaosaigent.github.io/VaiBReport/                                                   | Custom domain planned                                                             |
| LLM Tier 1         | Qwen3-14B                 | LiteLLM on theStudio via Tailscale                                                  | Self-hosted, free                                                                 |
| LLM Tier 2         | NVIDIA NIM                | 5 models (preview)                                                                  | 3 endpoints currently dead — fix pending                                          |
| LLM Tier 3         | Gemini 2.5 Flash          | Free tier (250 RPD)                                                                 | Former primary, now fallback                                                      |
| LLM Tier 4         | OpenRouter                | Llama 3.3 70B free                                                                  | Fallback                                                                          |
| LLM Tier 5         | Groq                      | Llama 3.3 70B versatile                                                             | Fallback                                                                          |
| LLM Tier 6         | Anthropic Claude Haiku    | Unfunded — would fail if reached                                                    | Last resort                                                                       |
| Browser automation | Playwright                | GitHub Actions                                                                      | Screenshots for catalog + tool pages                                              |
| Research           | Brave Search + Perplexity | Issue-triggered workflow                                                            | Claude synthesis                                                                  |
| Data sources       | 9 platforms               | GitHub, HF, Replicate, PwC, npm/PyPI, GitLab, Ollama, Product Hunt, DevHunt cluster | Daily automated fetch                                                             |

**Secrets in use:** GITHUB_TOKEN (Actions built-in + user PAT — consolidation pending), NVIDIA_API_KEY (lost from local env), GEMINI_API_KEY, HF_TOKEN, REPLICATE_API_TOKEN, OPENROUTER_API_KEY, GROQ_API_KEY, ANTHROPIC_API_KEY (unfunded), PRODUCT_HUNT_KEY, PRODUCT_HUNT_SECRET. All stored as GitHub repo secrets.

**Claude Code config:** chaos-controller active. 10 MCPs denied, 97 skills disabled via `.claude/settings.local.json`. Active MCPs: GitHub, Hugging_Face, Playwright, context7. No hooks installed. No pre-commit hook.

### Architecture

**System Layers**

**Layer 1 — Data Collection (9-Platform Fetch)**
What it does: 9 independent GitHub Actions workflows scrape/query platforms daily, writing JSON snapshots to `data/`.
The pattern: Each workflow is self-contained — one platform, one cron, one output file. Failures are isolated. New platforms = new workflow file, zero coupling.
Lift to: Any multi-source intelligence aggregator (podcast monitor, job board scraper, research paper tracker).

**Layer 2 — LLM Editorial Cascade**
What it does: `generate-digest.yml` reads today's JSON snapshots, applies quality filters, then generates editorial blurbs via a 6-tier LLM cascade (first success wins).
The pattern: Tiered provider failover with graceful degradation. Each tier is a simple HTTP POST; non-2xx falls through. No SDK dependencies. Inline JS in workflow YAML.
Lift to: Any LLM-powered content pipeline needing cost-free operation with resilience (newsletter generators, automated documentation, social content pipelines).

**Layer 3 — Static Site Rendering (Jekyll)**
What it does: Jekyll processes `_posts/`, `_repos/`, `_tools/` collections into browsable HTML. Minima theme. Collections for repos, tools, and research with custom layouts.
The pattern: Data-driven Jekyll — markdown files with YAML frontmatter are the "database." GitHub Pages builds and serves for free.
Lift to: Any curated catalog site (tool directories, resource libraries, learning path aggregators).

**Layer 4 — Deployment (GitHub Pages via Actions)**
What it does: `deploy-blog.yml` builds Jekyll and pushes to GitHub Pages on every commit to main.
The pattern: Zero-config deployment. Feature flags via `JEKYLL_ENV` variables in the workflow.
Lift to: Any Jekyll/Hugo/11ty site needing automated deployment with feature flags.

**Layer 5 — Enrichment (Me2 + Compare-To)**
What it does: Tool page generation, Playwright screenshots, compare-to validation (replaces/similar_to fields), ICP tagging. Adds editorial depth to raw catalog entries.
The pattern: Post-processing layer that enriches existing data files in-place. Runs after fetch/digest, before deploy.
Lift to: Any content pipeline needing progressive enrichment (add screenshots, add comparisons, add tags after initial ingestion).

**Full Chain**

`9 platform APIs → JSON snapshots (data/) → LLM cascade filters + writes blurbs → Jekyll renders _posts/ + _repos/ → GitHub Pages serves HTML`

**What You'd Swap for a Different Domain**

| This project's element                           | Swap for                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| 9 platform fetch workflows                       | Your domain's data sources (job boards, arxiv, court filings, etc.)        |
| LLM editorial cascade                            | Your content generation needs (summarization, classification, translation) |
| Quality filters (star threshold, cooldown dedup) | Your domain's signal/noise rules                                           |
| Jekyll + \_repos/ collection                     | Your rendering stack + data model                                          |
| compare-to validator                             | Your domain's cross-reference logic                                        |

### Tech Log

**Bugs**

- [B-01] 3 NVIDIA NIM endpoints dead — `qwen/qwen2.5-72b-instruct`, `meta/llama-3.1-405b-instruct` pulled from catalog, `nvidia/llama-3.1-nemotron-70b-instruct` account-gated. Replacement model IDs identified in `tasks/nvidia-cascade-and-backfill.md`. Status: not yet fixed.
- [B-02] Blurb truncation — cascade sends all candidates in one prompt; Mixtral-8x22B hits output limit with 3-field response format. Fix: batch candidates into groups of ~15. Status: not yet fixed.
- [B-03] NVIDIA_API_KEY lost from local terminal environment — PowerShell session cleared it. Status: re-export pending.

**Pivots**

- No pivots this session — checkpoint-only session.

**Gotchas**

- Line-ending normalization: 1558 files show as "modified" in `git status` due to CRLF→LF conversion. Content is identical. This inflates diff stats but represents zero code changes.
- Design HTML files were tracked before `.gitignore` pattern existed. Required `git rm --cached` to un-track them.
- Feature flag `JEKYLL_ENV=compare_to_live` is permanently on in production but the underlying data (compare_to_validated: true) is empty. Homepage hero cards render nothing.

**Worth it / waste of time**

- [chaos-controller first run] → worth it. Surfaced the NIM blocker clearly, quantified context waste (~300K tokens), created roadmap from nothing.

**Tech debt flagged**

- PRD index (`docs/prd/README.md`) is stale — shows shipped features as "Ready to build"
- `research-report.yml` is undocumented outside the workflow file
- 11MB .zip tracked in git (now removed from index)
- `postmvp/BACKLOG.md` last updated 2026-03-24 — stale

### MCP & Skill Activity

Active MCPs this session:

- GitHub → CHAOSAiGENT/VaiBReport — 0 tool calls — no verify
- Hugging_Face → no-need-username — 0 tool calls — no verify
- Playwright (plugin) → browser automation — 0 tool calls — no verify
- context7 → documentation — 0 tool calls — no verify

Not used (active but idle):

- All 4 active MCPs were idle (checkpoint-only session, no development work)

Context switches during session:

- (none)

Activation changes:

- PostHog: active → denied (not used in this project)
- Supabase: active → denied (no database layer)
- Vercel: active → denied (GitHub Pages deployment)
- Canva: active → denied (no design work currently)
- Excalidraw: active → denied (no diagramming)
- Figma: active → denied (no design work currently)
- Gmail: active → denied (no email integration)
- Google_Calendar: active → denied (no calendar)
- Google_Drive: active → denied (uses git)
- Notion: active → denied (uses markdown)
- 97 skills denied (marketing, design, framework, platform-specific)

Skills used: chaos-controller
Skills active but unused: cicd-expert, tdd-red-green-refactor, claude-api, simplify, loop, schedule, find-skills, update-config, write-prd, code-review, pr-review-toolkit, feature-dev, commit-commands, autonomous-agents, add-spotlight, all superpowers:\*

### PM Notes

**Structure used:** freeform — first chaos-controller run, no prior structure existed. Cost: ~20min to establish baseline. Benefit: roadmap + session brief + context pruning that persists across all future sessions.

**What went well:**

- Agent dispatch produced comprehensive project state analysis from zero prior documentation
- Toolhand identified ~300K tokens of irrelevant context — immediate quality-of-life improvement
- Journeyman surfaced the NIM blocker (Thread 1) as the single highest-leverage item

**What was skipped or unnecessary:**

- No code was written this session — pure checkpoint/baseline
- The line-ending normalization diff is noise; could be resolved with a `.gitattributes` file

**Pivots or disagreements:**

- None — first session, establishing baseline

**What structured process would have caught earlier:**

- The compare-to feature shipped 30 days ago with a permanent feature flag pointing at empty data. A post-ship verification step would have caught this immediately.
- The PRD index went stale within 3 weeks of creation. Either automate PRD status tracking or delete the index.

**Claude's assessment:** Clean first checkpoint. The project is operationally healthy but has one high-value blocked feature (compare-to) and significant documentation entropy. The context pruning alone justifies this session — 300K fewer tokens means faster, cheaper, more focused sessions going forward.

**Next time:**

- Fix NIM endpoints and run compare-to backfill (Thread 1) — this is the single highest-ROI task
- Add `.gitattributes` with `* text=auto` to prevent future line-ending drift
- Consider installing pre-commit hook for mechanical QA on every commit
- Set up MCP registry for persistent steering (currently no registry — steering skipped)
- When starting the redesign (NEW design + NEW URL), re-enable design skills and Vercel MCP
