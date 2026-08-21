# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 267ms | 650ms | 650ms | 318ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 124ms | 320ms | 320ms | 259ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 629ms | 1011ms | 1011ms | 1185ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 311ms | 398ms | 398ms | 454ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 340ms | 442ms | 442ms | 450ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 597ms | 685ms | 685ms | 644ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 61 | 158 | 267 | 325 | 408 | 429 |
| DOM Content Loaded | 95 | 206 | 313 | 372 | 453 | 473 |
| First Contentful Paint | 452 | 548 | 650 | 704 | 794 | 816 |
| Largest Contentful Paint | 452 | 548 | 650 | 704 | 794 | 816 |
| Full page load | 95 | 207 | 318 | 373 | 454 | 474 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 38 | 46 | 124 | 173 | 225 | 238 |
| DOM Content Loaded | 89 | 117 | 204 | 233 | 278 | 289 |
| First Contentful Paint | 120 | 156 | 320 | 398 | 425 | 432 |
| Largest Contentful Paint | 120 | 156 | 320 | 398 | 425 | 432 |
| Full page load | 95 | 127 | 259 | 427 | 667 | 727 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 67 | 165 | 629 | 1459 | 2907 | 3269 |
| DOM Content Loaded | 115 | 204 | 1184 | 2099 | 3077 | 3322 |
| First Contentful Paint | 164 | 256 | 1011 | 1896 | 3061 | 3352 |
| Largest Contentful Paint | 164 | 256 | 1011 | 1896 | 3061 | 3352 |
| Full page load | 121 | 211 | 1185 | 2099 | 3078 | 3323 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 75 | 140 | 311 | 479 | 671 | 719 |
| DOM Content Loaded | 131 | 214 | 369 | 539 | 729 | 776 |
| First Contentful Paint | 152 | 244 | 398 | 570 | 767 | 816 |
| Largest Contentful Paint | 152 | 244 | 398 | 570 | 767 | 816 |
| Full page load | 132 | 215 | 454 | 558 | 734 | 778 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 75 | 130 | 340 | 1108 | 2513 | 2864 |
| DOM Content Loaded | 129 | 187 | 404 | 1167 | 2574 | 2925 |
| First Contentful Paint | 148 | 224 | 442 | 1200 | 2595 | 2944 |
| Largest Contentful Paint | 148 | 224 | 442 | 1200 | 2595 | 2944 |
| Full page load | 130 | 188 | 450 | 1221 | 2585 | 2927 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 65 | 152 | 597 | 2569 | 5999 | 6856 |
| DOM Content Loaded | 107 | 196 | 641 | 2615 | 6043 | 6900 |
| First Contentful Paint | 144 | 228 | 685 | 2638 | 6083 | 6944 |
| Largest Contentful Paint | 144 | 228 | 685 | 2638 | 6083 | 6944 |
| Full page load | 114 | 202 | 644 | 2617 | 6048 | 6906 |
