import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Playwright wipes this directory at the start of every run. Point it
   * elsewhere so it never collides with test-results/, which holds our
   * hand-authored reports (SCRUM.md, exploratory-findings.md, Report.md). */
  outputDir: './playwright-output',
  /* Several flows (registration, password-reset) are gated by a Cloudflare
   * Turnstile check that was observed live taking 40-60s to clear - longer
   * than Playwright's 30s per-test default. A per-assertion timeout alone
   * isn't enough, since the overall test timeout still caps it. */
  timeout: 150_000,
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  /* Writes allure-results/environment.properties so the Allure report's
   * Environment widget isn't empty. */
  globalSetup: require.resolve('./tests/global-setup'),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright'],
    ['monocart-reporter', { outputFile: './monocart-report/index.html' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.FUENI_BASE_URL,

    /* Traces are recorded for every test but only kept for ones that actually fail. */
    trace: 'retain-on-failure',

    /* Capture a screenshot on failure only, for debugging/healing. */
    screenshot: 'only-on-failure',

    viewport: { width: 1600, height: 1000 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
