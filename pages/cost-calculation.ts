import { expect, Page } from '@playwright/test';

export class CostCalculationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/cost');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(
      this.page.getByRole('button', {
        name: 'บันทึก',
        exact: true
      })
    ).toBeVisible();
  }

  async scrollDown() {
    await this.page.mouse.wheel(0, 1000);
  }

  // วันที่ด้านบน
  async fillDateTime(value: string) {
    const dateInput = this.page.locator('input').nth(1);
    await dateInput.fill(value);
    await dateInput.press('Tab');
  }

  // Workrecord
  async fillWorkRecord(value: string) {
    await this.page.getByPlaceholder('เลขที่').first().fill(value);
  }

  async clickSearch() {
    await this.page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  }

  // เวลาและไมล์
  async fillFactoryOut(value: string) {
    await this.page.locator('.MuiPickersInputBase-input').nth(1).fill(value);
    await this.page.locator('.MuiPickersInputBase-input').nth(1).press('Tab');
  }

  async fillArriveSite(value: string) {
    await this.page.locator('.MuiPickersInputBase-input').nth(2).fill(value);
    await this.page.locator('.MuiPickersInputBase-input').nth(2).press('Tab');
  }

  async fillLeaveSite(value: string) {
    await this.page.locator('.MuiPickersInputBase-input').nth(3).fill(value);
    await this.page.locator('.MuiPickersInputBase-input').nth(3).press('Tab');
  }

  async fillReturnFactory(value: string) {
    await this.page.locator('.MuiPickersInputBase-input').nth(4).fill(value);
    await this.page.locator('.MuiPickersInputBase-input').nth(4).press('Tab');
  }

  // ค่าใช้จ่าย (editable only)
  async fillFuelCost(value: string) {
    await this.page
      .locator('input[type="number"]:not([disabled])')
      .nth(4)
      .fill(value);
  }

  async fillLaborCost(value: string) {
    await this.page
      .locator('input[type="number"]:not([disabled])')
      .nth(5)
      .fill(value);
  }

  async fillParkingCost(value: string) {
    await this.page
      .locator('input[type="number"]:not([disabled])')
      .nth(6)
      .fill(value);
  }

  async fillOtherCost(value: string) {
    await this.page
      .locator('input[type="number"]:not([disabled])')
      .nth(7)
      .fill(value);
  }

  async clickSave() {
    await this.page.getByRole('button', {
      name: 'บันทึก',
      exact: true
    }).click();
  }

  async expectRequiredError() {
    await expect(
      this.page.getByText('กรุณาค้นหาและเลือก Workrecord')
    ).toBeVisible();
  }

  async expectSaveSuccess() {
    await expect(
      this.page.getByText(/สำเร็จ|success/i)
    ).toBeVisible();
  }
}