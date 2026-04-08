import { Page, expect } from '@playwright/test';

export class SearchDeliveryPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('delivery-order/search');
    }

    async fillFromDate(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(0);
        await field.waitFor();
        const dayField = field.getByRole('spinbutton', { name: 'Day' });
        await dayField.click();
        const [day, month, year] = date.split('/');

        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }

    async fillToDate(date: string) {
        const field = this.page.locator('.MuiPickersInputBase-root').nth(1);
        await field.waitFor();
        const dayField = field.getByRole('spinbutton', { name: 'Day' });
        await dayField.click();
        const [day, month, year] = date.split('/');

        await this.page.keyboard.type(`${day}${month}${year}1200`);
    }

    async expectNoData() {
        await expect(this.page.getByText('ไม่พบข้อมูล')).toBeVisible();
    }

    async fillOrderNumber(orderNo: string) {
        await this.page.getByPlaceholder('ค้นหาเลขที่ใบคำสั่งปฏิบัติงาน').fill(orderNo);
    }

    // พนักงาน
async fillEmployee() {
    const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(0);
    await btn.click();
    await this.page.getByRole('option').nth(1).click();
}

// ลูกค้า
async fillCustomer() {
    const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(1);
    await btn.click();
    await this.page.getByRole('option').nth(1).click();
}

// รถ
async fillCar() {
    const btn = this.page.locator('button[aria-haspopup="listbox"]').nth(2);
    await btn.click();
    await this.page.getByRole('option').nth(1).click();
}

    async clickSearch() {
        const btn = this.page.getByRole('button', { name: 'ค้นหา', exact: true });

        await expect(btn).toBeEnabled();
        await btn.click();
    }

    async clickClear() {
        const btn = this.page.getByRole('button', { name: 'ล้างค่า', exact: true });

        await expect(btn).toBeEnabled();
        await btn.click();
    }

    async clickWorkNumber(workNo: string) {
        await this.page.getByRole('cell', { name: workNo }).click();
    }


    async expectRowVisible(text: string) {
        await expect(this.page.getByText(text)).toBeVisible();
    }

    async expectRowNotVisible(text: string) {
        await expect(this.page.getByText(text)).not.toBeVisible();
    }
}