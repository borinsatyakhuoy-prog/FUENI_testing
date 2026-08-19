# FUENI (Patient) Application Test Plan

## Application Overview

Confirmed live (2026-08-17, via login with the credentials in `user-stories/SCRUM.md` against
`https://fueni-staging-preview-patient.allweb.cloud`): FUENI is a digital-health platform for
Francophone Africa (9 countries, MVP). The patient app ("Espace Patient") is a sidebar layout
with three grouped sections - **MON ESPACE** (Tableau de bord, Mes RDV, Prendre RDV, Mes
documents), **MON COMPTE** (Mon profil, Connexion & Sécurité), and **AIDE** (FAQ, Contacter le
support) - plus a top bar (sidebar toggle, language switcher, notifications bell) and a
"Se déconnecter" sign-out button.

The project is at sprint **SCRUM-10**: authentication and the two account-management pages
(Mon profil, Connexion & Sécurité) are fully built; the four care-feature destinations (Mes RDV,
Prendre RDV, Mes documents) and both AIDE destinations (FAQ, Contacter le support) currently
render an identical generic "Bientôt disponible" (Coming soon) placeholder. This plan covers
what's live now in depth, covers the placeholders with a single shared smoke test, and documents
the anticipated future scope so the plan only needs new sections added (not restructuring) as
each feature ships.

IMPORTANT DATA-SAFETY NOTE: this suite logs into a **single shared patient test account**
(Borin KHUOY / `FUENI_EMAIL` / `FUENI_PASSWORD`), not an isolated per-test one. Tests must not
submit real changes to that account's password, e-mail, phone, "Localisation & langue", or
"Contact d'urgence" fields - doing so would break every other test's login or profile
assertions. Wherever a test opens one of those "Modifier"/"Changer" dialogs, it must stop at
validating the form/disabled-state and then Cancel/close, the same principle FAPA's plan uses
for its Add Client/Add User dialogs. The GDPR "Exporter mes données" export is read-only and
safe to execute for real. The registration wizard is also safe to run for real, provided it
uses a **disposable inbox from the `temp-mail` MCP server** rather than a real address, so it
never depends on or risks a fixed synthetic account.

## Sections

- [01-auth.md](01-auth.md) - §1 Authentication (login, invalid credentials, empty-field
  validation, forgot-password wizard, logout)
- [02-dashboard.md](02-dashboard.md) - §2 Dashboard
- [03-navigation.md](03-navigation.md) - §3 Sidebar Navigation (incl. the shared
  "Bientôt disponible" placeholder check)
- [04-profile.md](04-profile.md) - §4 Mon profil
- [05-security-account.md](05-security-account.md) - §5 Connexion & Sécurité
- [06-registration.md](06-registration.md) - §6 Registration (sign-up wizard, via temp-mail)
- [07-future-features.md](07-future-features.md) - §7 Anticipated/not-yet-buildable scope
  (appointments booking & listing, documents, FAQ, support) - tracked here so this plan doesn't
  need re-structuring each time SCRUM advances; promote each subsection to its own file with
  real test cases once the feature ships.
- [08-performance.md](08-performance.md) - §8 Page-load performance (P90 SLA across key pages)

Numbering is per-file (each `tests/fueni-test/<area>/` folder starts its own `001_*.spec.ts`),
following the same convention as the reference FAPA test suite this project's tooling is
modeled on.
