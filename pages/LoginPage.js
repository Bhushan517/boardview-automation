import { expect } from '@playwright/test';

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    console.log('Navigating to BoardView QA...');
    await this.page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(1500);
  }

  async clickLoginButton() {
    console.log('Clicking Log in button...');
    await this.page.getByRole('button', { name: 'Log in' }).click();
    await this.page.waitForTimeout(1000);
  }

  async enterEmailOrPhone(emailOrPhone) {
    console.log(`Entering email/phone: ${emailOrPhone}...`);
    const input = this.page.getByRole('textbox', { name: 'Email or phone number' });
    await input.click();
    await input.fill(emailOrPhone);
    await this.page.waitForTimeout(800);
  }

  async enterPassword(password) {
    console.log('Entering password...');
    const input = this.page.getByRole('textbox', { name: 'Password' });
    await input.click();
    await input.fill(password);
    await this.page.waitForTimeout(800);
  }

  async clickSubmitLogin() {
    console.log('Submitting login...');
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    await this.page.waitForTimeout(2500);
  }

  async selectOrganization(orgName = 'the baap') {
    console.log(`Searching organization: ${orgName}...`);
    const searchInput = this.page.getByRole('textbox', { name: 'Search Organizations' });
    await searchInput.click();
    await searchInput.fill(orgName);
    await this.page.waitForTimeout(1500);

    console.log('Selecting organization: The Baap Company Governor...');
    await this.page.getByRole('button', { name: 'The Baap Company Governor' }).click();
    await this.page.waitForTimeout(3000);
    console.log('✅ Login and organization selection successful!');
  }

  // Combined login method
  async login(emailOrPhone, password, orgName = 'the baap') {
    await this.goto();
    await this.clickLoginButton();
    await this.enterEmailOrPhone(emailOrPhone);
    await this.enterPassword(password);
    await this.clickSubmitLogin();
    await this.selectOrganization(orgName);
  }
}

export default LoginPage;
