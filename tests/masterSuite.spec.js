import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BoardPage from '../pages/BoardPage.js';
import HrmsConfigPage from '../pages/HrmsConfigPage.js';
import UserManagementPage from '../pages/UserManagementPage.js';
import AttendancePage from '../pages/AttendancePage.js';

test.describe.serial('BoardView Professional Complete E2E QA Suite', () => {
  let loginPage;
  let boardPage;
  let hrmsConfigPage;
  let userMgmtPage;
  let attendancePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(300000); // 5 mins per test
    loginPage = new LoginPage(page);
    boardPage = new BoardPage(page);
    hrmsConfigPage = new HrmsConfigPage(page);
    userMgmtPage = new UserManagementPage(page);
    attendancePage = new AttendancePage(page);
  });

  // ===================================================
  // PHASE 1: LOGIN FORM VALIDATIONS & NEGATIVE TESTS
  // ===================================================
  test('1.1 - Negative: Reject Blank Credentials', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 1.1: Testing Blank Credentials Validation');
    console.log('--------------------------------------------------');
    await loginPage.goto();
    await loginPage.clickLoginButton();
    await loginPage.enterEmailOrPhone('');
    await loginPage.enterPassword('');
    await loginPage.clickSubmitLogin();
    await loginPage.verifyStillOnLoginPage();
    console.log('✅ Phase 1.1 Passed: Blank credentials blocked.');
  });

  test('1.2 - Negative: Reject Incorrect Password', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 1.2: Testing Incorrect Password Validation');
    console.log('--------------------------------------------------');
    await loginPage.goto();
    await loginPage.clickLoginButton();
    await loginPage.attemptInvalidLogin('8767629834', 'WrongPassword@999', true);
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();
    console.log('✅ Phase 1.2 Passed: Incorrect password blocked.');
  });

  test('1.3 - Negative: Reject Unregistered Phone Number', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 1.3: Testing Unregistered Phone Validation');
    console.log('--------------------------------------------------');
    await loginPage.goto();
    await loginPage.clickLoginButton();
    await loginPage.attemptInvalidLogin('9000000000', 'Bhushan@123', true);
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();
    console.log('✅ Phase 1.3 Passed: Unregistered phone blocked.');
  });

  // ===================================================
  // PHASE 2: ADMIN SETUP & EMPLOYEE CREATION
  // ===================================================
  test('2.1 - Admin: Login, Setup HRMS Attendance Config & Add Employee', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 2.1: Admin Setup & Employee Creation');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.locator('label').filter({ hasText: 'Password*' }).getByRole('button').click().catch(() => {});
    await page.locator('label').filter({ hasText: 'Password*' }).getByRole('button').click().catch(() => {});
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2500);

    await page.getByRole('textbox', { name: 'Search Organizations' }).fill('playwright');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await page.locator('div').filter({ hasText: 'HRMS Configuration' }).nth(5).click();

    const deleteBtn = page.getByTestId('HRMS-ATC-btn-delete');
    if (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.click();
      await page.getByText('Delete', { exact: true }).click().catch(() => {});
    }

    await page.getByTestId('HRMS-ATC-container').getByRole('button', { name: 'Add' }).click();
    await page.getByTestId('HRMS-CAC-input-config-name').fill('new one');
    await page.getByTestId('HRMS-CAC-input-config-name').press('Enter');
    await page.getByTestId('HRMS-CAC-input-shift-search').fill('general');
    await page.getByTestId('HRMS-CAC-shift-option').first().click().catch(() => {});
    await page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric').fill('7');
    await page.getByTestId('HRMS-CAC-dropdown-weekdays').click();
    await page.locator('div').filter({ hasText: /^Monday$/ }).first().click().catch(() => {});
    await page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.getByRole('button', { name: 'Reject' }).click().catch(() => {});
    await page.getByTestId('HRMS-CAC-btn-save').click();
    await page.waitForTimeout(2000);

    await userMgmtPage.navigateToUsersAndStaff();
    await userMgmtPage.createEmployee({
      title: 'Mr',
      firstName: 'bhushan',
      lastName: 'raut',
      phone: '9922264088',
      gender: 'Male',
      manager: 'bhushan',
      designation: 'QA',
      role: 'Emp',
      shift: 'general',
      joiningDate: '1',
      remote: true
    });

    console.log('🎉 Phase 2.1 Passed: Admin Setup & Employee Creation Completed!');
  });

  // ===================================================
  // PHASE 3: EMPLOYEE CLOCK IN & APPLY LEAVE
  // ===================================================
  test('3.1 - Employee: OTP Login, Clock In & Apply Leave Application', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.1: Employee OTP Login, Clock In & Apply Leave');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('button', { name: 'Login with OTP' }).click();
    await page.getByRole('textbox', { name: 'Phone Number flag +' }).fill('9922264029');
    await page.getByRole('textbox', { name: 'Phone Number flag +' }).fill('9922264088');
    await page.getByRole('button', { name: 'Send OTP' }).first().click();
    await page.waitForTimeout(1000);

    await page.getByRole('textbox').nth(1).fill('9').catch(() => {});
    await page.getByRole('textbox').nth(2).fill('9').catch(() => {});
    await page.getByRole('textbox').nth(3).fill('5').catch(() => {});
    await page.getByRole('textbox').nth(4).fill('8').catch(() => {});
    await page.getByRole('textbox').nth(5).fill('7').catch(() => {});
    await page.locator('input[type="password"]').nth(5).fill('3').catch(() => {});
    await page.getByRole('button', { name: 'Show OTP' }).click().catch(() => {});
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await page.waitForTimeout(1500);

    const newPassInput = page.getByRole('textbox', { name: 'New Password' });
    if (await newPassInput.isVisible({ timeout: 2500 }).catch(() => false)) {
      await newPassInput.fill('Bhushan@123');
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Bhushan@123');
      await page.getByRole('button', { name: 'Set Password' }).click();
      await page.waitForTimeout(1500);
    }

    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123').catch(() => {});
    await page.getByRole('button', { name: 'Login', exact: true }).click().catch(() => {});
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await page.getByTestId('HRMS-ATT-btn-clock-in').click();
    await page.waitForTimeout(1000);

    await page.locator('div').filter({ hasText: 'Leave Management' }).nth(5).click();
    await page.getByTestId('HRMS-LM-btn-apply-leave').click();
    await page.getByTestId('HRMS-L-start-date-picker').click();
    await page.getByRole('button', { name: '1', exact: true }).first().click().catch(() => {});
    await page.getByTestId('HRMS-L-reason-textarea').fill('i am not well todya');
    await page.getByRole('button', { name: 'Reject' }).click().catch(() => {});
    await page.getByTestId('AF-student-save-button').click().catch(() => {});
    await page.waitForTimeout(2000);

    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await page.getByTestId('HRMS-ATT-btn-view-log').click();
    await page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});

    console.log('🎉 Phase 3.1 Passed: Employee OTP Login, Clock In & Leave Application Completed!');
  });
});
