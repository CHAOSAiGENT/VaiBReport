# VaiBReport — Post-MVP Backlog

**Tracking file for bugs, improvements, and future features.**
**Updated:** 2026-03-24

All Phases 1–4 shipped as of 2026-03-06. This file tracks everything from here.

---

## 🐛 Bugs

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| B-01 | `digestDate` ReferenceError in `generate-digest.yml` — digest failing daily since 2026-03-06 | ✅ Fixed 2026-03-24 | `digestDate` was defined inside async IIFE but referenced by `createRepoEntry()` at module scope. Fixed by passing it as a parameter. |
| B-02 | GitHub Pages serving 404 — site unreachable since launch | ✅ Fixed 2026-03-24 | `_config.yml` and README had `chaosagent.github.io` (typo). Correct URL is `chaosaigent.github.io`. |
| B-03 | Leaderboard links broken — repo names in all leaderboard tables not hyperlinking correctly | ✅ Fixed 2026-03-24 | `repo.slug` was null in Liquid template. Fixed by capturing `repo.url` (Jekyll's real URL) and using it directly in `link()`. |

---

## 🔜 Remaining V2 Items

| # | Feature | Blocked on | Priority |
|---|---------|-----------|----------|
| V-01 | **Product Hunt data source** | PH API key (register OAuth app at producthunt.com/v2/oauth/applications) | Medium |
| V-02 | **Owned platform migration** | Domain name, DNS access, hosting choice (Vercel/Netlify/CF Pages), framework choice (Next.js vs Astro vs keep Jekyll), Umami instance URL + site ID, PostHog API key | Low — do after email |
| V-03 | **Email digest delivery** | Resend API key, sending domain, from address, frequency (daily/weekly/choice), subscriber collection method, email template vibe | Medium |

---

## 💡 Ideas / Future Enhancements

| # | Idea | Source | Notes |
|---|------|--------|-------|
| I-01 | Screenshot service for repo cards — Phase 2 visual upgrade | V2-SCREENSHOTS-RESEARCH.md | Phase 1 (OG images) done. Phase 2 = README media extraction. Phase 3 = ScreenshotOne/Microlink if warranted. |
| I-02 | README media extraction — pull demo GIFs/videos from repo READMEs | V2-PUNCHLIST.md §3c | No prereqs needed from Peter. |
| I-03 | Staggered category fetch runs | V2-PUNCHLIST.md §11 | Deferred — only needed if GitHub rate limiting becomes a problem. Currently well under limits. |
| I-04 | Weekly digest rollup email | V2-PUNCHLIST.md §8 | Aggregates week's daily posts into one email. Part of V-03 scope. |
| I-05 | RSS feed promotion | V2-PUNCHLIST.md §9 | Feed likely exists at `/VaiBReport/feed.xml` via jekyll-feed. Just needs an icon/link in site header. |
| I-06 | Awesome Lists signal — surface repos recently added to `awesome-*` lists | V2-PUNCHLIST.md §10k | Watch list. Medium audience fit. |

---

## ✅ Completed (reference)

All Phases 1–4 shipped 2026-03-05 to 2026-03-06. See `V2-PUNCHLIST.md` for full history.

Short list:
- AI editorial blurbs (Gemini)
- Running results page (`/repos/` bento card grid)
- OG image previews
- Client-side search, sort, filter chips
- Hotness streak tracking + leaderboard
- Star velocity tracking
- All 8 data sources (HF, Replicate, GitLab, npm/PyPI, Ollama, Papers with Code, launches, GitHub)
