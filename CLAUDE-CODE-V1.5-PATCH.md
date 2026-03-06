# Claude Code V1.5 Patch Prompt

**Context:** VaiBReport is a daily GitHub digest blog. V1 is operational (3 workflows, Jekyll blog on GitHub Pages, automation chain works). A test session revealed 5 issues that need fixing before the next cron run. Read `VaiBReport-SPEC.md` and `CONTEXT.md` for full project context.

**Important:** Do NOT delete or archive any pages or files. Edit in place. Commit when all tasks are done.

---

## Task 1: Fix UGC Queries (Critical — affects tomorrow's digest)

The UGC/Social queries in `config/queries.json` are too broad. They currently pull in repos like `public-apis` (404K★), `fastapi`, `puppeteer`, `playwright`, and `ComfyUI` — none of which are UGC/social tools. The free-text search matches too many false positives.

**Peter's UGC focus:** Tools around automation of content creation, art/design generation, digital twins, social media scheduling/management, and things that make UGC easier for creators and small businesses.

**What to do:**

Replace the `ugc_social_queries` array in `config/queries.json` with tighter, more specific queries. Run **multiple experimental query sets** against the GitHub Search API to find the best balance of relevance and volume. Here are starting points — test all of them, keep the ones that return genuinely relevant repos, discard the ones that pull in junk:

**Experiment Set A — Tight topic-based (may return few results):**
```
"topic:social-media-scheduling stars:>20 pushed:>2025-01-01 sort:stars"
"topic:content-creation-tool stars:>20 pushed:>2025-01-01 sort:stars"
"topic:video-generation stars:>50 pushed:>2025-01-01 sort:stars"
"topic:ai-art stars:>50 pushed:>2025-01-01 sort:stars"
```

**Experiment Set B — Narrow free-text (should be more precise than current):**
```
"social media scheduler OR social media scheduling tool stars:>30 pushed:>2025-01-01 sort:stars"
"AI art generator OR AI image generation tool stars:>50 pushed:>2025-01-01 sort:stars"
"content creator tool OR creator economy stars:>30 pushed:>2025-01-01 sort:stars"
"digital twin OR avatar generation stars:>30 pushed:>2025-01-01 sort:stars"
"video editing tool OR video generation tool stars:>50 pushed:>2025-01-01 sort:stars"
"UGC platform OR user generated content stars:>30 pushed:>2025-01-01 sort:stars"
```

**Experiment Set C — Known-good repo neighborhoods:**
```
"social media management self-hosted stars:>20 pushed:>2025-01-01 sort:stars"
"AI image generation open source stars:>100 pushed:>2025-01-01 sort:stars"
"text to video OR text to image stars:>100 pushed:>2025-01-01 sort:stars"
"instagram automation OR tiktok automation stars:>30 pushed:>2025-01-01 sort:stars"
"open source design tool stars:>50 pushed:>2025-01-01 sort:stars"
```

**Experiment Set D — Repo name/description patterns:**
```
"social media in:name,description stars:>200 pushed:>2025-01-01 language:TypeScript sort:stars"
"social media in:name,description stars:>200 pushed:>2025-01-01 language:Python sort:stars"
"content creation in:name,description stars:>100 pushed:>2025-01-01 sort:stars"
"image generation in:name,description stars:>200 pushed:>2025-01-01 sort:stars"
```

**Testing process:**
1. For each query, run it against `https://api.github.com/search/repositories?q=<query>&per_page=10` and examine the top 10 results
2. Score each query: how many of the top 10 are genuinely UGC/creator/art/automation tools vs. false positives?
3. Keep queries that score 6+/10 relevance
4. Discard queries that return mostly false positives
5. Aim for a final set of 5-8 queries that together cover: social scheduling, AI art/image gen, video creation, digital twins/avatars, creator tools, content automation
6. Write the winning queries to `config/queries.json`

**Also update the `pushed:>` dates** across ALL query groups while you're in here — bump them to reflect a rolling 12-month window from today.

---

## Task 2: Fix UGC Category Assignment in generate-digest.yml

The `assignCategory()` function in `.github/workflows/generate-digest.yml` has an overly broad UGC regex that matches anything containing "content," "creator," or common API names.

**Current (too broad):**
```javascript
if (g.includes('ugc_social') ||
    all.match(/social.media|content.creat|tiktok|instagram|youtube.api|video.generat|ugc|creator/))
  return 'UGC, social media and creator tools';
```

**Fix:** Tighten the regex AND add a negative filter for known false-positive patterns:

```javascript
// Negative filter — repos that should NEVER be categorized as UGC
const UGC_EXCLUSIONS = /public.apis|awesome-|free-for-dev|fastapi|playwright|puppeteer|firecrawl|web.scraping|headless.browser|http.client|api.framework|web.framework/i;

function assignCategory(repo) {
  const t = (repo.topics || []).join(' ').toLowerCase();
  const d = (repo.description || '').toLowerCase();
  const g = (repo._query_group || '').toLowerCase();
  const all = `${t} ${d} ${g}`;

  // UGC — must be from ugc_social query group OR match tight keywords, AND not excluded
  if (!UGC_EXCLUSIONS.test(all)) {
    if (g.includes('ugc_social') ||
        all.match(/social.media.(?:schedul|manag|post|automat)|content.creat(?:ion|or).tool|video.generat|video.edit|ai.art|ai.image|image.generat|digital.twin|avatar.generat|ugc.platform|creator.econom|tiktok.(?:bot|tool|schedul)|instagram.(?:bot|tool|schedul)/))
      return 'UGC, social media and creator tools';
  }

  // ... rest of categories unchanged
}
```

The key changes: UGC regex now requires more specific compound phrases (not just "content" or "creator" alone), and the exclusion list blocks known mega-repos that aren't UGC tools.

---

## Task 3: Add Mega-Repo Filter for Trending

Trending currently surfaces perennial fixtures like `awesome-python` (285K★), `transformers` (157K★), and `free-for-dev` (118K★). These aren't genuinely "trending today" — they're just permanently popular.

**Add to generate-digest.yml, in the trending filtering section:**

```javascript
// Filter out perennial mega-repos from trending
// If a repo has >80K stars AND was created more than 2 years ago, it's not "trending" in a useful sense
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;
const trendingFiltered = trendingPool.filter(r => {
  if (r.stargazers_count > 80000) {
    const created = r.created_at ? new Date(r.created_at) : null;
    if (!created || (today - created) > TWO_YEARS_MS) {
      console.log(`Skipping perennial mega-repo from trending: ${r.full_name} (${r.stargazers_count}★)`);
      return false;
    }
  }
  return true;
});
```

Use `trendingFiltered` instead of `trendingPool` for the subsequent trending selection logic.

**Note:** Trending-scraped repos may have `created_at: null` (the Cheerio scraper doesn't extract creation date). If `created_at` is null AND stars > 80K, skip it — the combination of unknown age + massive stars almost certainly means it's a perennial fixture.

---

## Task 4: Fix Global Repo Count (Trim, Don't Cap)

`preferences.json` has `max_repos_total: 15` but the generate-digest script doesn't enforce it globally. The simulation produced 28 repos.

**Change `max_repos_total` in `config/preferences.json` to 30.** Peter confirmed 28-30 is fine.

**Then add a trim step in generate-digest.yml** after all sections are populated but before writing the markdown. The trim should remove the lowest-starred repo from the largest section, repeating until the total is at or below `max_repos_total`:

```javascript
// Trim to global max
let totalPicks = trendingOddballs.length + trendingAlso.length;
for (const key of Object.keys(sections)) {
  totalPicks += sections[key].length;
}

while (totalPicks > prefs.max_repos_total) {
  // Find the section with the most entries
  let largestSection = null;
  let largestCount = 0;
  for (const key of Object.keys(sections)) {
    if (sections[key].length > largestCount) {
      largestCount = sections[key].length;
      largestSection = key;
    }
  }
  if (!largestSection || largestCount <= 1) break; // safety valve
  // Remove the lowest-starred repo from the largest section
  sections[largestSection].pop(); // already sorted by stars desc, so pop removes lowest
  totalPicks--;
}
```

This keeps the digest balanced across categories rather than arbitrarily cutting one section entirely.

---

## Task 5: Exclude V2 Planning Files from Jekyll Build

Add these to the `exclude:` list in `_config.yml`:

```yaml
  - V2-PUNCHLIST.md
  - V2-PREREQUISITES.md
  - V2-SCREENSHOTS-RESEARCH.md
  - CLAUDE-CODE-V1.5-PATCH.md
```

Better yet, add a glob pattern if Jekyll supports it, or add a general rule:
```yaml
  - "V2-*.md"
  - "CLAUDE-CODE-*.md"
```

---

## Task 6: Verify and Report

After making all changes:

1. Run the UGC query experiments as described in Task 1. Document results:
   - How many queries tested
   - How many kept (with relevance scores)
   - Total UGC repos returned with the final query set
   - Top 10 UGC repos by stars (confirm these are genuinely UGC/creator tools)

2. Run `generate-digest.yml` locally or via `workflow_dispatch` to verify the digest looks right:
   - UGC section should contain actual social/creator/art tools
   - No mega-repos in trending
   - Total repos should be ≤30
   - All sections should have reasonable picks

3. Confirm the blog still builds (push triggers `deploy-blog.yml`)

4. Print a summary table:
   | Check | Result |
   |-------|--------|
   | UGC query relevance (top 10) | ? |
   | Total repos in digest | ? |
   | Mega-repos in trending | ? |
   | Jekyll build succeeds | ? |
   | Planning files excluded | ? |

---

## Order of Operations

1. Task 1 first (query experiments take the most iteration)
2. Tasks 2-5 (code/config changes)
3. Task 6 (verify everything together)

Commit message when done:
```
V1.5 patch: tighten UGC queries, fix category assignment, filter mega-repo trending, add global trim, exclude planning files
```
