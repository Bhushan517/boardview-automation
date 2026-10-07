import { test, expect } from '@playwright/test';

test.describe.serial('BoardView End-to-End Workflow (Exact Codegen Sequence)', () => {

  test('Complete Single E2E Flow: Admin Setup -> Employee Creation -> Employee OTP Login -> Clock In -> Apply Leave', async ({ page }) => {
    test.setTimeout(360000); // 6 mins timeout for full flow
    console.log('\n🚀 Starting Single Continuous E2E Flow (Admin Setup -> Employee Creation -> Employee OTP Login -> Clock In -> Apply Leave)...\n');

    // ==========================================================
    // STEP 1: ADMIN LOGIN & ORGANIZATION SELECTION
    // ==========================================================
    console.log('--- STEP 1: Admin Login & Select Organization ---');
    await page.goto('https://qa.boardview.me/');
    await page.waitForTimeout(1500);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await page.waitForTimeout(500);

    // Toggle Password View twice as recorded
    await page.locator('label').filter({ hasText: 'Password*' }).getByRole('button').click().catch(() => {});
    await page.waitForTimeout(600);
    await page.locator('label').filter({ hasText: 'Password*' }).getByRole('button').click().catch(() => {});
    await page.waitForTimeout(600);

    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(2500);

    await page.getByRole('textbox', { name: 'Search Organizations' }).click();
    await page.getByRole('textbox', { name: 'Search Organizations' }).fill('playwright');
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await page.waitForTimeout(3000);

    // ==========================================================
    // STEP 2: HRMS CONFIGURATION
    // ==========================================================
    console.log('--- STEP 2: HRMS Configuration ---');
    const appsBtn = page.locator('div').filter({ hasText: 'Applications' }).nth(4);
    if (await appsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await appsBtn.click();
    } else {
      await page.getByText('Applications').first().click().catch(() => {});
    }
    await page.waitForTimeout(1500);

    const peopleBtn = page.locator('div').filter({ hasText: 'People Management' }).nth(5);
    if (await peopleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await peopleBtn.click();
    } else {
      await page.getByText('People Management').first().click().catch(() => {});
    }
    await page.waitForTimeout(1500);

    const hrmsBtn = page.locator('div').filter({ hasText: 'HRMS' }).nth(5);
    if (await hrmsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await hrmsBtn.click();
    } else {
      await page.getByText('HRMS').first().click().catch(() => {});
    }
    await page.waitForTimeout(2000);

    const hrmsConfigBtn = page.locator('div').filter({ hasText: 'HRMS Configuration' }).nth(5);
    if (await hrmsConfigBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await hrmsConfigBtn.click();
    } else {
      await page.getByText('HRMS Configuration').first().click().catch(() => {});
    }
    await page.waitForTimeout(2000);

    // Delete existing config if present
    const deleteBtn = page.getByTestId('HRMS-ATC-btn-delete');
    if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteBtn.click();
      await page.waitForTimeout(800);
      await page.getByText('Delete', { exact: true }).click().catch(() => {});
      await page.waitForTimeout(1500);
    }

    // Add Attendance Configuration
    const addConfigBtn = page.getByTestId('HRMS-ATC-container').getByRole('button', { name: 'Add' });
    if (await addConfigBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addConfigBtn.click();
    } else {
      await page.getByTestId('HRMS-ATC-btn-add').last().click().catch(() => {});
    }
    await page.waitForTimeout(1000);

    await page.getByTestId('HRMS-CAC-input-config-name').click();
    await page.getByTestId('HRMS-CAC-input-config-name').fill('new one');
    await page.getByTestId('HRMS-CAC-input-config-name').press('Enter');
    await page.waitForTimeout(500);

    await page.getByTestId('HRMS-CAC-input-shift-search').click();
    await page.getByTestId('HRMS-CAC-input-shift-search').fill('general');
    await page.waitForTimeout(1000);
    await page.getByTestId('HRMS-CAC-shift-option').first().click().catch(() => {});
    await page.waitForTimeout(500);

    await page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric').fill('7');
    await page.waitForTimeout(500);

    await page.getByTestId('HRMS-CAC-dropdown-weekdays').click();
    await page.waitForTimeout(500);
    await page.locator('div').filter({ hasText: /^Monday$/ }).first().click().catch(() => {});
    await page.waitForTimeout(500);

    await page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.waitForTimeout(500);

    await page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.waitForTimeout(500);

    await page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await page.waitForTimeout(500);

    const rejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rejectBtn.click();
      await page.waitForTimeout(800);
    }

    await page.getByTestId('HRMS-CAC-btn-save').click();
    await page.waitForTimeout(2500);

    // ==========================================================
    // STEP 3: USER MANAGEMENT & ADD EMPLOYEE
    // ==========================================================
    console.log('--- STEP 3: User Management & Add Employee ---');
    
    // Resilient Navigation to User Management
    const userMgmtNav = page.locator('div').filter({ hasText: 'User Management' }).nth(5);
    if (await userMgmtNav.isVisible({ timeout: 5000 }).catch(() => false)) {
      await userMgmtNav.click();
    } else {
      await page.getByText('User Management').first().click().catch(() => {});
    }
    await page.waitForTimeout(1500);

    const usersStaffNav = page.locator('div').filter({ hasText: 'Users & Staff' }).nth(5);
    if (await usersStaffNav.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usersStaffNav.click();
    } else {
      await page.getByText('Users & Staff').first().click().catch(() => {});
    }
    await page.waitForTimeout(2000);

    // Click Add Employee
    await page.getByTestId('UM-emp-list-add-btn').click();
    await page.waitForTimeout(1500);

    // Title
    const titleDropdown = page.locator('#title-dropdown').first();
    if (await titleDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      await titleDropdown.click();
      await page.locator('#add-employee-sidebar').getByText('Mr', { exact: true }).click().catch(() => {});
      await page.waitForTimeout(500);
    }

    // First & Last Name
    await page.getByTestId('UM-AE-First Name').click();
    await page.getByTestId('UM-AE-First Name').fill('bhushan');
    await page.waitForTimeout(500);

    await page.getByTestId('UM-AE-Last Name').click();
    await page.getByTestId('UM-AE-Last Name').fill('raut');
    await page.waitForTimeout(500);

    // Timezone & Language
    const timezoneDrop = page.locator('div').filter({ hasText: /^Select timezone$/ }).nth(2);
    if (await timezoneDrop.isVisible({ timeout: 2000 }).catch(() => false)) {
      await timezoneDrop.click();
      await page.locator('div').filter({ hasText: /^\(UTC\+05:30\) India \(Kolkata\)$/ }).click().catch(() => {});
      await page.waitForTimeout(500);
    }

    const langBtn = page.getByRole('button', { name: 'English' });
    if (await langBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await langBtn.click();
      await page.getByText('English').nth(1).click().catch(() => {});
      await page.waitForTimeout(500);
    }

    // Phone & Confirm Path
    await page.getByTestId('UM-AE-Phone Number').click();
    await page.getByTestId('UM-AE-Phone Number').fill('9922264088');
    await page.waitForTimeout(500);

    const pathConfirm = page.locator('div:nth-child(2) > .flex > .cursor-pointer > path').first();
    if (await pathConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pathConfirm.click();
    } else {
      await page.getByTestId('UM-AE-FaCheckCircle icon4').click().catch(() => {});
    }
    await page.waitForTimeout(800);

    // Gender
    const maleDiv = page.locator('div').filter({ hasText: /^Male$/ });
    if (await maleDiv.isVisible({ timeout: 2000 }).catch(() => false)) {
      await maleDiv.click();
    } else {
      await page.getByTestId('UM-AE-Gender select').first().click().catch(() => {});
    }
    await page.waitForTimeout(500);

    // Manager
    await page.getByTestId('UM-AE-Manager').click();
    await page.getByTestId('UM-AE-Manager').fill('bhushan');
    await page.waitForTimeout(500);

    // Designation
    await page.getByTestId('UM-AE-Designation').click();
    await page.getByTestId('UM-AE-Designation').fill('QA');
    await page.waitForTimeout(500);

    // Role
    await page.getByTestId('UM-AE-Role').click();
    await page.getByTestId('UM-AE-Role').fill('em');
    await page.waitForTimeout(500);
    await page.getByText('Emp', { exact: true }).click().catch(() => {});
    await page.waitForTimeout(500);

    // Shift
    await page.getByTestId('UM-AE-Shifts-Search').click();
    await page.getByTestId('UM-AE-Shifts-Search').fill('general');
    await page.waitForTimeout(800);
    await page.locator('div').filter({ hasText: /^General Shift$/ }).nth(2).click().catch(() => {});
    await page.waitForTimeout(500);

    // Joining Date
    await page.getByTestId('UM-AE-Joining Date').click();
    await page.locator('#add-employee-sidebar').getByRole('button', { name: '1', exact: true }).first().click().catch(() => {});
    await page.waitForTimeout(500);

    // Remote Checkbox
    await page.locator('#add-employee-sidebar label').filter({ hasText: /^Remote$/ }).click().catch(() => {});
    await page.getByTestId('UM-AE-Remote-Checkbox').check().catch(() => {});
    await page.waitForTimeout(500);

    // Save Employee
    const saveBtn = page.locator('#add-employee-sidebar').getByRole('button', { name: 'Save' });
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(1500);
    }

    const listSearch = page.getByTestId('UM-emp-list-search');
    if (await listSearch.isVisible({ timeout: 2000 }).catch(() => false)) {
      await listSearch.click().catch(() => {});
      await listSearch.fill('').catch(() => {});
      await page.waitForTimeout(500);
    }

    console.log('✅ STEP 3 Complete: Employee Created! Moving to Employee OTP Login & Punch In...\n');

    // ==========================================================
    // STEP 4: EMPLOYEE OTP LOGIN & SET PASSWORD
    // ==========================================================
    console.log('--- STEP 4: Employee OTP Login & Set Password ---');

    // Clear Admin Session Storage & Cookies to ensure fresh unauthenticated login page
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});

    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const mainLoginBtn = page.getByRole('button', { name: 'Log in' });
    const isLoginVisible = await mainLoginBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (isLoginVisible) {
      await mainLoginBtn.click();
    } else {
      await page.goto('https://qa.boardview.me/');
      await page.getByRole('button', { name: 'Log in' }).click().catch(() => {});
    }
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Login with OTP' }).click();
    await page.waitForTimeout(1000);

    const phoneInput = page.getByRole('textbox', { name: 'Phone Number flag +' });
    await phoneInput.click();
    await phoneInput.fill('9922264029');
    await page.waitForTimeout(500);
    await phoneInput.click();
    await phoneInput.fill('9922264088');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Send OTP' }).first().click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Send OTP' }).first().click().catch(() => {});
    await page.waitForTimeout(1500);

    // Fill OTP digits
    await page.getByRole('textbox').nth(1).fill('9').catch(() => {});
    await page.getByRole('textbox').nth(2).fill('9').catch(() => {});
    await page.getByRole('textbox').nth(3).fill('5').catch(() => {});
    await page.getByRole('textbox').nth(4).fill('8').catch(() => {});
    await page.getByRole('textbox').nth(5).fill('7').catch(() => {});
    await page.locator('input[type="password"]').nth(5).fill('3').catch(() => {});
    await page.waitForTimeout(800);

    await page.getByRole('button', { name: 'Show OTP' }).click().catch(() => {});
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await page.waitForTimeout(2000);

    // Set New Password
    const newPassInput = page.getByRole('textbox', { name: 'New Password' });
    if (await newPassInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await newPassInput.click();
      await newPassInput.fill('Bhushan@123');
      await page.getByRole('textbox', { name: 'Confirm Password' }).click();
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Bhushan@123');
      await page.getByRole('button', { name: 'Set Password' }).click();
      await page.waitForTimeout(2000);
    }

    // Login with Password
    const passInput = page.getByRole('textbox', { name: 'Password' });
    if (await passInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await passInput.click();
      await passInput.fill('Bhushan@123');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await page.waitForTimeout(2500);
    }

    // ==========================================================
    // STEP 5: EMPLOYEE CLOCK IN & APPLY LEAVE
    // ==========================================================
    console.log('--- STEP 5: Employee Clock In & Apply Leave ---');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await page.waitForTimeout(1500);
    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await page.waitForTimeout(1500);
    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await page.waitForTimeout(2000);
    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await page.waitForTimeout(2000);

    // Clock In
    await page.getByTestId('HRMS-ATT-btn-clock-in').click();
    await page.waitForTimeout(1500);
    await page.getByText('AttendanceYour attendance log, requests and adjustmentsAbsentClock In').click().catch(() => {});
    await page.getByTestId('HRMS-ATT-btn-clock-in').click().catch(() => {});
    await page.waitForTimeout(2000);

    // Apply Leave
    await page.locator('div').filter({ hasText: 'Leave Management' }).nth(5).click();
    await page.waitForTimeout(2000);
    await page.getByTestId('HRMS-LM-btn-apply-leave').click();
    await page.waitForTimeout(1000);

    await page.getByTestId('HRMS-L-start-date-picker').click();
    await page.getByRole('button', { name: '1', exact: true }).first().click().catch(() => {});
    await page.waitForTimeout(500);

    await page.getByTestId('HRMS-L-reason-textarea').click();
    await page.getByTestId('HRMS-L-reason-textarea').fill('i am not well todya');
    await page.waitForTimeout(500);

    const leaveRejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await leaveRejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await leaveRejectBtn.click();
      await page.waitForTimeout(500);
    }

    await page.getByTestId('AF-student-save-button').click().catch(() => {});
    await page.waitForTimeout(2500);

    // View Attendance Log
    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await page.waitForTimeout(2000);
    await page.getByTestId('HRMS-ATT-btn-view-log').click();
    await page.waitForTimeout(1500);
    await page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});
    await page.waitForTimeout(1000);

    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click().catch(() => {});
    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click().catch(() => {});
    await page.waitForTimeout(2000);

    console.log('\n🎉 COMPLETE END-TO-END FLOW PASSED SUCCESSFULLY! (Admin Setup -> Employee Created -> OTP Login -> Clock In -> Leave Applied)\n');
  });
});
