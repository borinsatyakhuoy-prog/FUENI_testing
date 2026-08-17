# Automation Testing (FUENI E2E QA)

End-to-end QA automation for the FUENI application, driven by natural-language prompts to Claude Code using Playwright MCP and specialized agents (test planner, generator, healer).

---

## 1. Setup: Connect GitHub MCP to Claude Code

This lets agents perform Git operations (stage, commit, push) directly.

**Step 1 — Read your GitHub PAT into a secure variable:**
```powershell
$secure = Read-Host -Prompt "New GitHub PAT" -AsSecureString
```

**Step 2 — Decode it to plain text (only in memory, only for this step):**
```powershell
$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
```

**Step 3 — Register the MCP server with Claude Code:**
```powershell
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer $plain" -s local

```
or
```powershell
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer <YOUR_GITHUB_PAT>" -s local
```
> `-s local` keeps the token private to you, scoped to this project only. Never use `-s project` for a real token — that scope gets committed to the shared repo config.

**Step 4 — Clear the token from memory:**
```powershell
Remove-Variable plain, secure
```

**Step 5 — Verify the connection:**
```powershell
claude mcp get github
```

**Expected output:**
```
github:  Scope: Local config (private to you in this project)
         Status: ✔ Connected
```

---

## 2. Running the QA Workflow

The full step-by-step prompts (Steps 1–7: read story → create test plan → exploratory testing → generate automation scripts → execute & heal → test report → commit to Git) live in **[`QAE2EPromtFile.md`](./QAE2EPromtFile.md)**.

**Kick off a first-time run with:**
```
Now I would like to perform an end-to-end QA workflow using multiple agents and MCP servers,
as defined in the prompt file QAE2EPromtFile.md. Perform the QA workflow step by step as
defined in this prompt file.
```

Or use the single combined prompt at the bottom of `QAE2EPromtFile.md` to run all 7 steps back-to-back.

---

## 3. Re-running the Workflow (Incremental Updates)

Once a full run has completed, you don't need to redo everything for every change. **Step 8** in `QAE2EPromtFile.md` is a smart re-run prompt that inspects what actually changed and scopes the work accordingly:

| What changed | What re-runs |
|---|---|
| User story or test plan (`specs/*.md`) | Full workflow again: Steps 2–7 (re-plan, re-explore, regenerate scripts, heal, report, commit) |
| Only the app/selectors (test plan unchanged) | Steps 4–7 only: update/heal the automation scripts, execute, report, commit |

**Use it with:**
```
Now I want to re-run the QA workflow, but only redo what's necessary based on what changed
since the last run, as defined in Step 8 of QAE2EPromtFile.md.
```

See [`QAE2EPromtFile.md`](./QAE2EPromtFile.md) for the full decision logic and prompt text.
