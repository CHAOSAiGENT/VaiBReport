# VaiBReport — LLM System Overview

**Last updated:** 2026-04-30

**What it does:** generates ~20-30 one-line editorial blurbs per day for the digest post, in the "fellow builder, dry humor, no hype words" voice.

## The Cascade (failover order)

Defined in `.github/workflows/generate-digest.yml` — `tryCascadeBlurb()`. Providers are tried in this order; first non-error response wins, any non-2xx falls through to the next.

| # | Provider | Model | Where | Cost |
|---|---|---|---|---|
| 1 | **Local LiteLLM** | `local/qwen3-14b` | theStudio (`http://100.96.142.54:4000`) via Tailscale | Free (self-hosted) |
| 2a | **NVIDIA NIM** | `meta/llama-3.3-70b-instruct` | `integrate.api.nvidia.com` | Free (preview) |
| 2b | NVIDIA NIM | `nvidia/llama-3.1-nemotron-70b-instruct` | same | Free (preview) |
| 2c | NVIDIA NIM | `mistralai/mixtral-8x22b-instruct-v0.1` | same | Free (preview) |
| 2d | NVIDIA NIM | `qwen/qwen2.5-72b-instruct` | same | Free (preview) |
| 2e | NVIDIA NIM | `meta/llama-3.1-405b-instruct` | same | Free (preview) |
| 3 | **Gemini 2.5 Flash** | `gemini-2.5-flash` | `generativelanguage.googleapis.com` | Free (250 RPD) |
| 4 | **OpenRouter** | `meta-llama/llama-3.3-70b-instruct:free` | `openrouter.ai` | Free |
| 5 | **Groq** | `llama-3.3-70b-versatile` | `api.groq.com` | Free tier |
| 6 | **Anthropic** | `claude-haiku-4-5-20251001` | `api.anthropic.com` | Unfunded — fails if reached |

## How the switcher works

Pre-flight check (`generate-digest.yml`, `Check local LLM availability` step) pings the local LiteLLM `/health` over Tailscale with a 5s timeout. If reachable → `LOCAL_LLM_AVAILABLE=true` → tier 1 is added to the provider list. If not → tier 1 is skipped entirely and the cascade starts at NIM.

Inside `tryCascadeBlurb()`, providers are conditionally pushed onto a list based on which env vars are present, then iterated in a `for` loop with `try/catch`. The first one that returns text wins; any failure logs `[LLM blurbs] {name} failed: {err}` and continues. If all are exhausted, throws `'All LLM providers exhausted for blurbs'`, which the outer code catches and falls back to using each repo's raw description as the blurb (template fallback — degraded but never fatal).

## Integrations (the data side, not the LLM side)

| Source | Workflow | Output | Auth |
|---|---|---|---|
| GitHub repos + trending | `fetch-repos.yml` | `data/repos-YYYY-MM-DD.json` | `GITHUB_TOKEN` |
| HuggingFace (Spaces, Models, Datasets) | `fetch-hf.yml` | `data/hf-YYYY-MM-DD.json` | `HF_API_TOKEN` |
| Replicate (model listings, no inference) | `fetch-replicate.yml` | `data/replicate-YYYY-MM-DD.json` | `REPLICATE_API_TOKEN` |
| Papers with Code | `fetch-paperswithcode.yml` | `data/paperswithcode-*.json` | none (public) |
| npm + PyPI | `fetch-npm-pypi.yml` | `data/npm-pypi-*.json` | none (public) |
| GitLab | `fetch-gitlab.yml` | `data/gitlab-*.json` | none (public) |
| Ollama Library | `fetch-ollama.yml` | `data/ollama-*.json` | scrape (no API) |
| Product Hunt | `fetch-producthunt.yml` + `fetch-launches.yml` | `data/launches-*.json` | `PH_DEV_TOKEN2` |

`generate-digest.yml` runs at 14:00 UTC daily after the fetchers complete, reads the latest snapshot from each, applies cooldown/seen-ledger filters, calls the LLM cascade once with all candidates batched into a single prompt, parses JSON-mapped blurbs back, and writes `_posts/YYYY-MM-DD-github-digest.md` plus `_repos/*.md` catalog entries.

## Why this design

- **Cost-zero by default** — every tier is free or self-hosted; the unfunded Haiku at the bottom is a tripwire, not a billing risk.
- **Quality-first ordering** — tier 1 is the local model (free, fast over LAN, controllable), tier 2 is frontier-class (405B, Nemotron Ultra), then tiers 3-5 are smaller/older fallbacks.
- **Graceful degradation** — if every LLM fails, blurbs become repo descriptions. Digest still ships.
- **One batch call per day** — the entire prompt with all repos goes in one request, returning a JSON map. Keeps the system well under every provider's rate limit and makes failover atomic (no partial-blurb states).
- **Single-key, multi-model within NIM** — one `NVIDIA_API_KEY` unlocks all 5 NIM models, so per-model rate limits failover *within* tier 2 before dropping to Gemini.

## Maintenance notes

- **NIM model rotation:** preview-tier models can be deprecated/renamed when they graduate to production. If GitHub Actions logs show repeated 4xx from a specific NIM model, prune it from the list in `generate-digest.yml` and replace with a current preview model from `build.nvidia.com/models`.
- **Spend monitoring:** see `.management/api-costs.md` for billing dashboards. Expected monthly cost is $0.
- **Adding a new tier:** push a `{ name, call }` object onto the `providers` array inside `tryCascadeBlurb()`, gated by an env-var check. Place ahead of the tier you want it to outrank.
