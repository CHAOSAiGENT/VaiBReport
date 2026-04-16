# VaiBReport — API Cost Report

**Last updated:** 2026-04-16  
**Expected monthly spend: ~$0**

---

## API Cost Breakdown

| Service | Usage | Cost |
|---|---|---|
| **Gemini 2.5 Flash** | Editorial blurbs (~20-30/day) | Free tier (250 RPD limit — well under) |
| **GitHub API** | Repo search + trending scrape | Free (5K req/hr with token) |
| **HuggingFace API** | Spaces, Models, Datasets listing | Free |
| **Replicate API** | Model *listing/discovery* only (no inference runs) | Free |
| **Papers with Code** | Public REST API | Free |
| **npm / PyPI** | Public APIs | Free |
| **GitLab API** | Public repos | Free |
| **Ollama Library** | Scraping | Free |
| **Product Hunt API** | Keys set, not yet integrated | Free tier (when wired) |
| **Anthropic API** | Wired but unfunded — replaced by Gemini | $0 |

---

## Notes

- **Gemini** is the only AI provider actively used. It runs inside GitHub Actions via `generate-digest.yml`. The free tier allows 250 requests/day; the digest generates ~20-30 blurbs daily — no cost risk.
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
