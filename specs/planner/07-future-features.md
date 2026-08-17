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

#### 7.1. Prendre RDV (Book an appointment) - `/fr/book`

Anticipated: a doctor/specialty search or selection step, available time-slot picker, and a
confirmation step, given the dashboard's "Prendre un RDV" CTA and the marketing copy
"Prenez rendez-vous". Likely needs its own real-data-safety note once live (booking a real slot
against a real doctor's calendar in a shared staging environment).

#### 7.2. Mes RDV (My appointments) - `/fr/appointments`

Anticipated: a list of upcoming/past appointments, likely with cancel/reschedule actions and a
detail view, populated once 7.1 exists. The dashboard's current empty state ("Prenez un
rendez-vous pour commencer.") implies this list is driven by real booking data, not a
separately-seeded fixture - test data setup will depend on how 7.1 lands.

#### 7.3. Mes documents (My documents) - `/fr/documents`

Anticipated: a list/upload of medical documents ("gérez vos documents médicaux"), given the
dashboard's empty state ("Vos documents médicaux apparaîtront ici."). Likely candidate for a
document-upload + view/download round-trip test, similar in spirit to FAPA's report-lifecycle
suite, once real upload exists.

#### 7.4. FAQ - `/fr/faq`

Anticipated: static or searchable help content. Low complexity once live - likely just a content
smoke test plus any search/filter interaction if one exists.

#### 7.5. Contacter le support (Contact support) - `/fr/support`

Anticipated: a contact form or live-chat entry point ("restez en lien avec votre équipe de
soins"). If it sends real messages/tickets, will need its own real-data-safety note (validate
form + cancel, rather than submitting a real support ticket on every run) - same principle
already applied to FAPA's Add Client/Add User dialogs and to this project's account-mutation
dialogs in 04-profile.md / 05-security-account.md.

#### 7.6. Notifications bell (top bar)

Confirmed present on every page (button labeled "Notifications") but its contents weren't
explored this pass - revisit once there's something in it to test (currently no visible
unread-count badge was observed against a fresh login).

#### 7.7. Language switcher (top bar)

Confirmed present ("Français flag fr Changer de langue" button) but only French was observed
this pass - revisit once a second language is confirmed available/selectable, to test the
UI actually re-renders in the selected language rather than just changing the toggle's label.

#### 7.8. Espace professionnel (doctor role) and admin surfaces

Explicitly out of scope per `user-stories/SCRUM.md` ("For now focus on exploring the patient
role app") - the login page's "Vous êtes un professionnel de santé ? Espace professionnel" link
points to a separate app (`fueni-staging-preview-pro.allweb.cloud`). Not covered by this plan.
