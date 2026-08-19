# Defect: "Country not listed" waitlist panel has untranslated English body text (Doctor app)

**Status:** CONFIRMED, reproduced. Not yet covered by an automated test (no doctor-role
automated suite exists yet - see `tickets/DOCTOR-ROLE-registration-blocked-by-turnstile`).

**Severity: Low.** Cosmetic/i18n gap only - the underlying waitlist form itself is fully
functional and its own validation messages are correctly localized (see below); only the
introductory paragraph is affected.

**Environment:** `https://fueni-staging-preview-pro.allweb.cloud/fr/register`, step 1
(Éligibilité), `kc_locale=fr` / French session throughout.

## Steps to Reproduce

1. Go to `https://fueni-staging-preview-pro.allweb.cloud/fr/register` (doctor/"Espace praticien"
   registration, step 1 "Éligibilité"), with a French session (`kc_locale=fr`, the default).
2. Under "Profession", leave "Médecin(e)" selected (the only enabled option).
3. Click the "Dans quel pays exercez-vous ?" dropdown under "Pays d'exercice".
4. Select **"Mon pays n'est pas dans la liste"** (last option, after the 9 real countries).
5. Observe the orange "Bientôt disponible dans votre pays" panel that appears.

## Description

On the doctor registration wizard's step 1 (Éligibilité), selecting "Mon pays n'est pas dans la
liste" from the "Pays d'exercice" dropdown reveals a waitlist panel. Its heading ("Bientôt
disponible dans votre pays") is correctly in French, but the body paragraph directly under it is
entirely untranslated English:

> "FUENI is launching in 9 countries (Benin, Burkina Faso, Cameroon, Côte d'Ivoire, Mali, Niger,
> DR Congo, Senegal, Togo) and will expand progressively. Leave us your email to be notified when
> it opens in your country."

This is the only untranslated string found on this otherwise fully-French page. The waitlist
form's own field-validation messages ("Veuillez saisir une adresse e-mail valide.", "Veuillez
accepter de recevoir l'annonce du lancement par e-mail.") are correctly in French, confirming the
gap is isolated to this one hardcoded/missing-translation-key string, not a broader localization
failure on this panel.

## Expected Result

The body paragraph should be in French, matching the heading and the rest of the page.

## Actual Result

Heading in French, body paragraph in English.

## Evidence

- Screenshot: `doctor-country-not-listed-english-text.png` (repo root, captured 2026-08-19)
- Confirmed live during doctor-role exploratory pass, 2026-08-19 (see conversation/session notes;
  no dedicated exploratory-findings doc exists yet for the doctor role - candidate for the same
  treatment as `test-results/exploratory-findings.md` once a doctor-role test suite exists).

## Recommendation

Add the missing French translation key for this waitlist panel's body copy - low priority,
isolated fix.
