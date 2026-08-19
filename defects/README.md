# Defects

Standalone write-ups of confirmed application bugs discovered during QA work that aren't tied
to a specific tracked ticket (see `tickets/` for forward-looking/follow-up action items instead).
Each defect gets its own folder (`defects/<short-name>/README.md`) following a
Description / Steps to Reproduce (or Description) / Expected / Actual / Evidence template. This
index is kept up to date as defects are added.

Gitignored (matching `tickets/`'s convention) - local-only, not pushed.

## Index

| Defect | App/Role | Severity | Status | Details |
|---|---|---|---|---|
| [logout-console-error-cors-blocked-fetch](logout-console-error-cors-blocked-fetch/README.md) | Patient | Low | Confirmed, live regression test (currently failing, by design) | CORS-blocked RSC fetch throws a caught `TypeError` on every logout before falling back to full navigation |
| [notifications-bell-dead-control](notifications-bell-dead-control/README.md) | Patient | Low/Medium | Confirmed, live regression test (currently passing, documents the broken state) | Top-bar bell button is a silent no-op - no panel, no request, no error |
| [404-page-unbranded](404-page-unbranded/README.md) | Patient | Low | Confirmed, live regression test (functional-only) | Unknown routes return Next.js's default English 404 instead of a branded French page |
| [http-security-header-gaps](http-security-header-gaps/README.md) | Patient | Medium (session cookie), Low (rest) | Confirmed via header/cookie inspection, not yet automated | Session cookie missing `Secure`; CSP has no `script-src`; conflicting `Referrer-Policy` values; nginx version disclosed |
| [doctor-country-not-listed-untranslated-english](doctor-country-not-listed-untranslated-english/README.md) | Doctor | Low | Confirmed, reproduced (no doctor-role automated suite yet) | "Country not listed" waitlist panel's body text is untranslated English on an otherwise French page |
| [keycloak-userinfo-cors-misconfiguration](keycloak-userinfo-cors-misconfiguration/README.md) | Patient (Keycloak) | Low | Confirmed via real cross-origin browser fetch, not yet automated | `userinfo` endpoint reflects any Origin + allows credentials with no allowlist; not currently chainable into data leakage since this endpoint requires Bearer auth, but the policy itself is unscoped |
| [responsive-tablet-empty-whitespace](responsive-tablet-empty-whitespace/README.md) | Both (shared login template) | Low | Confirmed, reproduced on both roles, not yet automated | Login page wastes ~235px of empty vertical space at 768px tablet width; form not recentered either. Registration wizards on both roles are unaffected |

Additional low-severity findings not written up as their own defect folder (documentation/AC
corrections, environmental limitations, informational notes) are tracked inline in
`test-results/Report.md`'s own Defects Log and `test-results/exploratory-findings.md` - ask for
any of those to be promoted to a full write-up here if needed.
