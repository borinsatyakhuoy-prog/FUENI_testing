# Improvement: Document an explicit responsive-design policy per app

**Priority: Medium.** Not a bug in any single app, but the *lack of a stated policy* has already
caused this suite to flag one intentional design decision as a "mismatch" that may not actually
be a defect.

## The problem

Three different strategies exist across the three FUENI apps, with no documentation confirming
any of them are deliberate:

- **Patient/doctor apps:** fully responsive - adapt cleanly at 320/375/768/1600px (a few small
  cosmetic gaps found and fixed along the way, see `defects/login-phone-placeholder-clipped-320`
  etc.).
- **Admin console:** mobile (375px) is entirely **blocked** behind a static "use tablet/desktop"
  message (`defects/admin-console-mobile-not-responsive`) - deliberate and well-communicated,
  but never confirmed as the *intended* policy vs. an unfinished feature.
- **Doctor KYC/dashboard screens specifically:** fully responsive even though they're accessed
  from the same admin-adjacent "back-office" context that the admin console treats as
  desktop-only.

## Recommendation

Get an explicit, written policy per app/screen-type (e.g. "the admin console is desktop/tablet
only by design, given its data-table-heavy nature; the doctor and patient apps must be fully
responsive since real users access them from phones"). Once documented, `defects/admin-console-mobile-not-responsive`
can be closed as "working as intended" or escalated as a real gap, instead of sitting in limbo
pending confirmation - and future QA passes won't need to re-litigate the same question.
