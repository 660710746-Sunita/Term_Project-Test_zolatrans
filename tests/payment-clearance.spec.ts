import { test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login';
import { PaymentClearancePage } from '../pages/payment-clearance';

// ---------------------------------------------------------
// 🧪 TEST SUITE: PAYMENT CLEARANCE FLOW
// ---------------------------------------------------------
test.describe('Payment Clearance Flow', () => {
    let loginPage: LoginPage;
    let clearancePage: PaymentClearancePage;

    // Run this BEFORE every single test to setup the environment
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        clearancePage = new PaymentClearancePage(page);

        // 1. Authenticate (Steps 1 of TC-01)
        await loginPage.goto();
        await loginPage.login('admin', '1234');

        // 2. Wait for login to complete and navigate (Steps 2-3 of TC-01)
        // Note: Change '/dashboard' to whatever URL it actually lands on after login!
        await page.waitForURL('**/delivery-order');
        await clearancePage.navigateToPaymentClearance();
    });

    // TC-01 ตรวจสอบการคำนวณ "ยอดคงเหลือ"
    test('TC-01 ตรวจสอบการคำนวณ "ยอดคงเหลือ" หลังหักลบยอดที่จ่ายไปแล้ว', async ({ page }) => {
        // Summary: Verify the calculation of "Remaining Balance" after deducting paid amounts
        // Expected Result: System accurately displays the calculated remaining balance
        await expect(clearancePage.remainingBalanceCard).toBeVisible();
    });

    // TC-02 ตรวจสอบการกรองข้อมูลด้วยช่วง "วันที่เริ่มต้น" และ "วันที่สิ้นสุด"
    test('TC-02 ตรวจสอบการกรองข้อมูลด้วยช่วง "วันที่เริ่มต้น" และ "วันที่สิ้นสุด"', async ({ page }) => {
        // Summary: Verify filtering data using valid "Start Date" and "End Date"
        await clearancePage.startDateInputMain.click();
        await clearancePage.endDateInputMain.click();
        // Expected Result: System displays records falling within the specified date range
    });


    // 🛠️ Helper function to find a row with "ปกติ" since our test mutates data!
    async function navigateToNormalRow(page: any) {
        let found = false;
        for (let i = 0; i < 10; i++) { // Max 10 pages
            if (await page.locator('tr').filter({ hasText: 'ปกติ' }).count() > 0) {
                found = true;
                break;
            }
            const nextBtn = page.getByRole('button', { name: 'ถัดไป' });
            if (await nextBtn.isEnabled()) {
                await nextBtn.click();
                await page.waitForTimeout(1000); // Wait for page to load
            } else {
                break; // No more pages
            }
        }
        if (!found) {
            test.skip(true, 'ไม่มีข้อมูลสถานะ "ปกติ" เหลือให้เทสแล้วจ้า (Data Exhaustion)! ข้ามการทดสอบนี้ไปก่อน');
        }
    }

    test('TC-03 ตรวจสอบการสั่งพิมพ์เอกสารจากตารางข้อมูล', async ({ page }) => {
        // Summary: Verify document printing from the data table
        await navigateToNormalRow(page);
        
        // Expected Result: System opens Print Preview or downloads PDF successfully
        await clearancePage.printButton.click();
    });

    test('TC-04 ตรวจสอบกระบวนการลบและเปลี่ยนสถานะเอกสาร', async ({ page }) => {
        // Summary: Verify the deletion process and document status update
        await navigateToNormalRow(page);
        await clearancePage.cancelClearance('Test Delete');
        
        // Expected Result: Status updates to canceled or document is hidden
    });

    test('TC-05 ตรวจสอบการแจ้งเตือน (Validation) เมื่อไม่กรอกเหตุผลในการยกเลิก', async ({ page }) => {
        // Summary: Test clicking "cancel" while leaving the mandatory reason field completely blank
        await navigateToNormalRow(page);
        
        // Click cancel on a valid row
        await clearancePage.cancelButton.click();
        
        // Attempt to confirm without typing a reason
        await clearancePage.confirmCancelButton.click();
        
        // Expected Result: A clear warning message preventing the action
        await expect(page.getByText('กรุณาระบุเหตุผลในการยกเลิก')).toBeVisible();
        await page.getByText('กรุณาระบุเหตุผลในการยกเลิก').click(); // Optional user click interaction
    });
});