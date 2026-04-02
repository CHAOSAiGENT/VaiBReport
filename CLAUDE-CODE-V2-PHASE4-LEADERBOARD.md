# V2 Phase 4 — Leaderboard + Enhanced Trending

Run ALL tasks in order. Read CONTEXT.md first for project state.

---

## Task 1: Add star velocity tracking to `fetch-repos.yml`

The hotness tracking in `fetch-repos.yml` already tracks `appearances`, `streak`, `last_seen`, `first_seen`, `last_seen_prev` for each repo. Extend it to also snapshot star counts so we can compute velocity (daily star gain).

### In the hotness tracking section of `fetch-repos.yml`:

After `entry.last_seen_prev = todayStr;`, add:

```javascript
// Star velocity tracking
if (!entry.star_snapshots) entry.star_snapshots = [];
entry.star_snapshots.push({ date: todayStr, stars: r.stargazers_count });
// Keep only last 30 snapshots to avoid bloating the file
if (entry.star_snapshots.length > 30) {
  entry.star_snapshots = entry.star_snapshots.slice(-30);
}
// Compute velocity: stars gained per day over last 7 days
const recent = entry.star_snapshots.filter(s => {
  const d = new Date(s.date);
  const week = new Date();
  week.setDate(week.getDate() - 7);
  return d >= week;
});
if (recent.length >= 2) {
  const first = recent[0];
  const last = recent[recent.length - 1];
  const daysDiff = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
  entry.star_velocity = daysDiff > 0 ? Math.round((last.stars - first.stars) / daysDiff) : 0;
} else {
  entry.star_velocity = 0;
}
```

This gives each repo a `star_velocity` field = average stars gained per day over the last 7 days of observations. A repo gaining 500★/day is genuinely trending; one gaining 2★/day with 100K total stars is just big and static.

---

## Task 2: Improve trending detection in `generate-digest.yml`

Currently, "Trending oddballs" are selected from the scraped GitHub trending page and filtered with the mega-repo filter (>80K★ + >2 years old = skip). This is decent but misses velocity-based trending.

### Replace the trending oddballs selection logic:

Find the section where `trendingOddballs` is built. After the existing trending logic, add a velocity-based supplement:

```javascript
// ── Velocity-boosted trending ──────────────────────
// Add repos with high star velocity that aren't already in any section
const hotness = (() => {
  try { return JSON.parse(fs.readFileSync('data/hotness.json', 'utf8')); }
  catch (e) { return {}; }
})();

const velocityTrending = candidates
  .filter(r => {
    const h = hotness[r.full_name];
    return h && h.star_velocity && h.star_velocity >= 50; // 50+ stars/day
  })
  .filter(r => !featured.includes(r.full_name)) // not already featured
  .filter(r => !isOnCooldown(seen, r.full_name, today, prefs.cooldown_days))
  .sort((a, b) => {
    const va = (hotness[a.full_name] || {}).star_velocity || 0;
    const vb = (hotness[b.full_name] || {}).star_velocity || 0;
    return vb - va;
  })
  .slice(0, 3);

// Merge velocity trending into trendingOddballs (dedup)
const trendingNames = new Set(trendingOddballs.map(r => r.full_name));
for (const r of velocityTrending) {
  if (!trendingNames.has(r.full_name)) {
    trendingOddballs.push(r);
  }
}
```

**Important:** This code should run AFTER the existing trending filtering but BEFORE the trending section is rendered. The `featured` array may not be populated yet at that point — if so, use the sections object to check if a repo is already assigned to a category section. Adapt as needed.

Also, when rendering the trending section, add velocity info to repos that have it:

```javascript
// In the trending oddballs render loop, after the blurb line:
const h = hotness[r.full_name];
const velocityNote = (h && h.star_velocity > 0) ? ` ⚡${h.star_velocity}★/day` : '';
// Append velocityNote to the line
```

---

## Task 3: Create leaderboard page

Create `leaderboard.md` in the repo root.

### Front matter:

```yaml
---
layout: page
title: Leaderboard
permalink: /leaderboard/
---
```

### Page structure:

The leaderboard reads from `_repos/` collection data (same as catalog) but presents it as ranked lists. Build it with Liquid for data + inline HTML/CSS/JS.

### Sections:

**1. 🔥 Hottest Right Now** — Top 10 repos by streak length (only repos with streak > 0)
- Show: rank, name (linked), source badge, streak count, last featured date
- Sort by `streak` descending, then `appearances` descending as tiebreaker

**2. ⚡ Rising Fast** — Top 10 repos by star velocity (only repos with `star_velocity` > 0)
- Show: rank, name (linked), source badge, star velocity (★/day), total stars
- Sort by velocity descending
- Note: This section will only populate once star velocity data starts accumulating (after 2+ days of fetch-repos runs)

**3. 👑 Most Featured** — Top 15 repos by `times_featured`
- Show: rank, name (linked), source badge, times featured count, first featured date
- Sort by `times_featured` descending

**4. 📈 Most Appearances** — Top 15 repos by `appearances` (how many times they showed up in ANY fetch, not just featured)
- Show: rank, name (linked), source badge, appearances count, streak count
- Sort by `appearances` descending

**5. 🆕 Latest Discoveries** — 10 most recently first-featured repos
- Show: name (linked), source badge, category, first featured date
- Sort by `first_featured` descending

### Layout/styling:

- Each section is a numbered table (HTML `<table>` or `<ol>`)
- Same color scheme as the catalog cards (source badge pills, etc.)
- Responsive: table scrolls horizontally on mobile
- Keep it clean — no card grid here, just ranked lists
- All CSS inline in the page (`<style>` block)

### Data approach:

Same as the catalog page — embed all repo data as a JSON array via Liquid, then render with JS:

```html
<script>
const repoData = [
  {% for repo in site.repos %}
  {
    name: "{{ repo.name | escape }}",
    source: "{{ repo.source }}",
    category: "{{ repo.category | escape }}",
    stars: {{ repo.stars | default: 0 }},
    downloads: {{ repo.downloads | default: 0 }},
    likes: {{ repo.likes | default: 0 }},
    streak: {{ repo.streak | default: 0 }},
    appearances: {{ repo.appearances | default: 0 }},
    times_featured: {{ repo.times_featured | default: 1 }},
    first_featured: "{{ repo.first_featured }}",
    last_featured: "{{ repo.last_featured }}",
    star_velocity: {{ repo.star_velocity | default: 0 }},
    permalink: "{{ repo.url | relative_url }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];
</script>
```

Then build each section's table dynamically from the sorted/filtered data.

---

## Task 4: Add `star_velocity` to `_repos/` entries

In `generate-digest.yml`, the `createRepoEntry()` function creates `_repos/` markdown files. Extend it to include `star_velocity` in the front matter.

### For GitHub repos:

Load `data/hotness.json` (it may already be loaded earlier — reuse if so). When creating a `_repos/` entry for a GitHub repo, look up `hotness[full_name]` and add:

```yaml
star_velocity: 150
```

For non-GitHub items, set `star_velocity: 0`.

### When updating existing entries:

Also update `star_velocity` on each run (it's a live metric that changes daily).

---

## Task 5: Add navigation link

Add `leaderboard.md` to the header navigation in `_config.yml`:

```yaml
header_pages:
  - repos.md
  - leaderboard.md
  - about.md
```

---

## Task 6: Update `generate-digest.yml` trending section header

When the trending section uses velocity data, update the section header to reflect it. Change:

```
## Trending oddballs worth a look
```

To dynamically include a note when velocity data is present:

```
## Trending oddballs worth a look
```

(Keep the same header text but add velocity badges to individual items that have them. Don't change the header itself — it's part of the voice.)

The velocity badge format for individual trending items: append `⚡{N}★/day` after the stars count. Example:

```
- [owner/repo](url) – Blurb here (Python, 2.5k★ ⚡150★/day)
```

---

## Task 7: Update V2-PUNCHLIST.md

Mark as done:
- Item 6: Leaderboard view — DONE
- Item 12: Enhanced trending detection — DONE (star velocity tracking + velocity-boosted trending)

Update priority order to show remaining:
- Item 10j: Product Hunt
- Item 7: Owned platform migration
- Item 8: Email digest delivery
- Item 11: Staggered runs (only if rate-limited)

---

## Task 8: Verify

1. Verify `fetch-repos.yml` has star_velocity computation in the hotness tracking section
2. Verify `generate-digest.yml` has velocity-boosted trending logic
3. Verify `generate-digest.yml` createRepoEntry includes star_velocity
4. Verify `leaderboard.md` exists with all 5 sections
5. Verify `_config.yml` header_pages includes leaderboard.md
6. Verify trending items will show ⚡ velocity badges when data is available
7. Run `cat _config.yml | head -35` to confirm nav links

Commit with message: `feat: add leaderboard page and star velocity tracking for enhanced trending`

---

## IMPORTANT NOTES:

- The star velocity data will be empty/zero until fetch-repos.yml has run for at least 2 days with the new code. The leaderboard "Rising Fast" section will show "No data yet" until then. This is expected.
- The `hotness.json` file will grow slightly with `star_snapshots` arrays. Keeping only the last 30 snapshots per repo bounds this at roughly 30 entries × number of tracked repos. With ~200 repos, that's ~6000 entries — well under any size concern.
- Don't modify any fetch workflow other than `fetch-repos.yml`. The velocity tracking only applies to GitHub repos for now (they're the only ones with star counts in the fetch data).
- The leaderboard page uses the same Liquid → JSON → JS pattern as the catalog page. No server-side dependencies.
- The `star_velocity` front matter field in `_repos/` entries is updated on every digest run, so it stays current.
