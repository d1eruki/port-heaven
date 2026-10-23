import { defineConfig, devices } from "@playwright/test";

const distServerUrl = "http://127.0.0.1:4173";
const distServerCommand = process.env.CI
  ? "npm run serve:dist"
  : "npm run build && npm run serve:dist";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: distServerUrl,
    trace: { mode: "retain-on-failure", screenshots: false },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: distServerCommand,
    url: distServerUrl,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
