# PRD: Product Hunt Data Source
**ID:** U-06  
**Status:** Blocked on PH API key  
**Priority:** Medium  
**Effort:** ~2 hours  
**Last updated:** 2026-04-01

---

## Problem
VaiBReport currently pulls from 9 data sources, none of which cover Product Hunt — a high-signal community for new developer tools, AI products, and SaaS launches. Without it, the digest misses the most upvoted new products launched each day, which are often exactly what the target audience wants to discover.

## Goal
Add Product Hunt as a 10th data source so that daily digests automatically include top-ranked new products in Developer Tools, Artificial Intelligence, SaaS, and Productivity, filtered to quality launches (≥50 upvotes).

## Success Metrics
- Product Hunt posts appear in the daily digest within 24 hours of launch
- Zero duplicate entries across fetch runs (dedup via `data/seen-producthunt.json`)
- Quality filter holds: no posts with fewer than 50 upvotes are included
- Pipeline does not regress on existing 9 sources when Product Hunt is added

## Scope
### In
- New GitHub Actions workflow `fetch-producthunt.yml` (or extend `fetch-launches.yml`)
- GraphQL queries to `https://api.producthunt.com/v2/api/graphql` for posts in the last 24h
- Category filter: Developer Tools, Artificial Intelligence, SaaS, Productivity
- Upvote quality filter: minimum 50 upvotes
- Deduplication via `data/seen-producthunt.json` (same pattern as other sources)
- Post tagging: `_source: "producthunt"`
- Secrets: `PH_CLIENT_ID`, `PH_CLIENT_SECRET` stored as GitHub Actions secrets
- OAuth2 token fetch (client credentials flow) before each GraphQL request

### Out
- Paid or premium Product Hunt API tiers (free tier sufficient for daily digest volume)
- Product Hunt comments, media assets, or maker profiles
- Retroactive backfill of historical Product Hunt posts
- Writing reviews or voting on Product Hunt via the API

## Technical Spec

**Authentication:** Product Hunt uses OAuth2 client credentials. Before each fetch, POST to `https://api.producthunt.com/v2/oauth/token` with `client_id`, `client_secret`, `grant_type: client_credentials`. Use the returned `access_token` as `Bearer` in the GraphQL `Authorization` header.

**GraphQL query (skeleton):**
```graphql
query {
  posts(order: VOTES, postedAfter: "<ISO8601 24h ago>", topic: "artificial-intelligence") {
    edges {
      node {
        id
        name
        tagline
        url
        votesCount
        topics { edges { node { slug } } }
        thumbnail { url }
        createdAt
      }
    }
  }
}
```
Run once per category slug: `developer-tools`, `artificial-intelligence`, `saas`, `productivity`. Merge and dedup by `id` before writing.

**Dedup file:** `data/seen-producthunt.json` — array of string IDs. Append new IDs after each successful fetch. Commit the updated file as part of the workflow run.

**Output schema** (to match existing sources):
```json
{
  "_source": "producthunt",
  "id": "<ph-post-id>",
  "title": "<name>",
  "tagline": "<tagline>",
  "url": "<url>",
  "upvotes": <votesCount>,
  "topics": ["<slug>", ...],
  "thumbnail": "<thumbnail_url>",
  "fetched_at": "<ISO8601>"
}
```

**Workflow trigger:** Same daily schedule as other fetch workflows (e.g., `0 6 * * *` UTC). Add `workflow_dispatch` for manual runs.

**Node.js implementation:** Use `node-fetch` or the existing HTTP utility already in the repo. Keep the implementation in `scripts/fetch-producthunt.js`.

## Dependencies
- `PH_CLIENT_ID` and `PH_CLIENT_SECRET` GitHub Actions secrets — requires Peter to register an OAuth app at `producthunt.com/v2/oauth/applications`
- PH OAuth app must have `public` scope approved
- Existing fetch pipeline patterns (dedup file structure, output schema) must remain stable

## Open Questions
- [TBD-PETER] Has the OAuth app been registered at producthunt.com/v2/oauth/applications? What is the app callback URL to use (can be a placeholder URL for client credentials flow)?
- [TBD-PETER] Should Product Hunt results feed the existing `fetch-launches.yml` workflow, or get a standalone `fetch-producthunt.yml`? Standalone is simpler to isolate failures.
- [TBD-PETER] Minimum upvotes threshold — 50 is the current proposal. Adjust up (100?) if digest volume becomes too high.
- [TBD-PETER] Should thumbnail images be downloaded and stored in the repo, or hotlinked from Product Hunt CDN?
