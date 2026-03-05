# VaiBReport

A daily-updating blogroll of curated GitHub repositories for solo founders, AI/B2B SaaS builders, small business tool seekers, and content creators.

## How it works

- **Fetch** — GitHub Actions runs daily, querying GitHub Search API and scraping GitHub Trending via Cheerio. Results are saved as `data/repos-YYYY-MM-DD.json`.
- **Curate** — Claude reads the latest repo snapshot, applies quality filters (star thresholds, cooldown dedup, category matching), and writes an opinionated digest post. If nothing is interesting, no post is created.
- **Publish** — Pushing a new post to `_posts/` triggers a Jekyll build and deploys to GitHub Pages automatically.

Quality over volume. No filler posts.

## Stack

- GitHub Actions (data collection + deploy)
- Jekyll + GitHub Pages (static blog)
- Claude (editorial curation)

## Live blog

[https://chaosagent.github.io/VaiBReport](https://chaosagent.github.io/VaiBReport)
