# Tickets

Forward-looking follow-up items: things that need action from someone other than this suite
(the FUENI engineering team, or whoever maintains this QA project's own dependencies) before
they can be resolved or automated further. See `defects/` instead for confirmed application bugs
that are already fully described and don't need external action to *understand* (only to fix).

Each ticket gets its own folder (`tickets/<TICKET-ID>/README.md`). This index is kept up to date
as tickets are added.

Tracked in git alongside `defects/` (both were briefly gitignored early on, now committed so
findings survive across machines/sessions).

## Index

| Ticket | Summary | Verdict | Details |
|---|---|---|---|
| [CLOUDFLARE-TURNSTILE-CI-testkey-request](CLOUDFLARE-TURNSTILE-CI-testkey-request/README.md) | Ask the FUENI team for a Cloudflare Turnstile test-mode site key so Turnstile-gated flows (patient forgot-password/registration, doctor registration) can run unattended in CI | **Open** - blocked on infra owner | [README](CLOUDFLARE-TURNSTILE-CI-testkey-request/README.md) |
| [DOCTOR-ROLE-registration-blocked-by-turnstile](DOCTOR-ROLE-registration-blocked-by-turnstile/README.md) | No automatable path to a logged-in doctor account exists yet (Turnstile-blocked self-registration + manual KYC + un-readable-mailbox 2FA on the one ad hoc account provided) - zero automated coverage of the authenticated doctor area | **Open** - blocked on account provisioning or the Cloudflare ticket above | [README](DOCTOR-ROLE-registration-blocked-by-turnstile/README.md) |
| [NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade](NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade/README.md) | `npm audit` on this QA project's own devDependencies: 1 high (`xlsx`, no fix available) + 2 moderate (`exceljs`/`uuid`, fix needs a major downgrade) | **Open** - not yet actioned | [README](NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade/README.md) |
| [ADMIN-ROLE-exploration-notes](ADMIN-ROLE-exploration-notes/README.md) | First authenticated pass at the admin portal (new scope, not previously in the test plan) - confirms dedicated realm/anti-enumeration/audit-logging work, flags 2 defects, and lists what was deliberately not tested (brute-force threshold, DSI-reset session invalidation) | **Open** - informational/scoping, decide whether to build a full admin suite | [README](ADMIN-ROLE-exploration-notes/README.md) |
