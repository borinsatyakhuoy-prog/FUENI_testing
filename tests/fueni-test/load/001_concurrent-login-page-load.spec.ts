import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { installPerformanceObservers, capturePageLoadSample, summarize } from '../helpers/performance';

/**
 * Deliberately bounded load/stress probe against this shared staging host - NOT a
 * production-grade load-testing tool (no k6/artillery in this repo). Kept small and capped on
 * purpose: `test-results/Report.md` Issue 3 already documents that this exact host escalates its
 * Cloudflare anti-automation posture after heavy repeated automated traffic, to the point of
 * blocking even plain, non-Turnstile flows for an unmeasured cool-down period. Deliberately
 * hammering it further risks tripping that same escalation harder and locking the shared test
 * account out of Turnstile-gated flows other sessions depend on.
 *
 * Scope, by design:
 * - Only ever hits the stateless, pre-auth `/fr/login` page - never an authenticated route or a
 *   Turnstile-gated one, so this can never burn the shared account's rate-limit/attempt budget.
 * - Concurrency is capped at MAX_CONCURRENCY regardless of what the ramp finds - this is a
 *   ceiling chosen for safety against this specific shared host, not a "how far can it go"
 *   ceiling. Raise it only with the infra/FUENI team's awareness.
 * - Stops the ramp early the moment error-rate or P90 degradation crosses the stop conditions
 *   below, rather than always running to the cap.
 *
 * Improvement note: this probe can't distinguish real server-side throttling from local
 * browser-process contention on the machine running the suite. If real capacity numbers are ever
 * needed, use dedicated load-testing tooling (k6/artillery) from a separate process instead - see
 * defects/improvement/load-testing-tooling-gap.md.
 */
const MAX_CONCURRENCY = 15;
const RAMP_STEPS = [5, 10, MAX_CONCURRENCY];
const DEGRADATION_MULTIPLE = 3; // stop the ramp if P90 load time exceeds baseline x this
const ERROR_RATE_STOP = 0.1; // stop the ramp if more than 10% of requests in a step error

interface StepResult {
  concurrency: number;
  errors: number;
  attempted: number;
  loadP90: number;
  loadP50: number;
  sampleError: string | null;
}

async function loadOnce(page: import('@playwright/test').Page): Promise<number> {
  await page.goto('/fr/login', { waitUntil: 'load' });
  const sample = await capturePageLoadSample(page);
  return sample.loadEvent;
}

test.describe('Load/stress - concurrent login page load', () => {
  test('login page holds up under bounded concurrent load, stopping the ramp early on real degradation', async ({
    browser,
  }, testInfo) => {
    test.slow();

    // Baseline: single sequential load, same page, same pattern as the performance suite.
    const baselineContext = await browser.newContext();
    const baselinePage = await baselineContext.newPage();
    await installPerformanceObservers(baselinePage);
    const baselineLoad = await loadOnce(baselinePage);
    await baselineContext.close();

    const stepResults: StepResult[] = [];
    let stoppedEarly: string | null = null;

    for (const concurrency of RAMP_STEPS) {
      const contexts = await Promise.all(
        Array.from({ length: concurrency }, () => browser.newContext())
      );
      const pages = await Promise.all(contexts.map((c) => c.newPage()));
      await Promise.all(pages.map((p) => installPerformanceObservers(p)));

      const outcomes = await Promise.all(
        pages.map(async (p) => {
          try {
            const loadEvent = await loadOnce(p);
            return { ok: true as const, loadEvent };
          } catch (err) {
            return { ok: false as const, error: String(err) };
          }
        })
      );

      await Promise.all(contexts.map((c) => c.close()));

      const failures = outcomes.filter((o) => !o.ok) as { ok: false; error: string }[];
      const errors = failures.length;
      const loadTimes = outcomes.filter((o) => o.ok).map((o) => (o as { loadEvent: number }).loadEvent);
      const stats = loadTimes.length ? summarize(loadTimes) : null;

      stepResults.push({
        concurrency,
        errors,
        attempted: concurrency,
        loadP90: stats ? stats.p90 : -1,
        loadP50: stats ? stats.p50 : -1,
        sampleError: failures.length ? failures[0].error : null,
      });

      const errorRate = errors / concurrency;
      if (errorRate > ERROR_RATE_STOP) {
        stoppedEarly = `error rate ${(errorRate * 100).toFixed(0)}% at concurrency=${concurrency} exceeded the ${ERROR_RATE_STOP * 100}% stop threshold`;
        break;
      }
      if (stats && stats.p90 > baselineLoad * DEGRADATION_MULTIPLE) {
        stoppedEarly = `P90 load time ${Math.round(stats.p90)}ms at concurrency=${concurrency} exceeded ${DEGRADATION_MULTIPLE}x the ${Math.round(baselineLoad)}ms baseline`;
        break;
      }
    }

    const reportLines: string[] = [];
    reportLines.push('# Login Page - Bounded Load/Stress Probe');
    reportLines.push('');
    reportLines.push(
      `Deliberately bounded (max concurrency ${MAX_CONCURRENCY}) - see the spec file header for ` +
        'why this suite does not run an unbounded/production-grade load test against this shared ' +
        'staging host.'
    );
    reportLines.push('');
    reportLines.push(`Single-request baseline (full page load): ${Math.round(baselineLoad)}ms`);
    reportLines.push('');
    reportLines.push('| Concurrency | Errors | Load P50 (ms) | Load P90 (ms) | vs. baseline (P90) |');
    reportLines.push('|---|---|---|---|---|');
    for (const r of stepResults) {
      const ratio = r.loadP90 >= 0 ? (r.loadP90 / baselineLoad).toFixed(1) + 'x' : 'n/a';
      reportLines.push(
        `| ${r.concurrency} | ${r.errors}/${r.attempted} | ${r.loadP90 >= 0 ? Math.round(r.loadP50) : 'n/a'} | ${
          r.loadP90 >= 0 ? Math.round(r.loadP90) : 'n/a'
        } | ${ratio} |`
      );
    }
    reportLines.push('');
    reportLines.push(
      stoppedEarly
        ? `**Ramp stopped early:** ${stoppedEarly}.`
        : `Ramp completed all steps up to the ${MAX_CONCURRENCY}-concurrency safety cap without ` +
            'crossing either stop condition.'
    );
    const withErrors = stepResults.filter((r) => r.sampleError);
    if (withErrors.length) {
      reportLines.push('');
      reportLines.push('Sample error text per step that had failures:');
      for (const r of withErrors) {
        reportLines.push(`- concurrency=${r.concurrency}: \`${r.sampleError}\``);
      }
    }

    const reportDir = path.resolve(__dirname, '..', '..', '..', 'test-results');
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'load-test-report.md'), reportLines.join('\n'));
    await testInfo.attach('load-test-report.md', {
      path: path.join(reportDir, 'load-test-report.md'),
      contentType: 'text/markdown',
    });

    // This is a probe, not a hard pass/fail gate - report what was found rather than fail the
    // suite over a shared staging host's behavior under load. Soft-assert only that we got at
    // least one clean step, so a total outage still surfaces as a failure.
    expect.soft(stepResults.some((r) => r.errors === 0), 'at least one ramp step completed error-free').toBeTruthy();
  });
});
