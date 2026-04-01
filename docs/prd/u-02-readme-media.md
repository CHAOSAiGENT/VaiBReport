# PRD: README Media Extraction for Catalog Cards
**ID:** U-02  
**Status:** Ready to build  
**Priority:** Medium  
**Effort:** ~3 hours  
**Last updated:** 2026-04-01

---

## Problem
Catalog cards for `_repos/` entries currently display owner avatars as fallback images, which are generic and low-signal. Most popular repos have a demo GIF or screenshot in their README that would make the card immediately recognizable and more useful to readers. This media goes unused.

## Goal
For each `_repos/` entry, fetch the GitHub README, extract the first non-badge image or GIF, and store it as `readme_image` frontmatter. The catalog card template uses this image before falling back to `og_image` then the owner avatar. Roughly 30–40% of repos are expected to yield useful media.

## Success Metrics
- 30%+ of `_repos/` entries have a valid `readme_image` populated after the first enrichment run
- Zero broken image URLs on catalog cards (fallback chain must be airtight)
- No rate-limit failures against the GitHub API during weekly enrichment runs
- Enrichment run completes in under 10 minutes for a catalog of up to 500 repos

## Scope
### In
- Fetch raw README content for each `_repos/` entry via the GitHub Contents API (`GET /repos/{owner}/{repo}/readme`)
- Parse Markdown to extract image URLs (`![...](...)`), filtering out known badge domains
- Badge filter blocklist: `shields.io`, `img.shields.io`, `badge.fury.io`, `github.com/workflows`, `actions/workflows`, `travis-ci`, `circleci`, `codecov`, `snyk.io`
- Store the first passing image URL as `readme_image` in the repo's frontmatter
- Fallback chain in card template: `readme_image` → `og_image` → owner avatar
- Enrich only repos where `readme_image` is not already set (idempotent — skip if present)
- Deployable either as a new step in `generate-digest.yml` or as a standalone `enrich-repos.yml` workflow (decision deferred to implementer — see Open Questions)

### Out
- No downloading or proxying of the image — store the raw URL as-is
- No image validation (checking if URL returns a valid image) — URL presence is sufficient for MVP
- No extraction of images beyond the first qualifying one
- No README parsing for non-image media (video embeds, etc.)
- No backfill of already-set `readme_image` values unless the field is explicitly cleared

## Technical Spec

### Frontmatter Field
Add to `_repos/{slug}.md`:
```yaml
readme_image: "https://raw.githubusercontent.com/owner/repo/main/docs/demo.gif"
```

### Extraction Logic (Node.js)
```javascript
async function extractReadmeImage(owner, repo, token) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw' } }
  );
  if (!res.ok) return null;
  const markdown = await res.text();
  const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const badgeDomains = [
    'shields.io', 'img.shields.io', 'badge.fury.io',
    'github.com/workflows', 'actions/workflows',
    'travis-ci', 'circleci', 'codecov', 'snyk.io'
  ];
  let match;
  while ((match = imgRegex.exec(markdown)) !== null) {
    const url = match[1];
    if (!badgeDomains.some(d => url.includes(d))) return url;
  }
  return null;
}
```

### Frontmatter Update
Use `gray-matter` to read and update the `_repos/` file without disturbing other frontmatter.

### Workflow Placement
Option A — Add as a step in `generate-digest.yml` (runs daily, processes only new repos added that day).  
Option B — New `enrich-repos.yml` workflow (runs weekly Sunday 6am UTC + `workflow_dispatch`, processes all repos missing `readme_image`).  
Option B is preferred to keep daily digest workflow fast.

### Rate Limiting
GitHub API allows 5000 authenticated requests/hour. At ~500 repos, weekly enrichment uses ~500 requests. Add a 100ms delay between requests to be courteous.

### Card Template
Update the catalog card `_includes/` partial to use:
```liquid
{% assign hero = page.readme_image | default: page.og_image | default: page.owner_avatar %}
<img src="{{ hero }}" alt="{{ page.name }} preview" loading="lazy">
```

## Dependencies
- `GITHUB_TOKEN` — already available in GitHub Actions as `secrets.GITHUB_TOKEN`
- `gray-matter` npm package — verify it is in workflow's inline `package.json` or install step

## Open Questions
- Should this run daily (new repos only) or weekly (all missing)? Recommend weekly via separate workflow to keep daily digest under 2 minutes.
- Should relative image paths in READMEs be resolved to `raw.githubusercontent.com` URLs, or skipped? Some repos use `./docs/demo.png` — these would be skipped by the current regex (no `https://`).
- Is there a size or dimension filter needed? Some passing images may be tiny icons that look bad as hero images.
