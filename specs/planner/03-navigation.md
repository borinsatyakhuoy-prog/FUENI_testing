# Sidebar Navigation

[← index](README.md)

### 3. Sidebar Navigation

**Seed:** `tests/seed.spec.ts`

#### 3.1. All sidebar links route correctly and highlight the active item

**File:** `tests/fueni-test/navigation/001_sidebar-routes.spec.ts`

**Steps:**
  1. Log in, then click each sidebar link in turn: Tableau de bord, Mes RDV, Prendre RDV, Mes
     documents, Mon profil, Connexion & Sécurité, FAQ, Contacter le support
    - expect: Each click navigates to its documented route (`/fr/dashboard`, `/fr/appointments`,
      `/fr/book`, `/fr/documents`, `/fr/my-profile`, `/fr/security`, `/fr/faq`, `/fr/support`)
    - expect: The clicked link is marked as the active nav item (confirmed live via the
      accessibility tree's `[active]` state on the corresponding link)

#### 3.2. Unimplemented routes show the shared placeholder, not an error

**File:** `tests/fueni-test/navigation/002_unimplemented-routes-show-placeholder.spec.ts`

**Steps:**
  1. Navigate to each of `/fr/appointments`, `/fr/book`, `/fr/documents`, `/fr/faq`,
     `/fr/support` in turn
    - expect: Each shows the identical heading "Bientôt disponible" and body text "Cette
      fonctionnalité est en cours de développement. Revenez bientôt !" - not a 404, blank page,
      or console error
  - Note: intentionally one test covering all five routes (table-driven), since they're
    confirmed to render the same generic placeholder component - avoids five near-duplicate
    spec files for what's currently a single shared UI state. Split into per-feature specs once
    each route gets real content (see 07-future-features.md).

#### 3.3. Sign out is reachable from every page via the sidebar

**File:** `tests/fueni-test/navigation/003_sign-out-always-visible.spec.ts`

**Steps:**
  1. From several different sidebar destinations (Dashboard, Mon profil, Connexion & Sécurité),
     confirm the "Se déconnecter" button is present at the bottom of the sidebar
    - expect: Visible and clickable regardless of which page is active

#### 3.4. Direct URL access to protected MON COMPTE routes redirects when logged out

**File:** `tests/fueni-test/navigation/004_direct-url-protected-routes-redirect.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to `/fr/dashboard`, `/fr/my-profile`, and
     `/fr/security` in turn (each in a fresh, unauthenticated browser context)
    - expect: Each redirects to the login page rather than showing any cached/partial content
  - Extends auth/005's dashboard-only check (which tests the same thing after an explicit
    logout) to the other MON COMPTE routes. Confirmed live 2026-08-18: no defect found.

#### 3.5. Notifications bell is currently a dead UI element

**File:** `tests/fueni-test/navigation/005_notifications-bell-is-inert.spec.ts`

**Steps:**
  1. Log in, click the top-bar "Notifications" bell button
    - expect (current, documented behavior): No panel, dropdown, or dialog opens; no console/page
      error fires either - it's a silent no-op, not a crash
  - **Known issue (2026-08-18):** see Defects Log, Issue 4 in `test-results/Report.md`. This spec
    documents the current (broken) state and should start failing - and get rewritten to assert
    real panel content - the moment a notifications feature ships.

#### 3.6. Unknown routes return a real 404, not a crash

**File:** `tests/fueni-test/navigation/006_unknown-route-404.spec.ts`

**Steps:**
  1. Navigate to a nonexistent route (e.g. `/fr/this-route-does-not-exist-xyz123`)
    - expect: HTTP 404 status; a "404" heading is shown
  - Confirmed live 2026-08-18: the 404 page itself is a generic, unbranded, English-only default
    (no FUENI header/sidebar, no French copy, no link home) - inconsistent with the rest of the
    branded French UI. Low-severity finding, not blocking - see `test-results/Report.md`.

#### 3.7. Protected-route URL variants (trailing slash, query params) still redirect when logged out

**File:** `tests/fueni-test/navigation/007_route-variants-redirect-when-unauthenticated.spec.ts`

**Steps:**
  1. Without logging in, navigate to `/fr/dashboard/` (trailing slash) and separately to
     `/fr/my-profile?foo=bar&x=1` (query params)
    - expect: Both redirect to login, same as the bare-path case in 3.4
  - Confirmed live 2026-08-19. No defect found.

#### 3.8. Ordinary browser back/forward across authenticated pages renders correctly at every step

**File:** `tests/fueni-test/navigation/008_back-forward-preserves-authenticated-state.spec.ts`

**Steps:**
  1. Log in, visit `/fr/my-profile` then `/fr/security`
  2. Go back twice, then forward twice
    - expect: Each step lands on the correct URL with the correct page content rendered (not
      blank, not an error, not bounced to login) - distinct from auth 1.10, which covers the
      after-logout case specifically
  - Confirmed live 2026-08-19. No defect found.
