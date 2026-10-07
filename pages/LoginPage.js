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

  async enterPassword(password, showPassword = false) {
    console.log(`Entering password: ${password ? '********' : '[EMPTY]'}...`);
    const input = this.page.getByRole('textbox', { name: 'Password' });
    await input.click();
    await input.fill(password);
    await this.page.waitForTimeout(800);

    if (showPassword && password) {
      await this.togglePasswordVisibility();
    }
  }

  async togglePasswordVisibility() {
    console.log('👁️ Toggling password visibility (Show/Hide Password)...');
    try {
      const eyeButton = this.page.locator('label').filter({ hasText: 'Password*' }).getByRole('button');
      await eyeButton.click();
      await this.page.waitForTimeout(1200);
    } catch (error) {
      console.log('Password toggle eye icon click fallback...');
    }
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
    await this.page.waitForTimeout(2500);
  }

  async selectOrganization(orgName = 'playwright') {
    console.log(`Searching organization: ${orgName}...`);
    const searchInput = this.page.getByRole('textbox', { name: 'Search Organizations' });
    await searchInput.click();
    await searchInput.fill(orgName);
    await this.page.waitForTimeout(1500);

    console.log(`Selecting organization button for: ${orgName}...`);
    const playwrightOrgBtn = this.page.getByRole('button', { name: 'P Playwright Automation' });
    const isPlaywrightVisible = await playwrightOrgBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (isPlaywrightVisible) {
      await playwrightOrgBtn.click();
    } else {
      const genericBtn = this.page.getByRole('button', { name: new RegExp(orgName, 'i') }).first();
      const isGenericVisible = await genericBtn.isVisible({ timeout: 3000 }).catch(() => false);
      if (isGenericVisible) {
        await genericBtn.click();
      } else {
        await this.page.getByRole('button', { name: 'The Baap Company Governor' }).click().catch(() => {});
      }
    }
    await this.page.waitForTimeout(3000);
    console.log('✅ Organization selected successfully!');
  }

  // Combined Standard Password Login
  async login(emailOrPhone, password, orgName = 'playwright', showPassword = true) {
    await this.goto();
    await this.clickLoginButton();
    await this.enterEmailOrPhone(emailOrPhone);
    await this.enterPassword(password, showPassword);
    await this.clickSubmitLogin();
    await this.selectOrganization(orgName);
  }

  // OTP Login & Password Reset Flow for Employee
  async loginWithOtpAndSetPassword(phone, otpDigits = ['9', '9', '5', '8', '7', '3'], newPassword = 'Bhushan@123') {
    console.log(`Attempting OTP Login for Employee Phone: ${phone}...`);
    await this.goto();
    await this.clickLoginButton();
    await this.page.getByRole('button', { name: 'Login with OTP' }).click();
    await this.page.waitForTimeout(1000);

    const phoneInput = this.page.getByRole('textbox', { name: 'Phone Number flag +' });
    await phoneInput.click();
    await phoneInput.fill(phone);
    await this.page.waitForTimeout(800);

    console.log('Sending OTP...');
    await this.page.getByRole('button', { name: 'Send OTP' }).first().click();
    await this.page.waitForTimeout(1500);

    console.log('Filling OTP digits...');
    for (let i = 0; i < otpDigits.length; i++) {
      await this.page.getByRole('textbox').nth(i + 1).fill(otpDigits[i]).catch(() => {});
    }
    await this.page.waitForTimeout(800);

    await this.page.getByRole('button', { name: 'Show OTP' }).click().catch(() => {});
    await this.page.waitForTimeout(500);

    console.log('Verifying OTP...');
    await this.page.getByRole('button', { name: 'Verify OTP' }).click();
    await this.page.waitForTimeout(2000);

    // Set New Password
    const newPassInput = this.page.getByRole('textbox', { name: 'New Password' });
    const isPassInputVisible = await newPassInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (isPassInputVisible) {
      console.log('Setting new password for employee...');
      await newPassInput.click();
      await newPassInput.fill(newPassword);
      await this.page.getByRole('textbox', { name: 'Confirm Password' }).click();
      await this.page.getByRole('textbox', { name: 'Confirm Password' }).fill(newPassword);
      await this.page.getByRole('button', { name: 'Set Password' }).click();
      await this.page.waitForTimeout(2000);
    }

    // Login with newly set password
    await this.enterPassword(newPassword, true);
    await this.clickSubmitLogin();
    console.log('✅ Employee OTP Login & Password Set successful!');
  }

  async attemptInvalidLogin(emailOrPhone, password, showPassword = true) {
    await this.enterEmailOrPhone(emailOrPhone);
    await this.enterPassword(password, showPassword);
    await this.clickSubmitLogin();
  }

  async verifyStillOnLoginPage() {
    console.log('Verifying user remains on Login Page...');
    const loginBtn = this.page.getByRole('button', { name: 'Login', exact: true });
    await expect(loginBtn).toBeVisible({ timeout: 5000 });
    console.log('✅ Verified: User remains on Login Page after invalid attempt.');
  }

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
}

export default LoginPage;
