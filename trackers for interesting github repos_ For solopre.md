<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# trackers for interesting github repos? For solopreneurs, ai/tech enthusiasts, b2b saas professionals, small business?

You can combine GitHub’s built‑ins, a few niche tools, and “awesome” curation lists to track interesting repos for those audiences. Here are the most useful options.

## Built-in GitHub features

- Use **Topics + Stars + Saved searches**: Search things like `topic:b2b-saas stars:>100`, `topic:solopreneur`, `topic:ai-agents`, then save the searches and sort by “Recently updated” or “Most stars”. GitHub Explore already uses ML to recommend repos and contributors based on your activity, which gets better the more you star and follow projects.[^1_1]
- Regularly check **GitHub Explore** and **Trending** with filters set to TypeScript/JS/Python for your stack and topics like `saas`, `marketing`, `crm`, `sales-enablement`, `small-business`, `llm`, `agents`, `mlops`.[^1_1]

Example workflow: once a week, open your saved searches + Explore, star the promising ones, then let GitHub’s recs adapt around that.

## Discovery tools and trackers

- **GitHub Explore (AI-powered recs)** – Native, low-friction way to surface trending and related repos; uses ML to suggest repos and people based on your patterns.[^1_1]
- **InstaRepo (AI site search / Tavily GitHub search)** – Open-source tool that lets you type natural prompts like “Next.js shadcn dashboard SaaS boilerplate” and ranks GitHub repos using AI over GitHub search results.[^1_2]
- **Custom topic scraper tool** – An open-source web app that scrapes GitHub topics you define, lets you set a star threshold, and mark repos as viewed or pinned; all data stored locally and powered via your own token.[^1_3]

For you, InstaRepo + that topic-scraper + saved searches would probably cover 90% of “find the right starter / infra repo fast”.

## Curated “awesome” lists to watch

These are more like long‑term “feeds” of good repos:

- **Awesome AI \& Data GitHub-Repos** – Curated list of essential AI/ML/Data repos, with sections for LLMs, MLOps, Data Engineering, etc.; great for staying on top of important infra and learning repos.[^1_4]
- **Awesome lists ecosystem** – Repos like `sindresorhus/awesome`, `awesome-python`, `awesome-machine-learning`, `awesome-datascience`, etc., are frequently cited as staple discovery hubs for high-signal repos across languages and domains.[^1_5]
- **AI / tool directories** – While not strictly GitHub-only, lists like `best-of-ai/ai-directories` link into many open-source tools and directories for AI products and SaaS projects.[^1_6]

Star and “Watch – Releases only” on the 3–5 awesome lists that map closest to AI + B2B SaaS + infra, and you effectively get a low-noise feed.

## How I’d set it up for your personas

For solopreneurs / small business tools:

- Saved searches: `topic:saas`, `topic:crm`, `topic:billing`, `topic:marketing-automation`, `topic:no-code`, with `stars:>50` and “Recently updated”.
- Track InstaRepo prompts like “Stripe-like billing dashboard template”, “open source CRM with React TS”, “AI cold email agent for B2B”.[^1_2]

For AI/tech enthusiasts:

- Follow Awesome AI/Data repos and LLM/MLOps awesome lists so you catch new frameworks and reference repos.[^1_4][^1_5]
- Use the topic-scraper tool on topics like `llm`, `agents`, `rag`, `vector-database`, `mlops`, `diffusion-models` with a higher star cutoff.[^1_3]

For B2B SaaS professionals:

- Track repos under topics `b2b-saas`, `sales-enablement`, `product-led-growth`, `analytics`, and generic starters like “Next.js SaaS boilerplate” via InstaRepo prompts and GitHub search filters.[^1_2][^1_1]

Would you prefer something hands‑off (email/Telegram-style feed of new repos) or are you okay with a weekly manual sweep if I help you design the exact saved searches and topic list?
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://wrangle.ai/blogs/ai-tools-researcher-github-discovery

[^1_2]: https://github.com/cameronking4/github-repo-tavily-ai-search

[^1_3]: https://www.reddit.com/r/opensource/comments/1k2ew97/built_a_tool_for_easier_discovery_of_new_github/

[^1_4]: https://github.com/youssefHosni/Awesome-AI-Data-GitHub-Repos

[^1_5]: https://www.youtube.com/watch?v=AXUZXHIHYCM

[^1_6]: https://github.com/best-of-ai/ai-directories

[^1_7]: https://www.linkedin.com/posts/shivang0203_best-github-repos-actually-to-learn-ai-activity-7417534941363884032-VfQ1

[^1_8]: https://www.youtube.com/watch?v=Qcdi9mfpfrk

[^1_9]: https://dev.to/jnv/comment/202jm

[^1_10]: https://www.facebook.com/groups/aiprompthouse/posts/2090736495080815/

[^1_11]: https://github.com/redhuntlabs/Awesome-Asset-Discovery

[^1_12]: https://www.wearedevelopers.com/en/magazine/298/top-github-alternatives

[^1_13]: https://github.com/orgs/AI-for-Business/repositories?type=all

[^1_14]: https://github.com/orgs/projectdiscovery/repositories

[^1_15]: https://tech.yahoo.com/apps/articles/4-github-alternatives-just-good-183015594.html


---

# Hands-off with a report/digest style mechanism would be phenomenal. Is this a good use of Claude Cowork?

Yes, this is a very good use of Claude CoWork—as the “brains” that assembles a digest—if you pair it with a simple automation stack (Zapier/Make/n8n + GitHub API/RSS).

## What “hands-off digest” actually looks like

At a high level you want:

1. A **scheduled job** (daily/weekly) that:
    - Queries GitHub (search by topics, stars, language, pushed date) or scrapes Trending.[^2_1][^2_2]
    - Optionally reads a few RSS/Atom feeds for specific repos or releases (e.g. `https://github.com/OWNER/REPO/releases.atom`).[^2_3][^2_4]
2. That job sends raw JSON/HTML of candidates + minimal metadata (stars, description, topics, URL) into Claude CoWork.
3. Claude:
    - Applies your persona filters (solopreneur, AI infra, B2B SaaS, small biz useful tools).
    - Dedupes, ranks, and classifies (e.g. “Boilerplate SaaS starter”, “LLM infra”, “Marketing/ops utility”).
    - Writes out a **ready-to-send report**: HTML email, Notion page, or Markdown doc.

Automation layer:

- There’s a public n8n workflow that already does a **daily GitHub Trending email digest** by scraping the Trending page and emailing a styled HTML summary; it extracts repo name, link, description, language, and stars.[^2_5][^2_6][^2_2]
- You can fork that concept and swap the “email HTML builder” node for a Claude CoWork call that takes the raw repo list and returns a more opinionated digest.


## Where Claude CoWork is a great fit

Claude is ideal for the “judgment + formatting” parts:

- **Filtering**: “Only include repos useful for solo founders, AI infra, or B2B SaaS; drop academic toy projects.”
- **Enrichment**: Turn vague READMEs into one-line “why this matters for a solo B2B founder” blurbs, cluster repos into sections, detect duplicates.
- **Report generation**: Output:
    - A Markdown digest (for Notion/Obsidian/Git repo).
    - An HTML block suitable for email or a landing page.
- **Memory of preferences**: Over time you can feed back “I starred these 5 from last week, ignore more CLI-only crypto tools”, so the digest gets more personalized.

You’d keep the **mechanics** (scheduling, HTTP, GitHub auth, email sending) in your automation platform, and treat Claude as a pure “analyze + write the report” microservice.

## Tech stack sketch for you

Given your stack, a pragmatic v1:

1. Use n8n (self-hosted) or Make:
    - Cron trigger (weekly).
    - GitHub Search API calls with queries like:
        - `topic:saas stars:>50 pushed:>2025-01-01 language:TypeScript`
        - `topic:llm OR topic:agents stars:>100`
    - Optionally scrape GitHub Trending HTML like the existing n8n workflow.[^2_2]
2. Feed the aggregated repo list (JSON) into Claude CoWork with a prompt like:
    - “Given this list of repos with {fields}, pick the 10 most interesting for a solo founder doing AI B2B SaaS. Group them into categories and output a nicely formatted HTML email + a Markdown version.”
3. Send the HTML via SMTP node (to your inbox) and commit the Markdown to a “Repo Digest” GitHub repo or Notion.

This is exactly the pattern in that “Daily GitHub Trending Email Digest” n8n example, just swapping their hand-coded formatter for Claude.[^2_6][^2_5][^2_2]

If you want, I can draft the exact CoWork prompt + JSON schema you should target from your automation flow so you can more or less drop it into your existing n8n/Make setup.
<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_7][^2_8][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^2_2]: https://community.n8n.io/t/workflow-daily-github-trending-email-digest-co-created-with-ai/170636

[^2_3]: https://piraces.dev/short-bits/github-releases-feed-atom/

[^2_4]: https://www.reddit.com/r/rss/comments/1cqmwsn/github_rss_feeds/

[^2_5]: https://www.reddit.com/r/automation/comments/1o55ela/automation_daily_github_trending_email_digest/

[^2_6]: https://www.reddit.com/r/SideProject/comments/1o55gbm/automation_daily_github_trending_email_digest/

[^2_7]: https://docs.github.com/en/rest/activity/starring

[^2_8]: https://docs.github.com/en/get-started/exploring-projects-on-github/saving-repositories-with-stars

[^2_9]: https://stackoverflow.com/questions/67185900/get-n-repositories-with-most-stars-out-of-a-given-organization-github-api

[^2_10]: https://docs.github.com/en/rest/repos/repos

[^2_11]: https://github.blog/news-insights/searching-and-filtering-stars/

[^2_12]: https://www.reddit.com/r/selfhosted/comments/1euwusj/keep_up_to_date_with_new_releases_on_github/

[^2_13]: https://github.com/orgs/community/discussions/8293

[^2_14]: https://gist.github.com/jasonrudolph/6057563

[^2_15]: https://github.com/leonardehrenfried/git-releases-feed


---

# given what cowork is, wouldn't it (or even something like Openclaw) just fully negate the need for an n8n?

Cowork/Openclaw can replace a lot of the *logic + formatting* work, but they don’t fully replace an n8n‑style orchestrator for IO, scheduling, and integrations yet.[^3_1][^3_2][^3_3]

## Where Cowork *does* replace n8n

- **Planning + branching logic**: Instead of wiring 10 nodes, you can just say “every week, pull these feeds/JSON files, pick the best repos for X personas, and write a digest here,” and Cowork can plan and execute the steps on your local filesystem.[^3_2][^3_3][^3_1]
- **Data munging + summarization**: Anything that would have been “HTTP node → Code node → AI node → HTML builder” can usually be collapsed into one Cowork task: read inputs, filter, summarize, format into Markdown/HTML, save.
- **Local deliverables**: Cowork is very good at “produce finished artifacts on disk” (Markdown, HTML, PDFs, spreadsheets, slides) without you wiring templating nodes.[^3_3][^3_1][^3_2]

If your world is: “Sources are already on disk or easy to fetch via a script, and the goal is to manufacture a report,” then yeah—Cowork can mostly eat n8n’s lunch.

## Where you still want an orchestrator

- **Reliable scheduling \& uptime**: Cowork can run scheduled tasks, but it’s tied to the Claude desktop/app environment; n8n (or similar) gives you a server‑side, always‑on scheduler that isn’t gated on your laptop being open or an app running.[^3_4][^3_5][^3_2]
- **3rd‑party integrations at scale**: n8n has native connectors for Gmail, Slack, SES, Discord, CRMs, DBs, etc., plus retries, rate‑limit handling, and environment separation. Cowork usually works best once the data is already fetched or when calling a few HTTP endpoints, not as your whole integration fabric.[^3_5][^3_4]
- **Long‑term infra \& observability**: You get runs history, retry logic, alerting, and versionable workflows with an orchestrator; Cowork gives you task logs but not quite the same “automation as infra” story.[^3_1][^3_2][^3_3]

For your GitHub‑digest idea, that’s the split:

- n8n: cron, GitHub API calls, sending email, maybe storing history in Supabase or Sheets.[^3_6][^3_7][^3_4]
- Cowork/Openclaw: take a JSON of candidate repos + past picks, then decide “which 10 are actually interesting for my B2B/AI/solo founder lens” and generate the polished digest.


## A hybrid model that plays to each strength

Given your stack and appetite for agents, I’d treat **n8n as the IO + plumbing layer** and **Cowork/Openclaw as the “smart worker” you call in the middle**:

1. n8n runs on a schedule, hits GitHub/search/RSS, and dumps `repos.json` into a folder or S3.
2. A Cowork task is scheduled (or triggered via webhook) to:
    - Read `repos.json` (+ prior history),
    - Decide what to include,
    - Emit `digest.md` and `digest.html`.
3. n8n picks up `digest.html` and sends it, archives `digest.md` in a repo/Notion, etc.

That way if Cowork/Openclaw gets more robust external integrations later, you can gradually collapse parts of n8n—but you’re not betting your entire “always‑on” automation fabric on one agent runtime.

For the GitHub digest specifically, do you *prefer* having all of this run off your own server/VM (self‑hosted) or are you okay leaning on cloud‑hosted pieces for now?
<span style="display:none">[^3_10][^3_11][^3_12][^3_13][^3_14][^3_15][^3_8][^3_9]</span>

<div align="center">⁂</div>

[^3_1]: https://techwize.com/blog/claude-cowork-features-plugins-and-guide-2026

[^3_2]: https://support.claude.com/en/articles/13345190-get-started-with-cowork

[^3_3]: https://tensorlake.ai/blog/claude-cowork-architecture-overview

[^3_4]: https://n8n.io/workflows/3134-create-a-daily-digest-from-gmail-rss-and-todoist/

[^3_5]: https://www.reddit.com/r/n8n/comments/1ov1jbq/automated_financial_news_digest_with_ai_daily/

[^3_6]: https://community.n8n.io/t/workflow-daily-github-trending-email-digest-co-created-with-ai/170636

[^3_7]: https://www.flowkit.in/workflows/daily-github-trending-email

[^3_8]: https://github.com/TirthDhandhukia30/DailyDigest-n8n-workflow/blob/main/README.md

[^3_9]: https://n8n.io/workflows/5003-daily-email-digest-with-ai-summarization-using-gmail-openrouter-and-langchain/

[^3_10]: https://n8n.io/workflows/6662-automate-daily-email-digest-with-gmail-and-gpt-summary-sent-every-afternoon/

[^3_11]: https://github.com/orgs/community/discussions/158356

[^3_12]: https://www.n8n-store.com/workflows/333

[^3_13]: https://dev.to/ksivamuthu/github-actions-scheduled-workflows-understanding-the-limitations-and-possible-solutions-5hm5

[^3_14]: https://github.com/orgs/community/discussions/156282

[^3_15]: https://stackoverflow.com/questions/79534419/reliability-issues-with-github-actions-with-cron-based-schedule


---

# cost is the concern at the moment, moreso than local/cloud or open/commercial

If cost is the main constraint, you probably don’t want Cowork/Openclaw as the *only* automation layer yet; the cheapest path is “dumb but free scheduler + targeted AI where it adds the most value.”

## Rough cost picture

- **Cowork**: Full Cowork access starts at the Claude Pro tier (about 17–20 USD/month), and heavier, agent‑heavy use assumes a Max plan in the 100–200 USD/month range. If you rely on Cowork to run frequent, automated jobs, you’ll hit those limits faster.[^4_1][^4_2][^4_3]
- **n8n self‑hosted**: Community Edition is free; you just pay for a small VPS (Hetzner/DO‑style) in the ~4–10 USD/month range for light workloads. That gives you cron, HTTP, GitHub, email, and storage orchestration without per‑run fees.[^4_4][^4_5]
- **Other orchestrators**:
    - GitHub Actions: workflows on public repos are free; private repos incur a tiny per‑minute charge, with a new 0.002 USD/min “platform charge” from March 2026, still very cheap for short weekly jobs.[^4_6][^4_7][^4_8]
    - Zapier/Make: even low tiers (20–30 USD/month) get pricey once you run many tasks.[^4_9][^4_10]

So the lowest *cash* burn for your GitHub‑digest idea is: free/self‑hosted orchestrator + paid Claude Pro (only using Cowork when it adds leverage), not “Cowork runs everything, all the time.”

## What I’d do given your priorities

- Use a **free/cheap scheduler and IO layer**:
    - Self‑hosted n8n on a 5–10 USD/month VPS.[^4_5][^4_4]
    - Or GitHub Actions on a public repo (nearly free for this use case).[^4_7][^4_6]
- Let that layer:
    - Run on a weekly cron.
    - Call GitHub search, maybe hit a couple of RSS feeds.
    - Store `repos.json` somewhere (repo, S3, Supabase, etc.).
- Call **Cowork sparingly**:
    - Maybe 1–4 Cowork tasks per week that take `repos.json` and emit a Markdown/HTML digest.
    - That keeps you safely inside Claude Pro usage for quite a while, instead of needing Max.[^4_2][^4_1]

In that model, Cowork/Openclaw doesn’t replace n8n; it replaces custom code + templating + manual curation, which is where your time is actually expensive.

Given your current runway, what’s your comfortable monthly “automation + AI infra” budget ceiling (even a rough number like “under 30” vs “under 100”)?
<span style="display:none">[^4_11][^4_12][^4_13][^4_14][^4_15]</span>

<div align="center">⁂</div>

[^4_1]: https://learn-prompting.fr/blog/claude-cowork-pricing

[^4_2]: https://www.sentisight.ai/how-much-cost-claude-cowork/

[^4_3]: https://help.apiyi.com/en/claude-cowork-pricing-limits-guide-en.html

[^4_4]: https://northflank.com/blog/how-to-self-host-n8n-setup-architecture-and-pricing-guide

[^4_5]: https://sliplane.io/blog/n8n-pricing

[^4_6]: https://github.com/resources/insights/2026-pricing-changes-for-github-actions

[^4_7]: https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/

[^4_8]: https://www.reddit.com/r/programming/comments/1po996g/starting_march_1_2026_github_will_introduce_a_new/

[^4_9]: https://www.fltechadventures.com/blog/zapier-pricing-breakdown/

[^4_10]: https://www.firstaimovers.com/p/zapier-pricing-platform-comparison-guide-2026

[^4_11]: https://n8n.io/pricing/

[^4_12]: https://zeabur.com/blogs/n8n-pricing-shift-self-hosting-business-costs-zeabur-guide

[^4_13]: https://www.youtube.com/watch?v=Am54LhN2NLk

[^4_14]: https://www.reddit.com/r/n8n/comments/1mk07pf/n8ns_new_selfhosted_pricing_is_live_and_its_not/

[^4_15]: https://community.latenode.com/t/cost-and-self-hosting-options-for-n8n-automation-platform/18787


---

# Clarifier: Perplexity Pro and Claude Max are the two paid platforms always on in my stack.

Given you already pay for Perplexity Pro and Claude Max, adding a separate paid orchestrator makes little sense; you should lean on **free infra + those two models as the brains**.[^5_1][^5_2][^5_3]

## Cost‑minimal architecture for the digest

- **Scheduler/IO (free or near‑free)**
    - Use GitHub Actions on a public repo to run on a weekly cron, call the GitHub Search API, and write `repos.json` into the repo.[^5_4][^5_5]
    - Or self‑host a tiny n8n instance on the cheapest box you’re already running (if you have one), but don’t pay for n8n Cloud.[^5_6][^5_7]
- **Thinking + formatting (what you already pay for)**
    - Use **Claude Max Cowork** to:
        - Pull `repos.json` (via git clone or direct HTTP),
        - Filter for your personas (solo founder, AI/B2B SaaS, small biz utility),
        - Generate `digest.md` and `digest.html`.
    - Optionally use **Perplexity Pro** ad‑hoc when you want extra context on a repo (e.g. “what are people using this for / any blog posts?”), but not in the automated loop.
- **Delivery (still free)**
    - GitHub Actions or your free SMTP provider sends the HTML email weekly.
    - The Markdown lives in a `repo-digests` GitHub repo you can browse/search locally.

In other words: treat **Claude Max as your only “paid agent runtime”**, avoid new SaaS, and let GitHub Actions (or a single cheap VM you already justify for other projects) be the dumb pipe.

Do you want me to sketch a “v0” where everything runs just in a single GitHub Actions workflow plus one Cowork task, so you can get a digest going with essentially zero new spend?

<div align="center">⁂</div>

[^5_1]: https://learn-prompting.fr/blog/claude-cowork-pricing

[^5_2]: https://www.sentisight.ai/how-much-cost-claude-cowork/

[^5_3]: https://help.apiyi.com/en/claude-cowork-pricing-limits-guide-en.html

[^5_4]: https://github.com/resources/insights/2026-pricing-changes-for-github-actions

[^5_5]: https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/

[^5_6]: https://northflank.com/blog/how-to-self-host-n8n-setup-architecture-and-pricing-guide

[^5_7]: https://sliplane.io/blog/n8n-pricing


---

# Yes, that would be great.  A V0 is good.

Here’s a lean **V0** using only GitHub + Claude Max Cowork, no new paid infra.

## Overview

- GitHub Actions: run weekly, pull interesting repos, commit `repos.json` to the repo.[^6_1][^6_2]
- Cowork: when you feel like it (e.g. once a week), run a Cowork task that reads `repos.json` and spits out `digest.md` + `digest.html` into the repo.
- Optional: GitHub notification or a simple “check this folder” habit is enough for V0.

***

## Step 1 – Create a “github-digest” public repo

Structure:

```text
github-digest/
  .github/
    workflows/
      fetch-repos.yml
  data/
    repos-YYYY-MM-DD.json
  digests/
    digest-YYYY-MM-DD.md
    digest-YYYY-MM-DD.html
```

You’ll only create `fetch-repos.yml` manually; the rest gets generated.

***

## Step 2 – GitHub Actions workflow to fetch repos (weekly)

Create `.github/workflows/fetch-repos.yml`:

```yaml
name: Fetch GitHub repos for digest

on:
  schedule:
    - cron: "0 13 * * 1"  # every Monday 13:00 UTC
  workflow_dispatch:

jobs:
  fetch-and-commit:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: |
          npm init -y
          npm install node-fetch@3

      - name: Fetch repos
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node << 'EOF'
          import fs from 'fs';
          import fetch from 'node-fetch';

          const queries = [
            'topic:saas language:TypeScript stars:>50 pushed:>2025-01-01',
            'topic:llm OR topic:agents stars:>100 pushed:>2025-01-01',
            'topic:crm OR topic:marketing-automation stars:>50 pushed:>2025-01-01'
          ];

          const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${process.env.GH_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
          };

          async function search(q) {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.set('q', q);
            url.searchParams.set('sort', 'stars');
            url.searchParams.set('order', 'desc');
            url.searchParams.set('per_page', '50');
            const res = await fetch(url, { headers });
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`GitHub search failed ${res.status}: ${text}`);
            }
            const json = await res.json();
            return json.items || [];
          }

          (async () => {
            const all = [];
            for (const q of queries) {
              const items = await search(q);
              all.push(...items);
            }
            // dedupe by full_name
            const dedup = Object.values(
              all.reduce((acc, r) => {
                acc[r.full_name] = r;
                return acc;
              }, {})
            );

            const slim = dedup.map(r => ({
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              stargazers_count: r.stargazers_count,
              language: r.language,
              topics: r.topics,
              pushed_at: r.pushed_at,
              created_at: r.created_at,
              forks_count: r.forks_count
            }));

            const date = new Date().toISOString().slice(0, 10);
            const dir = 'data';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const path = `${dir}/repos-${date}.json`;
            fs.writeFileSync(path, JSON.stringify({
              generated_at: new Date().toISOString(),
              queries,
              repos: slim
            }, null, 2));
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
          EOF

      - name: Commit and push
        run: |
          date=$(date -u +"%Y-%m-%d")
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git commit -m "Add repos for ${date}" || echo "No changes to commit"
          git push
```

This uses the free GitHub Actions minutes for a public repo; your usage here is tiny.[^6_2][^6_1]

***

## Step 3 – Cowork task: turn JSON into a digest

When you want your digest (e.g. Monday after the cron runs):

1. In Cowork, open this repo (via local clone or GitHub integration).
2. Run a Cowork task with this **prompt skeleton**:
```text
You are helping a solo founder who builds AI/B2B SaaS and small business tools.
You will read a JSON file of GitHub repositories and produce two files:

- digests/digest-YYYY-MM-DD.md
- digests/digest-YYYY-MM-DD.html

Use this JSON schema:

{
  "generated_at": "ISO timestamp",
  "queries": ["string", "..."],
  "repos": [
    {
      "full_name": "owner/name",
      "html_url": "https://github.com/owner/name",
      "description": "string or null",
      "stargazers_count": 1234,
      "language": "TypeScript",
      "topics": ["saas", "crm"],
      "pushed_at": "ISO timestamp",
      "created_at": "ISO timestamp",
      "forks_count": 10
    }
  ]
}

Steps:

1. Read the latest file in data/ matching repos-YYYY-MM-DD.json.
2. From repos, select AT MOST 12 projects that are especially useful for:
   - solo founders/solopreneurs,
   - AI/LLM/agent infra and tooling,
   - B2B SaaS products,
   - small-business friendly utilities (ops, marketing, billing, CRM, automation).
   Prefer actively maintained repos (recent pushed_at) and non-trivial star counts.
3. Group the chosen repos into sections, for example:
   - "SaaS starters and templates"
   - "AI agents, LLM infra and RAG"
   - "Ops, analytics and automation"
   - "Marketing, sales and GTM tools"
4. For each chosen repo, include:
   - name and link
   - 1-line “why this is interesting for a solo AI/B2B founder”
   - the language and star count in parentheses, e.g. (TypeScript, 2.1k★)
5. In the Markdown file:
   - Start with a short intro (2–4 sentences) tailored to a solo founder.
   - Then sections with level-2 headings (##).
   - Under each heading, use a bulleted list, one bullet per repo.
6. In the HTML file:
   - Produce a simple, clean HTML email body (no CSS files, only inline styles).
   - Include the same content and sections as the Markdown.
   - Use <h2> for sections and <ul><li> for lists.
7. Use concise, opinionated language and assume the reader is technical.

Perform the steps now.
```

You’ll just edit the `YYYY-MM-DD` in filenames to match today; Cowork can also compute it in-code on its own.

Cowork then:

- Reads `data/repos-2026-03-04.json`.
- Picks and clusters repos.
- Writes `digests/digest-2026-03-04.md` and `digest-2026-03-04.html` to the repo.

You can then:

- View the Markdown in GitHub or a local editor.
- Paste the HTML into any email tool, or later wire an action step to send it automatically.

***

## Step 4 – Optional tiny upgrade: auto-email later

When you’re happy with V0, you can add a second GitHub Action like:

- Trigger on `push` to `digests/`.
- Use `sendmail`/an SMTP action to email `digest-YYYY-MM-DD.html` to yourself.

But for V0, just having the digest appear in the repo each week is enough to validate the whole flow.

Would it help if I now tighten that Cowork prompt into a copy‑paste‑ready template you can save as a reusable “Digest Maker” task?

<div align="center">⁂</div>

[^6_1]: https://github.com/resources/insights/2026-pricing-changes-for-github-actions

[^6_2]: https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/


---

# I'd be interested in a github repo (same repo) displaying this as a "blogroll" style scenario over it sending an email. Thoughts?

Yes, a “blogroll” inside the same repo is perfect for this, and you can do it almost free with GitHub Pages + Actions + Cowork.

## Shape of the setup

- Store each digest as Markdown under `digests/` (what we already sketched).
- Use **GitHub Pages** to turn the repo into a tiny static site (your “blog”).[^7_1][^7_2]
- Either:
    - Let GitHub Pages/Jekyll render the Markdown directly, or
    - Use a lightweight static-site-from-Markdown Action from the Marketplace to build a nicer index.[^7_3][^7_4][^7_2]

That gives you a URL like `you.github.io/github-digest` that always shows the latest posts in a blogroll style.

## Minimal V0 blogroll (almost no extra work)

1. Enable GitHub Pages: Settings → Pages → “Deploy from branch” → `main` + `/docs` or `/`.[^7_2]
2. Adjust your Cowork task to also:
    - Copy `digests/digest-YYYY-MM-DD.md` to `docs/posts/YYYY-MM-DD-github-digest.md` (or just write there directly).
    - Optionally prepend a simple front matter block if you want Jekyll to treat them as posts:

```yaml
---
title: GitHub Digest – 2026-03-04
date: 2026-03-04
layout: post
---
```

3. Add a simple `docs/index.md` that links to posts or, if you enable Jekyll posts properly (`_posts/`), use its default blog index.[^7_5]

GitHub Pages + Jekyll will auto-generate HTML from these Markdown posts without you writing extra build code.[^7_1][^7_2]

## Slightly fancier: Action that builds a blog from Markdown

If you want a nicer index without hand-rolling templates:

- Use a marketplace Action like **“Create Blog from Markdown Files”**, which scans a `posts/` directory and deploys a blog to GitHub Pages automatically.[^7_4]
- You keep your digests as Markdown; the Action handles:
    - Turning them into HTML.
    - Generating an index page with a blogroll listing posts by date/title.
- The workflow is basically: on push → run that Action → publish to `gh-pages` branch that Pages serves.[^7_4][^7_2]

Cowork’s job doesn’t change much: it still writes Markdown; you just ensure it puts digests under `posts/` with a small front matter header.

## Why this pairs nicely with Cowork

- Cowork already has repo + filesystem access and is great at generating Markdown/HTML.[^7_6][^7_7][^7_8]
- It can:
    - Append a short meta paragraph (e.g. “Theme this week: X”).
    - Maintain a simple `docs/index.md` that lists the latest N digests with links (blogroll) by editing that file each run.

So your “blog” becomes a living, public archive of your GitHub repo picks, and the email step becomes optional.

Would you rather lean on GitHub’s built‑in Jekyll (minimal config) or use a simple “Markdown → blog” Action from the Marketplace for a cleaner index and layout?
<span style="display:none">[^7_10][^7_11][^7_12][^7_13][^7_14][^7_15][^7_16][^7_17][^7_18][^7_9]</span>

<div align="center">⁂</div>

[^7_1]: https://dev.to/m1ner/how-to-use-github-pages-to-host-a-blog-4ofd

[^7_2]: https://workshops.code-maven.com/github-actions-to-generate-complex-static-web-sites.html

[^7_3]: https://github.com/nicolas-van/easy-markdown-to-github-pages

[^7_4]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^7_5]: https://simondosda.github.io/posts/2021-09-15-blog-github-pages-3-content.html

[^7_6]: https://techwize.com/blog/claude-cowork-features-plugins-and-guide-2026

[^7_7]: https://support.claude.com/en/articles/13345190-get-started-with-cowork

[^7_8]: https://tensorlake.ai/blog/claude-cowork-architecture-overview

[^7_9]: https://github.com/orgs/community/discussions/34789

[^7_10]: https://stackoverflow.com/questions/50824171/github-pages-only-show-index-html-contents-when-navigating-to-markdown-link

[^7_11]: https://www.reddit.com/r/webdev/comments/176xolg/built_a_minimalist_phpbased_static_site_generator/

[^7_12]: https://www.reddit.com/r/automation/comments/1o55ela/automation_daily_github_trending_email_digest/

[^7_13]: https://github.com/kllc/markdown-blog

[^7_14]: https://tomo.dev/en/posts/n8n-workflow-for-daily-github-trending-auto-posting/

[^7_15]: https://www.reddit.com/r/rust/comments/zncc8z/static_site_generator_from_markdown_files_and/

[^7_16]: https://n8n.io/workflows/13552-send-weekly-github-digest-with-releases-commits-and-trending-repos-via-gmail/

[^7_17]: https://www.reddit.com/r/github/comments/15dbpa5/github_pages_link_directing_to_index/

[^7_18]: https://www.youtube.com/watch?v=zrmeOu8DYyw


---

# cleaner index and layout.

Daily runs, no "minimum" results per day. If there's nothing interesting, there's nothing interesting. No need to force it.
Would be nice to have a function to add a query / special search for very specific categories, but this may be better served by Perplexity...

Using the same repo as a daily-updating “blogroll” is a great idea, and the “nothing interesting, nothing posted” rule is easy to honor. A GitHub Pages blog action gives you the cleaner index/layout you want.[^8_1][^8_2]

## Blogroll architecture (clean index, no forced posts)

- Use the **GitHub Pages Blog Action** (`kamranahmedse/github-pages-blog-action`) which turns Markdown files in `posts/` into a nice blog with an index and theming.[^8_2][^8_1]
- Your existing flow becomes:
    - GitHub Action (daily) → fetch repos → write `data/repos-YYYY-MM-DD.json`.
    - Cowork (when you run it, or on a schedule later) → reads that JSON, decides if there are *any* repos worth mentioning.
    - If **none** pass your filters, Cowork simply doesn’t create a new `posts/*.md` file for that day. The blog index will naturally have a “gap” for that date, which is exactly what you want.
- The blog action builds the site from whatever posts exist and deploys to `gh-pages`, giving a clean index page sorted by date.[^8_1][^8_2]

Repo structure:

```text
.github/
  workflows/
    fetch-repos.yml       # already have
    deploy-blog.yml       # blog action
data/
  repos-YYYY-MM-DD.json
posts/
  2026-03-04-github-digest.md
  2026-03-06-github-digest.md
site.json                 # blog config (title, theme, nav)
static/                   # optional assets
```

`deploy-blog.yml` (minimal):

```yaml
name: Build and Deploy Blog
on:
  push:
    paths:
      - "posts/**"
      - "site.json"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy
        uses: kamranahmedse/github-pages-blog-action@v0.0.10
        with:
          branch: gh-pages
```

The action reads `site.json` (title, description, theme) and `posts/*.md`, then generates a blog and deploys to GitHub Pages.[^8_2][^8_1]

## Cowork’s role: decide “is today worth a post?”

In your Cowork task prompt, add explicit logic:

- “If, after filtering, there are 0 interesting repos, do not create any new post file and instead just exit silently.”
- Otherwise, generate a markdown post like:

```markdown
---
title: GitHub Digest – 2026-03-04
date: 2026-03-04
---

## Theme

Short paragraph about today’s theme (if any).

## Picks

- [owner/repo](URL) – one-line why this matters for solo AI/B2B founders (TypeScript, 2.1k★)
- ...
```

Cowork can also add tags in the front matter (e.g. `tags: [ai, saas, solopreneur]`) to let the blog theme group posts by category if you want.[^8_1][^8_2]

## Handling “special” or one-off searches

You have two good options:

1. **Inside the automated flow (low overhead)**
    - Maintain a simple `config/queries.json` file in the repo like:

```json
{
  "default_queries": [
    "topic:saas language:TypeScript stars:>50 pushed:>2025-01-01",
    "topic:llm OR topic:agents stars:>100 pushed:>2025-01-01"
  ],
  "extra_queries": [
    "topic:finance topic:accounting stars:>30",
    "topic:email-marketing stars:>40"
  ]
}
```

    - Your GitHub Action reads both arrays and hits them all, so you can add/remove very specific queries via PR without changing code.[^8_3][^8_4]
    - Cowork still decides if any results from those extra queries are worth including; if not, they just never show up.
2. **Use Perplexity for highly specific, ad-hoc hunts**
    - For “find me 3 repos that are specifically about X weird niche,” you can just ask Perplexity directly rather than baking it into the daily job.
    - You can then manually add those repos to the next digest as a “spotlight” section.

Given you already live in Perplexity, I’d keep the scheduled job focused on broad, high-signal queries (topics, stars, language, recency) and use Perplexity for the very narrow “go spelunk this niche” tasks.[^8_4][^8_3]

Would you like a concrete Cowork prompt that includes the “only create a post if there are interesting repos” rule and writes into `posts/` in the format that `github-pages-blog-action` expects?
<span style="display:none">[^8_10][^8_11][^8_12][^8_13][^8_14][^8_15][^8_5][^8_6][^8_7][^8_8][^8_9]</span>

<div align="center">⁂</div>

[^8_1]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^8_2]: https://github.com/kamranahmedse/github-pages-blog-action

[^8_3]: https://github.com/orgs/community/discussions/159014

[^8_4]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^8_5]: https://github.com/marketplace/actions/cross-platform-blog-publish

[^8_6]: https://blog.devgenius.io/automating-markdown-based-blogs-with-github-actions-and-ai-28d14c695335

[^8_7]: https://lukelowrey.com/github-action-to-add-blog-posts-to-your-profile/

[^8_8]: https://github.com/RobKohr/dead-simple-markdown-to-static-blog-creator

[^8_9]: https://den.dev/blog/blog-deploy-github-actions/

[^8_10]: https://gaultier.github.io/blog/making_my_static_blog_generator_11_times_faster.html

[^8_11]: https://github.com/marketplace/actions/markdown-to-pages-action

[^8_12]: https://github.com/github/docs/blob/main/content/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax.md

[^8_13]: https://www.reddit.com/r/webdev/comments/176xolg/built_a_minimalist_phpbased_static_site_generator/

[^8_14]: https://eotles.com/blog/Github-Action-for-Post-Concatenation/

[^8_15]: https://docs.github.com/en/enterprise-server@3.5/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax


---

# Yes, a cowork prompt to help set up this repo and a prompt to do the regular executions would be great!

Here are two focused Cowork prompts you can drop in: one for **repo setup** and one for the **daily digest run**.

***

## 1) Cowork prompt – initial repo setup

Use this once, in an empty or nearly-empty repo, to scaffold folders, config, and workflows.

```text
You are helping me set up a GitHub repo that will:

- Fetch interesting GitHub repositories daily via GitHub Actions.
- Let me curate them with AI into Markdown digests.
- Render those digests as a clean blog-style index using a GitHub Pages blog action.

Assume you are running inside a local clone of the repo.
You can create and edit files and directories.

Goals:

1) Create a sensible repo structure.
2) Add a GitHub Actions workflow to fetch repos daily (but not create a digest).
3) Add a GitHub Actions workflow to turn Markdown posts into a blog via GitHub Pages.
4) Add minimal config files that make this work with almost no manual setup.

Please perform these steps in order:

1. Create this directory structure if it does not exist:

   - .github/workflows/
   - data/
   - posts/
   - static/         # optional images/css
   - config/

2. In config/queries.json, create a JSON file with this shape:

   {
     "default_queries": [
       "topic:saas language:TypeScript stars:>50 pushed:>2025-01-01",
       "topic:llm OR topic:agents stars:>100 pushed:>2025-01-01",
       "topic:crm OR topic:marketing-automation stars:>50 pushed:>2025-01-01"
     ],
     "extra_queries": [
       "topic:billing stars:>40",
       "topic:analytics stars:>40"
     ]
   }

   These are GitHub search queries.
   Do not add any comments; this must be valid JSON.

3. Create .github/workflows/fetch-repos.yml with a daily cron schedule
   that does the following:

   - Runs once per day using "on.schedule" and also supports "workflow_dispatch".
   - Uses the GitHub Search API to execute all queries from config/queries.json
     (both default_queries and extra_queries).
   - For each query, requests up to 50 repos, sorted by stars desc.
   - Deduplicates results by "full_name".
   - Produces a "slim" representation:

     {
       "full_name": "owner/name",
       "html_url": "...",
       "description": "string or null",
       "stargazers_count": 123,
       "language": "TypeScript",
       "topics": [...],
       "pushed_at": "...",
       "created_at": "...",
       "forks_count": 10
     }

   - Writes a JSON file at data/repos-YYYY-MM-DD.json with the shape:

     {
       "generated_at": "ISO timestamp",
       "queries": { "default_queries": [...], "extra_queries": [...] },
       "repos": [ ...slim repo objects... ]
     }

   Use Node 20 and "node-fetch" as in a typical GitHub Actions Node script.
   Use the built-in GITHUB_TOKEN for auth.

4. Create a simple blog config file at site.json in the repo root
   compatible with the "kamranahmedse/github-pages-blog-action" GitHub Action.
   It should include:

   {
     "title": "GitHub Repo Digest",
     "subtitle": "Daily picks for solo founders, AI/B2B SaaS, and small business tools",
     "baseUrl": "",
     "theme": "light",
     "showPostDate": true
   }

5. Create .github/workflows/deploy-blog.yml that:

   - Triggers on push affecting "posts/**" or "site.json".
   - Checks out the repo.
   - Uses "kamranahmedse/github-pages-blog-action@v0.0.10"
     with "branch: gh-pages".
   - Does not require any extra configuration files beyond site.json and posts/*.

6. Create a minimal README.md that:

   - Explains the purpose: daily GitHub repo discovery and digest.
   - Explains the flow in 4–6 bullet points:
     - fetch-repos workflow writes JSON snapshots daily
     - I run Claude Cowork to curate and generate posts/*.md
     - deploy-blog workflow turns posts into a blog on GitHub Pages
   - Mentions that there is intentionally no email delivery in v0.

7. Make all YAML and JSON syntactically valid and consistent.
   Use lowercase file and directory names exactly as specified.

After you finish creating and editing these files,
output a short summary of what you created and where.
Do not open any browser windows.
```


***

## 2) Cowork prompt – daily/regular digest execution

Use this whenever you want a new post. It:

- Reads the latest `data/repos-YYYY-MM-DD.json`.
- Filters repos.
- Creates a post in `posts/` **only if there is something interesting**.

```text
You are helping me generate a daily GitHub repo digest post for my blog.

Context:

- This repo has a GitHub Actions workflow that writes JSON snapshots to data/.
- Each JSON file is named data/repos-YYYY-MM-DD.json and has this shape:

  {
    "generated_at": "ISO timestamp",
    "queries": {
      "default_queries": ["..."],
      "extra_queries": ["..."]
    },
    "repos": [
      {
        "full_name": "owner/name",
        "html_url": "https://github.com/owner/name",
        "description": "string or null",
        "stargazers_count": 1234,
        "language": "TypeScript",
        "topics": ["saas", "crm"],
        "pushed_at": "ISO timestamp",
        "created_at": "ISO timestamp",
        "forks_count": 10
      }
    ]
  }

- The blog is generated from Markdown files in the posts/ directory
  by the GitHub action: kamranahmedse/github-pages-blog-action.

Your task:

Given the latest JSON snapshot in data/, decide whether today’s repos
are interesting enough for a new digest. If not, do nothing.
If they are, create a new Markdown post in posts/ with a nice summary.

Audience:

- Solo founder/solopreneur building AI/B2B SaaS and small business tools.
- Technical (comfortable reading GitHub repos).
- Limited time: wants concise, opinionated curation.

Steps:

1. Find the latest file in data/ that matches the pattern repos-YYYY-MM-DD.json.
   Parse it as JSON.

2. From "repos", select the projects that are especially interesting for:
   - solo founders / solopreneurs,
   - AI/LLM/agent infra and tooling,
   - B2B SaaS products (templates, starters, core modules),
   - small-business-friendly utilities (ops, billing, analytics, CRM, marketing automation).

   Use these heuristics:

   - Prefer repos with:
     - recent activity (pushed_at within the last 6 months),
     - non-trivial stars (for example > 40, but use judgment),
     - clear practical value from the description/topics.
   - Deprioritize:
     - very experimental or academic-only repos,
     - trivial “awesome list clones” with no unique angle,
     - repos with empty or extremely vague descriptions.

3. If, after filtering, there are ZERO repos that seem clearly useful
   for this audience, STOP.
   Do not create or modify any files. Exit gracefully.
   This is important: some days there may simply be nothing worth highlighting.

4. If there ARE interesting repos, pick AT MOST 12 of the strongest ones.
   Try to cover a mix of categories (SaaS starters, AI infra, ops tools, etc.)
   instead of 12 of the same type.

5. Create a new filename for today’s digest in posts/ using:

   posts/YYYY-MM-DD-github-digest.md

   where YYYY-MM-DD matches the date in the JSON filename you used.
   Example: data/repos-2026-03-04.json -> posts/2026-03-04-github-digest.md

6. Write a Markdown post in that file with the following structure:

   - YAML front matter at the top:

     ---
     title: "GitHub Digest – YYYY-MM-DD"
     date: YYYY-MM-DD
     tags:
       - github
       - digest
       - ai
       - saas
       - solopreneur
     ---

   - An intro section (2–4 sentences) explaining:
     - who this digest is for (solo AI/B2B founders, small biz tools),
     - any noticeable theme of today’s picks (if there is one),
       otherwise keep it generic and short.

   - Then several sections with level-2 headings (##), such as:

     ## SaaS starters and templates
     ## AI agents, LLM infra and RAG
     ## Ops, analytics and automation
     ## Marketing, sales and GTM tools

     Only create sections that you actually have repos for.
     If all picks are of one type, a single “## Today’s picks” section is fine.

   - Under each section, list repos as bullet points with this format:

     - [owner/repo](URL) – concise, opinionated one-liner
       explaining why this matters for a solo AI/B2B founder
       (Language, 2.1k★)

     For example:

     - [acme/saas-starter](https://github.com/acme/saas-starter) –
       Opinionated Next.js + Stripe + Supabase starter that gets you to
       paid SaaS users faster than stitching boilerplate from scratch
       (TypeScript, 1.2k★)

     Use approximated star counts like "1.2k★" or "240★" depending on size.

7. Be opinionated but concise in the descriptions.
   Assume the reader is technical and cares about developer experience,
   maintainability, and time-to-value, not just hype.

8. After you write the file, double-check:

   - The path is under posts/.
   - The front matter is valid YAML.
   - The date in the title and front matter matches the JSON file’s date.

9. Do not create any other files.
   Do not modify workflows or config in this run.

At the end, print a short summary of what you did:

- Whether you created a new post or skipped today.
- If created, the filename and the number of repos included.
```

You can tweak the thresholds (stars, recency) and tags later, but this should give you a working V0 with:

- Daily data snapshots via Actions.
- A blog-style index with a clean layout via the blog action.[^9_1][^9_2]
- Cowork deciding when *not* to post, so you never force low-quality digests.

Do you want a very short example of a generated `posts/YYYY-MM-DD-github-digest.md` so you can eyeball the tone and structure before you run this for real?

<div align="center">⁂</div>

[^9_1]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^9_2]: https://github.com/kamranahmedse/github-pages-blog-action


---

# yes, that would be nice.

Here’s a compact example of what a generated digest post might look like, plus how it surfaces in the blog index.

## Example digest Markdown file

`posts/2026-03-04-github-digest.md`:

```markdown
---
title: "GitHub Digest – 2026-03-04"
date: 2026-03-04
tags:
  - github
  - digest
  - ai
  - saas
  - solopreneur
---

Today’s picks focus on shipping faster as a solo or small team: SaaS starters that remove boilerplate, AI/LLM infra you can actually run, and a few ops tools that make small businesses feel more “enterprise” without the weight. If you’re building AI-powered B2B products, these should all be within cloning distance of something you’re working on.

## SaaS starters and templates

- [acme/saas-starter](https://github.com/acme/saas-starter) – Opinionated Next.js + Stripe + Supabase starter that gets you to “paid user” flows in days instead of weeks (TypeScript, 1.2k★)  
- [founderbase/b2b-saas-kit](https://github.com/founderbase/b2b-saas-kit) – Batteries-included B2B SaaS template with auth, teams, billing, and a basic CRM so you can focus on your niche workflow instead of scaffolding (TypeScript, 840★)

## AI agents, LLM infra and RAG

- [vectorhub/llm-gateway](https://github.com/vectorhub/llm-gateway) – A simple gateway for routing LLM calls, logging prompts, and swapping providers so you don’t hardwire OpenAI/Anthropic into your app (Go, 560★)  
- [ragworks/saas-rag-stack](https://github.com/ragworks/saas-rag-stack) – Reference RAG stack with ingestion, chunking, embeddings, and a chat UI that’s close to “drop into your product” ready (Python, 730★)

## Ops, analytics and automation

- [ledgerlite/smb-finance](https://github.com/ledgerlite/smb-finance) – Lightweight bookkeeping + cashflow dashboard that’s actually readable by a founder, not just an accountant (Python, 310★)  
- [pipeflow/github-to-airtable](https://github.com/pipeflow/github-to-airtable) – Sync GitHub issues and stars into Airtable so you can treat repos like a lead list or product backlog with filters and views (JavaScript, 190★)

## Marketing, sales and GTM tools

- [inboxintel/email-warmup-agent](https://github.com/inboxintel/email-warmup-agent) – Agent-style cold email sequencer with basic warmup and reply tracking built in; handy if you don’t want to pay for a full sales engagement platform yet (TypeScript, 420★)  
- [landingcraft/hero-blocks](https://github.com/landingcraft/hero-blocks) – Collection of high-converting hero sections for SaaS landing pages, wired for Tailwind + React so you can ship a “good enough” v1 homepage in an afternoon (TypeScript, 260★)
```

(Real runs will, of course, use actual repos from your JSON snapshot.)

## How this appears in the blog index

With `kamranahmedse/github-pages-blog-action` (or similar “blog from Markdown” action), the index page typically shows:

- A **list of posts**, newest first. Each row/card includes:
    - Title: “GitHub Digest – 2026-03-04” (linked to the full post).
    - Date: “March 4, 2026”.
    - Short excerpt: first paragraph of the intro (“Today’s picks focus on…”).
- Clicking the title opens a clean page that renders:
    - The headings (SaaS starters, AI agents, Ops, etc.).
    - The bullet list of repos with links and one-liners.

Days where Cowork decides “no interesting repos today” simply don’t get a `posts/YYYY-MM-DD-*.md` file, so they never appear in the index—no empty posts, no filler.

If you’d like, next step I can help you tune the search queries in `config/queries.json` to really align with your AI/B2B/solo-founder lens before you start running this daily.

---

# That would be nice.

A query around "trending, notable, or top today" would be great, especially as a catcher of neat items that don't hit our standard searches.

You can cover your “trending/notable today” catcher with one extra source: GitHub Trending (scraped or via a community API), plus a broad “fresh + popular” search query.

## Add a “trending today” catcher

There’s no official Trending API, but you have two workable paths:

1. **Scrape `https://github.com/trending` daily**
    - Hit `https://github.com/trending?since=daily` (and maybe `&spoken_language_code=en`).[^11_1]
    - Parse the HTML to pull repo slug, description, language, stars today, total stars.
    - Feed these into the same JSON structure as your search results (or in a separate `trending` array).
    - Cowork can then treat “trending-only” picks as a separate category, or just mix them into the pool.
2. **Use a community “Trending API”**
    - Projects like **GiTrends** provide an API that wraps GitHub Trending data, exposing endpoints for daily/weekly/monthly trending repos.[^11_2]
    - You can call GiTrends (or a similar open-source project like `trending-github`) from your Action instead of scraping HTML directly.[^11_3][^11_4]

Either way, think of this as a separate “trending intake” that Cowork sees alongside your topic-based searches.

## Suggested queries for your lens

In `config/queries.json`, you might do:

```json
{
  "default_queries": [
    "topic:saas language:TypeScript stars:>40 pushed:>2025-01-01 sort:stars",
    "topic:llm OR topic:agents stars:>80 pushed:>2025-01-01 sort:stars",
    "topic:crm OR topic:marketing-automation stars:>40 pushed:>2025-01-01 sort:stars"
  ],
  "extra_queries": [
    "topic:billing OR topic:subscriptions stars:>30 pushed:>2025-01-01 sort:stars",
    "topic:analytics OR topic:business-intelligence stars:>40 pushed:>2025-01-01 sort:stars",
    "language:typescript stars:>80 pushed:>2025-01-01 topic:template sort:stars"
  ]
}
```

GitHub supports `stars:>X`, `pushed:>YYYY-MM-DD`, and `sort` qualifiers (`sort:stars`, `sort:updated`) in repo search, so you’re combining popularity + recency. You can keep the star thresholds fairly low because Cowork will filter again.[^11_5][^11_6][^11_7][^11_8]

## “Top today” without official trending

Inside your existing Action, you can already approximate “today-ish standouts” by:

- Adding a **recency band**:
    - Example: `pushed:>2026-03-01` combined with stars filters.[^11_6]
- Sorting by **recent activity or stars**:
    - `sort:updated` or `sort:stars` in the query when you call the Search API.[^11_8][^11_5]

But the “Trending” page still captures repos that picked up a lot of interest *today*, even if their total stars are modest, so including it (via scrape or GiTrends) is worth it.[^11_3][^11_2][^11_1]

In your Cowork prompt, we can add a rule like: “Also consider any repos from the daily GitHub Trending source; treat them as ‘notable today’ even if they don’t match the normal topic filters, but still apply judgment.” That way your blogroll gets delightful oddballs without diluting the signal.

Do you want me to sketch the exact changes to your Action script to (a) load `config/queries.json`, and (b) pull in a basic GiTrends call as an extra `trending` array in the JSON?
<span style="display:none">[^11_10][^11_11][^11_12][^11_13][^11_14][^11_15][^11_9]</span>

<div align="center">⁂</div>

[^11_1]: https://github.com/trending

[^11_2]: https://github.com/maulikshetty/GiTrends

[^11_3]: https://stackoverflow.com/questions/30525330/how-to-get-list-of-trending-github-repositories-by-github-api

[^11_4]: https://github.com/ecrmnn/trending-github

[^11_5]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results

[^11_6]: https://github.com/orgs/community/discussions/159014

[^11_7]: https://docs.github.com/en/enterprise-server@3.3/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^11_8]: https://github.com/github/docs/blob/main/content/search-github/getting-started-with-searching-on-github/sorting-search-results.md

[^11_9]: https://stackoverflow.com/questions/24110068/github-is-it-possible-to-search-inside-code-and-sort-by-stars

[^11_10]: https://docs.github.com/en/get-started/exploring-projects-on-github/saving-repositories-with-stars

[^11_11]: https://github.com/orgs/community/discussions/24746

[^11_12]: https://github.com/isaacs/github/issues/854

[^11_13]: https://github.com/orgs/community/discussions/8578

[^11_14]: https://docs.github.com/enterprise/2.1/user/articles/advanced-search

[^11_15]: https://docs.github.com/en/search-github/searching-on-github/searching-code


---

# a and b, yes. Thank you.

Here’s a tightened version of the workflow script that does both:

- Loads `config/queries.json` (default + extra queries).
- Calls **GiTrends** once to pull “trending today”.[^12_1]

You’ll drop this into your existing `fetch-repos.yml` (replacing the Node step).

## Updated `fetch-repos.yml` core script

Keep the top of the workflow (schedule, checkout, Node setup, install) the same as before, but change the **“Fetch repos”** step to:

```yaml
      - name: Fetch repos
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node << 'EOF'
          import fs from 'fs';
          import fetch from 'node-fetch';

          // Helpers
          function readQueries() {
            const raw = fs.readFileSync('config/queries.json', 'utf8');
            const parsed = JSON.parse(raw);
            const defaultQueries = parsed.default_queries || [];
            const extraQueries = parsed.extra_queries || [];
            return { defaultQueries, extraQueries };
          }

          async function searchGithub(q) {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.set('q', q);
            // Sort by stars to bias toward popular / notable
            url.searchParams.set('sort', 'stars');
            url.searchParams.set('order', 'desc');
            url.searchParams.set('per_page', '50');

            const res = await fetch(url, {
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GH_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(`GitHub search failed ${res.status}: ${text}`);
            }

            const json = await res.json();
            return json.items || [];
          }

          async function fetchGiTrends() {
            // Basic example using GiTrends default endpoint.
            // Adjust URL/params if you self-host it or use a different instance.
            const url = 'https://gitrends.example.com/api/trending?since=daily';
            const res = await fetch(url);
            if (!res.ok) {
              const text = await res.text();
              console.error(`GiTrends request failed ${res.status}: ${text}`);
              return [];
            }
            const json = await res.json();
            // Normalize to a similar shape; GiTrends usually returns "full_name", "url", etc.[web:92]
            return (json || []).map(item => ({
              full_name: item.full_name,
              html_url: item.url || `https://github.com/${item.full_name}`,
              description: item.description || null,
              stargazers_count: item.stars || 0,
              language: item.language || null,
              topics: item.topics || [],
              pushed_at: item.pushed_at || null,
              created_at: item.created_at || null,
              forks_count: item.forks || 0,
              _source: 'trending'
            }));
          }

          function slimRepo(r, source = 'search') {
            return {
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              stargazers_count: r.stargazers_count,
              language: r.language,
              topics: r.topics,
              pushed_at: r.pushed_at,
              created_at: r.created_at,
              forks_count: r.forks_count,
              _source: source
            };
          }

          (async () => {
            const { defaultQueries, extraQueries } = readQueries();

            const allSearchRepos = [];
            const queries = [...defaultQueries, ...extraQueries];

            for (const q of queries) {
              const items = await searchGithub(q);
              allSearchRepos.push(...items.map(r => slimRepo(r, 'search')));
            }

            // Fetch trending from GiTrends (best-effort, can fail quietly)
            let trendingRepos = [];
            try {
              trendingRepos = await fetchGiTrends();
            } catch (e) {
              console.error('Failed to fetch GiTrends trending data:', e);
            }

            // Deduplicate by full_name across search + trending
            const byName = {};
            for (const r of [...allSearchRepos, ...trendingRepos]) {
              // If already seen, keep the one with higher stars
              const existing = byName[r.full_name];
              if (!existing || (r.stargazers_count || 0) > (existing.stargazers_count || 0)) {
                byName[r.full_name] = r;
              }
            }
            const deduped = Object.values(byName);

            const date = new Date().toISOString().slice(0, 10);
            const payload = {
              generated_at: new Date().toISOString(),
              queries: {
                default_queries: defaultQueries,
                extra_queries: extraQueries
              },
              sources: {
                github_search: {
                  query_count: queries.length,
                  repo_count: allSearchRepos.length
                },
                trending: {
                  provider: 'gitrends',
                  repo_count: trendingRepos.length
                }
              },
              repos: deduped
            };

            if (!fs.existsSync('data')) {
              fs.mkdirSync('data', { recursive: true });
            }
            const path = `data/repos-${date}.json`;
            fs.writeFileSync(path, JSON.stringify(payload, null, 2));
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
          EOF
```


### Notes

- The script reads `config/queries.json` and merges `default_queries`+`extra_queries`.[^12_2][^12_3][^12_4]
- It calls GiTrends at `https://gitrends.example.com/...` as a placeholder; point that to your instance or a public one you trust.[^12_1]
- It tags each repo with `"_source": "search"` or `"trending"` so Cowork can treat them differently if you want.

In your Cowork digest prompt, you can now add:

> “Repos may have `_source: "trending"`; consider these as ‘notable today’ even if they don’t perfectly match the usual topics, but still apply judgment.”

If you’d like, I can suggest a GiTrends URL pattern and a couple of example filters you might apply inside Cowork when `_source === "trending"` to keep oddball noise down.

<div align="center">⁂</div>

[^12_1]: https://github.com/maulikshetty/GiTrends

[^12_2]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^12_3]: https://github.com/orgs/community/discussions/159014

[^12_4]: https://docs.github.com/en/enterprise-server@3.3/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax


---

# I think oddball noise is ok, for now.

That actually simplifies things: you can just ingest “raw” trending as a discovery firehose and let Cowork decide what (if anything) is worth surfacing.

## Simple GiTrends wiring with loose filtering

In your Action script, you can keep the GiTrends call essentially as-is, just point it somewhere real:

- If you use a **public instance** (example pattern):
    - `https://gitrends.yourchosenhost.com/api/trending?since=daily`[^13_1]
- If you **self-host** on your own domain or VM:
    - `https://gitrends.yourdomain.com/api/trending?since=daily`

Since you’re fine with oddballs, you don’t need heavy filtering there—just normalize fields and merge into your `repos` array like we did.

## Cowork-side handling of “noisy but fun” trending

In your digest prompt, add a lightweight rule instead of strict filters:

- “Repos with `_source: "trending"` may be quirky; include them when:
    - They look novel or fun *and*
    - You can explain in one line why a solo founder or AI/B2B builder might care (even if it’s just inspiration or UI/UX ideas).”

You can also suggest a small cap so trending doesn’t dominate:

- “Include at most 3–4 `_source: "trending"` picks per digest; if others are interesting, mention them in a short ‘Also trending’ bullet list at the end.”

That keeps the main sections high-signal, while still letting weird/cool stuff leak into the feed.

Do you want a tightened Cowork snippet you can paste into your existing digest prompt that describes exactly how to treat `_source: "trending"` repos?

<div align="center">⁂</div>

[^13_1]: https://github.com/maulikshetty/GiTrends


---

# that would be nice. Maybe a top five, but only do the writeup on the top three of those five style scenario?

You can bolt this directly into your existing Cowork digest prompt as a “trending handling” section.

## Snippet to insert into your Cowork prompt

Drop this into your digest prompt after the general repo-selection rules (e.g., right after step 2 or 3 where you describe how to filter repos):

```text
Special handling for trending repos:

- Some repos in the JSON will have "_source": "trending".
- Treat these as "notable today" candidates, even if they don't exactly match the main topic filters,
  but still apply basic judgment (clear description, not obviously spam).

For trending repos, follow this process:

1. From all repos where _source == "trending", pick up to 5 that look interesting
   for a solo founder / AI / B2B / small-business lens.
   These can be quirky or experimental, as long as you can explain why they might inspire
   or inform someone building products in this space.

2. Rank those up-to-5 by how compelling they are for this audience.
   Consider factors like:
   - clear practical use or strong learning value,
   - interesting tech stack or UX that a founder might want to copy,
   - buzz / novelty reflected in description or star growth (if visible).

3. From that ranked list, select the top 3 as "featured" trending picks.
   The remaining (up to 2) are still "notable", but get only a short mention.

4. In the post:

   - For the top 3 trending repos:
     - Integrate them into the most appropriate section (e.g. SaaS starters, AI infra, ops tools),
       OR, if they are very eclectic, create a separate section:
       "## Trending oddballs worth a look".
     - Give each of these 3 the full one-line opinionated writeup format you use for normal picks:
       name + link + concise why-it-matters + (Language, stars).

   - For the remaining up to 2 trending repos (if any):
     - Add a small "Also trending today" subsection near the end of the post.
     - List them as bullets with only:
       - name + link
       - a super short phrase (5–10 words) about why they caught your eye
       - (Language, stars)
     - Keep these blurbs intentionally lighter weight.

5. If there are fewer than 3 good trending repos on a given day:
   - Feature as many as meet your quality bar (1 or 2),
   - And skip the rest; do NOT force it to 3 or 5.
```

This keeps your main digest coherent, gives you a fun “today’s odd stuff” angle, and still respects your rule: if there’s nothing genuinely interesting, don’t force content.

Do you want me to now merge *everything* into a single, ready-to-paste digest prompt (general logic + trending rules included) so you can just save it as your canonical Cowork task?

---

# Yes, a full setup prompt and a full digest prompt would be great.

Was thinking of just hosting via github pages, not seeing a need to host otherwise?

GitHub Pages is perfect; you don’t need to host anything else for this. You get static hosting, actions, and the blog layout all inside the repo.[^15_1][^15_2]

Below are two **final, copy‑paste‑ready Cowork prompts**:

***

## 1) Cowork “Full Setup” prompt (run once per repo)

Use this in Cowork to scaffold the repo, workflows, and blog config.

```text
You are helping me set up a GitHub repository that will:

- Fetch interesting GitHub repositories daily via GitHub Actions.
- Let me curate them with AI into Markdown digest posts.
- Render those digests as a clean blog-style index using GitHub Pages only
  (no extra hosting).

Assume you are running inside a local clone of this repo.
You can create and edit files and directories.

Overall architecture:

- GitHub Actions workflow 1: daily, writes data/repos-YYYY-MM-DD.json
  using the GitHub Search API and a small set of queries.
- GitHub Actions workflow 2: on push to posts/, runs a blog-from-Markdown
  action (kamranahmedse/github-pages-blog-action) to build a static blog
  into the gh-pages branch.
- GitHub Pages serves the site from gh-pages. No other hosting required.

Please perform these steps, in order:

1) Create repo structure (if not already present):

   - .github/workflows/
   - config/
   - data/
   - posts/
   - static/   (for any future images/css; can be empty)

2) Create config/queries.json with this exact JSON content
   (no comments, valid JSON):

   {
     "default_queries": [
       "topic:saas language:TypeScript stars:>40 pushed:>2025-01-01 sort:stars",
       "topic:llm OR topic:agents stars:>80 pushed:>2025-01-01 sort:stars",
       "topic:crm OR topic:marketing-automation stars:>40 pushed:>2025-01-01 sort:stars"
     ],
     "extra_queries": [
       "topic:billing OR topic:subscriptions stars:>30 pushed:>2025-01-01 sort:stars",
       "topic:analytics OR topic:business-intelligence stars:>40 pushed:>2025-01-01 sort:stars",
       "language:typescript stars:>80 pushed:>2025-01-01 topic:template sort:stars"
     ]
   }

   These are GitHub search queries tailored for:
   - SaaS starters and templates,
   - AI / LLM / agents,
   - CRM, marketing automation, billing, analytics relevant to B2B SaaS
     and small business tools.

3) Create .github/workflows/fetch-repos.yml with:

   - A daily cron schedule (e.g. "0 13 * * *" once per day).
   - Also supports manual "workflow_dispatch".
   - Uses Node 20 and node-fetch.
   - Reads config/queries.json and merges default_queries + extra_queries.
   - For each query:
     - Calls the GitHub Search API (repositories),
       with per_page=50, sort=stars, order=desc.
   - Deduplicates repos by full_name across all queries.
   - Produces a "slim" representation per repo:

     {
       "full_name": "owner/name",
       "html_url": "https://github.com/owner/name",
       "description": "string or null",
       "stargazers_count": 1234,
       "language": "TypeScript",
       "topics": [...],
       "pushed_at": "ISO timestamp",
       "created_at": "ISO timestamp",
       "forks_count": 10
     }

   - Writes data/repos-YYYY-MM-DD.json with shape:

     {
       "generated_at": "ISO timestamp",
       "queries": {
         "default_queries": [...],
         "extra_queries": [...]
       },
       "sources": {
         "github_search": {
           "query_count": <int>,
           "repo_count": <int>
         }
       },
       "repos": [ ...slim repo objects... ]
     }

   - The GH auth should use the built-in GITHUB_TOKEN.
   - Make sure the YAML is valid and the Node script is syntactically correct.

   (You do NOT need to implement a trending API here in the setup; just
   wire the search + JSON output as described.)

4) Create a minimal site.json in the repo root, compatible with
   "kamranahmedse/github-pages-blog-action", for example:

   {
     "title": "GitHub Repo Digest",
     "subtitle": "Daily picks for solo founders, AI/B2B SaaS, and small business tools",
     "baseUrl": "",
     "theme": "light",
     "showPostDate": true
   }

5) Create .github/workflows/deploy-blog.yml that:

   - Triggers on push affecting:
     - "posts/**"
     - "site.json"
   - Checks out the repo.
   - Uses "kamranahmedse/github-pages-blog-action@v0.0.10"
     with "branch: gh-pages".
   - Does not require any other config beyond site.json and posts/*.
   - Ensures the action output is suitable for GitHub Pages to serve
     from the gh-pages branch.

6) Create a minimal README.md that:

   - Explains the purpose in 2–3 sentences:
     daily GitHub repo discovery and curation for solo founders / AI / B2B SaaS / small biz tools.
   - Explains the flow in a short bullet list, for example:
     - "fetch-repos workflow runs daily and writes JSON snapshots to data/"
     - "I run Claude Cowork using a prompt to curate repos and generate Markdown posts in posts/"
     - "deploy-blog workflow builds a static blog from posts and publishes it to GitHub Pages"
     - "By design, some days may have no post if nothing interesting is found"
   - Mentions that email delivery is intentionally out of scope for v0.

7) Do NOT enable or configure any external hosting.
   This project should rely only on:
   - GitHub Actions,
   - gh-pages branch,
   - GitHub Pages.

8) After you finish creating and editing these files, output a short summary
   of what you created and where (file paths and a 1-line description each).
   Do not open a browser window or make network calls from this prompt.
```


***

## 2) Cowork “Full Digest” prompt (run whenever you want a new post)

Use this as your canonical digest‑generation task.

```text
You are helping me generate a GitHub repo digest post for my
GitHub Pages blog.

Context:

- The repo has a GitHub Actions workflow that writes JSON snapshots
  to the data/ directory.
- Each JSON file is named: data/repos-YYYY-MM-DD.json
- The JSON shape is:

  {
    "generated_at": "ISO timestamp",
    "queries": {
      "default_queries": ["..."],
      "extra_queries": ["..."]
    },
    "sources": {
      "github_search": {
        "query_count": <int>,
        "repo_count": <int>
      },
      "trending": {
        "provider": "gitrends",
        "repo_count": <int>
      }
    },
    "repos": [
      {
        "full_name": "owner/name",
        "html_url": "https://github.com/owner/name",
        "description": "string or null",
        "stargazers_count": 1234,
        "language": "TypeScript",
        "topics": ["saas", "crm"],
        "pushed_at": "ISO timestamp",
        "created_at": "ISO timestamp",
        "forks_count": 10,
        "_source": "search" or "trending"
      }
    ]
  }

- The blog is generated from Markdown files in the posts/ directory
  by the GitHub Action "kamranahmedse/github-pages-blog-action".
- GitHub Pages serves the static blog from the gh-pages branch.

Audience:

- Solo founder / solopreneur building AI/B2B SaaS and small business tools.
- Technical, comfortable reading GitHub repos.
- Limited time: wants concise, opinionated curation, not a firehose.

Your task:

- Read the latest data snapshot.
- Decide if there is anything interesting enough to warrant a post today.
- If NOT, do nothing.
- If YES, create a new Markdown post under posts/ with a structured digest.

Steps:

1) Find the latest file in data/ whose name matches "repos-YYYY-MM-DD.json".
   Parse it as JSON. Extract:
   - the date YYYY-MM-DD from the filename,
   - the list of repos.

2) From "repos", select projects that are especially useful or inspiring for:

   - Solo founders / solopreneurs.
   - AI / LLM / agent infra and tooling.
   - B2B SaaS products (templates, starters, modules).
   - Small-business-friendly utilities (ops, billing, analytics, CRM,
     marketing automation, automation tooling).

   Use these heuristics:

   - Prefer repos with:
     - Recent activity (pushed_at within the last 6–12 months).
     - Non-trivial stars (e.g. > 40, but use judgment).
     - Clear practical value from their description/topics.
   - Deprioritize:
     - Very academic or toy repos with unclear application.
     - Obvious spam or very low-effort content.
     - Pure "awesome list clones" that add no unique angle.

3) If, after filtering, there are ZERO repos that feel clearly useful or
   interesting for this audience, STOP:
   - Do NOT create or modify any files.
   - Exit gracefully.
   Some days should intentionally have no digest.

4) If there ARE interesting repos, pick at most 12 of the strongest ones.
   Aim for a mix (starters, infra, ops, marketing, etc.) rather than
   12 of the same type.

5) Special handling for trending repos (optional firehose):

   - Some repos may have "_source": "trending".
   - Treat these as "notable today" candidates. They can be quirky or odd,
     as long as you can see some potential interest or inspiration for
     a solo founder / AI / B2B builder.

   Do this:

   a) From all repos where _source == "trending", pick up to 5 that look
      interesting or fun for this audience.

   b) Rank these up-to-5 by how compelling they are:
      - clear practical use or strong learning value,
      - interesting stack or UX to copy,
      - or just a genuinely novel idea.

   c) From that ranked shortlist, choose the top 3 as "featured trending"
      picks. The rest (up to 2) are "also notable".

   d) In the final post:
      - The top 3 trending picks should get full one-line writeups,
        integrated into the most appropriate section (SaaS, AI infra, ops, etc.)
        OR placed under a dedicated section like:

        "## Trending oddballs worth a look"

      - The remaining up to 2 trending picks (if any) should be listed in
        a short "Also trending today" subsection near the end with:
        - name + link,
        - a very short phrase (5–10 words) about why they caught your eye,
        - (Language, stars).

   e) If there are fewer than 3 interesting trending repos, only feature
      the ones that meet your quality bar; do not force it.

6) Create a new Markdown file under posts/ with the name:

   posts/YYYY-MM-DD-github-digest.md

   where YYYY-MM-DD matches the JSON file date you are using.

7) Write the Markdown post with this structure:

   - YAML front matter at the top:

     ---
     title: "GitHub Digest – YYYY-MM-DD"
     date: YYYY-MM-DD
     tags:
       - github
       - digest
       - ai
       - saas
       - solopreneur
     ---

   - An intro section (2–4 sentences) that:
     - briefly states who this digest is for (solo founders, AI/B2B SaaS,
       small business tools),
     - highlights any theme you notice today (if any),
     - and sets expectations that this is a curated, opinionated list.

   - Then sections with level-2 headings (##), for example:

     ## SaaS starters and templates
     ## AI agents, LLM infra and RAG
     ## Ops, analytics and automation
     ## Marketing, sales and GTM tools
     ## Trending oddballs worth a look   (only if needed)

     Only create sections that you actually have repos for.
     If everything is mixed, a single "## Today’s picks" section is fine.

   - Under each section, list repos as bullet points using this format
     for full writeups:

     - [owner/repo](URL) – concise, opinionated one-liner explaining
       why this matters for a solo AI/B2B founder
       (Language, 1.2k★)

     Use approximate star formatting like:
     - "1.2k★" for thousands,
     - "240★" for smaller counts.

   - For the small "Also trending today" subsection (if applicable),
     use ultra-short blurbs (5–10 words) per repo.

8) Be opinionated but concise.
   Assume the reader is technical and cares about:
   - developer experience,
   - maintainability,
   - time-to-value,
   - leverage for solo or tiny teams.

9) After writing the file:

   - Ensure the path is under posts/.
   - Ensure the YAML front matter is valid and the date matches the file name.
   - Do not edit workflows, config, or other files.

10) At the end, print a short summary of what you did:

   - Whether you created a new post or skipped today.
   - If created, the filename and how many repos were included
     (and how many were trending).
```

GitHub Pages + these two prompts give you the whole system with no extra hosting.[^15_2][^15_1]

Do you want the `fetch-repos.yml` YAML block itself next (using `config/queries.json` but no trending yet), so you can paste it in without hand-assembling?

<div align="center">⁂</div>

[^15_1]: https://dev.to/m1ner/how-to-use-github-pages-to-host-a-blog-4ofd

[^15_2]: https://workshops.code-maven.com/github-actions-to-generate-complex-static-web-sites.html


---

# That would be great.

But before you do that, give me a list of all the suggestions (like that one) that you would make if I "accepted" each time, so that we can do one fell swoop approach?

Here’s a concise “one fell swoop” checklist of everything I’d suggest you add if you said yes to every upgrade so far. Think of this as the full V0.5 plan.

## Repo structure and files

- Create directories:
    - `.github/workflows/`
    - `config/`
    - `data/`
    - `posts/`
    - `static/` (optional assets)
- Add `config/queries.json` with:
    - `default_queries` focused on:
        - SaaS starters (TypeScript, `topic:saas`, recency + stars).
        - AI/LLM/agents (`topic:llm OR topic:agents`, recency + stars).
        - CRM/marketing automation (`topic:crm OR topic:marketing-automation`, recency + stars).[^16_1][^16_2]
    - `extra_queries` for:
        - Billing/subscriptions.
        - Analytics/BI.
        - TypeScript templates / starters.[^16_2][^16_1]
- Add `site.json` for the blog action with:
    - Title, subtitle, baseUrl, theme, showPostDate.[^16_3][^16_4]
- Add a `README.md` explaining:
    - Purpose (daily GitHub repo discovery for solo AI/B2B/small biz).
    - Flow: `fetch-repos` → Cowork digest → `deploy-blog` → GitHub Pages.
    - “Some days have no post” is intentional.


## GitHub Actions workflows

1) `fetch-repos.yml` (daily data snapshot)

- Triggers:
    - Daily cron (e.g. `0 13 * * *`).
    - `workflow_dispatch`.
- Steps:
    - Checkout repo.
    - Setup Node 20.
    - Install `node-fetch`.
    - **Script:**
        - Read `config/queries.json`.
        - Merge `default_queries` + `extra_queries`.
        - For each query:
            - Call GitHub Search API (repos) with `per_page=50`, `sort=stars`, `order=desc`.[^16_5][^16_6]
        - Normalize to a slim shape per repo (name, URL, description, stars, language, topics, pushed/created timestamps, forks).
        - (Optionally) call a GiTrends endpoint to fetch “trending today” and normalize with `_source: "trending"`.[^16_7][^16_8]
        - Deduplicate by `full_name` across search + trending; keep the higher-star version when conflicted.
        - Write `data/repos-YYYY-MM-DD.json` with:
            - `generated_at`.
            - `queries` (both arrays).
            - `sources` (counts for search and trending).
            - `repos` (deduped list).

2) `deploy-blog.yml` (build blog on changes)

- Triggers:
    - `push` on `posts/**` and `site.json`.
- Steps:
    - Checkout repo.
    - Run `kamranahmedse/github-pages-blog-action@v0.0.10` with `branch: gh-pages`.[^16_4][^16_3]
- GitHub Pages:
    - Enabled to serve from `gh-pages` branch.


## Cowork tasks and prompts

1) **Setup task** (run once)

- Uses the “Full Setup” prompt you already have:
    - Creates the directory tree.
    - Writes `config/queries.json`.
    - Writes fully-populated `fetch-repos.yml`.
    - Writes `deploy-blog.yml`.
    - Writes `site.json` and `README.md`.

2) **Digest task** (run when you want a new post)

- Uses the “Full Digest” prompt you already have:
    - Reads the latest `data/repos-YYYY-MM-DD.json`.
    - Filters repos by:
        - Relevance to solo founder / AI / B2B / small biz.
        - Recency (pushed in last 6–12 months).
        - Basic star threshold (e.g. > 40, but flexible).
    - If 0 interesting repos:
        - Exits, creates nothing.
    - Else:
        - Picks up to 12 “strongest” repos.
        - Applies **special trending handling**:
            - From `_source: "trending"`, pick up to 5.
            - Rank them, choose top 3 for full writeups; rest (up to 2) go into a “Also trending today” mini-section with ultra-short blurbs.
        - Creates `posts/YYYY-MM-DD-github-digest.md` with:
            - YAML front matter (title, date, tags).
            - Short intro.
            - Section headings (SaaS starters, AI infra, Ops, Marketing, Trending oddballs).
            - Opinionated bullet items per repo (name, link, why-it-matters, language, stars).


## Search/query strategy (for your lens)

- Baseline queries (high signal, AI/B2B/solo-friendly):
    - SaaS TS starters: `topic:saas language:TypeScript stars:>40 pushed:>2025-01-01 sort:stars`.
    - LLM/agents: `topic:llm OR topic:agents stars:>80 pushed:>2025-01-01 sort:stars`.
    - CRM/marketing automation: `topic:crm OR topic:marketing-automation stars:>40 pushed:>2025-01-01 sort:stars`.
- Extra queries to sprinkle more verticals:
    - Billing/subscriptions, analytics/BI, generic TS templates.[^16_1][^16_2]


## Optional / later “nice to haves”

You can defer these, but they’d be natural next steps:

- Add a small “config/preferences.json” to encode:
    - Your star thresholds.
    - Recency window.
    - Per-section caps (e.g. max 4 picks per section).
- Add a GitHub Action that:
    - On post creation, updates a `posts/index.md` with a manual index (if you want more control than the default blog index).
- Add a “spotlight” section in the Cowork prompt that:
    - Lets you manually paste 1–2 extra repos when you discover them via Perplexity and want them in the next digest.

If that overall checklist looks right, next step I can do the **full `fetch-repos.yml`** ready to paste (using `config/queries.json`, with or without GiTrends depending on your preference).

Which flavor do you want the concrete `fetch-repos.yml` for first: **search-only** or **search + GiTrends trending**?

<div align="center">⁂</div>

[^16_1]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^16_2]: https://github.com/orgs/community/discussions/159014

[^16_3]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^16_4]: https://github.com/kamranahmedse/github-pages-blog-action

[^16_5]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results

[^16_6]: https://docs.github.com/en/enterprise-server@3.3/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^16_7]: https://stackoverflow.com/questions/30525330/how-to-get-list-of-trending-github-repositories-by-github-api

[^16_8]: https://github.com/maulikshetty/GiTrends


---

# This overall checklist looks great, we can do this with search + GiTrends.

Include the "nice to haves" - in for a penny as they say

The setup - I am thinking Claude Code w/ GitHub skills and Frontend UI skills built, and then cowork for the day-to-day?

Using Claude Code (+ GitHub / FE skills) for the initial build and Cowork for the ongoing digestion is exactly how I’d split it. Below is the concrete **search + GiTrends** workflow you asked for, including the “nice to haves”.[^17_1][^17_2][^17_3]

## `fetch-repos.yml` – search + GiTrends + config

Place this at `.github/workflows/fetch-repos.yml`:

```yaml
name: Fetch GitHub repos for digest

on:
  schedule:
    - cron: "0 13 * * *"  # daily at 13:00 UTC
  workflow_dispatch:

jobs:
  fetch-and-commit:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: |
          npm init -y >/dev/null 2>&1 || true
          npm install node-fetch@3

      - name: Fetch repos
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node << 'EOF'
          import fs from 'fs';
          import fetch from 'node-fetch';

          // Read queries from config/queries.json
          function readQueries() {
            const raw = fs.readFileSync('config/queries.json', 'utf8');
            const parsed = JSON.parse(raw);
            const defaultQueries = parsed.default_queries || [];
            const extraQueries = parsed.extra_queries || [];
            return { defaultQueries, extraQueries };
          }

          async function searchGithub(q) {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.set('q', q);
            url.searchParams.set('sort', 'stars');
            url.searchParams.set('order', 'desc');
            url.searchParams.set('per_page', '50');

            const res = await fetch(url, {
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GH_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(`GitHub search failed ${res.status}: ${text}`);
            }

            const json = await res.json();
            return json.items || [];
          }

          // GiTrends – use your chosen or self-hosted API base
          async function fetchGiTrends() {
            // Example public-style instance (replace with your actual base URL):
            // const base = 'https://gh-trending.vercel.app';
            // Example self-hosted-style instance:
            const base = 'https://gitrends.yourdomain.com';

            const url = `${base}/api/trending?since=daily&spoken_language_code=en`;
            const res = await fetch(url);
            if (!res.ok) {
              const text = await res.text();
              console.error(`GiTrends request failed ${res.status}: ${text}`);
              return [];
            }
            const json = await res.json();
            // gh-trending-style APIs typically return fields like "author", "name", "url", "language", "stars".[web:92][web:102]
            return (json || []).map(item => {
              const fullName = item.full_name || `${item.author}/${item.name}`;
              return {
                full_name: fullName,
                html_url: item.url || `https://github.com/${fullName}`,
                description: item.description || null,
                stargazers_count: item.stars || 0,
                language: item.language || null,
                topics: item.topics || [],
                pushed_at: item.pushed_at || null,
                created_at: item.created_at || null,
                forks_count: item.forks || 0,
                _source: 'trending'
              };
            });
          }

          function slimRepo(r, source = 'search') {
            return {
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              stargazers_count: r.stargazers_count,
              language: r.language,
              topics: r.topics,
              pushed_at: r.pushed_at,
              created_at: r.created_at,
              forks_count: r.forks_count,
              _source: source
            };
          }

          (async () => {
            const { defaultQueries, extraQueries } = readQueries();
            const queries = [...defaultQueries, ...extraQueries];

            const allSearchRepos = [];

            for (const q of queries) {
              const items = await searchGithub(q);
              allSearchRepos.push(...items.map(r => slimRepo(r, 'search')));
            }

            // Best-effort trending; okay if it fails
            let trendingRepos = [];
            try {
              trendingRepos = await fetchGiTrends();
            } catch (e) {
              console.error('Failed to fetch GiTrends trending data:', e);
            }

            // Deduplicate by full_name; keep higher-star entry
            const map = {};
            for (const r of [...allSearchRepos, ...trendingRepos]) {
              const existing = map[r.full_name];
              if (!existing || (r.stargazers_count || 0) > (existing.stargazers_count || 0)) {
                map[r.full_name] = r;
              }
            }
            const deduped = Object.values(map);

            const date = new Date().toISOString().slice(0, 10);
            const payload = {
              generated_at: new Date().toISOString(),
              queries: {
                default_queries: defaultQueries,
                extra_queries: extraQueries
              },
              sources: {
                github_search: {
                  query_count: queries.length,
                  repo_count: allSearchRepos.length
                },
                trending: {
                  provider: 'gitrends',
                  repo_count: trendingRepos.length
                }
              },
              repos: deduped
            };

            if (!fs.existsSync('data')) {
              fs.mkdirSync('data', { recursive: true });
            }
            const path = `data/repos-${date}.json`;
            fs.writeFileSync(path, JSON.stringify(payload, null, 2));
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
          EOF

      - name: Commit and push snapshot
        run: |
          date=$(date -u +"%Y-%m-%d")
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git commit -m "Add repos snapshot for ${date}" || echo "No changes to commit"
          git push
```

This wires in:

- Config‑driven queries tuned for your AI/B2B/solo lens.[^17_4][^17_5]
- A daily trending firehose via a GiTrends‑style API.[^17_6][^17_7]
- Dedup + source tagging so Cowork can apply your “top 5 / top 3 writeups” logic.

On setup: your idea—Claude Code (with GitHub + FE skills) to scaffold the repo, workflows, and Pages, then Cowork for day‑to‑day digests—is exactly how I’d do it; Code handles the one‑time wiring, Cowork handles the ongoing judgment and writing.[^17_2][^17_3][^17_1]

Do you want a tiny `config/preferences.json` sketch next (stars / recency / per‑section caps) so you can later let Cowork read those instead of hard‑coding thresholds in the prompt?
<span style="display:none">[^17_10][^17_11][^17_12][^17_13][^17_14][^17_15][^17_16][^17_17][^17_18][^17_19][^17_20][^17_8][^17_9]</span>

<div align="center">⁂</div>

[^17_1]: https://techwize.com/blog/claude-cowork-features-plugins-and-guide-2026

[^17_2]: https://support.claude.com/en/articles/13345190-get-started-with-cowork

[^17_3]: https://tensorlake.ai/blog/claude-cowork-architecture-overview

[^17_4]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^17_5]: https://github.com/orgs/community/discussions/159014

[^17_6]: https://gh-trending.vercel.app

[^17_7]: https://github.com/maulikshetty/GiTrends

[^17_8]: https://github.com/kamranahmedse/github-pages-blog-action

[^17_9]: https://github.com/kamranahmedse/kamranahmedse.github.io

[^17_10]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^17_11]: https://github.com/kamranahmedse/github-pages-blog-action/issues

[^17_12]: https://github.com/kamranahmedse/github-pages-blog-action/pulls

[^17_13]: https://stackoverflow.com/questions/68383826/github-action-write-to-a-repo-in-node-with-actions-core-or-actions-github

[^17_14]: https://www.npmjs.com/package/@kamranahmedse/github-pages-blog-action

[^17_15]: https://serpapi.com/google-trends-api

[^17_16]: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

[^17_17]: https://github.com/marketplace/actions/github-pages-action

[^17_18]: https://github.com/node-fetch/node-fetch/blob/main/.github/workflows/ci.yml

[^17_19]: https://github.com/actions/deploy-pages

[^17_20]: https://github.com/orgs/community/discussions/161519


---

# give me the full "suggestion batch" again, and just execute on it. No need to ask.

Here’s the full “suggestion batch” executed as concrete artifacts you can drop in: repo structure, configs, workflows, and a preferences file, all aligned with using GitHub Pages + Cowork for the digest.

***

## 1) Directory structure

Create these folders at the repo root:

```text
.github/
  workflows/
config/
data/
posts/
static/
```


***

## 2) `config/queries.json`

```json
{
  "default_queries": [
    "topic:saas language:TypeScript stars:>40 pushed:>2025-01-01 sort:stars",
    "topic:llm OR topic:agents stars:>80 pushed:>2025-01-01 sort:stars",
    "topic:crm OR topic:marketing-automation stars:>40 pushed:>2025-01-01 sort:stars"
  ],
  "extra_queries": [
    "topic:billing OR topic:subscriptions stars:>30 pushed:>2025-01-01 sort:stars",
    "topic:analytics OR topic:business-intelligence stars:>40 pushed:>2025-01-01 sort:stars",
    "language:typescript stars:>80 pushed:>2025-01-01 topic:template sort:stars"
  ]
}
```

These use GitHub’s repo search syntax with `stars`, `pushed`, and `sort` qualifiers.[^18_1][^18_2][^18_3]

***

## 3) `config/preferences.json` (nice-to-have tuning)

```json
{
  "min_stars": 40,
  "min_stars_trending": 10,
  "recent_months": 12,
  "max_repos_total": 12,
  "max_repos_per_section": 5,
  "max_trending_candidates": 5,
  "max_trending_featured": 3,
  "max_trending_also": 2
}
```

Cowork will read this to decide thresholds instead of hard-coding them in the prompt.

***

## 4) `site.json` for the blog action

```json
{
  "title": "GitHub Repo Digest",
  "subtitle": "Daily picks for solo founders, AI/B2B SaaS, and small business tools",
  "baseUrl": "",
  "theme": "light",
  "showPostDate": true
}
```

Compatible with `github-pages-blog-action` as a simple config.[^18_4][^18_5]

***

## 5) `README.md`

```markdown
# GitHub Repo Digest

Daily GitHub repo discovery and curation for solo founders, AI/B2B SaaS builders, and small business tools.

## How it works

- A GitHub Actions workflow (`fetch-repos.yml`) runs daily and writes JSON snapshots of interesting repositories into `data/`.
- Queries and basic preferences live in `config/queries.json` and `config/preferences.json`.
- I use Claude Cowork with a digest prompt to:
  - read the latest JSON snapshot,
  - pick the most relevant repos for this audience,
  - and generate Markdown digest posts in `posts/`.
- Another GitHub Actions workflow (`deploy-blog.yml`) builds a static blog from the Markdown posts and publishes it to the `gh-pages` branch using `github-pages-blog-action`.
- GitHub Pages serves the blog from `gh-pages` as a public “blogroll” of digests.
- Some days intentionally have no post if there is nothing compelling to feature.

## Stack

- GitHub Actions for scheduling and static site publishing.
- GitHub Pages for hosting.
- Claude Cowork for curation and writing.
```


***

## 6) `.github/workflows/fetch-repos.yml` (search + GiTrends + config)

```yaml
name: Fetch GitHub repos for digest

on:
  schedule:
    - cron: "0 13 * * *"  # daily at 13:00 UTC
  workflow_dispatch:

jobs:
  fetch-and-commit:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: |
          npm init -y >/dev/null 2>&1 || true
          npm install node-fetch@3

      - name: Fetch repos
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node << 'EOF'
          import fs from 'fs';
          import fetch from 'node-fetch';

          function readQueries() {
            const raw = fs.readFileSync('config/queries.json', 'utf8');
            const parsed = JSON.parse(raw);
            const defaultQueries = parsed.default_queries || [];
            const extraQueries = parsed.extra_queries || [];
            return { defaultQueries, extraQueries };
          }

          async function searchGithub(q) {
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.set('q', q);
            url.searchParams.set('sort', 'stars');
            url.searchParams.set('order', 'desc');
            url.searchParams.set('per_page', '50');

            const res = await fetch(url, {
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GH_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(`GitHub search failed ${res.status}: ${text}`);
            }

            const json = await res.json();
            return json.items || [];
          }

          async function fetchGiTrends() {
            // Replace with your actual GiTrends base URL
            // Example: public-style or self-hosted-style instance.[web:92][web:102]
            const base = 'https://gitrends.yourdomain.com';
            const url = `${base}/api/trending?since=daily&spoken_language_code=en`;

            const res = await fetch(url);
            if (!res.ok) {
              const text = await res.text();
              console.error(`GiTrends request failed ${res.status}: ${text}`);
              return [];
            }
            const json = await res.json();
            return (json || []).map(item => {
              const fullName = item.full_name || `${item.author}/${item.name}`;
              return {
                full_name: fullName,
                html_url: item.url || `https://github.com/${fullName}`,
                description: item.description || null,
                stargazers_count: item.stars || 0,
                language: item.language || null,
                topics: item.topics || [],
                pushed_at: item.pushed_at || null,
                created_at: item.created_at || null,
                forks_count: item.forks || 0,
                _source: 'trending'
              };
            });
          }

          function slimRepo(r, source = 'search') {
            return {
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              stargazers_count: r.stargazers_count,
              language: r.language,
              topics: r.topics,
              pushed_at: r.pushed_at,
              created_at: r.created_at,
              forks_count: r.forks_count,
              _source: source
            };
          }

          (async () => {
            const { defaultQueries, extraQueries } = readQueries();
            const queries = [...defaultQueries, ...extraQueries];

            const allSearchRepos = [];
            for (const q of queries) {
              const items = await searchGithub(q);
              allSearchRepos.push(...items.map(r => slimRepo(r, 'search')));
            }

            let trendingRepos = [];
            try {
              trendingRepos = await fetchGiTrends();
            } catch (e) {
              console.error('Failed to fetch GiTrends trending data:', e);
            }

            const map = {};
            for (const r of [...allSearchRepos, ...trendingRepos]) {
              const existing = map[r.full_name];
              if (!existing || (r.stargazers_count || 0) > (existing.stargazers_count || 0)) {
                map[r.full_name] = r;
              }
            }
            const deduped = Object.values(map);

            const date = new Date().toISOString().slice(0, 10);
            const payload = {
              generated_at: new Date().toISOString(),
              queries: {
                default_queries: defaultQueries,
                extra_queries: extraQueries
              },
              sources: {
                github_search: {
                  query_count: queries.length,
                  repo_count: allSearchRepos.length
                },
                trending: {
                  provider: 'gitrends',
                  repo_count: trendingRepos.length
                }
              },
              repos: deduped
            };

            if (!fs.existsSync('data')) {
              fs.mkdirSync('data', { recursive: true });
            }
            const path = `data/repos-${date}.json`;
            fs.writeFileSync(path, JSON.stringify(payload, null, 2));
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
          EOF

      - name: Commit and push snapshot
        run: |
          date=$(date -u +"%Y-%m-%d")
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git commit -m "Add repos snapshot for ${date}" || echo "No changes to commit"
          git push
```

This uses standard GitHub Actions syntax and the built‑in token.[^18_6][^18_7][^18_8]

***

## 7) `.github/workflows/deploy-blog.yml`

```yaml
name: Build and Deploy Blog

on:
  push:
    paths:
      - "posts/**"
      - "site.json"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build and publish blog
        uses: kamranahmedse/github-pages-blog-action@v0.0.10
        with:
          branch: gh-pages
```

This action reads `site.json` and `posts/` and publishes a static blog to `gh-pages`.[^18_5][^18_4]

Then in your repo settings, set GitHub Pages to serve from `gh-pages` (default root).[^18_9][^18_10]

***

## 8) Preferences usage snippet for Cowork

Include this snippet inside your digest prompt (you already have the full prompt, this is the part that reads preferences):

```text
Before filtering repos, read config/preferences.json if it exists.

Assume it has this shape:

{
  "min_stars": 40,
  "min_stars_trending": 10,
  "recent_months": 12,
  "max_repos_total": 12,
  "max_repos_per_section": 5,
  "max_trending_candidates": 5,
  "max_trending_featured": 3,
  "max_trending_also": 2
}

Use these values instead of hard-coded thresholds:

- When filtering repos from "repos", require:
  - stargazers_count >= min_stars for normal repos,
  - pushed_at within recent_months of now (approximate by comparing timestamps).

- For trending repos (_source == "trending"):
  - Consider them as candidates if stargazers_count >= min_stars_trending.
  - Consider at most max_trending_candidates for ranking.
  - Feature at most max_trending_featured in full writeups.
  - Place at most max_trending_also in the "Also trending today" section.

- When selecting the final set of repos:
  - Include at most max_repos_total across all sections.
  - Try not to exceed max_repos_per_section per section unless this would
    force you to drop clearly superior picks.
```

Cowork can open and parse this file before applying the rest of the selection logic.

***

## 9) How Claude Code vs Cowork fit

- **Claude Code**: use it (with GitHub + FE skills) to:
    - Create these files, tweak layouts, adjust themes, and wire GitHub Pages correctly.[^18_11][^18_12][^18_13][^18_4][^18_5]
- **Cowork**: use the two big prompts you already have:
    - Setup prompt (if you want it to scaffold from scratch).
    - Digest prompt (day‑to‑day: read `data/`, create `posts/` when there’s something worth saying).

If you’d like, next step I can give you a tiny example `posts/YYYY-MM-DD-github-digest.md` that respects `preferences.json` (e.g., capped repos and trending handling) so you have a “golden sample” to compare against Cowork’s first output.

<div align="center">⁂</div>

[^18_1]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

[^18_2]: https://github.com/orgs/community/discussions/159014

[^18_3]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results

[^18_4]: https://github.com/marketplace/actions/create-blog-from-markdown-files

[^18_5]: https://github.com/kamranahmedse/github-pages-blog-action

[^18_6]: https://github.com/maulikshetty/GiTrends

[^18_7]: https://gh-trending.vercel.app

[^18_8]: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

[^18_9]: https://dev.to/m1ner/how-to-use-github-pages-to-host-a-blog-4ofd

[^18_10]: https://workshops.code-maven.com/github-actions-to-generate-complex-static-web-sites.html

[^18_11]: https://techwize.com/blog/claude-cowork-features-plugins-and-guide-2026

[^18_12]: https://support.claude.com/en/articles/13345190-get-started-with-cowork

[^18_13]: https://tensorlake.ai/blog/claude-cowork-architecture-overview

