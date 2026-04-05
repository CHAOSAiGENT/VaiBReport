# V2 Prerequisites — Peter's Action Items

**Companion to:** V2-PUNCHLIST.md
**Last updated:** 2026-03-06 (evening)
**Status:** All API secrets set. HuggingFace + Product Hunt integrated. Gemini editorial voice live. Zero credential blockers.

---

## CREDENTIALS — ALL DONE

| Secret | Status | Used By |
|--------|--------|---------|
| `ANTHROPIC_API_KEY` | Set (unfunded — unused) | — |
| `GEMINI_API_KEY` | ✅ Set | `generate-digest.yml` (editorial blurbs) |
| `HF_API_TOKEN` | ✅ Set | `fetch-hf.yml` (HuggingFace Spaces/Models/Datasets) |
| `PH_API_KEY` | ✅ Set | Product Hunt fetch |
| `PH_API_SECRET` | ✅ Set | Product Hunt fetch |
| `REPLICATE_API_TOKEN` | ✅ Set | Ready for `fetch-replicate.yml` (not yet created) |
| `GITHUB_TOKEN` | ✅ Automatic | All workflows |

---

## OPERATIONAL — What's Running

- [x] GitHub repo fetch (daily cron, 12 queries + trending)
- [x] HuggingFace fetch (Spaces, Models, Datasets — 13 items featured so far)
- [x] Product Hunt fetch (newly added)
- [x] Gemini editorial blurbs (2.5 Flash free tier, $0/month)
- [x] HF sections in digest (Spaces, Models, Datasets)
- [x] Hotness tracking (200+ repos in hotness.json)
- [x] Deploy chain (workflow_run trigger)
- [x] V1.5 UGC fixes (tighter queries, exclusions, mega-repo filter, trim to 30)
- [x] Jekyll excludes for planning files

---

## REMAINING — Claude Code Prompts Needed (No Peter Action Required)

These all need Claude Code prompts written and executed. No credentials or decisions needed from Peter — everything is furnished.

### Phase 2 Platform Fetch Workflows

| Platform | API Key Needed? | Status |
|----------|----------------|--------|
| Uneed / OpenHunts | No (scraping) | Needs prompt |
| Papers with Code | No (public API) | Needs prompt |
| npm / PyPI Trending | No (public APIs) | Needs prompt |
| DevHunt | No (scraping) | Needs prompt |
| Ollama Library | No (scraping) | Needs prompt |
| Replicate | ✅ Already set | Needs prompt |
| GitLab | No (public API v4) | Needs prompt |
| Beta/Launch platforms | No (scraping + HN Firebase) | Needs prompt |

### Core V2 Site Features

| Feature | Needs from Peter? | Status |
|---------|-------------------|--------|
| Bento card grid (running results) | No | Needs prompt |
| Sort/search/tagging (Lunr.js) | No | Needs prompt |
| Screenshots (OG images + AI cards) | No | Needs prompt |
| Enhanced trending detection | No | Needs prompt |

---

## FUTURE — Phase 3-4 (Decisions Deferred)

These are not blocking anything. Capture answers here when ready.

### Item 7: Owned Platform Migration
- [ ] Domain name
- [ ] DNS provider
- [ ] Hosting preference (Vercel/Netlify/Cloudflare Pages)
- [ ] Framework (Next.js/Astro/keep Jekyll)

### Item 8: Email Digest
- [ ] Resend API key
- [ ] Sending domain
- [ ] From address
- [ ] Frequency preference

---

## Summary

**Peter has zero action items blocking Phase 2.** Every credential is set, every decision for the current phase is made. The remaining work is writing Claude Code prompts for platform fetch workflows and site features — that's on us, not Peter.
