# Defect: Admin portal claims 20-year audit retention on login, but the audit log page itself says retention is unconfirmed

**Status:** CONFIRMED via direct observation of both pages in the same session, 2026-08-20. Not
yet covered by an automated test (no admin-role automated suite exists yet - see
`tickets/ADMIN-ROLE-exploration-notes`).

**Severity: Medium.** Not an exploitable security bug, but a real compliance/documentation
consistency gap on a system that explicitly markets itself as PRODUCTION-grade with
RGPD/HDS/ISO 27001 compliance banners - for a healthcare platform, an inaccurate retention claim
in security-facing copy is a genuine risk (regulatory representations should match reality).

**Environment:** `https://fueni-staging-preview-admin.allweb.cloud` (realm
`fueni-platform-admin`), both the login page and `/fr/audit-logs`, observed 2026-08-20.

## Description

The admin login page's security-feature banner states, under "Actions auditées":

> Journalisation complète · **conservation 20 ans**.

("Full logging · **20-year retention**.") This same "conservation 20 ans" phrase repeats in the
authenticated app's footer/header area too.

However, the actual audit log page (`/fr/audit-logs`) - the feature this claim is about - shows
its own governance notice directly above the log table:

> Registre inaltérable — ajout uniquement (append-only), non modifiable et non supprimable.
> Comptes nommés individuels · **conservation à confirmer (DPO)**.

("Immutable register — append-only, not modifiable and not deletable. Named individual accounts
· **retention to be confirmed (DPO)**.") DPO = Data Protection Officer.

These two statements directly contradict each other: the login page confidently states a fixed
20-year retention period as an established fact/selling point, while the feature's own page says
that exact same retention period has **not yet been confirmed** by the Data Protection Officer.

## Steps to Reproduce

1. Go to `https://fueni-staging-preview-admin.allweb.cloud` and read the login page's "Actions
   auditées" security-feature card.
2. Log in (email + password + email OTP) and navigate to Journal d'audit (`/fr/audit-logs`).
3. Read the governance notice directly above the table.
4. Compare the two retention statements.

## Expected Result

A single, accurate retention statement used consistently everywhere the claim appears - and it
should only state a specific duration ("20 years") once that duration is actually confirmed and
implemented, not before.

## Actual Result

Two different, contradictory retention statements exist simultaneously: one marketing-facing
("20 ans", stated as fact) and one on the actual feature page ("à confirmer (DPO)", explicitly
not yet decided).

## Evidence

Observed live via Playwright browser automation, 2026-08-20 - login page snapshot and
`/fr/audit-logs` page snapshot, same authenticated session.

## Recommendation

- Until the DPO actually confirms a retention period, remove or soften the "20 ans" claim on the
  login page and anywhere else it appears (e.g. "conservation définie par notre politique de
  confidentialité" rather than a specific, seemingly final number).
- Once a real retention period is confirmed, update the audit log page's own notice to match and
  drop the "à confirmer" language.
- Whichever is fixed first, make sure both surfaces say the same thing - don't leave one updated
  and the other stale.
