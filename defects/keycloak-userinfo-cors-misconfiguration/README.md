# Defect: Keycloak `userinfo` endpoint has a permissive CORS policy (reflects any Origin + allows credentials)

**Status:** CONFIRMED via a real cross-origin browser fetch (not just raw header inspection), and
now confirmed **server-wide across all three realms** (2026-08-21 - see "Scope confirmed
server-wide" below). Live regression test as of 2026-08-21:
`tests/fueni-test/security/013_keycloak-userinfo-cors-reflects-any-origin.spec.ts` (currently
failing on all three realms, by design - documents the unfixed state).

**Severity: Low.** Confirmed real (the misconfiguration exists and a genuine credentialed
cross-origin browser request does get its response exposed to JS), but not currently chained
into a working exploit - see "Why this isn't higher severity" below. Still a defense-in-depth
violation worth fixing, and now confirmed broader than originally scoped (see below).

**Environment:** `https://fueni-staging-preview-auth.allweb.cloud` (Keycloak). Originally found
on realm `fueni-platform` (patient app); confirmed 2026-08-21 to be the identical policy on
`fueni-professional` (doctor app) and `fueni-platform-admin` (admin console) as well.

## Steps to Reproduce

1. From any page on a different origin (e.g. the real patient app,
   `https://fueni-staging-preview-patient.allweb.cloud`, already a different origin from the
   auth server), run:
   ```js
   fetch('https://fueni-staging-preview-auth.allweb.cloud/realms/fueni-platform/protocol/openid-connect/userinfo', { credentials: 'include' })
     .then(r => console.log(r.status, r.headers.get('access-control-allow-origin'), r.headers.get('access-control-allow-credentials')));
   ```
2. Observe the response is NOT blocked by CORS - the browser exposes the status/headers to JS
   (confirmed live, 2026-08-19, `401` came through readable to JS rather than a CORS network
   error).
3. Separately, a plain `fetch()` (no browser, arbitrary `Origin` header set directly) to the same
   endpoint from a completely fabricated, never-registered origin
   (`https://evil-attacker-site.example.com`) gets that exact origin reflected back in
   `Access-Control-Allow-Origin`, alongside `Access-Control-Allow-Credentials: true` - i.e. there
   is no origin allowlist at all on this endpoint's CORS policy.

## Expected Result

`Access-Control-Allow-Origin` should only ever reflect a small, explicit allowlist of trusted
origins (the app's own real domains) - never an arbitrary/unregistered origin - especially when
combined with `Access-Control-Allow-Credentials: true`.

## Actual Result

Any origin, including a completely made-up one, is reflected back with credentials allowed.

## Why this isn't higher severity right now

The `userinfo` endpoint's own authorization strictly requires an `Authorization: Bearer <token>`
header per the OIDC spec - confirmed live that a credentialed (`credentials: 'include'`)
cross-origin fetch using only the browser's real session cookies got `401` with an empty body,
not the user's profile data. So today, this specific endpoint's CORS gap doesn't by itself leak
data, because cookies alone aren't sufficient credentials for it.

**However:** this CORS policy is evidently applied broadly (not scoped per-endpoint), so any
*other* endpoint on this same auth domain that *does* accept cookie-based session auth (rather
than requiring a bearer token) would be immediately exploitable for cross-origin data disclosure
via this same misconfiguration. This wasn't exhaustively tested across every Keycloak
endpoint/realm - see Recommendation.

## Scope confirmed server-wide (new, 2026-08-21)

Re-tested via a raw Node `fetch()` with a fabricated `Origin: https://evil-attacker-site.example.com`
header (no browser involved, so nothing about "which origin sent this" was self-fulfilling) against
all three realms' `userinfo` endpoints. All three reflected the fabricated origin with
`Access-Control-Allow-Credentials: true`:

| Realm | App | Result |
|---|---|---|
| `fueni-platform` | Patient | `ACAO` reflects fabricated origin, `ACAC: true` |
| `fueni-professional` | Doctor | `ACAO` reflects fabricated origin, `ACAC: true` |
| `fueni-platform-admin` | Admin | `ACAO` reflects fabricated origin, `ACAC: true` |

This means the misconfiguration is a single server-wide Keycloak CORS setting, not something
scoped per-realm/client - fixing it in one place (the shared instance config) should resolve it
for all three apps at once, and conversely, testing/fixing only the patient realm would leave the
doctor and admin realms' identical exposure unaddressed. The admin realm's identical exposure is
the more notable escalation here given the platform's own compliance marketing is heaviest on
that surface (see `defects/admin-audit-retention-policy-contradiction`,
`defects/admin-audit-log-generic-admin-identity`).

## Audit of cookie-based-auth endpoints (new, 2026-08-21) - closes the open recommendation below

The original recommendation asked whether any *other* endpoint on this auth domain accepts
cookie-based session auth (which would make this CORS gap immediately exploitable for data
leakage, unlike `userinfo` which strictly requires a Bearer token). Tested directly, using a real
authenticated patient session:

- `/realms/fueni-platform/account/`, `/account/credentials`,
  `/protocol/openid-connect/token`, and `/protocol/openid-connect/logout` - a real in-browser
  cross-origin `fetch(..., { credentials: 'include' })` from the patient app's own origin was
  **blocked** (`TypeError: Failed to fetch`, no `Access-Control-Allow-Origin` sent at all for
  that origin) for all four. **These are not chainable into this CORS gap** - good hygiene,
  closes that open question.
- `/protocol/openid-connect/certs` (the public JWKS document) *does* reflect-any-origin +
  `ACAC: true` like `userinfo`, but this endpoint only ever serves public signing keys - no
  session or user data - so this is informational only, not a separate defect.

## Evidence

Captured live 2026-08-19 via a Node `fetch()` (raw header/reflection check) and a real
in-browser `fetch()` from the actual patient-app origin (credentialed cross-origin
exploitability check). Extended 2026-08-21: raw Node `fetch()` with a fabricated `Origin` header
against all three realms (server-wide scope confirmation above), and a real authenticated
in-browser cross-origin fetch against `account`/`token`/`logout`/`certs` (cookie-auth audit
above). Automated as of 2026-08-21:
`tests/fueni-test/security/013_keycloak-userinfo-cors-reflects-any-origin.spec.ts`.

## Recommendation

- Configure Keycloak's CORS/Web-Origins policy **once, at the shared instance/provider level**
  (confirmed 2026-08-21 to be identical across all three realms, not a per-realm setting) to an
  explicit allowlist of real, trusted origins - never a reflect-any-origin pattern - especially
  wherever `Access-Control-Allow-Credentials: true` is also set. This one fix covers `userinfo`
  on all three realms plus `certs`.
- ~~Audit whether any other endpoint under this auth domain accepts cookie/session-based auth~~ -
  done 2026-08-21, see above: `account`/`token`/`logout` are correctly not CORS-exposed, so the
  practical impact today remains bounded to what was already documented (defense-in-depth gap,
  not a demonstrated data leak).
