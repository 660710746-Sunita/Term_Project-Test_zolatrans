import { Page, expect } from '@playwright/test';

export class DeliveryOrderPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('delivery-order');
    }

    //ลงวันที่
    async fillStartDate(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(0);
        await field.click();

        const [day, month, year] = date.split('/');
        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }
    // รหัสพนักงาน
    async selectEmployee() {
        const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(0);
        await btn.click();
        await this.page.getByRole('option').nth(1).click();
    }

    // รหัสรถ
    async selectCar() {
        const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(1);
        await btn.click();
        await this.page.getByRole('option').nth(1).click();
    }

    // ชนิดรถ
    async selectCarType() {
        await this.page.locator('select').selectOption({ index: 1 });
    }

    // ใบส่งของ
    async fillDeliveryOrderNo(value: string) {
        const field = this.page.locator('label:has-text("ใบส่งของเลขที่")').locator('..');
        await field.locator('input').fill(value);
    }

    // ใบอนุมัติขาย
    async fillSalesApprovalNo(value: string) {
        const field = this.page.locator('label:has-text("ใบอนุมัติขายเลขที่")').locator('..');
        await field.locator('input').fill(value);
    }


    //วันที่ 
    async fillDate2(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(1);
        await field.click();

        const [day, month, year] = date.split('/');
        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }
    //ลูกค้า
    async selectCustomer() {
        const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(2);
        await btn.click();
        await this.page.getByRole('option').nth(1).click();
    }

    //สถานที่ส่ง
    async fillLocation(text: string) {
        await this.page.getByPlaceholder('ระบุสถานที่จัดส่ง').fill(text);
    }

    //รายละเอียดการเดินรถ
    async fillDescription(text: string) {
        await this.page.getByPlaceholder('ระบุรายละเอียดการเดินรถ...').fill(text);
    }

    //คำสั่งพิเศษ
    async fillSpecialInstruction(text: string) {
        await this.page.getByPlaceholder('ระบุคำสั่งพิเศษ...').fill(text);
    }

    //กำหนดเดินทาง
    async fillDate3(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(2);
        await field.click();

        const [day, month, year] = date.split('/');
        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }
    //กำหนดวันถึงลูกค้า
    async fillDate4(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(3);
        await field.click();

        const [day, month, year] = date.split('/');
        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }

    //ระยะทางตามแผนที่
    async fillDistanceMap(value: string) {
        const field = this.page.locator('label:has-text("ระยะทางตามแผนที่")').locator('..');
        await field.locator('input').fill(value);
    }
    //ระยะทาง S/O
    async fillDistanceSO(value: string) {
        const field = this.page.locator('label:has-text("ระยะทาง S/O")').locator('..');
        await field.locator('input').fill(value);
    }

    async fillTotalPrice(value: string) {
        const field = this.page.locator('label:has-text("รวมเป็นเงิน")').locator('..');
        await field.locator('input').fill(value);
    }

    //สินค้า
    async selectProduct() {
        const input = this.page.getByPlaceholder('ค้นหาสินค้า...');

        await input.click();
        await input.fill('a'); //trigger dropdown

        // รอ dropdown โผล่ก่อน
        const option = this.page.getByRole('option').first();
        await expect(option).toBeVisible();

        await option.click();
    }

    async clickSave() {
        const saveBtn = this.page.getByRole('button', { name: 'บันทึก' }).first();
        await expect(saveBtn).toBeVisible();
        await saveBtn.click();
    }
    async confirmSave() {
        // รอ popup confirm
        const modal = this.page.getByText('คุณต้องการบันทึกเอกสารหรือไม่?');
        await expect(modal).toBeVisible();

        //กดปุ่ม "บันทึก" ใน popup
        const confirmBtn = this.page.getByRole('button', { name: 'บันทึก' }).nth(1);
        await expect(confirmBtn).toBeEnabled();
        await confirmBtn.click();
    }

    // ตรวจสอบ error popup (บันทึกไม่สำเร็จ)
    async expectSaveFailed() {
        await expect(this.page.getByText('บันทึกไม่สำเร็จ')).toBeVisible();
    }

    // ตรวจสอบ error ราย field (FIXED VERSION)

    async expectCarOwner(value: string) {
        const field = this.page
            .locator('label:has-text("เจ้าของรถ")')
            .locator('..')
            .locator('input')
            .filter({ hasNot: this.page.locator('input[value=""]') })
            .first();

        await expect(field).toHaveValue(value);
    }

    async expectCarHead(value: string) {
        const field = this.page
            .locator('label:has-text("ทะเบียน(หัว)")')
            .locator('..')
            .locator('input')
            .filter({ hasNot: this.page.locator('input[value=""]') })
            .first();

        await expect(field).toHaveValue(value);
    }

    async expectCarTail(value: string) {
        const field = this.page
            .locator('label:has-text("ทะเบียน(ท้าย)")')
            .locator('..')
            .locator('input')
            .filter({ hasNot: this.page.locator('input[value=""]') })
            .first();

        await expect(field).toHaveValue(value);
    }

    //ปุ่มเพิ่มรายการสินค้า
    async clickAddItem() {
        const button = this.page.getByRole('button', {
            name: 'เพิ่มรายการ'
        });

        await button.click();
    }

    //ตรวจสอบว่ามีรายการสินค้าเพิ่มขึ้น (optional แต่แนะนำ)
    async expectItemRowCount(count: number) {
        const rows = this.page.locator('tbody tr');

        await expect(rows).toHaveCount(count);
    }

    //ปุ่มเคลียร์
    async clickClear() {
        const btn = this.page.getByRole('button', { name: 'เคลียร์', exact: true });
        await expect(btn).toBeEnabled();
        await btn.click();
    }
    
}
