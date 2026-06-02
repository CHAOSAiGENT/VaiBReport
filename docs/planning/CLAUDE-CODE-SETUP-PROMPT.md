# Claude Code Setup Prompt — VaiBReport

Copy everything below the line into a Claude Code session that has GitHub access and is pointed at the `CHAOSAiGENT/VaiBReport` repo.

---

## Prompt

You are scaffolding a GitHub repo for a daily-updating blogroll of curated GitHub repositories. The repo already exists at `github.com/CHAOSAiGENT/VaiBReport` and is currently empty.

Read the full project spec at `VaiBReport-SPEC.md` in the repo root (it's already committed or will be provided). That spec is the source of truth. Follow it exactly.

Here is what you need to create, in order:

### 1. Directory structure

Create these directories:
```
.github/workflows/
config/
data/
_posts/
_layouts/     (optional, only if customizing minima)
static/
```

### 2. Config files

Create these exactly as specified in the spec:

**config/queries.json** — Contains `default_queries`, `extra_queries`, and `ugc_social_queries` arrays. Copy them verbatim from the spec.

**config/preferences.json** — Contains thresholds and caps (`min_stars`, `cooldown_days`, etc.). Copy verbatim from the spec.

**config/spotlight.json** — Initialize with an empty repos array:
```json
{
  "repos": []
}
```

**data/seen.json** — Initialize empty:
```json
{
  "featured": {}
}
```

### 3. Jekyll config

**_config.yml** — Copy from the spec. Key points:
- Theme: `minima`
- Permalink: `/:year/:month/:day/:title/`
- Exclude: `data/`, `config/`, `static/`, `README.md`, `CONTEXT.md`, `node_modules/`, `package.json`, `package-lock.json`
- Title: "VaiBReport"
- Description: "Daily GitHub repo picks for solo founders, AI/B2B SaaS builders, and small business tools."
- URL: `https://chaosagent.github.io`
- baseurl: `/VaiBReport`

**index.md** — Create a simple blog index page:
```markdown
---
layout: home
title: VaiBReport
---
```

**about.md** — Create a simple about page:
```markdown
---
layout: page
title: About
permalink: /about/
---

VaiBReport is a daily-updating blogroll of curated GitHub repositories for solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators.

Each post is an opinionated selection of repos that matter — starters, frameworks, tools, and trending projects filtered through the lens of someone actually building products. If there's nothing interesting on a given day, there's no post. Quality over volume.

Data is collected automatically via GitHub Actions. Curation is powered by Claude. The blog runs on Jekyll + GitHub Pages.

Built by [CHAOSAiGENT](https://github.com/CHAOSAiGENT).
```

### 4. GitHub Actions workflows

**.github/workflows/fetch-repos.yml** — Copy the full workflow from the spec. This is the daily cron job that:
- Reads config/queries.json (all three query arrays)
- Calls GitHub Search API for each query (with 2s delay between calls)
- Scrapes github.com/trending using Cheerio
- Deduplicates by full_name
- Tags repos with `_source` and `_query_group`
- Writes `data/repos-YYYY-MM-DD.json`
- Commits and pushes

Make sure:
- The `node --input-type=module` heredoc syntax is preserved exactly
- The `cheerio@1` dependency install is included
- The `GH_TOKEN` env var uses `${{ secrets.GITHUB_TOKEN }}`
- The permissions block includes `contents: write`

**.github/workflows/deploy-blog.yml** — Use Option B from the spec (GitHub Actions Pages deploy). This gives us more control:
```yaml
name: Deploy Blog

on:
  push:
    branches: [main]
    paths:
      - "_posts/**"
      - "_config.yml"
      - "index.md"
      - "about.md"

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 5. README.md

Create a README that covers:
- What VaiBReport is (1-2 sentences)
- How it works (short bullet list: fetch → curate → publish)
- The "no post if nothing interesting" philosophy
- Stack: GitHub Actions, Jekyll, GitHub Pages, Claude Cowork
- Link to the live blog (https://chaosagent.github.io/VaiBReport)

Keep it concise. No badges, no screenshots, no filler.

### 6. Seed post

Create one seed post so the blog has content on first deploy:

**_posts/2026-03-05-hello-world.md**
```markdown
---
layout: post
title: "Welcome to VaiBReport"
date: 2026-03-05
tags: [meta]
---

This is VaiBReport — a daily blogroll of curated GitHub repositories for solo founders, AI/B2B SaaS builders, and small business tools.

Each post surfaces the most interesting repos from that day's GitHub activity: SaaS starters, AI/LLM infrastructure, ops and automation tools, marketing and GTM utilities, and UGC/social media creator tools. If there's nothing worth highlighting, there's no post.

Data is collected daily via GitHub Actions. Curation is powered by Claude. The blog runs on Jekyll and GitHub Pages.

First real digest coming soon.
```

### 7. GitHub Pages setup

After all files are committed and pushed:
- Go to repo Settings → Pages
- Set Source to "GitHub Actions"
- This pairs with the deploy-blog.yml workflow

### 8. Test the fetch workflow

Run the fetch workflow manually via `workflow_dispatch` to verify it works:
```bash
gh workflow run fetch-repos.yml
```

Wait for it to complete, then verify that `data/repos-YYYY-MM-DD.json` was committed with actual repo data.

### 9. Final checks

- Verify `_config.yml` is valid YAML
- Verify `config/queries.json` is valid JSON
- Verify `config/preferences.json` is valid JSON
- Verify the blog deploys and is accessible at the GitHub Pages URL
- Verify the seed post renders correctly

### Summary

When done, list every file you created with a one-line description. Do not create any files not mentioned above. Do not install global npm packages. Do not modify the spec files (VaiBReport-SPEC.md, CONTEXT.md).
