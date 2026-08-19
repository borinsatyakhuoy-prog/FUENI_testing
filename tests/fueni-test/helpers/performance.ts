import { Page } from '@playwright/test';

export interface PageLoadSample {
  /** Time to first byte: navigationStart -> responseStart (ms). */
  ttfb: number;
  /** navigationStart -> domContentLoadedEventEnd (ms). */
  domContentLoaded: number;
  /** navigationStart -> loadEventEnd (ms), the primary metric this suite's SLA is measured against. */
  loadEvent: number;
  /** First Contentful Paint (ms), null if the browser/page never reported one. */
  fcp: number | null;
  /** Largest Contentful Paint (ms), null if unavailable (Chromium-only; can also legitimately
   * be null if the page has no qualifying LCP candidate, e.g. an all-text login form). */
  lcp: number | null;
}

/**
 * LCP entries are only ever delivered through an active `PerformanceObserver` - unlike
 * Navigation/Paint Timing, they are never retroactively available via a plain
 * `performance.getEntriesByType('largest-contentful-paint')` call. Must be installed via
 * `page.addInitScript` (so it re-registers on every subsequent navigation, before the page's
 * own scripts run) rather than `page.evaluate` after the fact, or every sample silently comes
 * back null.
 */
export async function installPerformanceObservers(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as any).__lcp = null;
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length) {
          (window as any).__lcp = entries[entries.length - 1].startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // LCP unsupported in this browser engine (e.g. firefox/webkit) - __lcp stays null.
    }
  });
}

/**
 * Reads Navigation Timing / Paint Timing / LCP straight from the browser's own performance
 * timeline (no Lighthouse dependency - keeps this in the same Playwright process/browser
 * context as the rest of the suite, and works across repeated same-session navigations).
 * Must be called after `page.goto` has resolved and after `installPerformanceObservers` has
 * been installed on this page at least once; a short settle wait lets late LCP candidates
 * (e.g. a hero image that finishes decoding after `load`) get recorded before we read back.
 */
export async function capturePageLoadSample(page: Page): Promise<PageLoadSample> {
  await page.waitForTimeout(1000);
  return page.evaluate(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const fcpEntry = performance
      .getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint');

    return {
      ttfb: nav ? nav.responseStart - nav.startTime : -1,
      domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : -1,
      loadEvent: nav ? nav.loadEventEnd - nav.startTime : -1,
      fcp: fcpEntry ? fcpEntry.startTime : null,
      lcp: (window as any).__lcp ?? null,
    };
  });
}

export function percentile(samples: number[], p: number): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return sorted[lower];
  const weight = rank - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export interface MetricStats {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  samples: number;
}

export function summarize(values: number[]): MetricStats {
  return {
    p50: percentile(values, 50),
    p90: percentile(values, 90),
    p95: percentile(values, 95),
    p99: percentile(values, 99),
    min: Math.min(...values),
    max: Math.max(...values),
    samples: values.length,
  };
}
