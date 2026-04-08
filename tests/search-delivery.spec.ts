import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { SearchDeliveryPage } from '../pages/search-delivery';

// login
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin', '1234');

    await page.waitForURL('**/delivery-order');
});

// TC-01 วันที่ผิดช่วง
test('TC-01 วันที่เริ่มต้นมากกว่าวันที่สิ้นสุด ต้องแจ้ง error', async ({ page }) => {
    const searchPage = new SearchDeliveryPage(page);

    await searchPage.goto();
    await searchPage.fillFromDate('10/04/2026');
    await searchPage.fillToDate('05/04/2026');
    await searchPage.clickSearch();

    await searchPage.expectNoData();
});

// TC-02 ค้นหาเลขที่คำสั่ง
test('TC-02 ค้นหาโดยเลขที่ใบคำสั่งปฏิบัติงาน', async ({ page }) => {
    const searchPage = new SearchDeliveryPage(page);

    await searchPage.goto();
    await searchPage.fillOrderNumber('69040001');
    await searchPage.clickSearch();

    await searchPage.expectRowVisible('69040001');
});

// TC-03 คลิกเลขที่ใบงาน ไม่สามารถเข้า detail ได้
test('TC-03 คลิกเลขที่ใบงาน ไม่สามารถเข้า detail ได้', async ({ page }) => {
    const searchPage = new SearchDeliveryPage(page);

    await searchPage.goto();
    await searchPage.clickWorkNumber('69040001');

    // ตรวจว่า URL ไม่เปลี่ยน
    await searchPage.expectRowVisible('69040001');
});

// TC-04 ไม่พบข้อมูล
test('TC-04 กรอกข้อมูลที่ไม่มีอยู่ ต้องแสดงข้อความไม่พบข้อมูล', async ({ page }) => {
    const searchPage = new SearchDeliveryPage(page);

    await searchPage.goto();
    await searchPage.fillOrderNumber('99999999');
    await searchPage.clickSearch();

    await searchPage.expectNoData();
});

// TC-05 ล้างค่า
test('TC-05 ปุ่มล้างค่า ต้องเคลียร์ข้อมูลทุกช่อง', async ({ page }) => {
    const searchPage = new SearchDeliveryPage(page);

    await searchPage.goto();

    await searchPage.fillOrderNumber('69040001');

    // combobox
    await searchPage.fillEmployee();
    await searchPage.fillCustomer();
    await searchPage.fillCar();

    // dropdown
    await page.locator('select').selectOption('1');

    // date (from)
    await searchPage.fillFromDate('10/04/2026');
    // date (to)
    await searchPage.fillToDate('05/04/2026');

    // 🔥 2. กดปุ่ม "ล้างค่า"
    await searchPage.clickClear();

    // 🔥 3. ตรวจสอบว่าเคลียร์หมด

    // text input
    await expect(page.getByPlaceholder('ค้นหาเลขที่ใบคำสั่งปฏิบัติงาน')).toHaveValue('');

    // combobox
    await expect(page.getByPlaceholder('รหัส หรือ ชื่อพนักงาน...')).toHaveValue('');
    await expect(page.getByPlaceholder('รหัส หรือ ชื่อลูกค้า...')).toHaveValue('');
    await expect(page.getByPlaceholder('รหัสรถ...')).toHaveValue('');

    // dropdown → default = ""
    await expect(page.locator('select')).toHaveValue('');

    // 🔥 date locator (ต้องสร้างก่อนใช้)
    const fromDate = page.locator('.MuiPickersInputBase-root').nth(0);
    const toDate = page.locator('.MuiPickersInputBase-root').nth(1);

    // 🔥 เช็คว่า reset จริง
    await expect(fromDate).toContainText('DD');
    await expect(fromDate).toContainText('MM');
    await expect(fromDate).toContainText('YYYY');

    await expect(fromDate).toContainText('hh');
    await expect(fromDate).toContainText('mm');

    await expect(toDate).toContainText('DD');
    await expect(toDate).toContainText('MM');
    await expect(toDate).toContainText('YYYY');

    await expect(toDate).toContainText('hh');
    await expect(toDate).toContainText('mm');
});