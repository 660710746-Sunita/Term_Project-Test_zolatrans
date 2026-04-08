import { Page, Locator, expect } from '@playwright/test';

export class CarGroupPage {

    readonly page: Page;
    readonly carSearch: Locator;
    readonly addGroupBtn: Locator;
    readonly codeCar: Locator;
    readonly dropdownHead: Locator;
    readonly dropdownBack: Locator;
    readonly rateOil: Locator;
    readonly rateAllowance: Locator;
    readonly carStatus: Locator;
    readonly saveBtn: Locator;
    readonly typeCar: Locator;
    readonly editCar: Locator;
    readonly deleteCar: Locator;
    readonly ConfirmDeleteCar: Locator;
    readonly cancelBtn: Locator;
    readonly pageBtn: Locator;


      constructor(page: Page) {
        this.page = page;
        this.carSearch = page.getByRole('textbox', { name: 'ค้นหารหัสรถ หรือทะเบียน' });
        this.addGroupBtn =  page.getByRole('button', { name: 'เพิ่มกลุ่มรถ' });
        this.codeCar = page.getByRole('textbox', { name: 'ระบุรหัสรถ' });
        this.typeCar = page.locator('select[name="carPackCode"]');
        this.dropdownHead = page.getByRole('combobox', { name: 'ค้นหาทะเบียนหัว' });
        this.dropdownBack = page.getByRole('combobox', { name: 'ค้นหาทะเบียนหาง' });
        this.rateOil = page.locator('input[name="rateOil"]');
        this.rateAllowance = page.locator('input[name="rateAllowance"]');
        this.carStatus = page.locator('select[name="carStatusUse"]');
        this.saveBtn = page.getByRole('button', { name: 'บันทึกข้อมูล' });
        this.editCar = page.getByRole('button', { name: 'แก้ไข' });
        this.deleteCar = page.getByRole('button', { name: 'ลบ' });
        this.ConfirmDeleteCar = page.getByRole('button', { name: 'ยืนยันการลบ' });
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });
        this.pageBtn = page.getByRole('button', { name: '2' });
      }

    async goto() {
    await this.page.goto('/car-group');
  }
  async searchCar(text: string) {
    await this.carSearch.fill(text);
  }

  async addCar(){
    await this.addGroupBtn.click();
  }
  async setCodeCar(text: string){
    await this.codeCar.fill(text);
  }
  async selectType(){
    await this.typeCar.selectOption('04');
  }
  async selectHead(name: string){
    const input = this.page.getByRole('combobox', { name: 'ค้นหาทะเบียนหัว' });
    await input.fill(name);
    await this.page.getByRole('option', { name }).click();
  }

  async selectBack(name:string){
    const input = this.page.getByRole('combobox', { name: 'ค้นหาทะเบียนหาง' });
    await input.fill(name);
    await this.page.getByRole('option', { name }).click();
  }

  async setRateOil(text: string){
    await this.rateOil.fill(text);
  }

  async setRateAllowance(text: string){
    await this.rateAllowance.fill(text);
  }

  async selectStatus(status: string){
    await this.carStatus.click();
    await this.carStatus.selectOption(status);
  }

  async saveCar(){
    await this.saveBtn.click();
  }

  async edit(){
    await this.editCar.click();
  }

  async deleteByCode(code: string) {
  const row = this.getRowByText(code);

  await expect(row).toBeVisible();

  await row.getByRole('button', { name: 'ลบ' }).click();

  await expect(this.ConfirmDeleteCar).toBeVisible();
  await this.ConfirmDeleteCar.click();

  await expect(row).toHaveCount(0);
}

    async cancel(){
        await this.cancelBtn.click();
    }

    async changePage(){
        await this.pageBtn.click();
    }

   getRowByText(text: string) {
   return this.page.locator('tr', { hasText: text });
  }

}