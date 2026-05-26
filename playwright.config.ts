import { defineConfig, devices } from "@playwright/test";

/**
 * E2E testleri (public sayfalar + auth gating + sitemap/robots).
 * Çalıştır: `npm run test:e2e` (önce `npx playwright install chromium`).
 * Var olan dev sunucu kullanılır; yoksa otomatik başlatılır.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: { timeout: 20_000 },
  // Dev modunda sayfalar ilk istekte derlendiği için tek tek (seri) çalıştır.
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE || "http://localhost:3000",
    trace: "on-first-retry",
    navigationTimeout: 30_000,
  },
  webServer: process.env.E2E_BASE
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
