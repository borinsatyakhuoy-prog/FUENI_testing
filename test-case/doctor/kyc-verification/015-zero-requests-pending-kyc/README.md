# 015 - Zero patient/appointment/medical-record requests while PENDING_KYC

**Result:** ✅ PASS

## How to test
1. Log in with a PENDING_KYC account and load the dashboard.
2. Capture the browser's network request log for the whole session.
3. Filter for any request URL matching patient, appointment, or medical-record-related API
   paths.

## Expected
No such requests should fire at all while the account is PENDING_KYC, since the doctor has no
verified access to that data yet - not just that the UI happens to display zero counts.

## Actual
Matches expected. The dashboard shows zeroed stat cards (Patients: 0, Rendez-vous du jour: 0,
Rendez-vous urgents: 0, Documents en attente: 0 - see
`001-login-pending-kyc-account/001-pending-kyc-dashboard.png`), and the full network request log
captured throughout the session contains **zero** requests matching
`patient|appointment|medical-record|dossier-medical` - confirming the zeroed UI is backed by an
actual absence of those API calls, not just a display-layer hide.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network log inspected via the
browser tool's request log) - not yet cross-browser tested.
