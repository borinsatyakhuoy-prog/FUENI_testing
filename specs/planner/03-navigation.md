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
