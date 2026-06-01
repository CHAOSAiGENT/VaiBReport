# MCP & Skill Registry — VaiBReport

## Active MCPs

### GitHub

- **Context:** CHAOSAiGENT/VaiBReport
- **Steer:** Already defaults to current repo
- **Verify:** `mcp__github__get_file_contents` on `CLAUDE.md` returns content

### Stitch

- **Context:** Project `6458998332659659501` ("VaiBReport Website Optimization")
- **API Endpoint:** `https://stitch.googleapis.com/mcp`
- **Auth Header:** `X-Goog-Api-Key` (value in CLI config, not stored here)
- **Steer:** Use `list_projects` and confirm project `6458998332659659501` is accessible
- **Verify:** `mcp__stitch__get_project` with projectId `6458998332659659501` returns title "VaiBReport Website Optimization"
- **Notes:** Design system "Sophisticated Technical" is configured. 23+ screens generated. Always use this projectId for all Stitch operations.

### Playwright

- **Context:** Local browser automation (screenshots, visual QA)
- **Notes:** Used for Me2 tool enrichment pages. Available for Stitch screen preview if needed.

### context7

- **Context:** Library documentation lookup
- **Notes:** Use for Next.js, Tailwind, and other framework docs during implementation.

## Active Skills

chaos-controller, cicd-expert, tdd-red-green-refactor, claude-api, simplify, loop, schedule, find-skills, code-review, pr-review-toolkit:_, feature-dev:_, commit-commands:_, write-prd, autonomous-agents, add-spotlight, superpowers:_, stitch-design, stitch-loop, stitch-sdk-bug-bash, stitch-sdk-development, stitch-sdk-domain-design, stitch-sdk-pipeline, stitch-sdk-readme, stitch-sdk-usage

## Denied MCPs

| Server          | Reason                                                  | Re-enable when                        |
| --------------- | ------------------------------------------------------- | ------------------------------------- |
| PostHog         | No analytics yet — platform migration prerequisite      | Next.js site deployed to Vercel       |
| Supabase        | Dropped from architecture (2026-05-31) — not needed     | User explicitly requests              |
| Vercel          | No Vercel project yet — platform migration prerequisite | Next.js project initialized on Vercel |
| Canva           | Not relevant to this project                            | Never (unless scope changes)          |
| Excalidraw      | Not relevant to this project                            | Never (unless scope changes)          |
| Figma           | Using Stitch for design, not Figma                      | Never (unless scope changes)          |
| Gmail           | Not relevant to this project                            | Never (unless scope changes)          |
| Google_Calendar | Not relevant to this project                            | Never (unless scope changes)          |
| Google_Drive    | Not relevant to this project                            | Never (unless scope changes)          |
| Notion          | Not relevant to this project                            | Never (unless scope changes)          |

## Denied Skills

| Skill Group                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Count | Reason                                   | Re-enable when                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------- | -------------------------------------------- |
| Marketing (ab-test-setup, ad-creative, ai-seo, analytics-tracking, churn-prevention, cold-email, competitor-alternatives, content-strategy, copy-editing, copywriting, customer-research, elevator-pitch-techniques, email-sequence, form-cro, free-tool-strategy, launch-strategy, lead-magnets, marketing-ideas, marketing-psychology, marketing-strategy-pmm, onboarding-cro, page-cro, paid-ads, paywall-upgrade-cro, popup-cro, pricing-strategy, product-marketing-context, programmatic-seo, referral-program, revops, sales-enablement, signup-flow-cro, social-content) | 33    | Not relevant to current engineering work | User requests marketing work                 |
| Design (canvas-design, design-md, enhance-prompt, frontend-design, react-components, remotion, taste-design, web-design-guidelines, shadcn-ui, site-architecture)                                                                                                                                                                                                                                                                                                                                                                                                                | 10    | Available on request for redesign phases | User requests specific design/frontend skill |
| Platform (tauri, distributing-tauri-for-windows, signing-tauri-apps, app-store-deployment, asc-notarization, asc-revenuecat-catalog-sync, typed-service-contracts)                                                                                                                                                                                                                                                                                                                                                                                                               | 7     | Wrong platform for this project          | Never (unless scope changes)                 |
| PostHog skills (posthog:\*)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 13    | PostHog MCP denied                       | PostHog MCP activated                        |
| Vercel skills (vercel-plugin:\*)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 25    | Vercel MCP denied                        | Vercel MCP activated                         |
| Ralph (ralph-loop:_, ralph-tui-_)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 7     | Not using ralph-tui for this project     | User requests                                |
