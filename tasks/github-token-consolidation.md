# GitHub Token Consolidation — theStudio

**Created:** 2026-04-09 during VaiBReport Tailscale/digest recovery session
**Status:** Pending — pick up when you have 20 min
**Why this matters:** Two different `GITHUB_TOKEN` env vars (one User, one Machine) caused stale-token 401s blocking `gh secret set` during the April 9 VaiBReport recovery. Consolidating prevents recurrence.

---

## Background — why you can't just delete both

An initial instinct was "delete both global `GITHUB_TOKEN` env vars, let each tool use its own credential store." That's wrong for this machine, because a grep across `S:\Chaos_Skunkworks` turned up **9 files actively depending on `GITHUB_TOKEN` being set in the shell environment**:

| File | Line | How it uses `GITHUB_TOKEN` |
|---|---|---|
| `RD\CHAost\.mcp.json` | 11 | `"GITHUB_TOKEN": "${GITHUB_TOKEN}"` — passes to GitHub MCP server |
| `Apps\Queens\.claude.json` | 15 | `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"` — interpolates caller env |
| `AI_Tooling\Project_Bootstrap\.claude.json` | — | Same pattern |
| `RD\RDA-LinkedIn_Analyze\.claude.json` | — | Same pattern |
| `RD\CHAOSPRD\.claude.json` | — | Same pattern |
| `AI_Tooling\Project_Bootstrap\bootstrap-template\.claude.json` | — | Same pattern |
| `RD\CHAost\bootstrap-template\.claude.json` | — | Same pattern |
| `RD\RDA-LinkedIn_Analyze\bootstrap-template\.claude.json` | — | Same pattern |
| `AI_Tooling\ChaosDeck\apps\sidecar\src\models\project_settings.py` | 17 | `github_token_env_var: str = Field(default="GITHUB_TOKEN")` |

The `${GITHUB_TOKEN}` syntax is env interpolation at MCP launch time — if the env var is empty, the MCP server launches with no auth and `mcp__github__*` tools silently fail with 401s. So you need a working global `GITHUB_TOKEN` — but **exactly one**, at **User level**, not two at different levels.

---

## Machine vs User — why User wins on a single-user dev box

| Scope | Who can read it | Admin to set? | Blast radius if leaked |
|---|---|---|---|
| **Machine** (`HKLM\...\Environment`) | Every user, every service, every scheduled task running as SYSTEM or local accounts | Yes | Large — background services, telemetry agents, GPU driver daemons, etc. |
| **User** (`HKCU\Environment`) | Only your logon session | No | Smaller — processes you launch |
| **Process** (`$env:X` in a shell) | Only that one shell + children | No | Smallest — dies with the window |

**Precedence when both exist:** User wins for your shells. That's why the stale User token was biting `gh` while the Machine token sat shadowed.

Machine-level means the token is readable by ANY process on the box (Windows Defender telemetry, Update Orchestrator, OEM services, anything running as SYSTEM or a local service account). User-level is scoped to your logon. On a "single-user dev machine" the functional behavior is identical, but User-level is the principle-of-least-privilege default.

**Rule: personal dev tokens are User-level, never Machine-level.**

---

## The plan — execute in order

### Step 1. Read both current values (don't paste them in chat)

```powershell
$user    = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "User")
$machine = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "Machine")
"User token length:    $($user.Length)"
"Machine token length: $($machine.Length)"
```

### Step 2. Identify each token — which account + which scopes

For each token value, check what it's authorized as (run once per token):

```powershell
# Account identity
curl.exe -s -H "Authorization: Bearer <token>" https://api.github.com/user | ConvertFrom-Json | Select login, id, type

# Scopes (look at the x-oauth-scopes response header)
curl.exe -sI -H "Authorization: Bearer <token>" https://api.github.com/user | Select-String "x-oauth-scopes|x-accepted"
```

Write down for each token:
- `login`: (e.g., `CHAOSAiGENT`, personal handle, bot account)
- `scopes`: (e.g., `repo, workflow, read:org`)
- Whether it's a classic PAT or fine-grained (classic PATs return comma-separated scopes; fine-grained PATs show differently)

**Don't skip this.** You might unknowingly delete the token that has broader permissions you actually depend on.

### Step 3. Rotate to a fresh fine-grained PAT

Since today was a debugging session around stale tokens, mint a fresh one with known scope + expiration. At https://github.com/settings/tokens:

- **Type:** Fine-grained personal access token (not classic)
- **Owner:** CHAOSAiGENT (matches your `gh auth status` keyring login and all MCP uses)
- **Resource owner:** CHAOSAiGENT
- **Repository access:** "All repositories" — or selected list if you want tighter scope
- **Permissions minimum set** (matches what MCP GitHub server + `gh` fallback actually need):
  - Repository → Contents: **Read and write**
  - Repository → Issues: **Read and write**
  - Repository → Pull requests: **Read and write**
  - Repository → Metadata: Read (auto)
  - Repository → Workflows: Read and write *(only if you need to dispatch or edit workflows from MCP; skip otherwise)*
  - Repository → Actions: Read *(only if you need to read run logs / status from MCP)*
- **Expiration:** 90 days (forces a rotation + scope re-audit cadence)
- **Click Generate**, then **copy the token value immediately** — GitHub only shows it once
- **Store in your password manager** with a note: "theStudio global GITHUB_TOKEN — rotate by <date+90>"

### Step 4. Delete the Machine-level token (admin PowerShell)

```powershell
# Run PowerShell as Administrator
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Machine")
```

Verify from a new normal shell:

```powershell
[Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "Machine")  # should print nothing
```

### Step 5. Replace the User-level token with the fresh one

```powershell
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "<fresh-pat-value>", "User")
```

### Step 6. Open a fresh PowerShell window and verify everything works

Env var changes don't propagate to already-open shells — you **must** open a new window.

```powershell
# Should show the fresh token
echo $env:GITHUB_TOKEN

# gh keyring login unchanged — still works
gh auth status

# Quick smoke test against the repo
gh repo view CHAOSAiGENT/VaiBReport

# MCP smoke test: restart Claude Code, then ask it to list recent PRs
# (it uses the GitHub MCP server, which reads GITHUB_TOKEN from env)
```

### Step 7. Revoke the two old tokens on GitHub

At https://github.com/settings/tokens, find the two old PATs that were living at User + Machine level and **revoke** them. If either ever leaked (paste into Slack, a `.env` file accidentally committed, a log), revocation is the only thing that actually stops abuse.

---

## Followup side-cleanup (separate session, not blocking)

**MCP config inconsistency.** During the grep, I noticed two different env-key conventions in use across your `.claude.json` / `.mcp.json` files:

- `CHAost/.mcp.json:11` — `"GITHUB_TOKEN": "${GITHUB_TOKEN}"` — **wrong key name**
- `Queens/.claude.json:15` — `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"` — correct

The official `@modelcontextprotocol/server-github` package reads from **`GITHUB_PERSONAL_ACCESS_TOKEN`**, not `GITHUB_TOKEN`. So any MCP config using the first pattern is launching the GitHub MCP server unauthenticated — it may appear to work for public read calls but fails silently on private repos or write operations.

Files to normalize (sweep all `.claude.json` + `.mcp.json` under `S:\Chaos_Skunkworks`):

```powershell
# Find all the inconsistent ones
Select-String -Path S:\Chaos_Skunkworks\**\*.mcp.json, S:\Chaos_Skunkworks\**\.claude.json -Pattern '"GITHUB_TOKEN"\s*:\s*"\$\{GITHUB_TOKEN\}"'
```

Standardize all of them to `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"`. Ask me to sweep this when you want — it's a 10-minute pass.

---

## Decision summary

| Decision | Answer | Reason |
|---|---|---|
| Consolidate to one env var? | ✅ Yes | Two tokens at different levels caused today's 401 debugging detour |
| User or Machine level? | **User** | Principle of least privilege; Machine is broader blast radius for zero functional benefit on a single-user box |
| Delete both entirely? | ❌ No | 9 files across S:\Chaos_Skunkworks depend on `$env:GITHUB_TOKEN` being set for MCP interpolation |
| Rotate while consolidating? | ✅ Yes | Fresh fine-grained PAT with 90-day expiration resets the clock and documents scope |
| Fix MCP key name inconsistency? | Later | Separate sweep; flagged above |
