# VaiBReport — Claude Code Instructions

## Project Context

@.chaosaigent/.session-brief.md

## Rules

- This is a Jekyll blog + Node.js data pipeline deployed to GitHub Pages
- Zero npm dependencies by design — use native Node.js APIs (fetch, test runner, fs, path)
- Workflow logic lives inline in GitHub Actions YAML (heredoc JS) — this is intentional
- Daily data snapshots go in `data/`, daily digest posts in `_posts/`, repo catalog in `_repos/`
- LLM cascade: first success wins, non-2xx falls through to next tier
- When the signal is weak, no digest publishes — silence beats filler
