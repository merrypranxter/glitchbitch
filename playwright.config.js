import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: '/tmp/glitchbitch-playwright',
  timeout: 90000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', reducedMotion: 'reduce', launchOptions: { args: ['--enable-unsafe-swiftshader'] } },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', deviceScaleFactor: 1 } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], deviceScaleFactor: 1, launchOptions: { ...(process.env.GLITCH_WEBKIT_EXECUTABLE ? { executablePath: process.env.GLITCH_WEBKIT_EXECUTABLE } : {}) } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: { command: 'npm run dev -- --port 5173', url: 'http://127.0.0.1:5173', reuseExistingServer: true },
});
