import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import BoardPage from '../pages/BoardPage.js';

test.describe('BoardView QA Automation', () => {
  let loginPage;
  let boardPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000); // 2 minute timeout for slow execution
    loginPage = new LoginPage(page);
    boardPage = new BoardPage(page);
  });

  test('Login and Navigate to HRMS Module', async ({ page }) => {
    console.log('🚀 Starting BoardView Login and HRMS Navigation Test...');

    // Step 1: Perform Login
    await loginPage.login('8767629834', 'Bhushan@123', 'the baap');

    // Step 2: Navigate to HRMS Module
    await boardPage.navigateToHrmsModule();

    console.log('🎉 Test completed successfully!');
  });
});
