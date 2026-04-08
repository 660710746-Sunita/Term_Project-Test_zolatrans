import { test ,expect} from '@playwright/test';
import { LoginPage } from '../pages/login';
import { DeliveryOrderPage } from '../pages/delivery-order';

// login ก่อนทุก test
test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin', '1234');

    await page.waitForURL('**/delivery-order');
});

//1
// TC-083 กรอกครบแล้วบันทึกได้
test('TC-01 กรอกข้อมูลครบทุกช่องต้องบันทึกได้สำเร็จ', async ({ page }) => {
    const deliveryPage = new DeliveryOrderPage(page);

    await deliveryPage.goto();

    // วันที่
    await deliveryPage.fillStartDate('10/04/2026');
    await deliveryPage.fillDate2('10/04/2026');

    // รหัสพนักงาน
    await deliveryPage.selectEmployee();
    // รหัสรถ
    await deliveryPage.selectCar();
    // ชนิดรถ
    await deliveryPage.selectCarType();

    //ใบส่งของเลขที่
    await deliveryPage.fillDeliveryOrderNo('DO-001');
    // ใบอนุมัติขายเลขที่
    await deliveryPage.fillSalesApprovalNo('SA-001');

    // ลูกค้า
    await deliveryPage.selectCustomer();

    // สถานที่ส่ง
    await deliveryPage.fillLocation('Bangkok');
    // รายละเอียด
    await deliveryPage.fillDescription('วิ่งงานทั่วไป');
    // คำสั่งพิเศษ
    await deliveryPage.fillSpecialInstruction('ระวังสินค้าแตก');

    // วันที่กำหนดเดินทาง
    await deliveryPage.fillDate3('11/04/2026');
    // วันที่ส่งถึงลูกค้า
    await deliveryPage.fillDate4('12/04/2026');

    // ระยะทาง + ราคา
    await deliveryPage.fillDistanceMap('100');
    await deliveryPage.fillDistanceSO('120');
    await deliveryPage.fillTotalPrice('5000');

    // สินค้า
    await deliveryPage.selectProduct();

    // บันทึก
    await deliveryPage.clickSave();
    await deliveryPage.confirmSave();
});

//2
// // 033 ไม่เลือกลูกค้า ต้องไม่สามารถบันทึกได้
test('TC-02 ไม่เลือกลูกค้า ต้องไม่สามารถบันทึกได้', async ({ page }) => {
    const deliveryPage = new DeliveryOrderPage(page);

    await deliveryPage.goto();

    // กรอกทุกอย่าง ยกเว้น "ลูกค้า"
    await deliveryPage.selectEmployee();
    await deliveryPage.selectCar();
    await deliveryPage.selectCarType();

    await deliveryPage.fillDeliveryOrderNo('DO-001');
    await deliveryPage.fillLocation('Bangkok');
    await deliveryPage.fillDescription('test');
    await deliveryPage.fillSpecialInstruction('none');

    await deliveryPage.fillDate3('10/04/2026');
    await deliveryPage.fillDate4('11/04/2026');

    await deliveryPage.fillDistanceMap('10');
    await deliveryPage.fillDistanceSO('10');
    await deliveryPage.fillTotalPrice('1000');

    // เพิ่มสินค้า
    await page.getByRole('button', { name: 'เพิ่มรายการ' }).click();

    // กดบันทึก
    await deliveryPage.clickSave();

    // ตรวจ error popup
    await deliveryPage.expectSaveFailed();
});

//3
test('TC-03 เลือกรหัสรถแล้ว auto fill ข้อมูลรถ', async ({ page }) => {
    const deliveryPage = new DeliveryOrderPage(page);

    await deliveryPage.goto();

    //เลือกรถ
    await deliveryPage.selectCar();

    // ตรวจ auto-fill
    await deliveryPage.expectCarOwner('บจก.อมตะสปีด');
    await deliveryPage.expectCarHead('71-5885');
    await deliveryPage.expectCarTail('71-5888');
});

//4
//053 เพิ่มรายการสินค้าในใบส่งของ
test('TC-04 เพิ่มรายการสินค้าในใบส่งของ', async ({ page }) => {
    const deliveryPage = new DeliveryOrderPage(page);

    await deliveryPage.goto();

    // กดเพิ่มรายการ
    await deliveryPage.clickAddItem();

    // ตรวจว่ามี row เพิ่ม (ถ้าต้องการ verify)
    await deliveryPage.expectItemRowCount(2);
});

//5
// TC-043 เลือกพนักงานแล้วกดเคลียร์
test('TC-05 เลือกพนักงานแล้วกดเคลียร์', async ({ page }) => {
    const deliveryPage = new DeliveryOrderPage(page);

    await deliveryPage.goto();

    // เลือกพนักงาน
    await deliveryPage.selectEmployee();

    // กดเคลียร์
    await deliveryPage.clickClear();

    await expect(
        page.getByRole('combobox', { name: 'ค้นหารหัสพนักงาน' })
    ).toHaveValue('');
});