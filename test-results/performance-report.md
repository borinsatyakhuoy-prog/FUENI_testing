# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 268ms | 670ms | 670ms | 329ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 108ms | 238ms | 238ms | 210ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 360ms | 450ms | 450ms | 436ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 236ms | 318ms | 318ms | 307ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 232ms | 334ms | 334ms | 286ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 230ms | 321ms | 321ms | 295ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 44 | 176 | 268 | 315 | 370 | 384 |
| DOM Content Loaded | 81 | 232 | 328 | 360 | 404 | 415 |
| First Contentful Paint | 460 | 592 | 670 | 700 | 745 | 756 |
| Largest Contentful Paint | 460 | 592 | 670 | 700 | 745 | 756 |
| Full page load | 82 | 234 | 329 | 361 | 405 | 416 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 42 | 48 | 108 | 110 | 112 | 113 |
| DOM Content Loaded | 95 | 122 | 200 | 266 | 353 | 375 |
| First Contentful Paint | 112 | 132 | 238 | 338 | 455 | 484 |
| Largest Contentful Paint | 112 | 132 | 238 | 338 | 455 | 484 |
| Full page load | 98 | 126 | 210 | 548 | 1137 | 1284 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 65 | 99 | 360 | 442 | 559 | 588 |
| DOM Content Loaded | 133 | 189 | 435 | 551 | 724 | 768 |
| First Contentful Paint | 144 | 204 | 450 | 559 | 729 | 772 |
| Largest Contentful Paint | 144 | 204 | 450 | 559 | 729 | 772 |
| Full page load | 133 | 190 | 436 | 552 | 725 | 768 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 73 | 126 | 236 | 250 | 258 | 260 |
| DOM Content Loaded | 114 | 194 | 306 | 335 | 382 | 394 |
| First Contentful Paint | 152 | 216 | 318 | 346 | 396 | 408 |
| Largest Contentful Paint | 152 | 216 | 318 | 346 | 396 | 408 |
| Full page load | 121 | 212 | 307 | 336 | 383 | 395 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 76 | 92 | 232 | 234 | 234 | 234 |
| DOM Content Loaded | 114 | 142 | 277 | 285 | 295 | 298 |
| First Contentful Paint | 148 | 188 | 334 | 350 | 361 | 364 |
| Largest Contentful Paint | 148 | 188 | 334 | 350 | 361 | 364 |
| Full page load | 124 | 168 | 286 | 294 | 305 | 308 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 83 | 126 | 230 | 233 | 235 | 236 |
| DOM Content Loaded | 138 | 169 | 292 | 319 | 365 | 377 |
| First Contentful Paint | 144 | 200 | 321 | 346 | 373 | 380 |
| Largest Contentful Paint | 144 | 200 | 321 | 346 | 373 | 380 |
| Full page load | 141 | 175 | 295 | 320 | 366 | 378 |
