# Defects

Standalone write-ups of confirmed application bugs discovered during QA work that aren't tied
to a specific tracked ticket (see `tickets/` for forward-looking/follow-up action items instead).
Each defect gets its own folder (`defects/<short-name>/README.md`) following a
Description / Steps to Reproduce (or Description) / Expected / Actual / Evidence template. This
index is kept up to date as defects are added.

Tracked in git alongside `tickets/` (see history - both were briefly gitignored early on, now
committed so findings survive across machines/sessions).

See `improvement/README.md` for the cross-cutting **improvement plan** synthesized after the
regression reruns and role retests - forward-looking themes (e.g. "no way to provision a
temp-password admin account") that group multiple individual defects/test-case findings together,
rather than a confirmed single bug.

## Index

| Defect | App/Role | Severity | Status | Details |
|---|---|---|---|---|
| [logout-console-error-cors-blocked-fetch](logout-console-error-cors-blocked-fetch/README.md) | Patient | Low | Confirmed, live regression test (currently failing, by design) | CORS-blocked RSC fetch throws a caught `TypeError` on every logout before falling back to full navigation |
| [notifications-bell-dead-control](notifications-bell-dead-control/README.md) | Patient | Low/Medium | Confirmed, live regression test (currently passing, documents the broken state) | Top-bar bell button is a silent no-op - no panel, no request, no error |
| [404-page-unbranded](404-page-unbranded/README.md) | Patient | Low | Confirmed, live regression test (functional-only) | Unknown routes return Next.js's default English 404 instead of a branded French page |
| [http-security-header-gaps](http-security-header-gaps/README.md) | Patient | Medium (session cookie), Low (rest) | Confirmed; 2 of 5 sub-findings now have live regression tests (2026-08-20) | Session cookie missing `Secure`; login-page CSP has no `script-src`; authenticated-app CSP allows `unsafe-inline`/`unsafe-eval`; conflicting `Referrer-Policy` values; nginx version disclosed |
| [doctor-country-not-listed-untranslated-english](doctor-country-not-listed-untranslated-english/README.md) | Doctor | Low | Confirmed, reproduced (no doctor-role automated suite yet) | "Country not listed" waitlist panel's body text is untranslated English on an otherwise French page |
| [keycloak-userinfo-cors-misconfiguration](keycloak-userinfo-cors-misconfiguration/README.md) | Patient (Keycloak) | Low | Confirmed via real cross-origin browser fetch, not yet automated | `userinfo` endpoint reflects any Origin + allows credentials with no allowlist; not currently chainable into data leakage since this endpoint requires Bearer auth, but the policy itself is unscoped |
| [responsive-tablet-empty-whitespace](responsive-tablet-empty-whitespace/README.md) | Both (shared login template) | Low | Confirmed, reproduced on both roles, not yet automated | Login page wastes ~235px of empty vertical space at 768px tablet width; form not recentered either. Registration wizards on both roles are unaffected |
| [login-phone-placeholder-clipped-320](login-phone-placeholder-clipped-320/README.md) | Both (shared login template) | Low | Confirmed, reproduced on both roles, not yet automated | Phone-number input's placeholder text clips mid-word ("Numéro de télépl") at 320px width; fine at 375px+ |
| [security-page-horizontal-overflow-320](security-page-horizontal-overflow-320/README.md) | Patient | Low | Confirmed, not yet automated (doctor equivalent not checked - authenticated doctor pages currently unreachable) | "Connexion & Sécurité" page's "Mot de passe" row forces ~26px of real horizontal page scroll at 320px width; fine at 375px+ |
| [admin-audit-retention-policy-contradiction](admin-audit-retention-policy-contradiction/README.md) | Admin | Medium | Confirmed, not yet automated (no admin-role suite yet) | Login page claims "conservation 20 ans" for audit logs; the audit log page itself says retention is "à confirmer (DPO)" |
| [admin-audit-log-generic-admin-identity](admin-audit-log-generic-admin-identity/README.md) | Admin | Medium/High | Confirmed, not yet automated (no admin-role suite yet) | Audit log attributes actions to a generic "Secondary Admin" seat label (with history predating the actual account), not the real named individual, contradicting its own "Comptes nommés individuels" claim |
| [admin-console-mobile-not-responsive](admin-console-mobile-not-responsive/README.md) | Admin | Low-Medium (pending DoD confirmation) | Confirmed behavior, not yet automated | Mobile (375px) is fully blocked behind a static "switch to tablet/desktop" page rather than an adapted responsive layout; tablet (768px) and desktop (1600px) render cleanly |
| [muted-text-color-contrast-below-wcag-aa](muted-text-color-contrast-below-wcag-aa/README.md) | Patient | Medium | Confirmed via automated axe-core scan, live regression test (currently failing, by design) | Shared `text-muted-foreground` token (4.1-4.46:1) and a separate caption style (2.56:1) both fail WCAG 2 AA's 4.5:1 minimum, across both login and dashboard |
| [doctor-kyc-form-field-mismatches](doctor-kyc-form-field-mismatches/README.md) | Doctor | Low-Medium (pending spec confirmation) | Confirmed behavior via live retest, not yet automated | Only 1 of 2 KYC upload slots is mandatory (not 2 as expected); no professional liability insurance field exists on the form at all |
| [admin-english-locale-reachable-undiscoverable](admin-english-locale-reachable-undiscoverable/README.md) | Admin | Low (pending intent confirmation) | Confirmed behavior via live retest, not yet automated | `/en` renders a complete, fully-translated English console despite no language selector existing anywhere in the UI - contradicts "no reachable /en/ admin URL" |

Additional low-severity findings not written up as their own defect folder (documentation/AC
corrections, environmental limitations, informational notes) are tracked inline in
`test-results/Report.md`'s own Defects Log and `test-results/exploratory-findings.md` - ask for
any of those to be promoted to a full write-up here if needed.
