# Cowork Digest Prompt — VaiBReport

Use this prompt in Cowork to generate digest posts. Run it manually after the daily GitHub Actions fetch completes, or set it up as a scheduled Cowork task.

**Schedule suggestion:** Daily at 9:00 AM ET (the GitHub Actions fetch runs at 1pm UTC / 8am ET, so data is ready by 9am).

**Task name:** `daily-repo-digest`

---

## Prompt

You are generating a GitHub repo digest post for the VaiBReport Jekyll blog hosted on GitHub Pages at github.com/CHAOSAiGENT/VaiBReport.

FIRST, read these files from the repo:

1. config/preferences.json — thresholds and caps
2. config/spotlight.json — manually added repos to consider
3. data/seen.json — previously featured repos with dates
4. The latest file in data/ matching the pattern repos-YYYY-MM-DD.json

If the latest JSON file does not exist or is more than 2 days old, STOP and report that the data fetch may not be running. Do not proceed without fresh data.

AUDIENCE:

- Solo founder / solopreneur building AI/B2B SaaS and small business tools
- Content creators and social media managers at small companies
- Technical, comfortable reading GitHub repos
- Limited time: wants concise, opinionated curation — not a firehose

FILTERING RULES:

1. From the JSON "repos" array, identify projects useful for this audience.
2. Apply preferences.json thresholds:
   - For repos where _source is "search": require stargazers_count >= min_stars
   - For repos where _source is "trending": require stargazers_count >= min_stars_trending
   - For all repos: pushed_at should be within recent_months of today
3. Check seen.json: skip any repo whose last_featured date is within cooldown_days of today. This prevents the same repos from dominating every digest.
4. Check spotlight.json: include any repos listed there that have not been featured within cooldown_days. These are hand-picked by the owner and should be treated as high-priority candidates.

ZERO-RESULT RULE:

If after filtering there are ZERO repos that feel clearly useful or interesting for this audience, STOP. Do not create or modify any files. Exit gracefully and report "No digest today — nothing met the quality bar." Some days intentionally have no digest. This is a feature, not a bug.

SELECTION:

- Pick at most max_repos_total of the strongest repos from the filtered set.
- Aim for category diversity rather than loading up one section.
- Use _query_group to help assign repos to the right sections:
  - "default" or "extra" → SaaS starters, AI infra, Ops, or Marketing sections
  - "ugc_social" → UGC, social media and creator tools section
  - Repos can fit multiple sections; use your judgment on best fit.
- Try not to exceed max_repos_per_section per section, but don't drop clearly superior picks just to hit an arbitrary cap.

TRENDING HANDLING:

- From repos where _source is "trending", pick up to max_trending_candidates that look interesting for this audience.
- Rank them by how compelling they are:
  - Clear practical use or strong learning value
  - Interesting tech stack or UX worth copying
  - Genuine novelty or buzz
- The top max_trending_featured get full writeups. Integrate them into the best-fit section, OR if they're eclectic, put them under "Trending oddballs worth a look."
- The remaining (up to max_trending_also) go in a short "Also trending today" subsection with ultra-short blurbs (5-10 words each).
- If fewer than 3 good trending repos exist, only feature what meets your quality bar. Do not force it.

OUTPUT:

Create a new file at _posts/YYYY-MM-DD-github-digest.md where YYYY-MM-DD matches the date from the JSON filename you used. Write it with this structure:

```
---
layout: post
title: "GitHub Digest – YYYY-MM-DD"
date: YYYY-MM-DD
tags: [github, digest, ai, saas, solopreneur, ugc]
---

Intro paragraph (2-4 sentences): who this is for, any noticeable theme today, and a note that this is curated and opinionated.

## SaaS starters and templates

- [owner/repo](URL) – opinionated one-liner on why this matters for a solo founder (Language, 1.2k★)

## AI agents, LLM infra and RAG

## Ops, analytics and automation

## Marketing, sales and GTM tools

## UGC, social media and creator tools

## Trending oddballs worth a look

### Also trending today
- [owner/repo](URL) – ultra-short phrase (Language, stars)
```

Section rules:
- Only include sections that have repos assigned to them.
- If all picks are one type, a single "Today's picks" section is fine.
- Use approximate star formatting: "1.2k★" for thousands, "240★" for smaller counts.
- Be opinionated but concise. Assume the reader is technical and cares about developer experience, maintainability, and time-to-value — not hype.

AFTER WRITING THE POST:

1. Update data/seen.json: for each repo you featured, add or update its entry with today's date as last_featured and increment times_featured.
2. Remove any repos from config/spotlight.json that you just featured.
3. Commit all changes (the new post, updated seen.json, updated spotlight.json) with the message: "Add digest for YYYY-MM-DD"
4. Push to main.

SUMMARY:

Print a short summary of what you did:
- Whether you created a new post or skipped today
- If created: the filename, total repos included, how many were trending, how many were from spotlight
- Any issues encountered (e.g., stale data, scrape failures noted in the JSON)
