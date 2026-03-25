---
name: add-spotlight
description: Add a repo or tool to config/spotlight.json for guaranteed inclusion in the next VaiBReport digest
---

Add an entry to config/spotlight.json following the existing schema.

The user will provide some or all of: name/full_name, url, category, and a reason.
If any fields are missing, ask for them before proceeding.

Steps:
1. Read config/spotlight.json
2. Add the new entry using the existing schema (infer any missing optional fields)
3. Validate the JSON is still valid after editing
4. Confirm what was added

If spotlight.json doesn't exist or is an empty object, initialize it as: { "repos": [] }
The entry goes in the "repos" array.
