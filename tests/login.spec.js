import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

test.describe('BoardView QA - Complete Login Test Suite', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000); // 2 min timeout for clear, visible execution
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickLoginButton();
  });

  // ==========================================
  // POSITIVE TEST CASES
  // ==========================================
  test('Positive: Login with Valid Credentials & Select Organization', async ({ page }) => {
    console.log('\n==================================================');
    console.log('TEST: Positive Login with Valid Credentials');
    console.log('==================================================');

    await loginPage.enterEmailOrPhone('8767629834');
    await loginPage.enterPassword('Bhushan@123');
    await loginPage.clickSubmitLogin();
    await loginPage.selectOrganization('the baap');

    console.log('🎉 Positive Login Test Passed!');
  });

  // ==========================================
  // NEGATIVE TEST CASES
  // ==========================================
  test('Negative: Login with Incorrect Password', async ({ page }) => {
    console.log('\n==================================================');
    console.log('TEST: Negative Login with Incorrect Password');
    console.log('==================================================');

    await loginPage.attemptInvalidLogin('8767629834', 'WrongPassword@999');
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();

    console.log('🎉 Negative Test Passed: Incorrect password rejected as expected.');
  });

  test('Negative: Login with Unregistered Phone Number', async ({ page }) => {
    console.log('\n==================================================');
    console.log('TEST: Negative Login with Unregistered Phone Number');
    console.log('==================================================');

    await loginPage.attemptInvalidLogin('9000000000', 'Bhushan@123');
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();

    console.log('🎉 Negative Test Passed: Unregistered phone number rejected as expected.');
  });

  test('Negative: Login with Blank/Empty Credentials', async ({ page }) => {
    console.log('\n==================================================');
    console.log('TEST: Negative Login with Blank Credentials');
    console.log('==================================================');

    await loginPage.enterEmailOrPhone('');
    await loginPage.enterPassword('');
    await loginPage.clickSubmitLogin();
    await loginPage.verifyStillOnLoginPage();

    console.log('🎉 Negative Test Passed: Blank credentials rejected as expected.');
  });
});
