import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CarGroupPage } from '../pages/car-group';


// login
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin', '1234');

    await page.waitForURL('**/delivery-order');

});

test('TC-01 ค้นหารหัสรถ c02', async ({ page }) => {

    const carGroup = new CarGroupPage(page);

    await carGroup.goto();
    await carGroup.searchCar('c02');
    await expect(carGroup.getRowByText('c02')).toBeVisible();

});

test('TC-02 เพิ่มกลุ่มรถใหม่ c79', async ({ page }) => {

    const carGroup = new CarGroupPage(page);

    await carGroup.goto();
    await carGroup.searchCar('c79');

  const row = carGroup.getRowByText('c79');

  
  if (await row.count() > 0) {
    await carGroup.deleteByCode('c79');

   
    await expect(page.getByText('ไม่พบข้อมูลที่ค้นหา')).toBeVisible();
  }

    await carGroup.addCar();
    await carGroup.setCodeCar('c79');
    await carGroup.selectType();
    await carGroup.selectHead('1กฎ');
    await carGroup.selectBack('1ฒฐ');
    await carGroup.setRateOil('100');
    await carGroup.setRateAllowance('300')
    await carGroup.selectStatus('00');
    await carGroup.saveCar();
    
    await carGroup.searchCar('c79');
    await expect(carGroup.getRowByText('c79')).toBeVisible();

});

test('TC-03 แก้ไขสถานะ c79 เป็น ปฏิบัติงาน', async ({ page }) => {

    const carGroup = new CarGroupPage(page);

    await carGroup.goto();

    await carGroup.searchCar('c79');
    await carGroup.edit();
    await carGroup.selectStatus('01');
    await carGroup.saveCar();

     await expect(carGroup.getRowByText('c79')).toContainText('ปฏิบัติงาน');

});


test('TC-04 ลบ c79', async ({ page }) => {

    const carGroup = new CarGroupPage(page);

    await carGroup.goto();

    await carGroup.searchCar('c79');
    await carGroup.deleteByCode('c79');
    await expect(page.getByRole('cell', { name: 'ไม่พบข้อมูลที่ค้นหา' })).toBeVisible();

});

test('TC-05 กดเปลี่ยนหน้าเป็นหน้าที่ 2', async ({ page }) => {

    const carGroup = new CarGroupPage(page);

    await carGroup.goto();
    await carGroup.changePage();
    await expect(page.getByText('แสดง')).toContainText('11 ถึง 20');
    

});

