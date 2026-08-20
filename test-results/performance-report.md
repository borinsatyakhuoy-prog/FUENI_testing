# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 0ms | 675ms | 766ms | 182ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 47ms | 184ms | 311ms | 214ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 450ms | 608ms | 608ms | 638ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 396ms | 517ms | 517ms | 529ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 240ms | 375ms | 375ms | 393ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 240ms | 357ms | 357ms | 372ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 0 | 0 | 12 | 34 | 39 |
| DOM Content Loaded | 120 | 152 | 181 | 182 | 183 | 183 |
| First Contentful Paint | 486 | 621 | 675 | 707 | 764 | 778 |
| Largest Contentful Paint | 559 | 716 | 766 | 794 | 845 | 858 |
| Full page load | 121 | 153 | 182 | 183 | 185 | 185 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 36 | 47 | 72 | 110 | 120 |
| DOM Content Loaded | 70 | 107 | 139 | 164 | 184 | 189 |
| First Contentful Paint | 97 | 142 | 184 | 202 | 218 | 222 |
| Largest Contentful Paint | 232 | 272 | 311 | 328 | 344 | 348 |
| Full page load | 113 | 153 | 214 | 418 | 748 | 830 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 56 | 146 | 450 | 514 | 528 | 531 |
| DOM Content Loaded | 112 | 301 | 568 | 620 | 626 | 628 |
| First Contentful Paint | 144 | 356 | 608 | 660 | 666 | 668 |
| Largest Contentful Paint | 144 | 356 | 608 | 660 | 666 | 668 |
| Full page load | 164 | 375 | 638 | 677 | 683 | 685 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 65 | 144 | 396 | 530 | 729 | 779 |
| DOM Content Loaded | 112 | 232 | 473 | 631 | 859 | 916 |
| First Contentful Paint | 148 | 275 | 517 | 673 | 900 | 957 |
| Largest Contentful Paint | 148 | 275 | 517 | 673 | 900 | 957 |
| Full page load | 162 | 322 | 529 | 686 | 911 | 967 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 66 | 144 | 240 | 306 | 413 | 440 |
| DOM Content Loaded | 118 | 265 | 336 | 461 | 690 | 747 |
| First Contentful Paint | 145 | 301 | 375 | 441 | 559 | 588 |
| Largest Contentful Paint | 145 | 301 | 375 | 441 | 559 | 588 |
| Full page load | 197 | 322 | 393 | 509 | 721 | 774 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 64 | 127 | 240 | 399 | 665 | 732 |
| DOM Content Loaded | 107 | 193 | 326 | 478 | 736 | 800 |
| First Contentful Paint | 131 | 247 | 357 | 517 | 788 | 856 |
| Largest Contentful Paint | 131 | 247 | 357 | 517 | 788 | 856 |
| Full page load | 154 | 249 | 372 | 529 | 793 | 859 |
