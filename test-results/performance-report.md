# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 376ms | 808ms | 808ms | 468ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 144ms | 298ms | 298ms | 251ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 321ms | 406ms | 406ms | 387ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 396ms | 530ms | 530ms | 499ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 227ms | 330ms | 330ms | 302ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 218ms | 290ms | 290ms | 266ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 48 | 185 | 376 | 445 | 454 | 456 |
| DOM Content Loaded | 83 | 269 | 467 | 502 | 518 | 521 |
| First Contentful Paint | 440 | 620 | 808 | 851 | 887 | 896 |
| Largest Contentful Paint | 440 | 620 | 808 | 851 | 887 | 896 |
| Full page load | 83 | 269 | 468 | 504 | 520 | 525 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 36 | 83 | 144 | 169 | 209 | 219 |
| DOM Content Loaded | 95 | 151 | 206 | 224 | 255 | 263 |
| First Contentful Paint | 128 | 208 | 298 | 328 | 357 | 364 |
| Largest Contentful Paint | 128 | 208 | 298 | 328 | 357 | 364 |
| Full page load | 104 | 162 | 251 | 449 | 776 | 858 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 78 | 123 | 321 | 367 | 415 | 427 |
| DOM Content Loaded | 136 | 190 | 383 | 429 | 477 | 489 |
| First Contentful Paint | 172 | 220 | 406 | 471 | 529 | 544 |
| Largest Contentful Paint | 172 | 220 | 406 | 471 | 529 | 544 |
| Full page load | 144 | 190 | 387 | 435 | 483 | 495 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 86 | 175 | 396 | 489 | 659 | 701 |
| DOM Content Loaded | 151 | 222 | 498 | 595 | 733 | 767 |
| First Contentful Paint | 180 | 272 | 530 | 626 | 765 | 800 |
| Largest Contentful Paint | 180 | 272 | 530 | 626 | 765 | 800 |
| Full page load | 154 | 250 | 499 | 596 | 733 | 768 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 77 | 113 | 227 | 239 | 240 | 240 |
| DOM Content Loaded | 123 | 171 | 266 | 285 | 297 | 300 |
| First Contentful Paint | 176 | 228 | 330 | 346 | 364 | 368 |
| Largest Contentful Paint | 176 | 228 | 330 | 346 | 364 | 368 |
| Full page load | 134 | 182 | 302 | 312 | 315 | 316 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 105 | 148 | 218 | 267 | 357 | 379 |
| DOM Content Loaded | 155 | 185 | 263 | 317 | 409 | 431 |
| First Contentful Paint | 172 | 228 | 290 | 344 | 440 | 464 |
| Largest Contentful Paint | 172 | 228 | 290 | 344 | 440 | 464 |
| Full page load | 158 | 190 | 266 | 319 | 412 | 436 |
