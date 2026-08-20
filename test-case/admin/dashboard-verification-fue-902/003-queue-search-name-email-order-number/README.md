# 003 - Queue - search by name, email, order number

**Result:** ✅ PASS

## How to test
1. Open the verification queue.
2. Type a doctor's first name into the search box; observe the result.
3. Clear and type a doctor's full email; observe the result.
4. Clear and type a doctor's medical order number; observe the result.

## Expected
The search box should match against name, email, and order number, narrowing the list
appropriately for each.

## Actual
Matches expected on all three modes, each tested independently against a different record:
- `Tola` → narrowed to exactly "Tola Tola" (1 of 21 results).
- `both.chan@allweb.com.kh` → narrowed to exactly "Both CHAN" (1 of 21 results).
- `ONMS-2024-84722` → narrowed to exactly "devops devops" (1 of 21 results).

Each search updates the URL to `?q=<term>` and fires a scoped API request
(`/api/v1/admin/doctors/verifications?q=...&page=0&size=10`), confirmed via the network log. See
`003-search-by-order-number.png`.

## Browser(s) tested
Chromium only, via interactive Playwright browser automation (network request inspection) - not
yet cross-browser tested.

## Improvement suggestion
None needed - all three documented search modes work correctly and consistently. Good candidate
for an automated test given the deterministic, easily-assertable results.
