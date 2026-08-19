import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { login } from '../helpers/auth';
import {
  capturePageLoadSample,
  installPerformanceObservers,
  summarize,
  MetricStats,
} from '../helpers/performance';

/**
 * Sample size per page. 15 gives a P90 with reasonable resolution (rank ~12.6) without
 * hammering the shared staging host - see test-results/exploratory-findings.md Issue 3 for why
 * this suite is deliberately conservative about repeated automated traffic against this
 * environment (Cloudflare anti-automation escalation observed after heavy repeated runs).
 */
const SAMPLES_PER_PAGE = 15;

/**
 * SLA thresholds. TTFB/FCP/LCP use Google's published Core Web Vitals "good" thresholds
 * (web.dev/vitals) - not house numbers. `loadEvent` (full page load) has no official Core Web
 * Vitals equivalent; 3000ms is a widely-used practical SLA bar for a full authenticated page
 * load and is treated as this suite's primary pass/fail metric.
 */
const SLA_MS = {
  ttfb: 800,
  fcp: 1800,
  lcp: 2500,
  loadEvent: 3000,
};

interface PageResult {
  name: string;
  url: string;
  stats: {
    ttfb: MetricStats;
    domContentLoaded: MetricStats;
    loadEvent: MetricStats;
    fcp: MetricStats;
    lcp: MetricStats | null;
  };
}

test.describe('Performance', () => {
  test('key patient pages meet the load-time SLA at P90 (falling back to P95/P99 if unmet)', async ({
    page,
  }, testInfo) => {
    test.slow(); // 4 pages x 15 loads each is well over the default per-test timeout budget.

    const results: PageResult[] = [];
    await installPerformanceObservers(page);

    async function measurePage(name: string, url: string, iterations: number) {
      const ttfb: number[] = [];
      const domContentLoaded: number[] = [];
      const loadEvent: number[] = [];
      const fcp: number[] = [];
      const lcp: number[] = [];

      await test.step(name, async () => {
        for (let i = 0; i < iterations; i++) {
          await page.goto(url, { waitUntil: 'load' });
          const sample = await capturePageLoadSample(page);
          ttfb.push(sample.ttfb);
          domContentLoaded.push(sample.domContentLoaded);
          loadEvent.push(sample.loadEvent);
          if (sample.fcp !== null) fcp.push(sample.fcp);
          if (sample.lcp !== null) lcp.push(sample.lcp);
        }
      });

      results.push({
        name,
        url,
        stats: {
          ttfb: summarize(ttfb),
          domContentLoaded: summarize(domContentLoaded),
          loadEvent: summarize(loadEvent),
          fcp: summarize(fcp),
          // LCP is Chromium-only and can legitimately have zero qualifying candidates on a
          // sparse page (e.g. the login form) - don't fabricate a stat block from an empty array.
          lcp: lcp.length ? summarize(lcp) : null,
        },
      });
    }

    // Pre-auth pages - never behind a session.
    await measurePage('Login', '/fr/login', SAMPLES_PER_PAGE);
    await measurePage('Registration (step 1)', '/fr/register', SAMPLES_PER_PAGE);

    // Authenticated pages - log in once, then repeatedly reload each while the session holds.
    await login(page);
    await measurePage('Dashboard', '/fr/dashboard', SAMPLES_PER_PAGE);
    await measurePage('Mon profil', '/fr/my-profile', SAMPLES_PER_PAGE);
    await measurePage('Connexion & Sécurité', '/fr/security', SAMPLES_PER_PAGE);
    // All 5 unimplemented routes (/appointments, /book, /documents, /faq, /support) render the
    // identical generic "Bientôt disponible" placeholder component (see
    // navigation/002_unimplemented-routes-show-placeholder.spec.ts) - one is representative of
    // all five for load-time purposes, so only one is measured here.
    await measurePage('Coming-soon placeholder (Mes RDV)', '/fr/appointments', SAMPLES_PER_PAGE);

    // Decide reporting standard: P90 is the target. If more than half the pages miss the P90
    // SLA on the primary (loadEvent) metric, this staging environment can't realistically hold
    // that bar - fall back to P95, then P99, rather than reporting a wall of red against a
    // standard the environment has already shown it can't meet. The fallback is explicit and
    // logged, never silent.
    const p90Failures = results.filter((r) => r.stats.loadEvent.p90 > SLA_MS.loadEvent).length;
    let percentileStandard: 'p90' | 'p95' | 'p99' = 'p90';
    if (p90Failures > results.length / 2) {
      const p95Failures = results.filter((r) => r.stats.loadEvent.p95 > SLA_MS.loadEvent).length;
      percentileStandard = p95Failures > results.length / 2 ? 'p99' : 'p95';
    }

    const reportLines: string[] = [];
    reportLines.push(`# Patient App - Page Load SLA Report`);
    reportLines.push('');
    reportLines.push(
      `Reporting standard used: **${percentileStandard.toUpperCase()}**` +
        (percentileStandard !== 'p90'
          ? ` (fell back from P90 - more than half the measured pages could not meet the ${SLA_MS.loadEvent}ms load-time SLA at P90 on this staging environment)`
          : '')
    );
    reportLines.push('');
    reportLines.push(
      `SLA thresholds: TTFB ≤ ${SLA_MS.ttfb}ms, FCP ≤ ${SLA_MS.fcp}ms, LCP ≤ ${SLA_MS.lcp}ms, full page load ≤ ${SLA_MS.loadEvent}ms.`
    );
    reportLines.push('');
    reportLines.push(
      `| Page | URL | Samples | TTFB (${percentileStandard}) | FCP (${percentileStandard}) | LCP (${percentileStandard}) | Load (${percentileStandard}) | Load SLA |`
    );
    reportLines.push('|---|---|---|---|---|---|---|---|');

    for (const r of results) {
      const at = (m: MetricStats) => Math.round(m[percentileStandard]);
      const loadAtStandard = r.stats.loadEvent[percentileStandard];
      const passed = loadAtStandard <= SLA_MS.loadEvent;
      reportLines.push(
        `| ${r.name} | \`${r.url}\` | ${r.stats.loadEvent.samples} | ${at(r.stats.ttfb)}ms | ${
          r.stats.fcp.samples ? `${at(r.stats.fcp)}ms` : 'n/a'
        } | ${r.stats.lcp ? `${Math.round(r.stats.lcp[percentileStandard])}ms` : 'n/a'} | ${Math.round(
          loadAtStandard
        )}ms | ${passed ? '✅ PASS' : '❌ FAIL'} |`
      );
    }

    reportLines.push('');
    reportLines.push(`## Full distribution (min / P50 / P90 / P95 / P99 / max), in ms`);
    reportLines.push('');
    for (const r of results) {
      reportLines.push(`### ${r.name}`);
      reportLines.push('');
      reportLines.push('| Metric | min | P50 | P90 | P95 | P99 | max |');
      reportLines.push('|---|---|---|---|---|---|---|');
      const row = (label: string, s: MetricStats | null) =>
        s
          ? `| ${label} | ${Math.round(s.min)} | ${Math.round(s.p50)} | ${Math.round(
              s.p90
            )} | ${Math.round(s.p95)} | ${Math.round(s.p99)} | ${Math.round(s.max)} |`
          : `| ${label} | n/a | n/a | n/a | n/a | n/a | n/a |`;
      reportLines.push(row('TTFB', r.stats.ttfb));
      reportLines.push(row('DOM Content Loaded', r.stats.domContentLoaded));
      reportLines.push(row('First Contentful Paint', r.stats.fcp.samples ? r.stats.fcp : null));
      reportLines.push(row('Largest Contentful Paint', r.stats.lcp));
      reportLines.push(row('Full page load', r.stats.loadEvent));
      reportLines.push('');
    }

    const reportDir = path.resolve(__dirname, '..', '..', '..', 'test-results');
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'performance-report.md'), reportLines.join('\n'));
    fs.writeFileSync(
      path.join(reportDir, 'performance-results.json'),
      JSON.stringify({ percentileStandard, sla: SLA_MS, results }, null, 2)
    );
    await testInfo.attach('performance-report.md', {
      path: path.join(reportDir, 'performance-report.md'),
      contentType: 'text/markdown',
    });

    // Soft-assert per page at the chosen standard so one slow page doesn't hide the others'
    // results in the test output - every page's SLA check still runs and reports.
    for (const r of results) {
      expect
        .soft(r.stats.loadEvent[percentileStandard], `${r.name} full page load (${percentileStandard})`)
        .toBeLessThanOrEqual(SLA_MS.loadEvent);
    }
  });
});
