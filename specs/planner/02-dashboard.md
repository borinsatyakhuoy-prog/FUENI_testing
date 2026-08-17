# Dashboard

[← index](README.md)

### 2. Dashboard

**Seed:** `tests/seed.spec.ts`

#### 2.1. Dashboard shows a personalized greeting and CTA

**File:** `tests/fueni-test/dashboard/001_dashboard-overview.spec.ts`

**Steps:**
  1. Log in
    - expect: Redirected to `/fr/dashboard`
    - expect: Heading reads "Bonjour {first name} 👋" (confirmed live: "Bonjour Borin 👋")
    - expect: Tagline "Pour votre santé, le maximum sera fait." is shown
    - expect: A "Prendre un RDV" button is visible

#### 2.2. Dashboard shows empty-state cards when no appointments/documents exist

**File:** `tests/fueni-test/dashboard/002_dashboard-empty-states.spec.ts`

**Steps:**
  1. On the dashboard, inspect the appointments card
    - expect: Shows "Prenez un rendez-vous pour commencer." and a "Tout voir" button
  2. Inspect the documents card
    - expect: Shows "Vos documents médicaux apparaîtront ici." and a "Tout voir" button
  - Note: since Mes RDV/Mes documents are themselves still "Bientôt disponible" placeholders
    (see 07-future-features.md), these empty states are the full extent of currently-testable
    dashboard content for those two areas - do not assume "Tout voir" navigates anywhere
    functional yet; assert only that it's present/clickable and lands on the (placeholder)
    route without erroring.

#### 2.3. "Compléter mon profil" banner links to My Profile

**File:** `tests/fueni-test/dashboard/003_complete-profile-banner.spec.ts`

**Steps:**
  1. On the dashboard, locate the "Compléter mon profil →" banner/link
    - expect: Clicking it navigates to `/fr/my-profile`
