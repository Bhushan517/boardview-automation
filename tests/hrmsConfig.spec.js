import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BoardPage from '../pages/BoardPage.js';
import HrmsConfigPage from '../pages/HrmsConfigPage.js';

test.describe('BoardView QA - HRMS Attendance Configuration Test Suite', () => {
  let loginPage;
  let boardPage;
  let hrmsConfigPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000); // 3 minutes timeout for full flow with delays
    loginPage = new LoginPage(page);
    boardPage = new BoardPage(page);
    hrmsConfigPage = new HrmsConfigPage(page);
  });

  test('Create HRMS Attendance Configuration & Navigate to Attendance', async ({ page }) => {
    console.log('🚀 Starting HRMS Attendance Configuration End-to-End Test...\n');

    // Step 1: Login & Select Organization
    await loginPage.login('8767629834', 'Bhushan@123', 'the baap');

    // Step 2: Open HRMS Module
    await boardPage.navigateToHrmsModule();

    // Step 3: Navigate to HRMS Configuration & Add Attendance Configuration
    await hrmsConfigPage.navigateToHrmsConfiguration();
    await hrmsConfigPage.clickAddConfiguration();

    // Step 4: Fill Attendance Configuration Form
    await hrmsConfigPage.enterConfigName('default');
    await hrmsConfigPage.setWorkingDays('6');
    await hrmsConfigPage.selectStartWeekday('Monday');
    await hrmsConfigPage.selectShift('gene');
    await hrmsConfigPage.setLateMarkRules({
      maxLateMarks: '0',
      allowanceMinutes: '0',
      probationDuration: '0'
    });

    // Handle any popups/modals
    await hrmsConfigPage.handleRejectModalIfPresent();

    // Step 5: Select Department & Location
    await hrmsConfigPage.selectDepartment('IT');
    await hrmsConfigPage.selectLocation('Sangamner');

    // Step 6: Save Configuration & Navigate to Attendance
    await hrmsConfigPage.clickSaveConfig();
    await hrmsConfigPage.navigateToAttendance();

    console.log('\n🎉 HRMS Attendance Configuration Test completed successfully!');
  });
});
