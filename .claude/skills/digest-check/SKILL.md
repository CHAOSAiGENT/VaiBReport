---
name: digest-check
description: Trigger and tail the VaiBReport daily digest GitHub Actions workflow (generate-digest.yml). Use when you want to manually run the digest pipeline and watch it complete.
disable-model-invocation: true
---

# Digest Check

Trigger the `generate-digest.yml` workflow and tail the run until it completes.

## Steps

1. Trigger the workflow:
```bash
gh workflow run generate-digest.yml --repo CHAOSAiGENT/VaiBReport
```

2. Wait a moment for it to queue, then get the run ID:
```bash
sleep 3 && gh run list --repo CHAOSAiGENT/VaiBReport --workflow generate-digest.yml --limit 1
```

3. Tail the run (replace RUN_ID with the ID from step 2):
```bash
gh run watch RUN_ID --repo CHAOSAiGENT/VaiBReport
```

4. On completion, view the summary:
```bash
gh run view RUN_ID --repo CHAOSAiGENT/VaiBReport --log-failed
```

## Quick one-liner (run all steps):
```bash
RUN_ID=$(gh workflow run generate-digest.yml --repo CHAOSAiGENT/VaiBReport 2>&1; sleep 5; gh run list --repo CHAOSAiGENT/VaiBReport --workflow generate-digest.yml --limit 1 --json databaseId -q '.[0].databaseId'); gh run watch "$RUN_ID" --repo CHAOSAiGENT/VaiBReport && gh run view "$RUN_ID" --repo CHAOSAiGENT/VaiBReport
```
