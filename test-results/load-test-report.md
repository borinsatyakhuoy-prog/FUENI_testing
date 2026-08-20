# Login Page - Bounded Load/Stress Probe

Deliberately bounded (max concurrency 15) - see the spec file header for why this suite does not run an unbounded/production-grade load test against this shared staging host.

Single-request baseline (full page load): 68ms

| Concurrency | Errors | Load P50 (ms) | Load P90 (ms) | vs. baseline (P90) |
|---|---|---|---|---|
| 5 | 0/5 | 119 | 201 | 2.9x |
| 10 | 1/10 | 267 | 410 | 6.0x |

**Ramp stopped early:** P90 load time 410ms at concurrency=10 exceeded 3x the 68ms baseline.

Sample error text per step that had failures:
- concurrency=10: `Error: page.evaluate: Execution context was destroyed, most likely because of a navigation`