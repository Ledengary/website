import { defineConfig } from '@playwright/test';
import astroConfig from './astro.config.mjs';

const B = (astroConfig.base ?? '/').replace(/\/$/, '');

// Browser tests for the site. Runs against a production build served by `astro preview`, in the
// installed Google Chrome (no separate browser download).
export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  timeout: 120_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4322',
    channel: 'chrome',
  },
  webServer: {
    command: 'npx astro build && npx astro preview --port 4322',
    url: `http://localhost:4322${B}/research/`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
