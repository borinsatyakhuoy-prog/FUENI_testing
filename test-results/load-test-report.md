# Login Page - Bounded Load/Stress Probe

Deliberately bounded (max concurrency 15) - see the spec file header for why this suite does not run an unbounded/production-grade load test against this shared staging host.

Single-request baseline (full page load): 95ms

| Concurrency | Errors | Load P50 (ms) | Load P90 (ms) | vs. baseline (P90) |
|---|---|---|---|---|
| 5 | 5/5 | n/a | n/a | n/a |

**Ramp stopped early:** error rate 100% at concurrency=5 exceeded the 10% stop threshold.

Sample error text per step that had failures:
- concurrency=5: `Error: page.evaluate: Execution context was destroyed, most likely because of a navigation`