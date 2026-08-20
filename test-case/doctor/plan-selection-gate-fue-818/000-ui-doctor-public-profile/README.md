# 000 - UI Doctor Public Profile

**Result:** ✅ PASS

## How to test
1. Log in with a doctor account that has not yet completed KYC.
2. Navigate to `/fr/public-profile` (via the "Mon profil public" sidebar link, or directly).

## Expected
A public-profile management screen should render, letting the doctor manage what patients see in
the FUENI directory, even before KYC is complete.

## Actual
Matches expected. The screen renders: a "Profil visible dans l'annuaire" toggle (on by default),
an "Aperçu patient" preview link, an identity block showing name/specialty as KYC-locked
read-only fields ("proviennent de votre dossier vérifié (KYC) et ne sont pas modifiables ici"),
several declarative sections ("Non renseigné pour l'instant." placeholders with "Modifier"
buttons), and a "Informations légales" section marked "Vérifié" showing the medical order number
fields. Notably, this page is reachable and fully functional **without** the KYC-completion gate
that blocks `/fr/dashboard` - it isn't behind that gate at all.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.

## Improvement suggestion
None needed for the UI itself. Worth confirming with product whether it's intentional that this
page is reachable pre-KYC while the dashboard is gated - if intentional, no action; if not, it's
a gap worth closing since KYC-locked fields showing placeholder dashes could look broken to a
doctor who hasn't been told this screen is available early.
