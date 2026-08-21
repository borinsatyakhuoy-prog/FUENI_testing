# Defect: Audit log attributes actions to a generic role label ("Secondary Admin"), not the actual named individual

**Status:** CONFIRMED via direct observation, 2026-08-20; reconfirmed still unfixed 2026-08-21
(same account, one day later). Not yet covered by an automated test (no admin-role automated
suite exists yet - see `tickets/ADMIN-ROLE-exploration-notes`).

**Severity: Medium/High.** This is a real accountability gap in the one feature (`Journal
d'audit`) whose entire purpose is individual accountability, on a system that explicitly claims
"Comptes nommés individuels" (named individual accounts) as a stated design guarantee, right next
to the append-only/immutable claim. If actions genuinely can't be attributed to the real
individual who performed them, the audit log doesn't deliver what it promises, and that
undermines its value for the RGPD/HDS compliance posture the login page advertises.

**Environment:** `https://fueni-staging-preview-admin.allweb.cloud/fr/audit-logs`, observed
2026-08-20, Super Admin session.

## Description

A brand-new temp-mail-controlled test account (`db022bd7b0284076@emalupe.com`) was provisioned
and used to log in for the first time ever today (2026-08-20). The account-menu widget in the
sidebar correctly displays this session's name as **"Test Admin"**.

However, every single row this session generated in the audit log - two logins and one logout,
all within the last few minutes - is attributed in the **Admin** column (and the **Cible**/
Target column) to **"Secondary Admin"**, not "Test Admin".

More significantly: the audit log shows "Secondary Admin" login events going back to **14 Aug
2026** - six days before this account (`db022bd7b0284076@emalupe.com`) existed at all. That
timing makes it very unlikely "Secondary Admin" is simply this account's assigned display name;
it looks much more like a generic role/seat label that gets reused across whichever real email
happens to occupy that admin seat over time, rather than a name tied to a specific individual.

If that's correct, the audit log cannot actually distinguish between different real people who
have each held the "Secondary Admin" seat at different times - directly contradicting its own
"Comptes nommés individuels" claim.

## Steps to Reproduce

1. Have (or provision) an admin account that is not the primary/first admin seat.
2. Log in, note the account-menu display name (e.g. "Test Admin").
3. Go to Journal d'audit (`/fr/audit-logs`).
4. Find the just-generated login row(s) and compare the **Admin** column's name against the
   account-menu's name.
5. Note the discrepancy, and note how far back "the same" admin-column name's history goes
   relative to when the actual account was created/provisioned.

## Expected Result

The **Admin** column should show the actual, real identity of whoever was authenticated for that
action (e.g. the specific email or a name genuinely tied 1:1 to that email/account), consistent
with the page's own "Comptes nommés individuels" claim - not a generic, reusable role label.

## Actual Result

The **Admin** column shows "Secondary Admin" for a session whose own account-menu says "Test
Admin" - and "Secondary Admin" has activity predating this account's existence, suggesting the
label is shared across whoever occupies that seat rather than being unique per individual.

## Evidence

Observed live via Playwright browser automation, 2026-08-20: sidebar account-menu snapshot
("Test Admin") vs. `/fr/audit-logs` table snapshot ("Secondary Admin" on rows timestamped
seconds after that same login), plus historical "Secondary Admin" rows dated 14/17/18 Aug 2026.

**Reconfirmed 2026-08-21, still unfixed:** logged in again with the same account (account-menu
still shows "Test Admin / Super Admin"), went straight to `/fr/audit-logs`, and the very top row -
this session's own login, timestamped seconds earlier (21 Aug 2026 15:19:18, "Succès Connexion
administrateur") - is again attributed to "Secondary Admin" in both the **Admin** and **Cible**
columns. The table now also shows a full day of other "Secondary Admin"-attributed login/logout
activity from 20-21 Aug (several round trips between 13:40 and 17:05 on the 20th alone) -
consistent with a real team actively using this account day-to-day, all of it still logged under
the same generic label a full day after this defect was first flagged.

## Recommendation

- Confirm with the FUENI/DSI team whether "Secondary Admin" is a per-seat role label (by design)
  or a bug in how the audit pipeline resolves the acting user's display name.
- If it's a role label by design: reconsider whether that satisfies "Comptes nommés individuels"
  as advertised - if the seat can be reassigned to different real people over time, either log
  the real underlying identity (email/user ID) in addition to the role label, or stop claiming
  individual accountability until it's tied to the actual person.
- If it's a bug: fix the audit pipeline to resolve and record the real authenticated identity for
  every logged action, not a cached/generic role name.
