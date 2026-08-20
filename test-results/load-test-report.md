# Login Page - Bounded Load/Stress Probe

Deliberately bounded (max concurrency 15) - see the spec file header for why this suite does not run an unbounded/production-grade load test against this shared staging host.

Single-request baseline (full page load): 99ms

| Concurrency | Errors | Load P50 (ms) | Load P90 (ms) | vs. baseline (P90) |
|---|---|---|---|---|
| 5 | 0/5 | 251 | 368 | 3.7x |

**Ramp stopped early:** P90 load time 368ms at concurrency=5 exceeded 3x the 99ms baseline.