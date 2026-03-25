---
name: trigger-enrichment
description: Trigger screenshot capture and script generation workflows for a submitted Peter's Pick by slug
disable-model-invocation: true
---

SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "Usage: /trigger-enrichment <slug>"
  echo "Example: /trigger-enrichment coolify"
  echo ""
  echo "Available slugs:"
  ls _tools/*.md 2>/dev/null | xargs -I{} basename {} .md || echo "(no tools yet)"
  exit 1
fi

if [ ! -f "_tools/${SLUG}.md" ]; then
  echo "Error: _tools/${SLUG}.md not found"
  echo "Available slugs:"
  ls _tools/*.md 2>/dev/null | xargs -I{} basename {} .md
  exit 1
fi

echo "Queuing enrichment for: $SLUG"
echo ""

gh workflow run capture-tool-screenshots.yml \
  --repo CHAOSAiGENT/VaiBReport \
  --field slug="$SLUG" 2>&1 && echo "✅ Screenshot capture queued" || echo "⚠️  Screenshot workflow not yet built (E-03)"

gh workflow run generate-tool-page.yml \
  --repo CHAOSAiGENT/VaiBReport \
  --field slug="$SLUG" 2>&1 && echo "✅ Script generation queued" || echo "⚠️  Script generation workflow not yet built (E-04)"

echo ""
echo "Monitor: https://github.com/CHAOSAiGENT/VaiBReport/actions"
