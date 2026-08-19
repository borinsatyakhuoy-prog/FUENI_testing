# Tickets

Forward-looking follow-up items: things that need action from someone other than this suite
(the FUENI engineering team, or whoever maintains this QA project's own dependencies) before
they can be resolved or automated further. See `defects/` instead for confirmed application bugs
that are already fully described and don't need external action to *understand* (only to fix).

Each ticket gets its own folder (`tickets/<TICKET-ID>/README.md`). This index is kept up to date
as tickets are added.

Gitignored (matching `defects/`'s convention) - local-only, not pushed.

## Index

| Ticket | Summary | Verdict | Details |
|---|---|---|---|
| [CLOUDFLARE-TURNSTILE-CI-testkey-request](CLOUDFLARE-TURNSTILE-CI-testkey-request/README.md) | Ask the FUENI team for a Cloudflare Turnstile test-mode site key so Turnstile-gated flows (patient forgot-password/registration, doctor registration) can run unattended in CI | **Open** - blocked on infra owner | [README](CLOUDFLARE-TURNSTILE-CI-testkey-request/README.md) |
| [DOCTOR-ROLE-registration-blocked-by-turnstile](DOCTOR-ROLE-registration-blocked-by-turnstile/README.md) | No automatable path to a logged-in doctor account exists yet (Turnstile-blocked self-registration + manual KYC + un-readable-mailbox 2FA on the one ad hoc account provided) - zero automated coverage of the authenticated doctor area | **Open** - blocked on account provisioning or the Cloudflare ticket above | [README](DOCTOR-ROLE-registration-blocked-by-turnstile/README.md) |
| [NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade](NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade/README.md) | `npm audit` on this QA project's own devDependencies: 1 high (`xlsx`, no fix available) + 2 moderate (`exceljs`/`uuid`, fix needs a major downgrade) | **Open** - not yet actioned | [README](NPM-AUDIT-xlsx-exceljs-vulnerability-upgrade/README.md) |
