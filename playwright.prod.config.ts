import { defineConfig } from "@playwright/test";

const productionBaseUrl = process.env.PLAYWRIGHT_PRODUCTION_BASE_URL ?? "https://tierrechtskongress.org";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /production-smoke\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-production-smoke" }]],
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: productionBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off"
  },
  projects: [
    {
      name: "production-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1200 },
        deviceScaleFactor: 1
      }
    }
  ]
});
