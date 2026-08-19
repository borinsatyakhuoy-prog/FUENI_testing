# Future Features (Anticipated Scope)

[← index](README.md)

### 7. Anticipated / Not-Yet-Buildable Scope

As of sprint SCRUM-10, the destinations below all render the shared generic "Bientôt disponible"
placeholder (covered by `tests/fueni-test/navigation/002_unimplemented-routes-show-placeholder.spec.ts`).
This section exists so the test plan already has a home for each feature's real test cases the
moment it ships, without needing to restructure `specs/planner/`. Anticipated scope is inferred
from the sidebar labels, the dashboard's empty-state copy, and the app's marketing tagline
("Prenez rendez-vous, gérez vos documents médicaux et restez en lien avec votre équipe de
soins.") - treat every bullet below as a hypothesis to confirm, not a confirmed spec, once the
feature is live.

**Sprint-prep update (2026-08-19):** the sub-sections below now sketch concrete candidate test
cases per feature (happy path *and* non-happy-path, per this project's current testing standard -
see `test-results/Report.md` Session 6), so a future session can go straight from "feature shipped"
to "write the spec" without re-deriving scope from scratch. None of this is automatable yet - there
is no live UI to verify against - so nothing here has a `**File:**` line, and every numbered item
is a plan to confirm live, not a documented fact. When each feature ships, follow this project's
established convention: verify the real behavior/error-text live first, *then* write the spec.

#### 7.1. Prendre RDV (Book an appointment) - `/fr/book`

Anticipated: a doctor/specialty search or selection step, available time-slot picker, and a
confirmation step, given the dashboard's "Prendre un RDV" CTA and the marketing copy
"Prenez rendez-vous".

Candidate test cases once live:
- **Happy path:** search/filter by specialty, select an available slot, confirm booking - lands
  on a confirmation state and the new appointment appears in 7.2 (Mes RDV).
- **Empty/no-results state:** searching a specialty or date range with no availability shows an
  honest empty state, not a silent blank screen or a crash.
- **Double-booking / already-booked slot:** if two sessions can race for the same slot, confirm
  the second attempt gets a real "no longer available" error rather than silently succeeding or
  double-booking.
- **Cancel mid-flow:** abandoning the wizard partway (browser back, or an explicit cancel) does
  not leave a half-created/orphaned appointment behind.
- **Real-data-safety note:** this is the first flow in the app that would create real-looking
  scheduling data against what's likely a shared staging calendar/doctor roster - confirm live
  whether completed bookings are safely cancellable/revertible (mirroring how 05-security-account
  handles password-change and account-export) before automating the happy path past confirmation.
  If not safely revertible, prefer validating the form up to (not including) final confirm, the
  same pattern already used for registration's SMS step and the password-change dialog.

#### 7.2. Mes RDV (My appointments) - `/fr/appointments`

Anticipated: a list of upcoming/past appointments, likely with cancel/reschedule actions and a
detail view, populated once 7.1 exists. The dashboard's current empty state ("Prenez un
rendez-vous pour commencer.") implies this list is driven by real booking data, not a
separately-seeded fixture - test data setup will depend on how 7.1 lands.

Candidate test cases once live:
- **Happy path:** an existing appointment (created via 7.1) appears with correct date/doctor/
  status; upcoming vs. past are distinguishable.
- **Empty state:** confirmed already for the dashboard's summary card - re-verify the full-page
  empty state here matches, and that it's honest (no fake/placeholder appointment data shown).
- **Cancel an appointment:** if a cancel action exists, confirm it asks for confirmation before
  an irreversible action, and that a cancelled appointment either disappears or moves to a
  clearly-labelled "cancelled" state rather than vanishing silently.
- **Reschedule, if present:** same real-data-safety caution as 7.1 - validate the flow up to
  confirmation unless a safe revert path is confirmed first.
- **Pagination/large-list behavior:** if the account accumulates many appointments over repeated
  test runs, confirm the list paginates or scrolls correctly rather than degrading.

#### 7.3. Mes documents (My documents) - `/fr/documents`

Anticipated: a list/upload of medical documents ("gérez vos documents médicaux"), given the
dashboard's empty state ("Vos documents médicaux apparaîtront ici.").

Candidate test cases once live:
- **Happy path:** upload a real (small, synthetic) PDF/image, confirm it appears in the list and
  can be downloaded/viewed back with matching content.
- **Empty state:** matches the dashboard's existing empty-state copy.
- **File-type/size validation:** confirmed elsewhere in this app (the doctor KYC form rejects
  `.txt` uploads with a specific message, and enforces a 5 MB max - see
  `test-results/exploratory-findings.md` Session 5) - expect a similarly specific rejection
  message here, not a generic failure, and verify it live rather than assuming parity.
- **Delete a document:** if present, confirm a real confirmation step exists before deletion
  (same expectation this suite already holds account-deletion and password-change to).
- **Real-data-safety note:** uploading/deleting real-looking documents against the shared account
  is likely safe (unlike password or appointment data) since documents are inherently
  add/remove-only per-item - but confirm live that a test-uploaded file doesn't trigger any
  downstream notification (e.g. an e-mail to a real clinician) before treating this as
  fully safe to automate end-to-end.

#### 7.4. FAQ - `/fr/faq`

Anticipated: static or searchable help content. Low complexity once live.

Candidate test cases once live:
- **Content smoke test:** page renders real FAQ entries (not another placeholder), in French.
- **Search/filter, if present:** a query with zero matches shows an honest empty state.
- **Expand/collapse, if an accordion pattern is used:** clicking a question reveals its answer
  and can be collapsed again - the kind of "does the interactive affordance actually do
  something" check this suite already applies elsewhere (see the notifications-bell defect,
  `defects/notifications-bell-dead-control`, for why this is worth checking rather than assuming).

#### 7.5. Contacter le support (Contact support) - `/fr/support`

Anticipated: a contact form or live-chat entry point ("restez en lien avec votre équipe de
soins"). If it sends real messages/tickets, will need its own real-data-safety note.

Candidate test cases once live:
- **Happy path:** validate the form's fields/labels and, if a genuinely safe way to verify
  submission exists (e.g. a dedicated test-support inbox reachable via `temp-mail`, mirroring how
  the doctor test account's OTP mailbox works), confirm one real end-to-end submission.
- **Empty/required-field validation:** matches the pattern already proven throughout this suite
  (login, registration, profile/security edit dialogs) - submitting empty required fields should
  show specific, real validation errors.
- **Real-data-safety note:** unless a disposable-inbox verification path is confirmed safe (see
  above), default to validating the form up to (not including) final submit - the same call
  already made for the password-change dialog and account-export's re-auth step - to avoid
  generating real support tickets on every CI run.

#### 7.6. Notifications bell (top bar)

**Currently:** confirmed a dead control - `defects/notifications-bell-dead-control` (Issue 4) -
no panel, no request, no error, just silently does nothing. Regression-tested by
`tests/fueni-test/navigation/005_notifications-bell-is-inert.spec.ts`, written to start failing
the moment this changes.

Candidate test cases once a real panel ships:
- **Happy path:** clicking the bell opens a panel/dropdown showing real notifications (or an
  honest "no notifications" empty state) - replaces 005's "confirmed inert" assertion with a real
  positive check.
- **Unread-count badge, if one ships:** appears when there's something unread, clears once
  read/dismissed, and the two states are distinguishable at both mobile (375px/320px - see
  `defects/login-phone-placeholder-clipped-320` for why narrow-width checks matter here too) and
  desktop widths.
- **Mark-as-read / dismiss action, if present:** confirm it's a real, persisted mutation (surviving
  a page reload) rather than local-only UI state - the same "is this a real write or just local
  state" question this suite already resolved for the SMS/e-mail reminder toggles in
  `profile/005_notification-preference-toggle-persists.spec.ts`.

#### 7.7. Language switcher (top bar)

**Currently:** confirmed fully functional on the pre-login login page (both `fr`/`en` fully
translate the page via a `kc_locale` round-trip - see `test-results/exploratory-findings.md`
Session 2) but not yet asserted by an automated spec, and not yet confirmed inside the
authenticated app (Session 5 found the authenticated *doctor* area defaults to English regardless
of session locale - `defects/doctor-country-not-listed-untranslated-english`'s sibling issue,
Issue 6 in `test-results/Report.md`).

Candidate test cases:
- **Pre-login language switch (patient login page):** clicking "English" then "Français" fully
  translates a representative sample of strings (heading, tab labels, "Rester connecté", primary
  button) each time - this is already confirmed working manually and just needs writing up as a
  spec, no new feature required.
- **Authenticated-app language consistency:** once Issue 6 (doctor app defaulting to English) is
  fixed, add a regression test confirming the authenticated area of *both* roles honors
  `kc_locale` throughout - not just the pre-login screens.

#### 7.8. Espace professionnel (doctor role)

**Status update (2026-08-19):** `user-stories/SCRUM.md`'s original "For now focus on exploring the
patient role app" scoping is now superseded - Sessions 5-6 did explore the authenticated doctor
app (dashboard, KYC form) manually, see `test-results/exploratory-findings.md` and
`test-results/Report.md` §7-8. What's still missing is an *automated* doctor-role suite, blocked
on account access - see `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile` for the current
blocker (both the durable self-service account and the ad-hoc KYC-approved one are presently
unreachable) and `tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request` for the underlying ask.

Candidate test cases once account access is restored (mirrors the patient suite's structure):
- **Doctor auth folder:** login success/failure/empty-fields, mirroring `auth/001-003`, plus the
  mandatory email-OTP second factor this role has that the patient role doesn't.
- **Doctor dashboard:** empty-state cards, the "Finish your verification" KYC-blocking dialog for
  a KYC-pending account, and the unlocked-vs-locked sidebar state (Patients/Schedule/Medical
  records) before vs. after KYC approval.
- **KYC form:** required-field validation (already manually confirmed thorough - see Session 5),
  file-type/size upload rejection, and the Region/City cascade from the registration-time country
  choice - all safe to automate since Session 5 already validated without submitting real-looking
  fake credentials; the automated version should keep that same discipline (validate, don't
  submit, given a human reviewer is on the other end).
- **Patients/Schedule/Medical records:** currently locked pre-KYC and entirely unexplored post-KYC
  - full scope unknown until an approved account is reachable again.

Explicitly still out of scope: any admin-role surface - not referenced anywhere in
`user-stories/SCRUM.md` or observed during exploratory testing to date.
