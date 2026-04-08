import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CostCalculationPage } from '../pages/cost-calculation';

// login ก่อนทุก test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('admin', '1234');

  await page.waitForURL('**/delivery-order');
});

// TC-01 เปิดหน้า Cost Calculation ได้
test('TC-01 เปิดหน้า Cost Calculation ได้', async ({ page }) => {
  const costPage = new CostCalculationPage(page);

  await costPage.goto();

  await expect(page).toHaveURL(/.*cost/);
  await costPage.expectPageLoaded();
});

// TC-02 ค้นหา Workrecord ที่ไม่มี
test('TC-02 ค้นหา Workrecord ที่ไม่มี', async ({ page }) => {
  const costPage = new CostCalculationPage(page);

  await costPage.goto();

  const input = page.getByPlaceholder('เลขที่').last();

  await input.fill('99999999');

  await page.getByRole('button', {
    name: 'ค้นหา',
    exact: true
  }).click();

  await expect(
    page.getByText(/ไม่พบ|ยังไม่มีข้อมูล/i).first()
  ).toBeVisible();
});

// TC-03 ปุ่มล้างข้อมูล
test('TC-03 ปุ่มเคลียร์ข้อมูล', async ({ page }) => {
  const costPage = new CostCalculationPage(page);

  await costPage.goto();

  const workRecord = page.getByPlaceholder('เลขที่').last();

  await workRecord.fill('69040001');

  await page.getByRole('button', {
    name: 'เคลียร์',
    exact: true
  }).click();

  await expect(workRecord).toHaveValue('');
});

// TC-04 รวมค่าใช้จ่าย
test('TC-04 กรอกค่าใช้จ่ายได้ครบ', async ({ page }) => {
  const costPage = new CostCalculationPage(page);

  await costPage.goto();
  await costPage.scrollDown();

  await costPage.fillFuelCost('500');
  await costPage.fillLaborCost('800');
  await costPage.fillParkingCost('100');
  await costPage.fillOtherCost('300');

  await expect(
    page.locator('input[type="number"]:not([disabled])').nth(7)
  ).toHaveValue('300');
});

// TC-05 ไม่กรอก Workrecord แล้วบันทึก
test('TC-05 ไม่กรอก Workrecord แล้วบันทึก', async ({ page }) => {
  const costPage = new CostCalculationPage(page);

  await costPage.goto();

  await costPage.clickSave();

  await costPage.expectRequiredError();
});