# 005 - KYC document upload - infected file AND wrong file type both rejected

**Result:** 🟡 PARTIAL (wrong-type rejection confirmed working - independently reproduced
manually by the project owner; infected-file not tested)

## How to test
1. Open the KYC verification form and attempt to upload a `.txt` file (an unsupported type; the
   form states "PDF, JPG ou PNG" only) to the mandatory document slot.
2. Separately, attempt to upload a file containing a known malware test signature (e.g. an EICAR
   test string) to the same slot.
3. Observe whether each is rejected, and whether the user sees a clear error message.

## Expected
Both should be rejected, each with a clear, user-visible error message explaining why.

## Actual
- **Wrong file type:** rejected - confirmed via network log that zero upload request was fired
  after selecting the `.txt` file. Independently reproduced manually (2026-08-20) by the project
  owner, who also could not upload a `.txt` file - confirms the rejection itself is real and
  reproducible, not a one-off automation artifact. However, **no visible error message** appeared
  telling the user why the file wasn't accepted (the upload slot just silently stayed empty) - a
  UX gap, not a rejection-logic gap. See `005-wrong-file-type-attempt.png`.
- **Infected file:** **not tested.** This suite does not create or upload real malicious test
  files (even a benign EICAR test string) against a live staging endpoint without explicit
  sign-off from the project owner - flagged as untested rather than guessed at.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation - not yet cross-browser tested.
