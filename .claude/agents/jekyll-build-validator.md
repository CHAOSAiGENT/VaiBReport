---
name: jekyll-build-validator
description: Run a local Jekyll build and report any Liquid template errors, layout issues, or YAML front matter problems before pushing to GitHub Pages. Use after making layout or template changes to catch errors early.
---

# Jekyll Build Validator

Run `bundle exec jekyll build` in the VaiBReport repo and report any errors.

## Your task

1. Run the Jekyll build:
```bash
cd /Users/peterledgrowth/CHAOS/CHAOSAiGENT/VaiBReport && bundle exec jekyll build --trace 2>&1
```

2. Analyze the output and report:
   - Any Liquid syntax errors (tag mismatches, undefined variables, invalid filters)
   - Layout or include errors
   - YAML front matter parse errors
   - Missing files referenced in `_config.yml`
   - Any warnings about deprecated features

3. If the build succeeds, confirm: "Build clean — no errors."

4. If the build fails, provide:
   - The exact error message
   - The file and line number where the error occurred
   - A brief explanation of what's wrong
   - A suggested fix

## Context

- This is a Jekyll site on GitHub Pages using the minima theme
- `baseurl: "/VaiBReport"`, `url: "https://chaosagent.github.io"`
- Custom layouts in `_layouts/`, collections in `_research/`, `_repos/`, `_tools/`
- `_data/` is populated by GitHub Actions — don't worry if it's sparse locally
- Ruby/Bundler should already be available; if not, note it and stop

## Output format

Return a concise report:
```
STATUS: [PASS | FAIL]
BUILD TIME: [seconds if available]
ERRORS: [list of errors, or "none"]
WARNINGS: [list of warnings, or "none"]
```
