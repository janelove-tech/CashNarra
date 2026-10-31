import { defineConfig } from "@playwright/test";

// The CI smoke suite uses Playwright's bundled Chromium and an already built app.
// Local development keeps the existing Edge/dev-server workflow unchanged.
const ciSmoke = process.env.CASHNARRA_CI_BROWSER_SMOKE === "1";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3100",
    ...(ciSmoke ? {} : { channel: "msedge" as const }),
    headless: true,
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: ciSmoke
      ? "npm run start -- --port 3100"
      : "npm run dev -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !ciSmoke,
    timeout: 120000,
  },
});
