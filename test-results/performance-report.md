# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 0ms | 678ms | 768ms | 178ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 143ms | 276ms | 412ms | 307ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 441ms | 615ms | 615ms | 778ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 294ms | 478ms | 478ms | 498ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 235ms | 375ms | 375ms | 419ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 276ms | 387ms | 387ms | 405ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 0 | 0 | 12 | 34 | 40 |
| DOM Content Loaded | 122 | 137 | 176 | 195 | 197 | 197 |
| First Contentful Paint | 489 | 655 | 678 | 691 | 706 | 710 |
| Largest Contentful Paint | 489 | 745 | 768 | 782 | 798 | 802 |
| Full page load | 123 | 138 | 178 | 197 | 198 | 198 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 41 | 143 | 183 | 208 | 214 |
| DOM Content Loaded | 102 | 122 | 232 | 257 | 260 | 261 |
| First Contentful Paint | 140 | 164 | 276 | 298 | 305 | 307 |
| Largest Contentful Paint | 258 | 300 | 412 | 433 | 451 | 455 |
| Full page load | 145 | 178 | 307 | 402 | 572 | 614 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 57 | 126 | 441 | 569 | 720 | 758 |
| DOM Content Loaded | 110 | 202 | 565 | 654 | 775 | 805 |
| First Contentful Paint | 144 | 236 | 615 | 701 | 808 | 835 |
| Largest Contentful Paint | 144 | 236 | 615 | 701 | 808 | 835 |
| Full page load | 163 | 255 | 778 | 923 | 1050 | 1081 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 61 | 163 | 294 | 421 | 571 | 609 |
| DOM Content Loaded | 116 | 272 | 418 | 502 | 648 | 685 |
| First Contentful Paint | 184 | 331 | 478 | 557 | 706 | 743 |
| Largest Contentful Paint | 184 | 331 | 478 | 557 | 706 | 743 |
| Full page load | 203 | 340 | 498 | 580 | 730 | 768 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 63 | 94 | 235 | 309 | 411 | 436 |
| DOM Content Loaded | 126 | 194 | 368 | 455 | 562 | 589 |
| First Contentful Paint | 184 | 252 | 375 | 452 | 591 | 626 |
| Largest Contentful Paint | 184 | 252 | 375 | 452 | 591 | 626 |
| Full page load | 206 | 256 | 419 | 501 | 614 | 642 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 51 | 113 | 276 | 340 | 429 | 451 |
| DOM Content Loaded | 117 | 199 | 363 | 422 | 516 | 539 |
| First Contentful Paint | 145 | 278 | 387 | 451 | 547 | 571 |
| Largest Contentful Paint | 145 | 278 | 387 | 451 | 547 | 571 |
| Full page load | 162 | 282 | 405 | 462 | 560 | 585 |
