# PRD: RSS Feed Promotion
**ID:** U-05  
**Status:** Ready to build  
**Priority:** Low  
**Effort:** ~30 minutes  
**Last updated:** 2026-04-01

---

## Problem
The `jekyll-feed` plugin already generates `feed.xml` and it is presumably live at the site URL, but readers have no way to discover it. There is no RSS icon in the site header, no `<link rel="alternate">` autodiscovery tag in the HTML `<head>`, and no visible entry point for readers who use RSS readers. The feed exists but is effectively invisible.

## Goal
Surface the RSS feed through three mechanisms: an icon/link in the site header, an autodiscovery `<link>` tag in the HTML `<head>`, and a verified working URL. Readers who want to follow the digest via RSS can find and subscribe in one click.

## Success Metrics
- RSS feed URL is reachable and returns valid XML at the live site within one deploy
- The `<link rel="alternate" type="application/rss+xml">` tag is present in the rendered HTML `<head>` of the home page
- An RSS icon and link appear in the site header on all pages
- Feed validates cleanly against the W3C Feed Validator

## Scope
### In
- Verify `jekyll-feed` is active in `_config.yml` (`plugins: - jekyll-feed`) and that `feed.xml` resolves at the live GitHub Pages URL
- Add `<link rel="alternate" type="application/rss+xml" title="VaiBReport RSS Feed" href="{{ '/feed.xml' | relative_url }}">` to the site's `<head>` — either via a layout override or by confirming `jekyll-feed` already injects it
- Add an RSS icon and link to the site header — requires a `_includes/header.html` override (since `_config.yml` `header_pages` only supports page links, not arbitrary HTML)
- Use an inline SVG or standard RSS icon (no external icon library dependency)

### Out
- Custom feed filtering (e.g., per-category feeds) — `jekyll-feed` default output is sufficient
- Email subscription or newsletter integration
- Feed pagination or partial content feeds
- Analytics tracking on feed requests

## Technical Spec

### Step 1 — Verify Plugin Config
Confirm `_config.yml` contains:
```yaml
plugins:
  - jekyll-feed
```
If missing, add it. The plugin generates `feed.xml` automatically from `_posts/`.

### Step 2 — Autodiscovery Tag
Check whether `jekyll-feed` already injects the `<link>` tag into `<head>` (it does by default when using the `{% feed_meta %}` Liquid tag). If the site's `_layouts/default.html` or `head.html` include does not already call `{% feed_meta %}`, add it inside `<head>`:

```html
{% feed_meta %}
```

If `jekyll-feed` is not injecting it, add manually:
```html
<link rel="alternate" type="application/rss+xml" 
      title="{{ site.title }} RSS Feed" 
      href="{{ '/feed.xml' | relative_url }}">
```

### Step 3 — Header Icon
Create or modify `_includes/header.html` to add an RSS link. If the theme uses a different include path, locate the correct partial.

Add to the header navigation area:
```html
<a href="{{ '/feed.xml' | relative_url }}" class="rss-link" title="Subscribe via RSS" aria-label="RSS Feed">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="6.18" cy="17.82" r="2.18"/>
    <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
  </svg>
  RSS
</a>
```

### Step 4 — CSS (minimal)
```css
.rss-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--link-color, #e67e22);
  text-decoration: none;
}
.rss-link:hover { text-decoration: underline; }
```

### Step 5 — Verification
After deploy, check:
1. `https://{site-url}/feed.xml` returns XML with status 200
2. View source of home page — confirm `<link rel="alternate" type="application/rss+xml">` is present
3. RSS icon appears in header on desktop and mobile
4. Paste feed URL into https://validator.w3.org/feed/ — confirm no errors

## Dependencies
- `jekyll-feed` gem must be in `Gemfile` and `_config.yml` (likely already present — verify)
- Theme must allow `_includes/header.html` override — standard Jekyll minima theme supports this; confirm the site's theme does too

## Open Questions
- Which theme is the site using? The path to override the header partial depends on the theme (`minima`, `just-the-docs`, custom, etc.) — check `_config.yml` `theme:` value before editing
- Does `jekyll-feed` already inject the autodiscovery tag via `{% feed_meta %}`? Check existing layout files first to avoid duplicating the tag
- Should the RSS link appear in the header nav alongside page links, or in the footer? Footer may be less intrusive if the header is already crowded
