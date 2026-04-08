import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    headless: false,
    baseURL: 'https://zola-trans-frontend-z1hm.vercel.app/',
    screenshot: 'only-on-failure',
  },
});