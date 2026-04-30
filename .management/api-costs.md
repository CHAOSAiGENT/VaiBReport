# VaiBReport — API Cost Report

**Last updated:** 2026-04-30  
**Expected monthly spend: ~$0**

---

## API Cost Breakdown

| Service | Usage | Cost |
|---|---|---|
| **Local Qwen3-14B (LiteLLM)** | Primary blurb generator when theStudio reachable via Tailscale | Free (self-hosted) |
| **NVIDIA NIM (preview)** | Tier 2 — 5 models in rotation: Llama 3.3 70B, Nemotron 70B, Mixtral 8x22B, Qwen 2.5 72B, Llama 3.1 405B | Free (preview tier) |
| **Gemini 2.5 Flash** | Tier 3 fallback for editorial blurbs | Free tier (250 RPD limit — well under) |
| **OpenRouter (Llama 3.3 70B free)** | Tier 4 fallback | Free |
| **Groq (Llama 3.3 70B versatile)** | Tier 5 fallback | Free tier |
| **Anthropic Claude Haiku** | Last-resort fallback (unfunded — would fail if reached) | $0 |
| **GitHub API** | Repo search + trending scrape | Free (5K req/hr with token) |
| **HuggingFace API** | Spaces, Models, Datasets listing | Free |
| **Replicate API** | Model *listing/discovery* only (no inference runs) | Free |
| **Papers with Code** | Public REST API | Free |
| **npm / PyPI** | Public APIs | Free |
| **GitLab API** | Public repos | Free |
| **Ollama Library** | Scraping | Free |
| **Product Hunt API** | Keys set, not yet integrated | Free tier (when wired) |

---

## Notes

- **LLM cascade order** (in `generate-digest.yml`): Local Qwen → NVIDIA NIM (5 models) → Gemini Flash → OpenRouter → Groq → Haiku. First success wins; non-2xx falls through to next provider.
- **NVIDIA NIM** added 2026-04-30 to upgrade quality (frontier models like 405B, Nemotron) and add resilience. Preview tier — model endpoints can be deprecated/renamed when they graduate. Rotate or prune model list when GitHub Actions logs show 4xx from a specific NIM model.
- **Gemini** previously the primary. Now tier 3. Free tier allows 250 requests/day; digest generates ~20-30 blurbs daily — no cost risk.
- **Replicate** token is used to hit the model listing endpoint (discovery), not to run predictions. Inference is what costs money on Replicate; this pipeline doesn't trigger any.
- **Anthropic** API key is set as a GitHub secret but the account has no credits and the code no longer calls it (swapped to Gemini on 2026-03-06).
- **GitHub Actions** minutes: the 9 fetch workflows + digest + deploy run daily. Free tier is 2,000 min/month on public repos (or 500 min on private). Each workflow takes ~30s. Total: ~10 workflows × 1 min × 30 days ≈ 300 min/month. Comfortable on either tier.

---

## Where to Check Actual Spend

| Account | URL |
|---|---|
| Google Cloud (Gemini) | console.cloud.google.com → Billing |
| Replicate | replicate.com/account/billing |
| Anthropic | console.anthropic.com → Billing |
| GitHub Actions | github.com/CHAOSAiGENT/VaiBReport/settings/billing |
