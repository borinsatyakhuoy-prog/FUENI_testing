# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 131ms | 520ms | 520ms | 182ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 205ms | 301ms | 301ms | 313ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 452ms | 598ms | 598ms | 605ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 382ms | 498ms | 498ms | 457ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 262ms | 383ms | 383ms | 355ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 140ms | 228ms | 228ms | 201ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 43 | 104 | 131 | 147 | 156 | 158 |
| DOM Content Loaded | 99 | 162 | 181 | 190 | 196 | 197 |
| First Contentful Paint | 480 | 500 | 520 | 527 | 541 | 544 |
| Largest Contentful Paint | 480 | 500 | 520 | 527 | 541 | 544 |
| Full page load | 100 | 162 | 182 | 191 | 197 | 198 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 41 | 50 | 205 | 235 | 276 | 287 |
| DOM Content Loaded | 83 | 124 | 248 | 280 | 317 | 326 |
| First Contentful Paint | 100 | 172 | 301 | 332 | 370 | 380 |
| Largest Contentful Paint | 100 | 172 | 301 | 332 | 370 | 380 |
| Full page load | 83 | 137 | 313 | 415 | 556 | 591 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 66 | 139 | 452 | 523 | 525 | 526 |
| DOM Content Loaded | 110 | 196 | 601 | 633 | 640 | 642 |
| First Contentful Paint | 128 | 220 | 598 | 630 | 680 | 692 |
| Largest Contentful Paint | 128 | 220 | 598 | 630 | 680 | 692 |
| Full page load | 111 | 198 | 605 | 633 | 641 | 643 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 77 | 121 | 382 | 426 | 480 | 493 |
| DOM Content Loaded | 130 | 184 | 443 | 481 | 539 | 554 |
| First Contentful Paint | 148 | 216 | 498 | 529 | 554 | 560 |
| Largest Contentful Paint | 148 | 216 | 498 | 529 | 554 | 560 |
| Full page load | 130 | 219 | 457 | 489 | 541 | 554 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 88 | 166 | 262 | 279 | 282 | 283 |
| DOM Content Loaded | 164 | 256 | 354 | 390 | 436 | 447 |
| First Contentful Paint | 200 | 292 | 383 | 414 | 448 | 456 |
| Largest Contentful Paint | 200 | 292 | 383 | 414 | 448 | 456 |
| Full page load | 177 | 276 | 355 | 392 | 438 | 449 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 76 | 97 | 140 | 152 | 160 | 162 |
| DOM Content Loaded | 114 | 132 | 196 | 205 | 210 | 211 |
| First Contentful Paint | 152 | 176 | 228 | 234 | 245 | 248 |
| Largest Contentful Paint | 152 | 176 | 228 | 234 | 245 | 248 |
| Full page load | 118 | 139 | 201 | 209 | 211 | 211 |
