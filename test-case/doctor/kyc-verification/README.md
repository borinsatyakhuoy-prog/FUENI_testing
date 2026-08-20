# Test Case Results: Doctor KYC Verification (retest, 2026-08-20)

**Context:** These 16 items were requested for retest against the doctor ("Espace praticien")
role's KYC verification flow. Per `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`, this
whole area had **zero automated coverage and was believed blocked** (Turnstile at registration
step 3, manual KYC review, and an unreadable 2FA mailbox on the one durable account). This
session found that blocker no longer holds - see "Major update" below - and used a **fresh
temp-mail-controlled account** (not `FUENI_PRO_EMAIL`) to reach and fully exercise the KYC
screen for the first time. All evidence below is from that one live, continuous session.

**Account used:** `32ee35cec946055d@emalupe.com` (temp-mail controlled, password not committed -
see local `.env` if this account should become a standing fixture; not added there automatically
since this was an exploratory retest, not a deliberate provisioning decision).

## Major update to the existing ticket

**Fresh doctor registration completed successfully end-to-end with no Turnstile block
encountered at any step** - contradicting the open ticket's premise. Registration (4 steps:
Éligibilité → Inscription → email-OTP verification → Choix du plan) went straight through to the
dashboard in PENDING_KYC state. Network logs show a Turnstile widget request
(`0x4AAAAAADhOODqZb40ZZn36`, the same sitekey documented in
`tickets/CLOUDFLARE-TURNSTILE-CI-testkey-request`) did fire and one sub-resource request failed
(`net::ERR_ABORTED`), but this did not block the flow - either the widget passed silently
(Cloudflare's invisible/managed mode can do this based on risk signals) or the escalation
documented in Issue 3 had cooled down by the time of this attempt. **This directly enables
building a real doctor-role automated suite**, which was previously blocked. See
`tickets/DOCTOR-ROLE-registration-blocked-by-turnstile` for the update.

## Results

Each test case has its own folder (named `<#>-<short-name>/`) containing the screenshot
evidence referenced below. Folders for 016/017 exist for structural consistency but hold no
screenshot, since no distinguishing evidence could be captured for them this session (see their
rows).

| # | Test case | Result | Folder | Evidence |
|---|---|---|---|---|
| 000 | UI Doctor KYC Verification | ✅ **PASS** | [`000-ui-kyc-verification/`](000-ui-kyc-verification/) | `000-kyc-form-initial-state.png` - full form renders: professional info fields, 2 upload slots, 3 declaration checkboxes, submit/save-draft buttons |
| 001 | Login - PENDING_KYC account | ✅ **PASS** | [`001-login-pending-kyc-account/`](001-login-pending-kyc-account/) | `001-pending-kyc-dashboard.png` - sidebar shows "Vérification en cours", dashboard loads normally |
| 001.5 | Upload slots render — 2 mandatory documents only | 🔴 **MISMATCH** | [`001.5-upload-slots-mandatory-count/`](001.5-upload-slots-mandatory-count/) | `000-kyc-form-initial-state.png` - there are 2 upload slots, but only **1** ("Attestation ou carte d'inscription à l'Ordre des médecins") is marked **Obligatoire**; the other ("Pièce d'identité") is marked **Facultatif**. Either this test case's expectation is wrong, or the app is missing making the ID document mandatory too - needs the real spec to resolve. Now tracked as `defects/doctor-kyc-form-field-mismatches`. |
| 002 | KYC documents - no date validation required | ✅ **PASS** (by absence) | [`002-no-date-validation/`](002-no-date-validation/) | `000-kyc-form-initial-state.png` - no expiry-date or issue-date fields exist anywhere in the Justificatifs section, consistent with "no date validation required" |
| 005 | KYC document upload - infected file AND wrong file type both rejected | 🟡 **PARTIAL** | [`005-file-type-rejection/`](005-file-type-rejection/) | `005-wrong-file-type-attempt.png` - a `.txt` file was silently rejected (confirmed via network log: zero upload request fired), but **no visible error message** told the user why - a UX gap. **Infected-file rejection was not tested** - this suite does not create real malicious files (even an EICAR test string) against a live staging upload endpoint without explicit sign-off; flagging as untested rather than guessing. |
| 008 | Professional liability insurance - optional field | 🔴 **NOT FOUND** | [`008-insurance-field-missing/`](008-insurance-field-missing/) | `000-kyc-form-initial-state.png` - no such field or upload slot exists anywhere on this form. Either it's planned but not built, or it lives somewhere else not yet found. Now tracked as `defects/doctor-kyc-form-field-mismatches`. |
| 009 | KYC screen - support contact link available | 🟡 **PARTIAL** | [`009-support-contact-link/`](009-support-contact-link/) | Not present on the upload form itself (see 000's screenshot), but a "Contacter le support" button **is** present on the post-submission "Vérification en cours" status modal (`013-frozen-during-review.png`). Depends on which screen the test case means. |
| 010 | KYC draft saved and resumed later (cross-device) | ✅ **PASS** (fully verified with a dedicated second account) | [`010-save-draft-resume/`](010-save-draft-resume/) | Filled partial data, saved (confirmed via a real `PATCH .../kyc/profile` → 204), logged out completely, logged back in with a **brand-new** email OTP, reopened the form - both values were correctly restored. Rules out client-side-only persistence. |
| 011 | KYC submission - missing required document | ✅ **PASS** | [`011-missing-required-document/`](011-missing-required-document/) | `011-missing-document-only-highlighted.png` - clean, isolated evidence: every other field/checkbox valid (green), only the missing mandatory document blocks submission, clearly flagged "Ce champ est obligatoire." |
| 012 | KYC submission - complete file (documents + professional info) | ✅ **PASS** | [`012-complete-submission/`](012-complete-submission/) | `012-valid-upload-accepted.png` (upload accepted) and `012-submission-success-dashboard.png` (successful submission, redirected to dashboard, status becomes "Vérification en cours") |
| 013 | Slot editable until submit, frozen during review — server-enforced edit-lock | ✅ **PASS** | [`013-frozen-during-review/`](013-frozen-during-review/) | `013-frozen-during-review.png` - navigating directly to `/fr/kyc` after submission **redirects to `/fr/dashboard`** (a full page navigation, not just a hidden client-side link) and shows the read-only "Vérification en cours" status modal instead |
| 014 | Locked nav items are truly non-navigable, not just greyed out | ✅ **PASS** | [`014-locked-nav-items/`](014-locked-nav-items/) | `014-locked-nav-items-highlighted-PASS.png` + DOM inspection confirming "Mes patients", "Mon planning", "Dossiers médicaux" are real `<button disabled>` elements (not styled links with an active `href`) |
| 015 | Zero patient/appointment/medical-record requests while PENDING_KYC | ✅ **PASS** | [`015-zero-requests-pending-kyc/`](015-zero-requests-pending-kyc/) | `001-pending-kyc-dashboard.png` (zeroed stat cards) - network request log captured throughout the session shows zero requests matching `patient|appointment|medical-record|dossier-medical`, so the zeroed cards are backed by an absence of those calls, not just a hidden UI |
| 016 | Automatic deletion - no documents within 14 days, including exact reminder wording | ⚪ **NOT TESTABLE in real time** | [`016-auto-deletion-14-days/`](016-auto-deletion-14-days/) (no screenshot) | Same class of limitation as the admin portal's 20-year retention claim (`defects/admin-audit-retention-policy-contradiction`) - this needs either 14 real days to pass, or a look at the actual reminder-email template/copy from the FUENI team directly. Not guessed at. |
| 017 | Automatic deletion - corrections not resubmitted within 1 month, including exact reminder wording | ⚪ **NOT TESTABLE in real time** | [`017-auto-deletion-1-month/`](017-auto-deletion-1-month/) (no screenshot) | Same limitation as #016. |
| 018 | Responsive layout across mobile / tablet / desktop (DoD) | ✅ **PASS** | [`018-responsive-layout/`](018-responsive-layout/) | `018-responsive-mobile-375.png`, `-tablet-768.png`, `-desktop-1600.png` - the dashboard and "Vérification en cours" status modal render cleanly with no overflow/clipping at all three breakpoints. Notably **different from the admin console** (`defects/admin-console-mobile-not-responsive`), which fully blocks mobile instead of adapting - this doctor-app screen genuinely adapts. |

## Other findings, not on the original list

- **Unexplained field auto-fill:** partway through testing (after a document upload action),
  "Spécialité médicale" changed from "— Sélectionner —" to **"Chirurgie cardiaque"** without any
  interaction with that field. Not confirmed as a reproducible bug in this session (only observed
  once, and a full root-cause investigation - e.g. isolating whether it's tied to the upload
  action or some other state change - wasn't performed) - flagging for awareness, not asserting
  as a confirmed defect.
- **Inconsistent empty-required-field messaging:** "Numéro d'ordre médical" shows the
  format-validation message ("Numéro d'ordre invalide (3 à 60 caractères...)") when left empty,
  while every other empty required field correctly shows "Ce champ est obligatoire." - a minor
  copy/logic inconsistency.
- **Icon-only delete button has no accessible name** on the uploaded-document row (no `aria-label`
  found; had to be located via CSS class/icon matching rather than an accessible role+name query) -
  a small accessibility gap worth a look given this session's other a11y findings this week
  (`defects/muted-text-color-contrast-below-wcag-aa`).

## Not yet automated

None of this is captured as a Playwright spec yet - this was a manual/scripted-via-browser-tool
retest to establish current ground truth first, consistent with this suite's convention of
confirming live before writing automated assertions. Given the major update above (registration
is no longer Turnstile-blocked), building a real `tests/fueni-test/doctor/` suite is now
realistic - recommend prioritizing 011, 012, 013, 014, and 015 first since they have the cleanest,
most unambiguous pass evidence here.
