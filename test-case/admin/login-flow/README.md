# Test Case Results: Admin Login Flow (retest, 2026-08-20)

**Context:** 16 items requested for retest against the admin ("Portail d'administration")
login/session flow. Continues the exploration already documented in
`tickets/ADMIN-ROLE-exploration-notes`. Each test case has its own folder with a how-to-test/
expected/actual/browser-tested write-up and screenshot evidence where any could be captured.

**Account used:** `db022bd7b0284076@emalupe.com` (temp-mail controlled, Super Admin role) - the
same account used throughout this project's admin exploration. See local `.env` for credentials.

## Results

| # | Test case | Result | Folder |
|---|---|---|---|
| 000 | UI Admin Login | ✅ PASS | [`000-ui-admin-login/`](000-ui-admin-login/) |
| 001 | First login — mandatory temporary password change | ⚪ NOT TESTABLE | [`001-first-login-mandatory-password-change/`](001-first-login-mandatory-password-change/) |
| 002 | First login — real-time password complexity policy | ⚪ NOT TESTABLE | [`002-first-login-password-complexity/`](002-first-login-password-complexity/) |
| 003 | First login — new password must differ from the temporary password | ⚪ NOT TESTABLE | [`003-first-login-new-password-differs/`](003-first-login-new-password-differs/) |
| 004 | First login — invalid password submission message | ⚪ NOT TESTABLE | [`004-first-login-invalid-password-message/`](004-first-login-invalid-password-message/) |
| 005 | First login — completion leads to OTP verification, temp password unusable afterwards | ⚪ NOT TESTABLE | [`005-first-login-otp-temp-password-unusable/`](005-first-login-otp-temp-password-unusable/) |
| 007 | Step 2 — 6-digit OTP screen behavior | ✅ PASS | [`007-otp-screen-behavior/`](007-otp-screen-behavior/) |
| 008 | Mandatory MFA — non-disableable, no skippable challenge, no bypassable token | ✅ PASS | [`008-mandatory-mfa-non-bypassable/`](008-mandatory-mfa-non-bypassable/) |
| 009 | Generic errors / anti-enumeration — verbatim §9 messages | 🟡 PASS (wording not cross-checked) | [`009-anti-enumeration/`](009-anti-enumeration/) |
| 010 | Session, logout & password-change invalidation | 🟡 PARTIAL | [`010-session-logout-password-change-invalidation/`](010-session-logout-password-change-invalidation/) |
| 011 | Layered anti-brute-force — per-user lockout AND IP/source rate limiting | 🟡 PARTIAL, deliberately limited | [`011-anti-brute-force/`](011-anti-brute-force/) |
| 013 | Dedicated realm, email-only identification, no self-service registration/reset | ✅ PASS | [`013-dedicated-realm-no-self-service/`](013-dedicated-realm-no-self-service/) |
| 019 | Success message + console redirect | 🟡 PARTIAL | [`019-success-message-console-redirect/`](019-success-message-console-redirect/) |
| 020 | Password reset by the DSI invalidates all active admin sessions | ⚪ NOT TESTABLE | [`020-dsi-password-reset-invalidates-sessions/`](020-dsi-password-reset-invalidates-sessions/) |
| 021 | Admin audit log entries are retained for 20 years | 🔴 CONTRADICTION FOUND | [`021-audit-log-20-year-retention/`](021-audit-log-20-year-retention/) |
| 022 | Responsive layout across mobile / tablet / desktop (DoD) | 🔴 MISMATCH | [`022-responsive-layout/`](022-responsive-layout/) |

## Why 5 items are "not testable"

Items 001-005 all depend on reaching a **first login with a DSI-issued temporary password** -
this session's account already has a permanent password and the admin console has no
self-service way to provision a new admin account (checked the full sidebar: no "Users" or
"Admins" management section exists). Reaching this flow needs either DSI-side provisioning of a
fresh account, or Keycloak realm-admin access to flag an existing account for a required
password update. Item 020 needs a second concurrent session plus real DSI action, which is a
separate limitation from 001-005.

## Cross-references

- Item 021 → `defects/admin-audit-retention-policy-contradiction`
- Item 022 → `defects/admin-console-mobile-not-responsive`
- Full exploration context → `tickets/ADMIN-ROLE-exploration-notes`
