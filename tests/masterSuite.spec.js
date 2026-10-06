import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BoardPage from '../pages/BoardPage.js';
import HrmsConfigPage from '../pages/HrmsConfigPage.js';

test.describe.serial('BoardView Professional End-to-End QA Suite', () => {
  let loginPage;
  let boardPage;
  let hrmsConfigPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000); // 3 mins timeout per test
    loginPage = new LoginPage(page);
    boardPage = new BoardPage(page);
    hrmsConfigPage = new HrmsConfigPage(page);
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
    await loginPage.attemptInvalidLogin('8767629834', 'WrongPassword@999');
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
    await loginPage.attemptInvalidLogin('9000000000', 'Bhushan@123');
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();
    console.log('✅ Phase 1.3 Passed: Unregistered phone blocked.');
  });

  // ===================================================
  // PHASE 2: POSITIVE LOGIN & HRMS CONFIGURATION FLOW
  // ===================================================
  test('2.1 - Positive: Valid Login & HRMS Attendance Configuration', async ({ page }) => {
    console.log('\n--------------------------------------------------');
    console.log('PHASE 2.1: Valid Login, Org Selection & HRMS Config');
    console.log('--------------------------------------------------');

    // Step 1: Valid Login
    await loginPage.login('8767629834', 'Bhushan@123', 'the baap');

    // Step 2: Open HRMS Module
    await boardPage.navigateToHrmsModule();

    // Step 3: Configure Attendance
    await hrmsConfigPage.navigateToHrmsConfiguration();
    await hrmsConfigPage.clickAddConfiguration();
    await hrmsConfigPage.enterConfigName('default');
    await hrmsConfigPage.setWorkingDays('6');
    await hrmsConfigPage.selectStartWeekday('Monday');
    await hrmsConfigPage.selectShift('gene');
    await hrmsConfigPage.setLateMarkRules({
      maxLateMarks: '0',
      allowanceMinutes: '0',
      probationDuration: '0'
    });
    await hrmsConfigPage.handleRejectModalIfPresent();
    await hrmsConfigPage.selectDepartment('IT');
    await hrmsConfigPage.selectLocation('Sangamner');
    await hrmsConfigPage.clickSaveConfig();
    await hrmsConfigPage.navigateToAttendance();

    console.log('🎉 Phase 2.1 Passed: Valid Login & HRMS Attendance Configuration Completed!');
  });
});
