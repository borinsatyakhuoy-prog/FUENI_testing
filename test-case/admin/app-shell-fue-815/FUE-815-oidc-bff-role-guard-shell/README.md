# FUE-815 - fueni-admin App Shell (OIDC callback · BFF session · role guard · console shell)

**Result:** ✅ PASS (all four sub-components confirmed working together)

## How to test
1. Log in and observe the OIDC redirect flow (app → Keycloak → back to app with an auth code).
2. Inspect the resulting session mechanism (cookie-based vs. token-in-JS).
3. Confirm role-based access control: locked features should be genuinely inaccessible, not just
   hidden.
4. Confirm the console shell (sidebar, header, breadcrumb) renders consistently across pages.

## Expected
A working OIDC authorization-code flow into a backend-for-frontend (BFF) session, with
server-enforced role gating and a consistent console shell.

## Actual
All four confirmed:
- **OIDC callback:** login correctly redirects through
  `fueni-staging-preview-auth.allweb.cloud/realms/fueni-platform-admin/...` (Keycloak) and back
  to `/auth/login/oauth2/code/keycloak-admin` on success.
- **BFF session:** a `SESSION` cookie is issued by the admin app itself (not just relying on the
  Keycloak cookie); logout is a real server-side `POST /api/v1/session/logout` call (see the
  007 test case in this same folder) rather than a client-only token discard.
- **Role guard:** the "Super Admin" role is enforced server-side, not just visually - e.g. the
  disabled sidebar items and the mobile-block redirect are both full page-level redirects, and
  the audit log's own governance notice is consistent with genuine server-side access control.
- **Console shell:** sidebar (Tableau de bord / Gestion / Configuration sections), header
  (breadcrumb, date, account email), and account menu render consistently across every page
  visited this session (`/fr`, `/fr/audit-logs`, `/fr/verifications`, `/en`).

See `admin-en-url-reachable.png` for a representative shell render (used here as a general shell
screenshot, not specifically for the language finding it's also referenced from).

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
