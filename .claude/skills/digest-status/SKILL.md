---
name: digest-status
description: Show today's GitHub Actions workflow run status for all VaiBReport fetch and digest workflows
disable-model-invocation: true
---

echo "VaiBReport — Workflow Status (last 24h)\n"
gh run list --repo CHAOSAiGENT/VaiBReport --limit 25 \
  --json name,status,conclusion,createdAt \
  --jq '
    .[] |
    [
      (if .conclusion == "success" then "✅"
       elif .conclusion == "failure" then "❌"
       elif .conclusion == "skipped" then "⏭ "
       elif .status == "in_progress" then "🔄"
       else "⏳" end),
      (.createdAt | split("T")[0]),
      (.createdAt | split("T")[1] | split(".")[0]),
      .name
    ] | @tsv
  ' | column -t -s $'\t'
