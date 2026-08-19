# Defect: HTTP security header/cookie configuration gaps (Patient app)

**Status:** CONFIRMED via direct HTTP response/cookie inspection (no exploitation attempted -
this is a passive configuration review, not a penetration test). Not yet covered by an automated
test.

**Severity: Medium** for the missing `Secure` flag on the session cookie; **Low** for the other
three sub-findings. Nothing here was actively exploited; these are configuration gaps that widen
the theoretical attack surface rather than a demonstrated live compromise.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/login`, response headers
and cookies observed via Playwright on a normal page load, 2026-08-19.

## Description

### 1. Session cookie (`SESSION`) is missing the `Secure` flag

The application's own session cookie (`SESSION`, domain `fueni-staging-preview-patient.allweb.cloud`)
is set with `httpOnly: true` (good) but `secure: false`. On an HTTPS-only application, every
cookie - and especially the session cookie - should carry `Secure` so it can never be transmitted
over a plaintext connection under any circumstance (downgrade, misconfigured redirect, etc.).
This is the most actionable finding here for a healthcare app handling real patient sessions.

### 2. `csrf` and `NEXT_LOCALE` cookies also missing `Secure`

Same root cause, lower severity: `csrf` (domain `fueni-staging-preview-patient.allweb.cloud`,
`secure: false`, `httpOnly: false` - the latter is likely intentional for a double-submit-cookie
CSRF pattern that needs JS to read it, not a defect on its own) and `NEXT_LOCALE` (`secure: false`,
non-sensitive locale preference) should still both carry `Secure` on an HTTPS-only site as a
matter of consistent hygiene.

### 3. Content-Security-Policy is present but doesn't mitigate XSS

The CSP header sent is: `frame-src 'self'; frame-ancestors 'self'; object-src 'none';` - this
restricts framing/embedding (clickjacking-adjacent) and object embeds, but sets no `script-src`
or `default-src` directive at all. Script execution is entirely unrestricted by this policy, so
it provides none of CSP's primary value (mitigating XSS via restricting what scripts can run).

### 4. Conflicting `Referrer-Policy` values sent for the same response

Two different values were observed on the same response: `no-referrer` and
`strict-origin-when-cross-origin`. This isn't harmless redundancy (unlike the duplicated-but-
identical `X-Frame-Options`/`Strict-Transport-Security`/`X-Content-Type-Options` headers also
observed, which repeat the same value twice, likely from a CDN layer and the app both setting
it) - here, two different layers of the stack disagree, so actual browser behavior for referrer
leakage is inconsistent/undefined across origins.

### Minor, informational: `Server: nginx/1.27.5` discloses the exact server version

Low-severity information disclosure - an exact version string makes it trivial to check for
known CVEs against that specific nginx release. Not a vulnerability on its own, but unnecessary
disclosure.

## Expected Result

- Every cookie on an HTTPS-only app, especially the session cookie, should carry `Secure`.
- CSP should include a real `script-src`/`default-src` directive restricting script execution.
- `Referrer-Policy` should be set once, consistently, by a single layer of the stack.
- `Server` header should not disclose the exact version (e.g. suppress or genericize it).

## Actual Result

See the four sub-findings above.

## Evidence

Captured via Playwright `page.goto()` + `response.headers()` + `context.cookies()` against the
live login page response, 2026-08-19 (see session notes; no dedicated automated header/cookie
test exists yet - candidate for a new `tests/fueni-test/security/` spec if this suite adds
header/cookie assertions going forward).

## Recommendation

Priority order: (1) add `Secure` to the `SESSION` cookie - cheapest fix, most concrete risk
reduction; (2) reconcile the two conflicting `Referrer-Policy` sources into one; (3) add a real
`script-src`/`default-src` to the CSP; (4) add `Secure` to `csrf`/`NEXT_LOCALE`; (5) suppress the
exact nginx version string, lowest priority.
