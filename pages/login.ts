import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async fillUsername(username: string) {
    await this.page.getByRole('textbox', { name: 'เช่น' }).fill(username);
  }

  async fillPassword(password: string) {
    await this.page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill(password);
  }

  async clickLogin() {
    await this.page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}