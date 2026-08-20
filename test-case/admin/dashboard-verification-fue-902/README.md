# Test Case Results: FUE-902 - Admin Dashboard Scaffold & Doctor Verification List

**Context:** These 16 items were requested for the admin console's dashboard shell and the
"Vérification des dossiers médecins" (doctor verification) queue. Tested live against the
existing Super Admin account (`FUENI_ADMIN_EMAIL` in `.env`) - login (password + email-OTP) was
confirmed fully working this session, with no credential issues.

**Account used:** `db022bd7b0284076@emalupe.com` (the standing `FUENI_ADMIN_EMAIL`/`FUENI_ADMIN_PASSWORD`
account already in `.env`). At the time of testing, the queue had 21 real pending doctor records
(a mix of earlier test-data seeded by prior sessions and a couple of doctors this session's own
KYC/plan-selection retests created).

## Results

| # | Test case | Result | Folder | Evidence |
|---|---|---|---|---|
| 000 | UI Admin Dashboard and Verification | ✅ **PASS** | [`000-ui-admin-dashboard-and-verification/`](000-ui-admin-dashboard-and-verification/) | `000-dashboard-overview.png` (Vue d'ensemble welcome screen), `000-verifications-queue-initial.png` (full queue page: metrics, search, filters, list, pagination) |
| 001 | Queue - metrics display (pending / approved / needs correction) | ✅ **PASS** | [`001-queue-metrics-display/`](001-queue-metrics-display/) | Four metric cards: "21 En attente", "0 À corriger", "0 Validés ce mois", "0 Rejetés" - covers pending/needs-correction/approved plus a bonus rejected count, all matching the filter-by-status options exactly |
| 002 | Queue - filter by status | ✅ **PASS** | [`002-queue-filter-by-status/`](002-queue-filter-by-status/) | "Ajouter un filtre" → "Statut" → 4 options (En attente/À corriger/Validé/Rejeté) → applying "Validé" sets `?status=validated` in the URL, shows a removable "Statut: Validé" chip + "Tout effacer", and correctly returns 0 results |
| 003 | Queue - search by name, email, order number | ✅ **PASS** | [`003-queue-search-name-email-order-number/`](003-queue-search-name-email-order-number/) | All three modes confirmed independently: `Tola` → name match, `both.chan@allweb.com.kh` → email match, `ONMS-2024-84722` → order-number match, each narrowing to exactly the right 1 result |
| 004 | Queue - file card content and 'urgent' highlight beyond waiting threshold | ✅ **PASS** | [`004-card-content-and-urgent-highlight/`](004-card-content-and-urgent-highlight/) | Cards show avatar initials, name, role badge, status badge, email, specialty code, country flag, hours-waiting, medical order number. The "— Dépassé" (overdue) badge appears on long-waiting entries (71h+) and is correctly **absent** on the two shortest-waiting entries (31h, 2h) - confirmed both states exist in the live data, not just the "always shown" state |
| 005 | Queue - pagination | ✅ **PASS** | [`005-queue-pagination/`](005-queue-pagination/) | "Affichage 1-10 / 11-20 / 21-21 sur 21 éléments" across 3 pages; Première/Précédent correctly disabled on page 1, Suivant/Dernière disabled on the last page; "Lignes par page" selector present |
| 006 | Queue - default sort is oldest pending first | ✅ **PASS** | [`006-default-sort-oldest-pending-first/`](006-default-sort-oldest-pending-first/) | Waiting time descends monotonically across all 21 records and all 3 pages (246h → ... → 31h → 2h → 1h) - the very last record is the one this session itself created minutes earlier, confirming true chronological (creation-order) sorting, not a coincidental static order |
| 007 | Queue - no records message | ✅ **PASS** | [`007-queue-no-records-message/`](007-queue-no-records-message/) | Filtering to "Validé" (0 matches) shows a clear, correctly-localized "Aucun dossier ne correspond à ces filtres." message instead of an empty/broken list |
| 033 | Single-language console interface (French) | 🟡 **PARTIAL, consistent with existing finding** | [`033-single-language-french/`](033-single-language-french/) | Same split result as the already-documented `defects/admin-console-mobile-not-responsive`-adjacent FUE-815 finding: no language toggle exists anywhere in the console, but navigating directly to `/en/verifications` renders a complete, working English version anyway - not tracked as a new defect here, just reconfirmed on this specific screen |
| 034 | Dashboard shell - sidebar/topbar render and collapse responsively | ✅ **PASS** | [`034-shell-sidebar-topbar-responsive-collapse/`](034-shell-sidebar-topbar-responsive-collapse/) | Clicking "Toggle Sidebar" collapses the full sidebar (logo, section labels, nav-item text, account name/role text) down to an icon-only rail, while all nav links/buttons remain present and functional |
| 035 | Doctor list cards show all required fields plus urgency badge | ✅ **PASS** | [`035-doctor-cards-required-fields-urgency-badge/`](035-doctor-cards-required-fields-urgency-badge/) | Every card consistently shows: initials avatar, full name, "Médecin" role badge, status badge, email, specialty code, country flag, hours-waiting, and medical order number - plus the "— Dépassé" urgency badge when applicable (see case 004) |
| 036 | Sidebar badge shows the count of PENDING doctors | ✅ **PASS** | [`036-sidebar-badge-pending-count/`](036-sidebar-badge-pending-count/) | The "Vérification des dossiers" sidebar link shows a badge reading "21" - exactly matching the "21 En attente" metric on the queue page itself, confirmed on every page/filter state visited |
| 037 | Filter tabs and search update the list without a page reload | ✅ **PASS** | [`037-filter-search-no-reload/`](037-filter-search-no-reload/) | Every filter/search/pagination interaction fires a Next.js RSC fetch (`?_rsc=...`) plus a `GET /api/v1/admin/doctors/verifications?...` call with query params - confirmed via the network log, no full-page navigation/reload for any of them |
| 038 | Paginated, authorized read endpoint - no doctor id exposed in the request | ✅ **PASS** | [`038-paginated-authorized-endpoint-no-id-leak/`](038-paginated-authorized-endpoint-no-id-leak/) | The list endpoint (`/api/v1/admin/doctors/verifications`) only ever carries `page`, `size`, `q`, and `status` query params across every interaction captured this session (default view, all 3 search modes, status filter) - never a doctor id. Session-cookie-authenticated, consistent with every other admin endpoint tested this suite |
| 039 | Responsive layout across mobile / tablet / desktop (DoD) | 🔴 **MISMATCH, consistent with existing defect** | [`039-responsive-layout/`](039-responsive-layout/) | Tablet (768px) and desktop (1600px) render cleanly. Mobile (375px) redirects to `/fr/mobile-restricted`, same as every other admin screen - already tracked as `defects/admin-console-mobile-not-responsive`; not re-filed as a new defect, just reconfirmed on this specific screen |

## Other findings, not on the original list

- **"Examiner" (review) button is disabled on every card, by design** - not a bug. Its tooltip
  reads "Pas encore disponible dans cet environnement" ("Not yet available in this
  environment"), which is a deliberate, self-documented limitation matching FUE-902's own scope
  ("scaffold" + list only - review/approve/reject actions are presumably a separate, later
  ticket).
- **Likely duplicate/near-duplicate seed data:** two entries named "Mengty LIM" and "Mengty LIm"
  (case difference only) share the exact same medical order number `ONMS-2024-84729`. Almost
  certainly test-seed data rather than a real product bug, but flagging in case it's actually two
  accidental submissions from the same real test session that should be cleaned up.

## Not yet automated

None of this is captured as a Playwright spec yet. Given how clean and consistent every result
here is (14 of 16 cases a clean PASS, and the 2 non-PASS cases are both *reconfirmations* of
already-tracked, already-understood defects rather than new open questions), this is a strong,
low-risk candidate for the next `tests/fueni-test/admin/` spec - see
`defects/improvement/automated-suite-expansion.md`. Unlike the doctor-role registration flow,
there's no Turnstile/anti-automation concern here since it's a read-only queue view behind normal
login, not a repeated-registration flow.
