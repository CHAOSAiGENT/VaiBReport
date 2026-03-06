# V2 Prerequisites — What Peter Needs to Furnish

**Companion to:** V2-PUNCHLIST.md
**Last updated:** 2026-03-05

Items are grouped by the priority order from the punchlist. Nothing below is needed all at once — just check off items before we start work on that feature.

---

## Quick Wins

### Item 9: RSS Feed Verification
- [x] ~~RSS link in blog header?~~ **No.** Feed will exist but won't be promoted in nav.

### Item 1: Claude API Writeups
- [x] ~~Anthropic API key~~ **Furnished.** Needs to be added as GitHub Actions secret `ANTHROPIC_API_KEY` (see setup instructions below).
- [x] ~~Which model?~~ **Claude Sonnet** (latest available — `claude-sonnet-4-5-20250929` or newer if available at runtime). Good balance of quality and cost for daily editorial blurbs.
- [x] ~~Tone/voice guidance~~ **Casual dry humor.** Preferred reference: JPW'26 project style (not accessible this session). Fallback: opinionated solo-founder voice, casual, dry humor, concise, no fluff. Can be refined once we see the first AI-generated digest.

### Item 5: Hotness Streak Data Collection
- [ ] **Nothing needed from you.** Claude Code adds this to `fetch-repos.yml`. Start collecting now, display later.

---

## Core V2 Features

### Item 2: Running Results Page (Individual Repo Entries)
- [x] ~~Layout preference~~ **Card grid / bento grid.**
- [x] ~~What shows on each card?~~ **Approved as proposed:** repo name, one-liner, stars, language badge, category badge, hotness streak indicator, date first featured. Will tinker over time.
- [x] ~~URL structure~~ **Default is fine:** `/repos/owner-reponame/`

### Item 4: Sort/Search/Tagging
- [x] ~~Custom tags?~~ **No custom tags yet.** Stick with automatic: category, language, source. Revisit later.

### Item 6: Leaderboard
- [ ] **Nothing needed from you.** Depends on item 5 data accumulating for a couple of weeks first.

### Item 3: Screenshots/Video Previews
- [x] ~~Approach decision~~ **Detailed comparison written up in V2-SCREENSHOTS-RESEARCH.md.** Recommended phased approach: Phase 1 = GitHub OG images + AI-generated cards (free, 100% coverage). Phase 2 = README media extraction. Phase 3 = screenshot service if warranted.
- [ ] **No decision needed now.** Phase 1 needs nothing from Peter. Phase 3 service choice (ScreenshotOne vs Microlink vs self-hosted Playwright) can wait until we see if it's needed.
- [x] ~~Storage location~~ **Repo (`static/screenshots/`) for now.** Move to external (R2/S3) during platform migration.

---

## Platform Evolution

### Item 7: Owned Platform Migration
- [ ] **Domain name** — What domain will this live on? Subdomain of an existing property (e.g., `digest.yourdomain.com`) or something new?
- [ ] **DNS provider** — Where are your domains managed? (Cloudflare, Namecheap, Route53, etc.)
- [ ] **Hosting preference** — Vercel, Netlify, Cloudflare Pages, or self-hosted?
- [ ] **Framework preference** — Next.js (SSR, API routes, dynamic features) vs Astro (mostly static, islands of interactivity) vs keep Jekyll
- [ ] **Umami instance URL** — Tracking script URL and site ID
- [ ] **PostHog project** — API key and instance URL (cloud or self-hosted?)
- [ ] **Phase 1 shortcut (custom domain on GitHub Pages):** Just the domain name and DNS access. Everything else can wait.

### Item 8: Email Digest Delivery
- [ ] **Resend API key** — From your Resend dashboard
- [ ] **Sending domain** — Which domain will emails come from? (Needs DNS verification in Resend)
- [ ] **From address** — e.g., `digest@yourdomain.com`
- [ ] **Frequency preference** — Daily, weekly, or subscriber's choice?
- [ ] **Subscriber collection method** — Simple form on blog? Import from existing list? Seed list?
- [ ] **Email template vibe** — Plain text / minimal HTML / branded? Link to a newsletter you like the look of.

### Item 10: Hugging Face Data Source
- [ ] **HF API token** (optional) — Free tier works without auth but has lower rate limits. Get one at huggingface.co/settings/tokens.
- [ ] **Scope decision** — Spaces only? Models too? Datasets?

### Item 11: Staggered Category Runs
- [ ] **Schedule confirmation** — Proposed: 7am–noon ET spread. Confirm or adjust.

### Item 12: Enhanced Trending Detection
- [ ] **Nothing needed from you.** Pure logic change.

---

## Setup Instructions: API Key as GitHub Secret

**Do NOT put the API key in any file in the repo.** Add it as a GitHub Actions secret:

```
gh secret set ANTHROPIC_API_KEY --repo CHAOSAiGENT/VaiBReport
```

When prompted, paste the key. Or via the GitHub web UI:
1. Go to github.com/CHAOSAiGENT/VaiBReport/settings/secrets/actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: paste the key
5. Click "Add secret"

The `generate-digest.yml` workflow will reference it as `${{ secrets.ANTHROPIC_API_KEY }}`.

---

## Summary: What's Still Needed

**Quick Wins: READY TO GO.** All prerequisites furnished. Peter just needs to run the `gh secret set` command above, then Claude Code can wire up the API integration.

**Core V2: READY TO GO.** All decisions made. Claude Code can start building the card grid, bento layout, and repo collection.

**Platform Evolution: BLOCKED on:**
- Domain name + DNS access (item 7)
- Resend credentials (item 8)
- HF token + scope decision (item 10)
- Schedule confirmation (item 11)
