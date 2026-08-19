# Defect: Keycloak `userinfo` endpoint has a permissive CORS policy (reflects any Origin + allows credentials)

**Status:** CONFIRMED via a real cross-origin browser fetch (not just raw header inspection) -
demonstrated, low current practical impact given this specific endpoint's auth requirement (see
below). Not yet covered by an automated test.

**Severity: Low.** Confirmed real (the misconfiguration exists and a genuine credentialed
cross-origin browser request does get its response exposed to JS), but not currently chained
into a working exploit - see "Why this isn't higher severity" below. Still a defense-in-depth
violation worth fixing.

**Environment:** `https://fueni-staging-preview-auth.allweb.cloud` (Keycloak, realm
`fueni-platform`), `userinfo` endpoint. Same architecture likely applies to the `fueni-professional`
realm used by the doctor app - not separately re-tested.

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

## Evidence

Captured live 2026-08-19 via a Node `fetch()` (raw header/reflection check) and a real
in-browser `fetch()` from the actual patient-app origin (credentialed cross-origin
exploitability check) - see session notes; no dedicated automated test exists yet.

## Recommendation

- Configure Keycloak's CORS/Web-Origins policy for this client and realm to an explicit
  allowlist of real, trusted origins - never a reflect-any-origin pattern - especially
  wherever `Access-Control-Allow-Credentials: true` is also set.
- Audit whether any other endpoint under this auth domain (or the `fueni-professional` realm)
  accepts cookie/session-based auth in addition to or instead of Bearer tokens; if any does, this
  CORS gap becomes immediately exploitable for that endpoint and should be prioritized
  accordingly.
