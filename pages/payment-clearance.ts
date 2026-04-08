import { Page, Locator, expect } from '@playwright/test';

export class PaymentClearancePage {
    readonly page: Page;

    // -- Navigation Ingredients --
    readonly transportMenu: Locator;
    readonly clearanceSubMenu: Locator;

    // -- Search & Filter Ingredients --
    readonly browseAdvancesButton: Locator;
    readonly empCodeInput: Locator;
    readonly clearanceNoInput: Locator;
    readonly searchButton: Locator;
    readonly searchButtonPopup: Locator;
    readonly clearButton: Locator;
    readonly clearButtonPopup: Locator;

    // -- Summary Cards Ingredients  --
    readonly totalAdvanceAmountCard: Locator;
    readonly paidAmountCard: Locator;
    readonly remainingBalanceCard: Locator;

    // -- Date Pickers [Main Ingredients] --
    readonly startDateInputMain: Locator;
    readonly endDateInputMain: Locator;

    // -- Date Pickers [Popup Ingredients] --
    readonly startDateInputPopup: Locator;
    readonly endDateInputPopup: Locator;

    // -- Action Ingredients --
    readonly printButton: Locator;
    readonly confirmPrintButton: Locator;
    readonly cancelPrintButton: Locator;
    readonly cancelButton: Locator;
    readonly cancelReasonInput: Locator;
    readonly confirmCancelButton: Locator;

    // -- Popup Specifics Ingredients --
    readonly closePopupXButton: Locator;
    readonly popupCheckboxItem: Locator;
    readonly submitSelectionPopupButton: Locator;

    // -- My Cookbooks [or Methods] --
    constructor(page: Page) {
        this.page = page;

        // Locators based on my raw CodeGen scrape.
        // I might need to adjust .first() or .nth() based on the final stable UI.
        this.transportMenu        = page.getByRole('button', { name: 'เคลียร์เงินทดลองจ่าย' }).first();
        this.clearanceSubMenu     = page.getByRole('heading', { name: 'เคลียร์เงินทดลองจ่าย', exact: true })

        this.browseAdvancesButton = page.getByRole('button', { name: 'เรียกดูรายการเบิกเงิน' });
        this.empCodeInput         = page.getByRole('textbox', { name: 'พิมพ์รหัสพนักงาน' });
        this.clearanceNoInput     = page.getByRole('textbox', { name: 'เลขที่ใบเคลียร์' });

        // I'm using generic text or role matches for buttons to make them reusable again.
        this.searchButton         = page.getByRole('button', { name: 'ค้นหา', exact: true });
        this.searchButtonPopup    = page.getByRole('button', { name: 'ค้นหา', exact: true }).nth(1);
        this.clearButton          = page.getByRole('button', { name: 'ล้าง', exact: true });
        this.clearButtonPopup     = page.getByRole('button', { name: 'ล้าง', exact: true }).nth(1);

        // Summary Cards
        this.totalAdvanceAmountCard = page.getByText('วงเงินทดลองจ่ายทั้งหมด');
        this.paidAmountCard         = page.getByText('จ่ายไปแล้ว');
        this.remainingBalanceCard   = page.getByText('คงเหลือ');

        // Date Pickers Main
        this.startDateInputMain     = page.getByText('ตั้งแต่วันที่DD/MM/YYYY hh:mm').nth(0);
        this.endDateInputMain       = page.getByText('ถึงวันที่DD/MM/YYYY hh:mm').nth(0);

        // Date Pickers Popup
        this.startDateInputPopup    = page.getByRole('group').nth(2);
        this.endDateInputPopup      = page.getByRole('group').nth(3);

        this.printButton          = page.locator('tr').filter({ hasText: 'ปกติ' }).first().getByRole('button', { name: 'พิมพ์' });
        this.confirmPrintButton     = page.getByText('พิมพ์', { exact: true });
        this.cancelPrintButton      = page.getByRole('button', { name: 'ไม่พิมพ์' });

        this.cancelButton         = page.locator('tr').filter({ hasText: 'ปกติ' }).first().getByRole('button', { name: 'ยกเลิก' });
        this.cancelReasonInput    = page.getByRole('textbox', { name: 'ระบุเหตุผล' });
        this.confirmCancelButton  = page.getByRole('button', { name: 'ยืนยันการยกเลิก' });

        // Popup Specifics
        this.closePopupXButton      = page.locator('.bg-white.rounded-xl > .flex.items-center.justify-between.p-6 > .p-2');
        this.popupCheckboxItem      = page.locator('.lucide.lucide-square.w-5.h-5.text-gray-300').first();
        this.submitSelectionPopupButton = page.getByRole('main').getByRole('button', { name: 'เคลียร์เงินทดลองจ่าย' });
    }

    // 🥘 Method: Navigate to the page (Fulfills TC-01 Steps 2 & 3)
    async navigateToPaymentClearance() {
        await this.transportMenu.click();
        // Adding a small wait or verifying visibility before clicking submenu is a good POM practice
        await expect(this.clearanceSubMenu).toBeVisible();
        await this.clearanceSubMenu.click();
    }

    // 🥘 Method: Verify Page Load (Fulfills TC-01 Expected Result)
    async expectPageLoaded() {
        // Assert that the core elements of the page are visible
        await expect(this.browseAdvancesButton).toBeVisible();
        await expect(this.searchButton.first()).toBeVisible();
    }

    // 🥘 Method: Search by Employee Code
    async searchByEmployeeCode(empCode: string) {
        await this.empCodeInput.click();
        await this.empCodeInput.fill(empCode);
        await this.searchButtonPopup.click();
    }

    // 🥘 Method: Search by Clearance Number
    async searchByClearanceNo(clearanceNo: string) {
        await this.clearanceNoInput.click();
        await this.clearanceNoInput.fill(clearanceNo);
        await this.searchButton.first().click();
    }

    // 🥘 Method: Cancel a Clearance with Reason
    async cancelClearance(reason: string) {
        await this.cancelButton.click();
        await this.cancelReasonInput.click();
        await this.cancelReasonInput.fill(reason);
        await this.confirmCancelButton.click();
    }
}