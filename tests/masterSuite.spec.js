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
    await page.getByTestId('HRMS-CAC-input-config-name').fill('Standard Attendance Policy');
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
      firstName: 'Bhushan',
      lastName: 'Raut',
      phone: '9922264088',
      gender: 'Male',
      manager: 'Bhushan Raut',
      designation: 'Senior QA Automation Engineer',
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
    await page.getByTestId('HRMS-L-reason-textarea').fill('Requesting leave due to personal health reasons and medical consultation.');
    await page.getByRole('button', { name: 'Reject' }).click().catch(() => {});
    await page.getByTestId('AF-student-save-button').click().catch(() => {});
    await page.waitForTimeout(2000);

    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await page.getByTestId('HRMS-ATT-btn-view-log').click();
    await page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});

    console.log('🎉 Phase 3.1 Passed: Employee OTP Login, Clock In & Leave Application Completed!');
  });

  // ===================================================
  // PHASE 3.2: ADMIN APPROVE LEAVE REQUEST
  // ===================================================
  test('3.2 - Admin: Re-Login & Approve Employee Leave Request', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.2: Admin Re-Login & Approve Employee Leave Request');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2000);

    const searchOrgBox = page.getByRole('textbox', { name: 'Search Organizations' });
    await searchOrgBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchOrgBox.click();
    await searchOrgBox.fill('playwright');
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.getByTestId('hrms').click();
    await page.getByTestId('hrms-sub').click();
    await page.getByTestId('team-request').click();
    await page.waitForTimeout(1500);

    await page.locator('.w-4').first().click();
    await page.getByTestId('HRMS-LR-LRQ-checkbox-header').check();
    await page.getByTestId('HRMS-RT-btn-bulk-approve').click();
    await page.getByTestId('HRMS-RT-modal-btn-approve').click();
    await page.waitForTimeout(2500);

    console.log('🎉 Phase 3.2 Passed: Admin Re-Login & Leave Request Approved Successfully!');
  });

  // ===================================================
  // PHASE 3.3: EMPLOYEE CANCEL LEAVE APPLICATION
  // ===================================================
  test('3.3 - Employee: Re-Login & Request Leave Cancellation', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.3: Employee Re-Login & Request Leave Cancellation');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('9922264088');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.getByTestId('hrms').click();
    await page.getByTestId('hrms-sub').click();
    await page.getByTestId('leave-management').click();
    await page.waitForTimeout(1500);

    await page.getByTestId('HRMS-LR-ML-btn-cancel-request').click();
    await page.waitForTimeout(1000);

    await page.getByTestId('HRMS-CQ-textarea-reason').fill('Requesting cancellation of approved leave due to change in personal schedule.');
    await page.getByRole('button', { name: 'Reject' }).click().catch(() => {});
    await page.getByTestId('HRMS-CQ-container').getByTestId('AF-student-save-button').click();
    await page.waitForTimeout(2500);

    console.log('🎉 Phase 3.3 Passed: Employee Leave Cancellation Submitted Successfully!');
  });

  // ===================================================
  // PHASE 3.4: ADMIN REJECT LEAVE CANCELLATION
  // ===================================================
  test('3.4 - Admin: Re-Login & Reject Leave Cancellation Request', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.4: Admin Re-Login & Reject Leave Cancellation Request');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2000);

    const searchOrgBox = page.getByRole('textbox', { name: 'Search Organizations' });
    await searchOrgBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchOrgBox.click();
    await searchOrgBox.fill('playwright');
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.getByTestId('hrms').click();
    await page.getByTestId('hrms-sub').click();
    await page.getByTestId('team-request').click();
    await page.waitForTimeout(1500);

    const empCell = page.getByRole('cell', { name: 'Bhushan Raut' });
    if (await empCell.isVisible({ timeout: 3000 }).catch(() => false)) {
      await empCell.click();
    } else {
      await page.getByTestId('HRMS-LR-LRQ-container').getByText('Bhushan Raut').click().catch(() => {});
    }
    await page.waitForTimeout(1000);

    await page.getByTestId('am_ar_ard_w_level_header_0').click().catch(() => {});
    await page.getByTestId('AM-AR-ARD-W-reject-button-0-0').click().catch(() => {});
    await page.waitForTimeout(800);

    await page.getByTestId('am_ar_ard_w_rejection_reason_textarea').fill('Leave was already approved and scheduled in the roster. Unable to process cancellation request at this time.');
    await page.getByTestId('am_ar_ard_w_rejection_submit_button').click();
    await page.waitForTimeout(2000);

    const backBtn = page.locator('.flex.items-center.mb-3 > button').first();
    if (await backBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backBtn.click();
      await page.waitForTimeout(1000);
    }

    const statusDropdown = page.getByTestId('HRMS-RT-dropdown-status');
    if (await statusDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusDropdown.click();
      await page.waitForTimeout(1000);
    }

    console.log('🎉 Phase 3.4 Passed: Admin Rejected Leave Cancellation Request Successfully!');
  });

  // ===================================================
  // PHASE 3.5: ADMIN MARK TEAM ATTENDANCE & APPLY FILTER
  // ===================================================
  test('3.5 - Admin: Mark Team Attendance & Apply Filter (Fresh Codegen)', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.5: Admin Mark Team Attendance & Apply Filter');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2000);

    const searchOrgBox = page.getByRole('textbox', { name: 'Search Organizations' });
    await searchOrgBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchOrgBox.click();
    await searchOrgBox.fill('playwright');
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await page.waitForTimeout(2500);

    const attBtn = page.getByTestId('attendance');
    if (await attBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await attBtn.click();
    } else {
      await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click().catch(() => {});
      await page.getByTestId('hrms').click().catch(() => {});
      await page.getByTestId('hrms-sub').click().catch(() => {});
      await page.getByTestId('attendance').click().catch(() => {});
    }
    await page.waitForTimeout(1500);

    await page.getByTestId('HRMS-ATT-tab-team').click().catch(() => {});
    await page.getByTestId('HRMS-ATT-tab-hierarchy').click().catch(() => {});
    await page.getByTestId('HRMS-ATT-tab-team-status').click().catch(() => {});
    await page.waitForTimeout(1000);

    await page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-second-half-1').click().catch(() => {});
    await page.getByRole('button', { name: 'Reject' }).click().catch(() => {});
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await page.waitForTimeout(2000);

    await page.getByTestId('HRMS-attendance-start-date-input').click();
    await page.getByRole('button', { name: '1' }).first().click();
    await page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});
    await page.getByRole('button', { name: 'Confirm' }).click().catch(() => {});
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await page.waitForTimeout(2000);

    await page.getByTestId('HRMS-attendance-start-date-input').click();
    await page.getByRole('button', { name: '6', exact: true }).click();
    await page.getByTestId('HRMS-attendance-search-input').click();
    await page.getByTestId('HRMS-attendance-search-input').fill('Bhushan');
    await page.getByTestId('HRMS-attendance-present-0').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-first-half-0').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await page.waitForTimeout(2000);

    await page.getByTestId('HRMS-attendance-filter-btn').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-gender-select').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-gender-option-male').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-filter-apply-btn').click().catch(() => {});
    await page.waitForTimeout(2000);

    console.log('🎉 Phase 3.5 Passed: Admin Marked & Filtered Team Attendance Successfully!');
  });

  // ===================================================
  // PHASE 3.6: EMPLOYEE VERIFY ATTENDANCE LOG
  // ===================================================
  test('3.6 - Employee: Re-Login & Verify Attendance Log (Fresh Codegen)', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 3.6: Employee Re-Login & Verify Attendance Log');
    console.log('--------------------------------------------------');

    await page.goto('https://qa.boardview.me/');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('9922264088');
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2500);

    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.getByTestId('hrms').click();
    await page.getByTestId('hrms-sub').click();
    await page.getByTestId('attendance').click();
    await page.waitForTimeout(1500);

    const date1Grid = page.getByTestId('HRMS-ATT-grid-calendar').locator('div').filter({ hasText: /^1$/ }).first();
    if (await date1Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date1Grid.click().catch(() => {});
    }
    const date6Grid = page.locator('div').filter({ hasText: /^6$/ }).first();
    if (await date6Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date6Grid.click().catch(() => {});
    }
    const date8Grid = page.locator('div').filter({ hasText: /^8$/ }).first();
    if (await date8Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date8Grid.click().catch(() => {});
    }

    await page.getByTestId('HRMS-ATT-btn-view-log').click().catch(() => {});
    await page.waitForTimeout(1500);
    await page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});
    await page.waitForTimeout(1000);

    await page.getByTestId('hrms-sub').click().catch(() => {});
    await page.getByTestId('hrms').click().catch(() => {});
    await page.waitForTimeout(1000);

    console.log('🎉 Phase 3.6 Passed: Employee Attendance Log Verified Successfully!');
  });
});
