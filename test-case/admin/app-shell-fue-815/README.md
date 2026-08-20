# Test Case Results: Admin App Shell (FUE-815) (retest, 2026-08-20)

**Context:** 3 items requested against the admin app's shell architecture (OIDC callback, BFF
session, role guard, console shell) under ticket reference FUE-815 - a separate item group from
`login-flow/`, with its own independent numbering (its "005" and "007" are unrelated to
`login-flow/005` and `login-flow/007`).

**Account used:** `db022bd7b0284076@emalupe.com` (same account as `login-flow/`).

## Results

| # | Test case | Result | Folder |
|---|---|---|---|
| FUE-815 | fueni-admin App Shell (OIDC callback · BFF session · role guard · console shell) | ✅ PASS | [`FUE-815-oidc-bff-role-guard-shell/`](FUE-815-oidc-bff-role-guard-shell/) |
| 005 | French only — no language selector, no reachable /en/ admin URL | 🔴 MISMATCH (half true, half false) | [`005-french-only-no-language-selector/`](005-french-only-no-language-selector/) |
| 007 | Logout — POST + CSRF, never a bare GET link, terminates both sessions | ✅ PASS | [`007-logout-post-csrf-terminates-both-sessions/`](007-logout-post-csrf-terminates-both-sessions/) |

## Notable finding

Item 005's premise only half holds: there's genuinely no language-selector control anywhere in
the UI, but `/en` is **fully reachable and completely translated** - not a partial/broken
translation, a real working English console. This is a meaningful mismatch against "no reachable
/en/ admin URL" specifically, even though the "no language selector" half is accurate. Not yet
written up as a `defects/` entry pending a decision on whether an undiscoverable-but-functional
`/en/` route is actually a problem worth fixing, or acceptable as-is (e.g. if some FUENI
admins are expected to use it directly).
