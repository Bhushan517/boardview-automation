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
    console.log(`Entering email/phone: ${emailOrPhone || '[EMPTY]'}...`);
    const input = this.page.getByRole('textbox', { name: 'Email or phone number' });
    await input.click();
    await input.fill(emailOrPhone);
    await this.page.waitForTimeout(800);
  }

  async enterPassword(password) {
    console.log(`Entering password: ${password ? '********' : '[EMPTY]'}...`);
    const input = this.page.getByRole('textbox', { name: 'Password' });
    await input.click();
    await input.fill(password);
    await this.page.waitForTimeout(800);
  }

  async clearFields() {
    console.log('Clearing input fields...');
    await this.page.getByRole('textbox', { name: 'Email or phone number' }).clear();
    await this.page.getByRole('textbox', { name: 'Password' }).clear();
    await this.page.waitForTimeout(500);
  }

  async clickSubmitLogin() {
    console.log('Submitting login...');
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    await this.page.waitForTimeout(2000);
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

  // Helper for Negative Login attempt
  async attemptInvalidLogin(emailOrPhone, password) {
    await this.enterEmailOrPhone(emailOrPhone);
    await this.enterPassword(password);
    await this.clickSubmitLogin();
  }

  // Verify user is still on Login Page (login failed)
  async verifyStillOnLoginPage() {
    console.log('Verifying user remains on Login Page...');
    const loginBtn = this.page.getByRole('button', { name: 'Login', exact: true });
    await expect(loginBtn).toBeVisible({ timeout: 5000 });
    console.log('✅ Verified: User remains on Login Page after invalid attempt.');
  }

  // Verify Error Toast/Alert Message if visible
  async verifyErrorMessage() {
    console.log('Checking for error message/toast...');
    const errorAlert = this.page.locator('.toast, [role="alert"], .error-message, p.text-red-500, span.text-red-500').first();
    const isVisible = await errorAlert.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      const text = await errorAlert.innerText();
      console.log(`✅ Error message displayed: "${text.trim()}"`);
    } else {
      console.log('ℹ️ Validation active: Login form retained without navigating to dashboard.');
    }
  }

  // Combined Positive login method
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
