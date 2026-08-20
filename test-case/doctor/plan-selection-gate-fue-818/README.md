# Test Case Results: FUE-818 - Doctor Plan-Selection Gate (dashboard entry)

**Context:** These 7 items were requested for the doctor ("Espace praticien") role's plan-selection
gate, which turned out to be **Step 4 of the registration flow itself** ("Choix du plan") rather
than a separate feature bolted onto the dashboard. Two fresh temp-mail-controlled accounts were
created and walked through the full registration flow (Éligibilité → Inscription → email-OTP →
Choix du plan) to exercise every case live.

**Accounts used:**
- `7dca937409914a42@emalupe.com` (password `PlanGate@2026!`) - used for cases 000-005, including
  a full logout/login cycle for case 004.
- `d2ba371f6e5241de@emalupe.com` (password `PlanGate@2026!`) - a second, disposable account used
  only for case 007, so the plan-selection screen could still be captured at all three breakpoints
  without first being dismissed by a plan choice.

Neither account is added to `.env` since both are exploratory/disposable, consistent with this
suite's existing convention for one-off retest accounts.

## Results

| # | Test case | Result | Folder | Evidence |
|---|---|---|---|---|
| 000 | UI Doctor Public Profile | ✅ **PASS** | [`000-ui-doctor-public-profile/`](000-ui-doctor-public-profile/) | `000-public-profile-ui.png` - full "Mon profil public" screen renders (visibility toggle, KYC-locked identity fields, editable declarative sections, verified legal info) even though the account has not completed KYC |
| 001 | Non-dismissable plan gate blocks the dashboard when no plan is selected | ✅ **PASS** | [`001-non-dismissable-plan-gate/`](001-non-dismissable-plan-gate/) | `001-gate-blocks-dashboard.png` - direct navigation to `/fr/dashboard` renders the dashboard behind a modal ("Choisissez votre formule") with no close/X control; confirmed non-dismissable via Escape key (no effect) and a real Playwright click on a sidebar link, which timed out because a `bg-black/50` backdrop div genuinely intercepts pointer events |
| 002 | Choosing Free persists the plan and closes the gate | ✅ **PASS** | [`002-choosing-free-persists-and-closes-gate/`](002-choosing-free-persists-and-closes-gate/) | `002-free-selected-plan-gate-closed.png` - clicking "Commencer gratuitement" fires `POST /api/v1/doctors/me/plan {"plan":"FREE"}` → 200 with `{"selectedPlan":"FREE","planSelectedAt":...}`, and the plan gate is gone afterward (replaced by the separate, unrelated KYC-completion gate) |
| 003 | Solo is disabled with a coming-soon toast; server also rejects it | 🟡 **PARTIAL** | [`003-solo-disabled-coming-soon-server-rejects/`](003-solo-disabled-coming-soon-server-rejects/) | `003-solo-disabled-no-toast.png` - "Choisir Solo" is a genuine `disabled` button with a static "Bientôt disponible" badge; clicking it (and the surrounding card) produced **no toast at all**, so that half of the test case's expectation doesn't hold. Server-side rejection is fully confirmed: a direct authenticated `POST .../me/plan {"plan":"SOLO"}` (with the real CSRF token) returned `422 PLAN_NOT_AVAILABLE`, and the account's plan remained unchanged (`FREE`) afterward. |
| 004 | Already-chosen plan skips the gate; re-selecting the same plan is idempotent | ✅ **PASS** | [`004-already-chosen-plan-skips-gate-idempotent/`](004-already-chosen-plan-skips-gate-idempotent/) | `004-plan-gate-skipped-after-relogin.png` - after a full logout and a fresh login (new password + new email-OTP), the plan gate never reappears (only the separate KYC gate does). Idempotency confirmed directly: re-`POST`ing `{"plan":"FREE"}` returned `200` with the **exact same** `planSelectedAt` timestamp as the original selection, not a bumped one - a true no-op, not just a non-error. |
| 005 | No payment is taken for any plan choice in this story | ✅ **PASS** | [`005-no-payment-taken/`](005-no-payment-taken/) | The plan-selection screen's own copy states "Aucun paiement à cette étape." Confirmed independently: the full network log across registration + both plan selections (FREE success, SOLO rejection attempt) contains **zero** requests matching `stripe\|payment\|checkout\|billing\|invoice`. |
| 007 | Responsive layout across mobile / tablet / desktop (DoD) | ✅ **PASS** | [`007-responsive-layout/`](007-responsive-layout/) | `007-responsive-mobile-375.png`, `-tablet-768.png`, `-desktop-1600.png` - the plan-selection screen (both plan cards, billing-cycle toggle, disclaimer text) renders cleanly at all three breakpoints; `scrollWidth` vs `clientWidth` check at 375px showed no real horizontal overflow (the ~15px delta is just the scrollbar). |

## Other findings, not on the original list

- **Phone-number validation is inconsistent with its own placeholder.** The registration form's
  phone field defaults to Cambodge (+855) with a placeholder example ("Ex : 77 123 45 67") that
  the **server itself rejects** as an invalid Cambodian number (`422 phoneNumber: "Phone number
  is not valid for the given country code"`), and Bénin (+229) rejected an 8-digit number with a
  client-side error too. Only France (+33) with a standard mobile-format number was accepted on
  the first attempt. This isn't one of the 7 requested cases, but is a real friction point in the
  same registration flow the plan gate lives in - worth its own look separately.
- **The "Choisir Solo" disabled state has no explanatory affordance at all** - not a toast, not a
  tooltip, nothing beyond the static "Bientôt disponible" badge. See case 003 above; tracked in
  `defects/improvement/inconsistent-feedback-messaging.md`-adjacent territory, though not yet
  added there since it's a "nothing happens" gap rather than a wrong message.

## Not yet automated

None of this is captured as a Playwright spec yet - this was a manual/scripted-via-browser-tool
exploration to establish current ground truth first, consistent with this suite's convention.
Given how clean and reproducible most of these results are (especially 001, 002, 004, 005), this
is a strong candidate for the next batch of permanent `tests/fueni-test/doctor/` specs - see
`defects/improvement/automated-suite-expansion.md`.
