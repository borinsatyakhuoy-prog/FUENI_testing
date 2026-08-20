# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 0ms | 611ms | 694ms | 135ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 83ms | 214ms | 333ms | 233ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 343ms | 529ms | 529ms | 643ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 411ms | 557ms | 557ms | 589ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 255ms | 410ms | 410ms | 423ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 277ms | 423ms | 423ms | 427ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 0 | 0 | 11 | 32 | 37 |
| DOM Content Loaded | 95 | 124 | 134 | 136 | 138 | 138 |
| First Contentful Paint | 494 | 577 | 611 | 618 | 627 | 629 |
| Largest Contentful Paint | 617 | 659 | 694 | 699 | 704 | 705 |
| Full page load | 96 | 125 | 135 | 137 | 139 | 139 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 40 | 83 | 88 | 95 | 97 |
| DOM Content Loaded | 86 | 120 | 177 | 188 | 190 | 191 |
| First Contentful Paint | 123 | 164 | 214 | 223 | 225 | 225 |
| Largest Contentful Paint | 221 | 272 | 333 | 338 | 340 | 341 |
| Full page load | 130 | 167 | 233 | 318 | 470 | 508 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 58 | 89 | 343 | 461 | 607 | 644 |
| DOM Content Loaded | 153 | 192 | 492 | 576 | 708 | 741 |
| First Contentful Paint | 155 | 220 | 529 | 613 | 745 | 778 |
| Largest Contentful Paint | 155 | 220 | 529 | 613 | 745 | 778 |
| Full page load | 193 | 237 | 643 | 724 | 775 | 788 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 68 | 175 | 411 | 464 | 498 | 507 |
| DOM Content Loaded | 163 | 275 | 504 | 560 | 594 | 603 |
| First Contentful Paint | 220 | 321 | 557 | 615 | 645 | 653 |
| Largest Contentful Paint | 220 | 321 | 557 | 615 | 645 | 653 |
| Full page load | 225 | 337 | 589 | 651 | 656 | 657 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 70 | 110 | 255 | 299 | 310 | 313 |
| DOM Content Loaded | 157 | 231 | 367 | 456 | 541 | 562 |
| First Contentful Paint | 198 | 266 | 410 | 505 | 603 | 628 |
| Largest Contentful Paint | 198 | 266 | 410 | 505 | 603 | 628 |
| Full page load | 213 | 284 | 423 | 519 | 609 | 632 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 63 | 118 | 277 | 313 | 323 | 325 |
| DOM Content Loaded | 125 | 217 | 383 | 414 | 414 | 414 |
| First Contentful Paint | 174 | 250 | 423 | 463 | 475 | 478 |
| Largest Contentful Paint | 174 | 250 | 423 | 463 | 475 | 478 |
| Full page load | 180 | 265 | 427 | 466 | 477 | 480 |
