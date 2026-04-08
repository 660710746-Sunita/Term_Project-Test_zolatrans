import { test } from '@playwright/test';
import { LoginPage } from '../pages/login';

test('login success', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('admin', '1234');
});