# Test Case Results: FUE-904 - Admin Audit Log Viewer

**Context:** These 6 items were requested for the admin console's "Journal d'audit"
(`/fr/audit-logs`) feature. Admin credentials changed mid-session (new account
`allweb.qa@gmail.com`, OTP relayed by the user from a real Gmail inbox rather than a
temp-mail-controlled one). One successful login reached the page and captured real evidence for
3 of 6 cases before the session was interrupted by the admin realm's single-session lock -
confirmed to be caused by a real team actively using this same shared account concurrently, not
a test artifact. Per standing instruction, no data was edited or deleted on this account; only
read-only navigation was performed.

## Results

| # | Test case | Result | Folder |
|---|---|---|---|
| 000 | UI Admin Audit Log | ✅ **PASS** | [`000-ui-admin-audit-log/`](000-ui-admin-audit-log/) |
| 001 | Audit log page renders a read-only paginated table | ✅ **PASS** | [`001-read-only-paginated-table/`](001-read-only-paginated-table/) |
| 002 | Filtering by action, actor, or date range updates the list server-side | 🟡 **PARTIAL** (date range confirmed server-side/URL-reflected; action/actor not yet exercised) | [`002-filter-action-actor-date-range-server-side/`](002-filter-action-actor-date-range-server-side/) |
| 003 | Export downloads a CSV of the currently filtered entries | ⚪ **NOT EXECUTED** (button located, not yet clicked) | [`003-export-csv-of-filtered-entries/`](003-export-csv-of-filtered-entries/) |
| 006 | Audit entries older than the current date remain available up to 20 years | 🔴 **CONTRADICTION RECONFIRMED** | [`006-entries-available-up-to-20-years/`](006-entries-available-up-to-20-years/) |
| 007 | Responsive layout across mobile / tablet / desktop (DoD) | ⚪ **NOT EXECUTED** | [`007-responsive-layout/`](007-responsive-layout/) |

## What was confirmed in the one successful load

- Page header: "Journal d'audit" + "Exporter (CSV)" button; subtitle "Toutes les actions des
  administrateurs, tracées et attribuées. Consultation seule."
- Governance notice: "Registre inaltérable — ajout uniquement (append-only), non modifiable et
  non supprimable. Comptes nommés individuels · conservation à confirmer (DPO)." - matches and
  reconfirms the earlier-session finding in `defects/admin-audit-retention-policy-contradiction`.
- Controls: search box ("Rechercher une action, un motif…"), "Ajouter un filtre", a date-range
  chip already applied by default ("Période: 2026-05-20 - 2026-08-20", a rolling last-3-months
  window, URL-reflected as `?dateRangeFrom=...&dateRangeTo=...`), "Paramètres des colonnes",
  "Actualiser".
- Table: 6 columns (Horodatage, Admin, Catégorie, Action, Cible, Détail), 66 total entries this
  session, populated with real recent activity (mostly repeated Connexion/Déconnexion
  administrateur pairs from "Secondary Admin" every ~15-20 minutes throughout the day - this is
  what tipped off the concurrent-team-usage finding).
- Pagination: "Affichage 1 - 10 sur 66 éléments", "Lignes par page" selector, Précédent/Suivant
  (no Première-page/Dernière-page shortcuts, unlike the verification queue - a minor UI
  consistency note, not a defect).

## Other findings, not on the original list

- **Actor-name inconsistency:** the account switcher in the sidebar/topbar displays "TA Test
  Admin Super Admin" for the currently logged-in `allweb.qa@gmail.com` session, but the audit
  log attributes every recent action to "Secondary Admin" instead. Either the display name is
  stale from a prior account state, or there are two related admin identities and the log is
  attributing correctly while the UI chrome shows the wrong cached name - worth a follow-up look,
  not confirmed as a defect since it could just be an unrefreshed client-side cache within this
  one session.

## Not yet automated

None of this is captured as a Playwright spec yet, and shouldn't be until the single-session
constraint is resolved (see `defects/improvement/test-account-provisioning.md`) - an automated
spec that logs in during this team's active hours would just add to the session churn rather
than test anything reliably.
