# Patient App - Page Load SLA Report

Reporting standard used: **P90**

SLA thresholds: TTFB ≤ 800ms, FCP ≤ 1800ms, LCP ≤ 2500ms, full page load ≤ 3000ms.

| Page | URL | Samples | TTFB (p90) | FCP (p90) | LCP (p90) | Load (p90) | Load SLA |
|---|---|---|---|---|---|---|---|
| Login | `/fr/login` | 15 | 0ms | 1449ms | 1680ms | 634ms | ✅ PASS |
| Registration (step 1) | `/fr/register` | 15 | 168ms | 352ms | 706ms | 467ms | ✅ PASS |
| Dashboard | `/fr/dashboard` | 15 | 282ms | 442ms | 442ms | 644ms | ✅ PASS |
| Mon profil | `/fr/my-profile` | 15 | 668ms | 971ms | 971ms | 983ms | ✅ PASS |
| Connexion & Sécurité | `/fr/security` | 15 | 329ms | 528ms | 528ms | 550ms | ✅ PASS |
| Coming-soon placeholder (Mes RDV) | `/fr/appointments` | 15 | 213ms | 409ms | 409ms | 437ms | ✅ PASS |

## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms

### Login

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 0 | 0 | 15 | 44 | 51 |
| DOM Content Loaded | 156 | 278 | 626 | 849 | 943 | 966 |
| First Contentful Paint | 544 | 1057 | 1449 | 1610 | 1764 | 1803 |
| Largest Contentful Paint | 928 | 1230 | 1680 | 1865 | 2040 | 2084 |
| Full page load | 158 | 280 | 634 | 859 | 949 | 971 |

### Registration (step 1)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 0 | 96 | 168 | 190 | 223 | 231 |
| DOM Content Loaded | 102 | 216 | 321 | 344 | 360 | 364 |
| First Contentful Paint | 160 | 290 | 352 | 386 | 445 | 460 |
| Largest Contentful Paint | 323 | 479 | 706 | 859 | 1125 | 1192 |
| Full page load | 176 | 307 | 467 | 564 | 738 | 782 |

### Dashboard

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 63 | 189 | 282 | 456 | 744 | 816 |
| DOM Content Loaded | 129 | 248 | 399 | 571 | 844 | 912 |
| First Contentful Paint | 180 | 298 | 442 | 611 | 888 | 957 |
| Largest Contentful Paint | 180 | 298 | 442 | 611 | 888 | 957 |
| Full page load | 184 | 302 | 644 | 816 | 934 | 964 |

### Mon profil

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 80 | 165 | 668 | 755 | 773 | 778 |
| DOM Content Loaded | 121 | 290 | 898 | 1501 | 2547 | 2809 |
| First Contentful Paint | 183 | 365 | 971 | 1533 | 2494 | 2734 |
| Largest Contentful Paint | 183 | 365 | 971 | 1533 | 2494 | 2734 |
| Full page load | 187 | 475 | 983 | 1601 | 2660 | 2925 |

### Connexion & Sécurité

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 71 | 140 | 329 | 435 | 625 | 673 |
| DOM Content Loaded | 142 | 223 | 449 | 550 | 700 | 738 |
| First Contentful Paint | 199 | 309 | 528 | 630 | 784 | 823 |
| Largest Contentful Paint | 199 | 309 | 528 | 630 | 784 | 823 |
| Full page load | 232 | 317 | 550 | 642 | 791 | 828 |

### Coming-soon placeholder (Mes RDV)

| Metric | min | P50 | P90 | P95 | P99 | max |
|---|---|---|---|---|---|---|
| TTFB | 64 | 92 | 213 | 272 | 282 | 285 |
| DOM Content Loaded | 119 | 166 | 335 | 372 | 382 | 385 |
| First Contentful Paint | 144 | 205 | 409 | 424 | 434 | 436 |
| Largest Contentful Paint | 144 | 205 | 409 | 424 | 434 | 436 |
| Full page load | 159 | 214 | 437 | 440 | 442 | 442 |
