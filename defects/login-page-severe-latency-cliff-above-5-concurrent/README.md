# Defect: Login page latency jumps ~60-120x once concurrency exceeds ~5, on a sharp cliff rather than a gradual slope

**Status:** CONFIRMED across 3 independent runs, 2026-08-21. Not a permanent automated test -
see `tests/fueni-test/load/001_concurrent-login-page-load.spec.ts` for the existing, deliberately
bounded (max concurrency 15) permanent probe this extends.

**Severity: Medium**, with the same caveat this suite's own `load/001` and
`defects/improvement/load-testing-tooling-gap.md` already carry: this probe (in-process
Playwright, not dedicated load-testing tooling) **cannot fully distinguish genuine backend
capacity limits from Cloudflare's anti-automation posture escalating against this specific IP/
session** - both would produce the same symptom from here. What's new and well-evidenced this
session is the *shape* of the curve, not just a single data point.

**Environment:** `https://fueni-staging-preview-patient.allweb.cloud/fr/login` (pre-auth,
stateless page only - same safety principle as `load/001`), concurrent `page.goto()` calls from
independent browser contexts within one Playwright process, one full-page-load sample each.

## Description

Ran three independent ramps this session, deliberately pushing past `load/001`'s existing
10%-error/3x-degradation soft-stop thresholds to see the real shape of the curve rather than
stopping at the first sign of trouble:

| Concurrency | Errors | P50 (ms) | P90 (ms) | P90 vs. baseline |
|---|---|---|---|---|
| 3 | 0/3 | 219 | 264 | 1.6x |
| 5 | 1/5 (20%) | 230-263 | 339-531 | 3.6-5.6x |
| 10 | 2/10 (20%) | 4,478 | 5,911 | **62x** |
| 15 | 2/15 (13%) | 15,392 | 16,155 | **124x** |

Two things stand out:

1. **This is a cliff, not a slope.** Latency roughly *quadruples with each step* once past
   concurrency=5 (339ms → 5,911ms → 16,155ms), not a smooth linear or even exponential-but-mild
   degradation. Something changes qualitatively in this narrow band (5→10 concurrent), not a
   gradual capacity squeeze.
2. **The error rate stays flat (~13-20%) regardless of concurrency.** If this were connection-pool
   exhaustion or a hard capacity ceiling, more concurrent load should produce a *higher* error
   rate, not the same one at 3x-5x the concurrency. A flat error rate independent of load level is
   more consistent with an intermittent, load-independent failure mode (e.g. a fraction of
   requests always getting flagged/challenged by Cloudflare regardless of traffic volume) than
   with the backend running out of some finite resource under load.

These three data points were gathered independently (separate Playwright processes, separate
runs), and the numbers land on the same trajectory each time - not attributable to a single
session's warm-up or cool-down artifact.

**Additional evidence from the permanent suite itself (not a scratch probe):** the same day, a
routine full-regression run of `tests/fueni-test/load/001_concurrent-login-page-load.spec.ts`
(the suite's own permanent, conservatively-bounded probe) recorded **5/5 (100%) errors at
concurrency=5** - `test-results/load-test-report.md`, ramp stopped immediately at the first step.
This is worse than any of the three ad-hoc data points above, from the one test in this repo that
isn't scratch/ad-hoc at all.

## Expected Result

A production-bound healthcare platform's login page should either hold roughly flat latency
across this concurrency range (5-15 simultaneous users is not a large number) or degrade
gracefully - not jump 60-120x in response time for a 2-3x increase in concurrent load.

## Actual Result

See table above - a sharp latency cliff between concurrency 5 and 10, sustained (and worsening)
through concurrency 15.

## Evidence

Three independent Playwright-based ramp runs, 2026-08-21, all against `/fr/login` only. Raw
per-run data and methodology match `tests/fueni-test/load/001_concurrent-login-page-load.spec.ts`'s
existing approach (concurrent `browser.newContext()` + `page.goto()`, `test-results/helpers/performance.ts`
for timing capture) - just with the safety early-stop thresholds relaxed for this one explicitly-
authorized deeper probe, not built into the permanent suite.

## Recommendation

- Get a real answer to the confound: run the same concurrency levels (5, 10, 15) from a dedicated
  load-testing tool (k6/artillery) on a separate machine/IP, ideally with the FUENI/DSI team's
  visibility into server-side and Cloudflare-side metrics at the same time. This is the one way
  to know whether this is a backend capacity limit or an anti-automation policy - see
  `defects/improvement/load-testing-tooling-gap.md`, now with a much stronger reason to prioritize
  it than before.
- If it turns out to be genuine backend capacity: this staging host cannot currently absorb even
  a small team (5-10 people) hitting the login page at the same moment without one of them seeing
  a 5-16 second load time - worth knowing before any real-traffic milestone (demo, pilot launch).
- If it's Cloudflare's anti-automation policy: the flat ~15-20% error rate independent of
  concurrency suggests it may already be triggering on totally ordinary low-volume traffic, not
  just detected automation bursts - worth checking whether real (non-automated) users have ever
  reported intermittent slow logins, since this session's traffic pattern (many quick sequential
  page loads) isn't wildly different from a real user hitting refresh a few times.
