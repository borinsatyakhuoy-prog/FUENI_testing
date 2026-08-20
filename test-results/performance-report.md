# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 186ms | 598ms | 598ms | 268ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 101ms | 182ms | 182ms | 175ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 148ms | 222ms | 222ms | 206ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 220ms | 339ms | 339ms | 440ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 255ms | 423ms | 423ms | 383ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 253ms | 323ms | 323ms | 298ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 71 | 167 | 186 | 209 | 241 | 250 |
| DOM Content Loaded | 118 | 233 | 267 | 298 | 331 | 339 |
| First Contentful Paint | 476 | 568 | 598 | 627 | 663 | 672 |
| Largest Contentful Paint | 476 | 568 | 598 | 627 | 663 | 672 |
| Full page load | 119 | 234 | 268 | 299 | 332 | 340 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 44 | 73 | 101 | 112 | 116 | 117 |
| DOM Content Loaded | 102 | 131 | 169 | 174 | 180 | 181 |
| First Contentful Paint | 120 | 144 | 182 | 250 | 357 | 384 |
| Largest Contentful Paint | 120 | 144 | 182 | 250 | 357 | 384 |
| Full page load | 104 | 133 | 175 | 496 | 1093 | 1243 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 75 | 106 | 148 | 286 | 528 | 589 |
| DOM Content Loaded | 129 | 160 | 206 | 368 | 656 | 727 |
| First Contentful Paint | 140 | 180 | 222 | 384 | 669 | 740 |
| Largest Contentful Paint | 140 | 180 | 222 | 384 | 669 | 740 |
| Full page load | 130 | 161 | 206 | 369 | 656 | 728 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 65 | 112 | 220 | 308 | 466 | 505 |
| DOM Content Loaded | 128 | 180 | 281 | 370 | 532 | 572 |
| First Contentful Paint | 148 | 212 | 339 | 423 | 555 | 588 |
| Largest Contentful Paint | 148 | 212 | 339 | 423 | 555 | 588 |
| Full page load | 135 | 182 | 440 | 553 | 569 | 573 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 96 | 146 | 255 | 295 | 361 | 378 |
| DOM Content Loaded | 134 | 229 | 371 | 402 | 431 | 438 |
| First Contentful Paint | 192 | 288 | 423 | 468 | 497 | 504 |
| Largest Contentful Paint | 192 | 288 | 423 | 468 | 497 | 504 |
| Full page load | 145 | 234 | 383 | 411 | 441 | 449 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 77 | 134 | 253 | 310 | 390 | 410 |
| DOM Content Loaded | 132 | 201 | 294 | 347 | 437 | 460 |
| First Contentful Paint | 144 | 208 | 323 | 371 | 452 | 472 |
| Largest Contentful Paint | 144 | 208 | 323 | 371 | 452 | 472 |
| Full page load | 133 | 202 | 298 | 351 | 439 | 461 |
