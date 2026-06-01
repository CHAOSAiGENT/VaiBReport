# VaiBReport Next.js Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all VaiBReport pages as a Next.js 16 App Router site, reading content from the existing Jekyll data pipeline, using the canonical Sophisticated Technical design system.

**Architecture:** Server Components reading markdown/JSON from the Jekyll repo via `lib/content.ts`. Static generation via `generateStaticParams` for digest and repo detail pages. Client components only for interactive elements (search input, subscribe form, theme toggle). No database — content comes from the filesystem.

**Tech Stack:** Next.js 16.2.6, React 19, Tailwind v4 (CSS @theme tokens), TypeScript, gray-matter, remark + remark-html (sanitized), next/font (Chivo/Inter/JetBrains Mono)

**Working directory:** `~/Projects/vaibreport-next/`

**Content source:** `/Volumes/100.96.142.54/Chaos_Skunkworks/Apps/VaiBReport/` (40 posts, 1053 repos, 467 data snapshots)

**Design reference:** `.stitch/designs/` on the NAS (22 HTML files covering every page type)

**Security note:** All markdown rendering uses remark (generates safe HTML from markdown source). Content is pipeline-generated, not user-submitted. Sanitization via rehype-sanitize added as defense-in-depth.

---

## Existing Files (already built)

- `src/app/globals.css` — Design tokens via Tailwind v4 @theme
- `src/app/layout.tsx` — Root layout (Chivo/Inter/JetBrains Mono + TopNav + Footer)
- `src/app/page.tsx` — Home page (7 sections)
- `src/components/common/top-nav.tsx` — Nav with DESKTOP green dot
- `src/components/common/footer.tsx` — Footer with DOWNLOAD CHAOS DESKTOP pill
- `src/lib/content.ts` — Markdown/JSON reader for Jekyll content

## Tasks

### Task 1: Shared Components + Digest Detail Page

### Task 2: Repo Detail Page + Chaos Desktop Block

### Task 3: Catalog Archive Page

### Task 4: Leaderboard Page

### Task 5: Trending Pulse Page

### Task 6: Search Page (Client Interactive)

### Task 7: Peter's Picks Archive

### Task 8: About / Intelligence Pipeline Page

### Task 9: Sponsor Info Page

### Task 10: Remaining Static Pages (Feeds, Settings, Subscribe, Platforms)

### Task 11: Init Git Repo + Sync Back to NAS

See full task details in the plan file. Each task follows the pattern: create files, build and verify, commit. All pages use the canonical design system and include sponsor slots + Chaos Desktop promotion per the audit findings.
