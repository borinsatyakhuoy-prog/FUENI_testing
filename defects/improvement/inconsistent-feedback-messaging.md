# Improvement: Inconsistent success/error feedback across flows

**Priority: Medium.** None of these are broken flows - every one completes correctly - but the
user is left guessing whether their action succeeded, which erodes trust especially on
compliance-sensitive actions (KYC, admin login).

## Observed instances

| Flow | What happens | What's missing |
|---|---|---|
| KYC wrong-file-type upload (`test-case/doctor/kyc-verification/005-file-type-rejection`) | File is silently rejected (no upload request fires) | No visible error message explaining why |
| KYC "Enregistrer et reprendre plus tard" (`test-case/doctor/kyc-verification/010-save-draft-resume`) | A real `PATCH .../kyc/profile` succeeds (204) | No visible "Saved" confirmation toast |
| Admin login success (`test-case/admin/login-flow/019-success-message-console-redirect`) | Redirect to console works every time | No distinct "success" toast separate from the redirect itself |

## Recommendation

Introduce (or audit for consistent use of) a single, shared toast/notification component used
for every async action's outcome - success and failure alike - rather than letting some actions
communicate purely through side effects (a redirect, a slot updating) that a user could miss or
misread as nothing having happened. This would resolve all three instances above with one
shared fix rather than three separate ones, and should be checked against other async actions
not covered by this session's specific test cases too.
