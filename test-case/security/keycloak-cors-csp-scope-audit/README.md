# Test Case Results: Cross-role security audit - Keycloak CORS/CSP scope, injection, access control (2026-08-21)

**Context:** A general security exploratory pass across the patient and doctor roles (admin
excluded from this round, per explicit scope), following up on open questions left in
`defects/keycloak-userinfo-cors-misconfiguration` and `defects/http-security-header-gaps`. No new
accounts' real data was mutated; the three fresh doctor-registration attempts (see "Not
reproducible" below) never got past email-OTP, so no doctor account from this session reached an
authenticated state.

**Accounts used:** the existing shared `FUENI_EMAIL`/`FUENI_PASSWORD` patient account for
login-dependent checks (no profile data changed); three disposable temp-mail addresses for
doctor-registration attempts (all abandoned at the OTP step, never completed).

## Results

| # | Test case | Result | Evidence |
|---|---|---|---|
| 1 | Keycloak `userinfo` CORS policy - is the reflect-any-origin misconfiguration scoped to the patient realm only, as originally documented? | 🔴 **Broader than documented** | Raw `fetch()` with a fabricated `Origin` header against all three realms (`fueni-platform`, `fueni-professional`, `fueni-platform-admin`) all reflected the fabricated origin with `Access-Control-Allow-Credentials: true`. See `defects/keycloak-userinfo-cors-misconfiguration/README.md` ("Scope confirmed server-wide"). |
| 2 | Does the same CORS gap extend to `account`/`token`/`logout` (which would make it exploitable for real data leakage), per the original defect's open recommendation? | ✅ **PASS (closes the question)** | A real authenticated in-browser cross-origin `fetch(..., {credentials:'include'})` from the patient app's own origin was blocked (`TypeError: Failed to fetch`) for `account/`, `account/credentials`, `token`, and `logout` - no CORS headers sent for those endpoints at all. Only `certs` (public JWKS, non-sensitive) shares the reflect-any-origin behavior. |
| 3 | OAuth `redirect_uri` validation - can it be bypassed with a subdomain-suffix, domain-suffix, or wildcard-path trick? | ✅ **PASS, no defect** | `https://evil-attacker-site.example.com`, `https://fueni-staging-preview-patient.allweb.cloud.evil-attacker.example.com`, and an unregistered path on the real domain (`/some-random-nonexistent-path`) were all rejected with a clean `400 Bad Request` / "Paramètre invalide : redirect_uri" - no verbose error, no bypass. |
| 4 | Post-login `from=` redirect param - does the browser's backslash-to-slash URL normalization (`/\evil.com` parsed as `//evil.com`) let it escape the app's origin? | ✅ **PASS, no defect** | Completed a real login starting from `/fr/login?from=/\evil-attacker-site.example.com`. Final URL after the full redirect chain was `https://fueni-staging-preview-patient.allweb.cloud/evil-attacker-site.example.com` - same origin. The value is handled as a literal path string server-side, not re-parsed as a URL, so the browser-normalization bypass class doesn't apply here. |
| 5 | Login "Identifiant" field - reflected XSS or SQL/template-injection markers (`<script>`, `img onerror`, `' OR '1'='1'`, `{{7*7}}`, `${7*7}`), patient + doctor | ✅ **PASS, no defect** | All 5 payloads on both apps: no JS dialog fired, no live DOM element created. Verified the one payload that looked suspicious in a raw substring check (`img onerror`) via full HTML inspection - it's fully HTML-entity-encoded (`&quot;&gt;&lt;img src=x onerror=alert(1)&gt;`) inside a hidden input value, not live markup. |
| 6 | Broken access control - do all known protected routes on patient + doctor consistently redirect unauthenticated requests to login (not just `/fr/dashboard`)? | ✅ **PASS, no defect** | 8 route guesses per app (`/fr/dashboard`, `/fr/my-profile`, `/fr/security`, `/fr/appointments`, `/fr/settings`, `/fr/profile`, `/fr/documents`, `/fr/notifications`) - every route that exists redirects to `/fr/login?from=...`; routes that don't exist 404. No route served protected content unauthenticated. |
| 7 | Common exposed-file/debug-endpoint sweep (`.env`, `.git/*`, `/actuator/*`, `/server-status`, source maps, etc.) across all 3 origins | ✅ **PASS, no defect** | All returned clean 404s. The one path that looked live (`/server-status` → `307`) turned out to be the app's own locale-prefix redirect (`/fr/server-status`, itself a 404), not a real status endpoint. |
| 8 | Authenticated-app CSP (`unsafe-inline`/`unsafe-eval`) - is it `/fr/dashboard`-specific or app-wide, and how permissive is `connect-src`? | 🔴 **Confirmed broader + new detail** | Identical CSP (including `unsafe-inline`/`unsafe-eval`) on `/fr/my-profile`, `/fr/security`, `/fr/appointments` - one app-wide policy. `connect-src 'self' wss: https: blob:` permits `fetch`/WebSocket to any HTTPS/WSS host - the actual data-exfiltration path if the `unsafe-inline` gap is ever combined with an HTML-injection vector. See `defects/http-security-header-gaps/README.md` finding #5. |
| 9 | Login-page CSP gap (#3) and conflicting `Referrer-Policy` (#4) - patient-only, or shared across roles? | 🔴 **Confirmed shared** | Identical response headers (missing `script-src`, duplicated `X-Frame-Options`/`HSTS`/`X-Content-Type-Options`, conflicting `Referrer-Policy`) on the doctor and admin login pages too - all three roles' login flows terminate at the same shared Keycloak/nginx layer. |
| 10 | Doctor authenticated-session CSP/cookie check (would need a fresh registration to reach a logged-in state) | ⚪ **Not reproducible this session** | 3 fresh temp-mail doctor registrations, all failed identically at the email-OTP wait (`No message from noreply@fueni.com arrived within 30000ms`) - same root cause already tracked in the uncommitted `tests/fueni-test/doctor/001_plan-selection-gate.spec.ts` cooldown mitigation, not a new finding. No doctor account from this session ever reached an authenticated state; nothing left behind beyond the 3 unverified, abandoned temp-mail accounts (never logged into again). |

## Automated as of this session

`tests/fueni-test/security/013_keycloak-userinfo-cors-reflects-any-origin.spec.ts` - live
regression test for item 1, across all three realms. Currently failing on all three (by design -
documents the unfixed state, same pattern as `009`/`010`/`011` in the same folder).

## Not yet automated

Items 2-9 above were ad-hoc/scripted checks (raw `fetch()` and one-off Playwright specs, deleted
after use), not turned into permanent specs - each is either a one-time scope-confirmation (2, 3,
4, 5, 6, 7, 9) or a documentation update to an existing defect (8) rather than a new standalone
defect needing its own regression test. Candidate for `defects/improvement/automated-suite-expansion.md`
if the team wants a permanent "access-control sweep" or "exposed-path sweep" spec going forward.
