import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--disable-web-security"]
        }
      },
    },
    {
      name: "desktop-mac-safari",
      use: { 
        ...devices["Desktop Safari"],
      },
    },
    {
      name: "desktop-firefox",
      use: { 
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "mobile-iphone",
      testMatch: /.*responsive\.spec\.ts/,
      use: { 
        ...devices["iPhone 14"],
      },
    },
    {
      name: "mobile-chrome",
      testMatch: /.*responsive\.spec\.ts/,
      use: { 
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        launchOptions: {
          args: ["--disable-web-security"]
        }
      },
    },
    {
      name: "tablet",
      testMatch: /.*responsive\.spec\.ts/,
      use: { 
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
        isMobile: true,
        hasTouch: true,
        userAgent: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        launchOptions: {
          args: ["--disable-web-security"]
        }
      },
    },
  ],
  webServer: {
    command: "npx.cmd next dev -p 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 60 * 1000,
  },
});
