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

---

## 4. Running the Suite Without Claude

The automated tests are plain Playwright - nothing about running them requires Claude Code or
any MCP server. Anyone with this repo and Node.js installed can run them directly.

**One-time setup:**
```powershell
npm install
npx playwright install --with-deps chromium firefox webkit
copy .env.example .env
# then edit .env: set FUENI_EMAIL / FUENI_PASSWORD to a real patient-role test account
```

**Run everything (all browsers, sequential - see playwright.config.ts for why):**
```powershell
npx playwright test
```

**Common narrower runs:**
```powershell
# One browser only
npx playwright test --project=chromium

# One file or folder
npx playwright test tests/fueni-test/auth/001_login-success.spec.ts
npx playwright test tests/fueni-test/security

# Watch it happen (headed, slowed down) - useful when a test is flaky/unclear
npx playwright test tests/fueni-test/auth --headed --workers=1

# Re-run only what failed last time
npx playwright test --last-failed

# Skip retries when you want to see the raw first-attempt result quickly
npx playwright test --retries=0 tests/fueni-test/registration
```

**Viewing results after a run:**
```powershell
npx playwright show-report          # Playwright's built-in HTML report
npx monocart show-report monocart-report/index.html   # tree-grid view, single self-contained file
npm run allure:generate && npm run allure:open         # history/trends view (see allurerc.mjs)
```

**A few things worth knowing before re-running the suite unattended:**
- This suite logs into a **single shared patient test account**, not an isolated one per test -
  see the real-data-safety notes in `user-stories/SCRUM.md` and `specs/planner/README.md`
  before adding any new test that touches the profile/security "Modifier" forms.
- `tests/fueni-test/auth/006_logout-no-console-errors.spec.ts` is **expected to fail** until the
  logout CORS console-error (Issue 1 in `test-results/exploratory-findings.md`) is fixed
  upstream - that's intentional, not something to "fix" in the test.
- `tests/fueni-test/auth/004`, `auth/008`, and `registration/002` (anything that hits a
  Cloudflare Turnstile-style check - password-reset or registration) can start failing if run
  repeatedly in a short window - this is Cloudflare's bot-detection escalating against
  automated traffic, not a test bug. See the same findings file for details. If you hit this,
  wait a while before re-running those specifically.
