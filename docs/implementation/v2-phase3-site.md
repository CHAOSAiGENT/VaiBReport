# V2 Phase 3 — Site Experience Upgrade

Run ALL tasks in order. Read CONTEXT.md first for project state. This prompt covers: running results page (repo catalog), sort/search/tagging, OG image cards, site description update, and about page refresh.

---

## Task 1: Add `_repos/` Jekyll collection

Create a Jekyll collection for individual repo/item entries. These are persistent catalog entries that accumulate over time, separate from daily digest posts.

### 1a. Update `_config.yml`:

Add collections config (keep all existing config, just add):

```yaml
collections:
  repos:
    output: true
    permalink: /repos/:name/

defaults:
  - scope:
      path: ""
      type: "repos"
    values:
      layout: "repo"
```

### 1b. Create `_layouts/repo.html`:

This is the individual repo page layout. Use the minima theme's base layout. The page should show:

- Repo/item name as h1
- Source badge (GitHub, HuggingFace, Replicate, etc.)
- Editorial blurb (from `description` front matter)
- Key stats in a clean row: stars/downloads/likes, language, category
- Hotness streak badge if applicable (from front matter `streak` and `appearances`)
- Link to the actual repo/model/space/package URL
- OG image preview (from front matter `og_image`)
- Date first featured and times featured
- "Back to catalog" link

Keep it clean and minimal. Use inline CSS in the layout (no separate CSS file needed — minima handles the basics). Style the source badge with a subtle colored pill: GitHub=gray, HuggingFace=yellow, Replicate=blue, GitLab=orange, npm=red, PyPI=blue, Ollama=green, PaperswithCode=teal, Launches=purple.

### 1c. Create `_repos/.gitkeep` so the directory exists.

---

## Task 2: Update `generate-digest.yml` to create `_repos/` entries

This is the biggest task. Modify the digest generator to ALSO create/update `_repos/` markdown files for every item featured in the digest.

### Architecture:

After building the markdown post (the existing code) and before the git commit step, add a new section that loops through ALL featured items from ALL platforms and creates `_repos/` entries.

### For each featured item, create a file:

**Filename:** `_repos/{slug}.md` where slug is the item ID sanitized: replace `/` with `--`, lowercase, strip non-alphanumeric except hyphens.

Examples:
- `wasp-lang/open-saas` → `_repos/wasp-lang--open-saas.md`
- `Qwen/Qwen3-0.6B` → `_repos/qwen--qwen3-0.6b.md`
- `npm-express` → `_repos/npm-express.md`

**Front matter:**

```yaml
---
layout: repo
name: "wasp-lang/open-saas"
source: github
url: "https://github.com/wasp-lang/open-saas"
description: "The editorial blurb from Gemini, or the repo description if no blurb"
category: "SaaS starters and templates"
language: "TypeScript"
stars: 8500
downloads: 0
likes: 0
og_image: "https://opengraph.githubassets.com/1/wasp-lang/open-saas"
first_featured: "2026-03-07"
last_featured: "2026-03-07"
times_featured: 1
streak: 3
appearances: 12
tags: [github, saas, typescript]
---
```

**Body:** The editorial blurb as a single paragraph. If the item already has a `_repos/` file, UPDATE only `last_featured`, `times_featured` (increment), `stars`/`downloads`/`likes` (latest values), `streak`, `appearances`, and `description` (if a new blurb was generated). Do NOT overwrite `first_featured`.

### Platform-specific field mapping:

| Platform | `source` | `url` | `stars` | `downloads` | `likes` | `og_image` |
|----------|----------|-------|---------|-------------|---------|------------|
| GitHub | `github` | `html_url` | `stargazers_count` | 0 | 0 | `https://opengraph.githubassets.com/1/{full_name}` |
| HuggingFace Space | `huggingface-space` | `https://huggingface.co/spaces/{id}` | 0 | 0 | `likes` | `https://huggingface.co/api/spaces/{id}/screenshot` |
| HuggingFace Model | `huggingface-model` | `https://huggingface.co/{id}` | 0 | `downloads` | `likes` | _(empty)_ |
| HuggingFace Dataset | `huggingface-dataset` | `https://huggingface.co/datasets/{id}` | 0 | `downloads` | 0 | _(empty)_ |
| Replicate | `replicate` | `url` | 0 | 0 | 0 | `cover_image_url` or empty |
| Papers with Code | `paperswithcode` | `url` | `github_stars` | 0 | 0 | _(empty)_ |
| npm | `npm` | `url` | 0 | `weekly_downloads` | 0 | _(empty)_ |
| PyPI | `pypi` | `url` | 0 | `recent_downloads` | 0 | _(empty)_ |
| GitLab | `gitlab` | `url` | `star_count` | 0 | 0 | _(empty)_ |
| Ollama | `ollama` | `url` | 0 | 0 | 0 | _(empty)_ |
| Launches | `launch` | `url` | 0 | 0 | `upvotes` | _(empty)_ |

### Hotness data:

Load `data/hotness.json` and look up each GitHub repo's `streak` and `appearances`. For non-GitHub items, set both to 0 for now.

### Implementation approach:

Add a helper function `createRepoEntry(item, source, section, blurbs, hotness)` that:
1. Builds the slug from the item ID
2. Checks if `_repos/{slug}.md` already exists
3. If exists: read it, parse front matter (use a simple regex — don't add a YAML library), update the mutable fields, write back
4. If new: create with all fields populated
5. Returns the slug for git add

Call this function for every featured item across all platforms. Collect all slugs and add `_repos/` to the git add step.

### Update the git add line:

Change:
```
git add _posts/ data/seen*.json data/health-*.json config/spotlight.json
```
To:
```
git add _posts/ _repos/ data/seen*.json data/health-*.json config/spotlight.json
```

---

## Task 3: Create the catalog browse page

Create `repos.md` in the repo root:

```markdown
---
layout: page
title: Catalog
permalink: /repos/
---
```

Below the front matter, add an HTML/JS block that:

1. Loads all `_repos/` entries (Jekyll makes them available as `site.repos`)
2. Renders them as a **bento card grid** — responsive CSS grid, 3 columns on desktop, 2 on tablet, 1 on mobile
3. Each card shows:
   - OG image thumbnail at top (if `og_image` exists, else a gradient placeholder with the source icon)
   - Source badge pill (colored by platform, top-right corner)
   - Item name (linked to the individual `/repos/{slug}/` page)
   - Editorial blurb (truncated to 2 lines with CSS)
   - Stats row: stars/downloads/likes icon + count, language pill
   - Hotness badge if streak > 3: "🔥 {streak}-day streak"
   - Category tag pill
   - "First seen: {date}" small text
4. Default sort: most recently featured first (`last_featured` descending)
5. Style the cards with subtle shadows, rounded corners, hover lift effect. Keep it modern but not over-designed. Dark text on white cards. Source badge colors per Task 1b.

Use Liquid templating for the data, vanilla CSS for the grid, and vanilla JS for the interactive features (Task 4).

**Important:** The card grid CSS should be embedded in the page (between `<style>` tags), NOT in a separate file. Jekyll + minima makes external CSS annoying. Keep it self-contained.

---

## Task 4: Add sort, search, and tag filtering

Add client-side interactivity to the catalog page (`repos.md`):

### 4a. Search bar:

- Text input at the top of the page
- Filters cards in real-time as the user types
- Searches against: name, description, category, language, tags, source
- Use vanilla JS `.filter()` — no need for Lunr.js at this scale (under 1000 items)
- Debounce input to 200ms

### 4b. Sort dropdown:

Options:
- Recently featured (default) — `last_featured` desc
- Most starred — `stars` desc
- Most downloaded — `downloads` desc
- Hottest streak — `streak` desc
- Alphabetical — `name` asc
- Oldest first — `first_featured` asc

### 4c. Filter chips:

Two rows of clickable chips:
1. **Source:** All, GitHub, HuggingFace, Replicate, GitLab, npm, PyPI, Ollama, Papers, Launches
2. **Category:** All, SaaS starters, AI/LLM, Ops/analytics, Marketing/GTM, UGC/creator, Trending, (dynamic from actual categories in data)

Clicking a chip filters the grid. Multiple chips can be active (AND logic within a row, OR logic between rows... actually keep it simple: one source filter + one category filter at a time, clicking a new one replaces the old one).

### 4d. Result count:

Show "Showing X of Y items" above the grid, updates live with filters.

### Implementation:

All JS should be inline in the `repos.md` page (between `<script>` tags). Store card data as a JSON array in a `<script>` tag generated by Liquid, then manipulate the DOM based on filters/search/sort.

```html
<script>
const repoData = [
  {% for repo in site.repos %}
  {
    slug: "{{ repo.slug }}",
    name: "{{ repo.name | escape }}",
    source: "{{ repo.source }}",
    url: "{{ repo.url }}",
    description: {{ repo.description | jsonify }},
    category: "{{ repo.category | escape }}",
    language: "{{ repo.language | escape }}",
    stars: {{ repo.stars | default: 0 }},
    downloads: {{ repo.downloads | default: 0 }},
    likes: {{ repo.likes | default: 0 }},
    og_image: "{{ repo.og_image }}",
    first_featured: "{{ repo.first_featured }}",
    last_featured: "{{ repo.last_featured }}",
    times_featured: {{ repo.times_featured | default: 1 }},
    streak: {{ repo.streak | default: 0 }},
    appearances: {{ repo.appearances | default: 0 }},
    tags: {{ repo.tags | jsonify }},
    permalink: "{{ repo.url | relative_url }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];
</script>
```

Then render/filter/sort from this array.

---

## Task 5: Update site description and about page

### 5a. Update `_config.yml` description:

Change from:
```
Daily GitHub repo picks for solo founders, AI/B2B SaaS builders,
and small business tools.
```
To:
```
Daily curated tools, repos, models, and launches from GitHub,
HuggingFace, Replicate, GitLab, npm, PyPI, Ollama, Papers with Code,
and indie launch platforms. Built for solo founders, AI builders,
and small business tool seekers.
```

### 5b. Rewrite `about.md`:

Replace the current about page content (keep the front matter) with something like:

```
VaiBReport is a daily-updating catalog of curated tools, repositories, models, datasets, and product launches — pulled from nine platforms and filtered through the lens of someone actually building products.

**What we track:**

- **GitHub** — Repos for SaaS starters, AI/LLM infra, ops tools, marketing/GTM, and UGC/creator tools
- **HuggingFace** — Trending Spaces, Models, and Datasets
- **Replicate** — Popular hosted AI models
- **Papers with Code** — Research papers with real, starred implementations
- **npm & PyPI** — Packages gaining adoption this week
- **GitLab** — Repos that don't live on GitHub
- **Ollama** — Models you can run locally
- **DevHunt, Hacker News, BetaList, Uneed** — New product launches for builders

**Who it's for:** Solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators.

**How it works:** Data is collected automatically via GitHub Actions from all nine platforms. Editorial blurbs are generated by Gemini. The blog runs on Jekyll + GitHub Pages. Every item ever featured lives in the [catalog](/repos/) for browsing, searching, and filtering.

Built by [CHAOSAiGENT](https://github.com/CHAOSAiGENT).
```

### 5c. Update `index.md`:

Change from just `layout: home` to include a brief hero/intro. Replace with:

```markdown
---
layout: home
title: VaiBReport
---

Daily curated picks from GitHub, HuggingFace, Replicate, and 6 more platforms. [Browse the full catalog →](/repos/)
```

---

## Task 6: Add navigation link for Catalog

Minima theme supports header links via `_config.yml`. Add:

```yaml
header_pages:
  - repos.md
  - about.md
```

This puts "Catalog" and "About" in the nav bar. The `repos.md` page title is "Catalog" (from Task 3), so it will show as "Catalog" in the nav.

---

## Task 7: Update V2-PUNCHLIST.md

Mark these items as done:
- Item 1 (AI-quality writeups) — DONE (Gemini editorial blurbs)
- Item 2 (Running results page) — DONE (bento card grid catalog)
- Item 3 Phase 1 (Screenshots) — DONE (OG images in cards)
- Item 4 (Sort/search/tagging) — DONE (client-side search, sort, filter chips)
- Item 5 (Hotness streak) — DONE (data collection + badges in cards)
- Item 9 (RSS feed) — DONE (already existed)
- Item 10a-10i (All platforms) — DONE (Phase 2 complete)

Update the priority order section to reflect remaining work:
- Phase 3-4 remaining: Item 6 (Leaderboard), Item 10j (Product Hunt), Item 7 (Owned platform), Item 8 (Email), Item 12 (Enhanced trending)

---

## Task 8: Verify everything

1. Run `ls _repos/` — directory should exist
2. Run `ls _layouts/repo.html` — layout should exist
3. Verify `_config.yml` has collections config, updated description, header_pages
4. Verify `repos.md` exists with card grid HTML/CSS/JS
5. Verify `about.md` has updated content
6. Verify `generate-digest.yml` has the `createRepoEntry` function and `_repos/` in git add
7. Verify `index.md` has the hero intro
8. Run `cat V2-PUNCHLIST.md | head -20` to confirm items marked done

Commit everything with message: `feat: add repo catalog with bento grid, search, sort, and filter`

---

## IMPORTANT NOTES:

- Do NOT modify the existing digest post format or any fetcher workflow. Only EXTEND `generate-digest.yml` to also create `_repos/` entries.
- The `_repos/` entries are created by the digest generator, not manually. They accumulate automatically.
- Keep all CSS/JS inline in the page files. No separate asset files.
- Test that the Liquid templating in `repos.md` doesn't have syntax errors by checking for balanced braces and proper `jsonify` usage.
- The OG image URL for GitHub repos is: `https://opengraph.githubassets.com/1/{owner}/{repo}` — this is a real, working URL pattern.
- For the front matter parser in `generate-digest.yml`: use a simple regex approach. Split on `---`, parse key-value pairs. Don't add js-yaml or gray-matter as dependencies.
