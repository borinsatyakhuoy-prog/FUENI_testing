# Login Page - Bounded Load/Stress Probe

Deliberately bounded (max concurrency 15) - see the spec file header for why this suite does not run an unbounded/production-grade load test against this shared staging host.

Single-request baseline (full page load): 176ms

| Concurrency | Errors | Load P50 (ms) | Load P90 (ms) | vs. baseline (P90) |
|---|---|---|---|---|
| 5 | 0/5 | 304 | 363 | 2.1x |
| 10 | 4/10 | 537 | 643 | 3.7x |

**Ramp stopped early:** error rate 40% at concurrency=10 exceeded the 10% stop threshold.

Sample error text per step that had failures:
- concurrency=10: `Error: page.evaluate: Execution context was destroyed, most likely because of a navigation`