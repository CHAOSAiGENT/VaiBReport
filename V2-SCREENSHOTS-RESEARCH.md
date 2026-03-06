# V2 Screenshots & Visual Previews — Service Comparison

**Companion to:** V2-PUNCHLIST.md (Item 3)
**Last updated:** 2026-03-05

---

## The Problem

A repo listing with just text is forgettable. A repo listing with a screenshot of the actual product is 3-5x more likely to get a click. For the bento/card grid layout we're building, visual previews are what make the difference between "a list" and "something worth browsing."

We need screenshots for every featured repo. Some repos will have great README media we can extract. Most won't. So we need a fallback that works for everything.

---

## Approach Layers (Stack These)

The recommendation is to layer these, not pick one:

| Layer | What | Coverage | Cost | Quality |
|-------|------|----------|------|---------|
| A. GitHub OpenGraph | Auto-generated social cards | 100% of repos | Free | Generic but consistent |
| B. README media extraction | GIFs, videos, screenshots from READMEs | ~30-40% of repos | Free | High (authentic product shots) |
| C. Screenshot service | Headless browser captures of repo homepages/demos | ~70-80% of repos with a live URL | $0-50/mo | Medium-high |
| D. AI-generated cards | Branded preview cards with metadata | 100% of repos | ~$0.01-0.05/card | Consistent, branded |

**Recommended stack:** A (baseline for everything) + B (where available) + C or D (for the card grid hero images).

---

## Layer A: GitHub OpenGraph Images

**What it is:** GitHub generates a social preview image for every repo. It shows the repo name, description, star count, language, and contributor avatars on a dark gradient background.

**URL pattern:**
```
https://opengraph.githubassets.com/{hash}/{owner}/{repo}
```

The hash isn't predictable, but you can get the actual OG image URL by fetching the repo page and reading the `<meta property="og:image">` tag. Alternatively, use the pattern:
```
https://repository-images.githubusercontent.com/{repo_id}
```

**Simpler approach:** Just use the GitHub API response — the `owner.avatar_url` field gives you the org/user avatar, which works as a consistent thumbnail. Not as good as a full screenshot, but zero-effort.

**Pros:**
- Free, no API calls beyond what we already make
- 100% coverage — every repo has one
- Consistent visual style

**Cons:**
- Generic — doesn't show the actual product
- Dark themed, may not fit all blog designs
- GitHub could change the format without notice

**Implementation:** In `generate-digest.yml`, when building the repo data for the card grid, include the avatar_url (already in our fetch data) and construct the OG image URL. The card template uses the OG image as the card background/hero, with the avatar as a small icon.

**Effort:** ~1 hour. Almost no code changes.

---

## Layer B: README Media Extraction

**What it is:** Parse each repo's README.md and extract any images, GIFs, or video embeds. Many well-maintained repos include product screenshots or demo GIFs in their README.

**How it works:**
1. Fetch the README via GitHub API: `GET /repos/{owner}/{repo}/readme` (returns base64-encoded content)
2. Decode and parse the markdown
3. Extract media references:
   - `![alt](url)` — markdown images
   - `<img src="url">` — HTML images
   - `<video>` tags
   - `<a href="url"><img>` — linked images (common for demo GIFs)
4. Filter: skip badges (shields.io, img.shields.io, badge.fury.io), sponsor buttons, CI status icons
5. Take the first non-badge image as the "hero" preview

**Badge filter regex:**
```javascript
const BADGE_PATTERNS = [
  /shields\.io/i,
  /badge\./i,
  /badgen\.net/i,
  /fury\.io/i,
  /travis-ci/i,
  /circleci/i,
  /github\.com\/.*\/workflows\/.*\/badge/i,
  /codecov\.io/i,
  /coveralls\.io/i,
  /img\.shields/i,
  /badge-size/i,
  /snyk\.io/i
];
```

**Pros:**
- Free — uses the GitHub API we already call
- Authentic — shows the actual product as the maintainer wants it seen
- High quality when available — many repos have beautiful hero images

**Cons:**
- Coverage is maybe 30-40% — lots of repos have text-only READMEs or only badges
- Images may be hosted on various CDNs (some may break over time)
- Large GIFs can be heavy for card thumbnails (need to note file size and possibly skip if >5MB)
- Need to handle relative URLs (resolve against `https://raw.githubusercontent.com/{owner}/{repo}/main/`)

**Implementation:** Add a step in `generate-digest.yml` (or a separate `fetch-screenshots.yml` workflow) that processes newly featured repos, fetches their READMEs, extracts the hero image URL, and stores it in a `data/screenshots.json` manifest:

```json
{
  "wasp-lang/open-saas": {
    "hero_url": "https://raw.githubusercontent.com/wasp-lang/open-saas/main/.github/hero.png",
    "source": "readme",
    "extracted": "2026-03-05"
  }
}
```

**Effort:** ~3-4 hours. Moderate complexity (regex parsing, URL resolution, badge filtering).

---

## Layer C: Screenshot Services

These use headless browsers (Chromium) to capture a webpage as an image. You point them at a URL and get back a PNG/JPEG.

### Option C1: Self-Hosted Playwright in GitHub Actions

**What it is:** Run Playwright (headless Chromium) inside a GitHub Action to screenshot each repo's homepage or demo URL.

**How it works:**
```yaml
- name: Install Playwright
  run: npx playwright install chromium

- name: Capture screenshots
  run: |
    node << 'SCRIPT'
    import { chromium } from 'playwright';
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    for (const repo of repos) {
      const url = repo.homepage || repo.html_url;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.screenshot({ path: `static/screenshots/${repo.full_name.replace('/', '_')}.png` });
    }
    await browser.close();
    SCRIPT
```

**What to screenshot:**
- If the repo has a `homepage` field (live demo URL) → screenshot that
- If not → screenshot the GitHub repo page itself (less useful, but consistent)
- Could also screenshot the README rendered page at `github.com/{owner}/{repo}#readme`

**Pros:**
- Free (runs on GitHub Actions minutes)
- Full control over viewport size, wait conditions, element hiding
- Can crop, resize, optimize images in the same step
- No third-party dependency

**Cons:**
- Slow — each screenshot takes 5-15 seconds (page load + render + capture)
- For 15 repos/day, that's 1-4 minutes of Actions time
- Some sites block headless browsers or show CAPTCHAs
- Sites with auth walls won't render
- GitHub Actions minutes are free for public repos but limited for private
- Playwright install adds ~300MB to the runner

**Cost:** Free for public repos. ~$0.008/minute for private repos (negligible).

**Effort:** ~4-5 hours. Need to handle timeouts, failures, image optimization.

---

### Option C2: ScreenshotOne

**URL:** https://screenshotone.com
**What it is:** Screenshot-as-a-service API. Send a URL, get back an image.

**API example:**
```
https://api.screenshotone.com/take?
  access_key=YOUR_KEY
  &url=https://github.com/wasp-lang/open-saas
  &viewport_width=1280
  &viewport_height=720
  &format=webp
  &image_quality=80
  &block_ads=true
  &block_cookie_banners=true
  &cache=true
  &cache_ttl=86400
```

**Pricing:**
- Free: 100 screenshots/month
- Starter: $4.99/mo — 1,000 screenshots
- Growth: $13.99/mo — 5,000 screenshots

For 15 repos/day × 30 days = 450 screenshots/month, the Starter plan covers it.

**Pros:**
- Dead simple API — one HTTP call per screenshot
- Handles ads, cookie banners, lazy loading automatically
- Caching built in (same URL returns cached image)
- WebP output (smaller files)
- Fast (typically 2-5 seconds)

**Cons:**
- Monthly cost ($5-14/mo)
- Third-party dependency
- Rate limits on lower tiers
- Less control over timing/waits for SPAs

**Effort:** ~2 hours. Very straightforward integration.

---

### Option C3: Urlbox

**URL:** https://urlbox.io
**What it is:** Similar to ScreenshotOne but more feature-rich. Popular with dev tools.

**Pricing:**
- Starter: $19/mo — 2,000 screenshots
- Plus: $49/mo — 10,000 screenshots
- No free tier.

**Pros:**
- Excellent rendering quality
- Full-page screenshots, element selection, custom CSS injection
- S3/webhook delivery options
- Retina support

**Cons:**
- More expensive than ScreenshotOne
- Overkill for our use case (we just need basic page captures)

**Effort:** ~2 hours. Similar integration to ScreenshotOne.

---

### Option C4: Microlink

**URL:** https://microlink.io
**What it is:** Link preview and screenshot API. Also extracts metadata (title, description, image, video) from any URL — which overlaps with our Layer B needs.

**Pricing:**
- Free: 50 requests/day (enough for our daily batch!)
- Pro: $15.90/mo — 15,000 requests

**Interesting angle:** Microlink's `screenshot` endpoint + its `metadata` endpoint could replace both Layer B (README media) and Layer C (screenshots) in a single API:

```
https://api.microlink.io/?url=https://github.com/wasp-lang/open-saas&screenshot=true&meta=true
```

Returns: screenshot image + extracted title, description, OG image, video URL, etc.

**Pros:**
- Free tier might be enough (50/day > our 15/day)
- Combines screenshot + metadata extraction
- Well-documented, popular in the dev community
- Handles SPAs, lazy loading, cookie banners

**Cons:**
- Free tier has watermark (removable on Pro)
- Rate limit on free tier might be tight if we retry failures

**Effort:** ~2-3 hours. Slightly more integration work to use both screenshot and metadata features.

---

## Layer D: AI-Generated Preview Cards

**What it is:** Instead of capturing a live screenshot, generate a branded card image using a template with the repo's metadata (name, description, stars, language, category badge, hotness streak).

**How it works:**
- Use a Node.js image generation library (Sharp, Canvas, or Satori + Resvg) in a GitHub Action
- Template: dark background, repo name in large type, one-liner description, star count badge, language pill, category color bar
- Consistent visual identity across all cards
- Generated at build time, stored in `static/cards/`

**Example using Satori (Vercel's OG image library):**
```javascript
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const svg = await satori(
  <div style={{ display: 'flex', flexDirection: 'column', padding: 40, background: '#0d1117', color: '#e6edf3', width: 600, height: 315 }}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{repo.full_name}</div>
    <div style={{ fontSize: 16, color: '#8b949e', marginTop: 12 }}>{repo.description}</div>
    <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
      <span>⭐ {repo.stargazers_count}</span>
      <span>{repo.language}</span>
      <span style={{ background: categoryColor, padding: '2px 8px', borderRadius: 4 }}>{repo.category}</span>
    </div>
  </div>,
  { width: 600, height: 315, fonts: [/* loaded font */] }
);

const png = new Resvg(svg).render().asPng();
```

**Pros:**
- 100% coverage — works for every repo regardless of whether they have a homepage
- Consistent brand identity
- Fast generation (no network requests to external sites)
- No monthly cost
- Can include our own metadata (hotness streak, category) that screenshots wouldn't show

**Cons:**
- Doesn't show the actual product — it's a metadata card, not a product shot
- Design work needed to make the template look good
- Another build step in the pipeline

**Cost:** Free (runs locally in GitHub Actions).

**Effort:** ~4-6 hours for a polished template. Can iterate on design over time.

---

## Recommendation

**Phase 1 (ship now with V2 card grid):**
Layer A (GitHub OG/avatar) + Layer D (AI-generated cards)
- Every card gets a generated preview card as the hero image
- The org avatar appears as a small icon on the card
- Zero external dependencies, zero monthly cost
- Looks consistent and professional

**Phase 2 (enhance over time):**
Add Layer B (README media extraction)
- When a repo has a real product screenshot or demo GIF in its README, use that instead of the generated card
- This gives the best repos their authentic visuals while maintaining coverage for the rest

**Phase 3 (if the audience demands richer visuals):**
Add Layer C (Microlink or ScreenshotOne)
- For repos with live demo URLs, capture actual screenshots
- Microlink's free tier might be enough; ScreenshotOne Starter ($5/mo) if not
- Only worth doing if traffic and engagement justify the effort

---

## Storage & Delivery

**Where screenshots live:**
- `static/screenshots/` in the repo for generated cards and extracted README images
- Named by repo: `wasp-lang_open-saas.webp`

**Manifest file:** `data/screenshots.json`
```json
{
  "wasp-lang/open-saas": {
    "card": "static/screenshots/wasp-lang_open-saas-card.webp",
    "readme_hero": "https://raw.githubusercontent.com/wasp-lang/open-saas/main/.github/hero.png",
    "screenshot": null,
    "updated": "2026-03-05"
  }
}
```

**Image optimization:**
- Generate at 600×315 (social card aspect ratio, matches bento grid cards)
- WebP format (40-60% smaller than PNG)
- Max file size target: 50KB per card
- Run `sharp` or `imagemin` in the Action to optimize

**Repo size concern:**
- 15 repos/day × 50KB × 365 days = ~267MB/year of images
- That's manageable for a year or two
- When migrating to own platform (V2 item 7), move images to Cloudflare R2 or S3

---

## Decision Needed

No immediate decision required. Phase 1 (OG images + generated cards) needs nothing from Peter — it's all code. Phase 2 and 3 can be evaluated once the card grid is live and we can see what looks good.
