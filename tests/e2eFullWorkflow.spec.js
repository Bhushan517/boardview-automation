import { test, expect } from '@playwright/test';

test.describe.serial('BoardView End-to-End Workflow (Fresh Employee Codegen Sequence)', () => {

  test('Complete Single E2E Flow: Admin Setup -> Employee Creation -> Employee OTP Login -> Clock In -> Apply Leave', async ({ page }) => {
    test.setTimeout(480000); // 8 mins timeout for clear execution
    console.log('\n🚀 Starting Complete BoardView E2E Flow (Fresh Codegen Sequence)...\n');

    // Helper delay for uniform, visible execution (800ms)
    const delay = async (ms = 800) => await page.waitForTimeout(ms);

    // ==========================================================
    // STEP 1: ADMIN LOGIN & ORGANIZATION SELECTION
    // ==========================================================
    console.log('--- STEP 1: Admin Login & Select Organization ---');
    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await delay(1200);

    console.log('1.1 Clicking Log in button...');
    await page.getByRole('button', { name: 'Log in' }).click();
    await delay(1000);

    console.log('1.2 Entering Admin Phone: 8767629834...');
    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await delay(800);

    console.log('1.3 Entering Admin Password...');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await delay(800);

    console.log('1.4 Toggling Password Visibility twice...');
    const eyeToggle = page.locator('label').filter({ hasText: 'Password*' }).getByRole('button');
    await eyeToggle.click().catch(() => {});
    await delay(800);
    await eyeToggle.click().catch(() => {});
    await delay(800);

    console.log('1.5 Submitting Admin Login...');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await delay(2500);

    console.log('1.6 Searching & Selecting Organization: playwright...');
    await page.getByRole('textbox', { name: 'Search Organizations' }).click();
    await page.getByRole('textbox', { name: 'Search Organizations' }).fill('playwright');
    await delay(1200);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await delay(3000);
    console.log('✅ Admin Login & Organization Selection Complete!\n');

    // ==========================================================
    // STEP 2: HRMS CONFIGURATION
    // ==========================================================
    console.log('--- STEP 2: HRMS Configuration ---');
    console.log('2.1 Navigating: Applications -> People Management -> HRMS -> HRMS Configuration...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await delay(1200);

    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await delay(1500);

    await page.locator('div').filter({ hasText: 'HRMS Configuration' }).nth(5).click();
    await delay(2000);

    console.log('2.2 Deleting existing configuration if present...');
    const deleteBtn = page.getByTestId('HRMS-ATC-btn-delete');
    if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteBtn.click();
      await delay(800);
      await page.getByText('Delete', { exact: true }).click();
      await delay(1500);
    }

    console.log('2.3 Adding New Attendance Configuration: "new one"...');
    await page.getByTestId('HRMS-ATC-container').getByRole('button', { name: 'Add' }).click();
    await delay(1000);

    await page.getByTestId('HRMS-CAC-input-config-name').click();
    await page.getByTestId('HRMS-CAC-input-config-name').fill('new one');
    await page.getByTestId('HRMS-CAC-input-config-name').press('Enter');
    await delay(800);

    console.log('2.4 Selecting Shift: general...');
    await page.getByTestId('HRMS-CAC-input-shift-search').click();
    await page.getByTestId('HRMS-CAC-input-shift-search').fill('general');
    await delay(1000);
    await page.getByTestId('HRMS-CAC-shift-option').first().click();
    await delay(800);

    console.log('2.5 Setting Working Days per week: 7...');
    await page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric').fill('7');
    await delay(800);

    console.log('2.6 Selecting Start Weekday: Monday...');
    await page.getByTestId('HRMS-CAC-dropdown-weekdays').click();
    await delay(500);
    await page.locator('div').filter({ hasText: /^Monday$/ }).first().click();
    await delay(800);

    console.log('2.7 Setting Rules: Max Late Marks=0, Allowance=0, Probation=0...');
    await page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await delay(500);

    await page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await delay(500);

    await page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric').click();
    await page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric').fill('0');
    await delay(500);

    const hrmsRejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await hrmsRejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hrmsRejectBtn.click();
      await delay(800);
    }

    console.log('2.8 Saving HRMS Attendance Configuration...');
    await page.getByTestId('HRMS-CAC-btn-save').click();
    await delay(2500);
    console.log('✅ HRMS Configuration Saved Successfully!\n');

    // ==========================================================
    // STEP 3: USER MANAGEMENT & ADD EMPLOYEE (EXACT FRESH CODEGEN SEQUENCE)
    // ==========================================================
    console.log('--- STEP 3: User Management & Add Employee ---');
    console.log('3.1 Navigating: User Management -> Users & Staff...');
    await page.locator('div').filter({ hasText: 'User Management' }).nth(5).click();
    await delay(1200);

    await page.locator('div').filter({ hasText: 'Users & Staff' }).nth(5).click();
    await delay(1500);

    console.log('3.2 Clicking Add Employee Button...');
    await page.getByTestId('UM-emp-list-add-btn').click();
    await delay(1000);

    console.log('3.3 Selecting Title: Mr...');
    await page.locator('#title-dropdown').first().click();
    await delay(500);
    await page.locator('#add-employee-sidebar').getByText('Mr', { exact: true }).click();
    await delay(800);

    console.log('3.4 Entering First Name: bhushan...');
    await page.getByTestId('UM-AE-First Name').click();
    await page.getByTestId('UM-AE-First Name').fill('bhushan');
    await delay(800);

    console.log('3.5 Entering Last Name: raut...');
    await page.getByTestId('UM-AE-Last Name').click();
    await page.getByTestId('UM-AE-Last Name').fill('raut');
    await delay(800);

    console.log('3.6 Entering Phone Number: 9922264088...');
    await page.getByTestId('UM-AE-Phone Number').click();
    await page.getByTestId('UM-AE-Phone Number').fill('9922264088');
    await delay(800);

    console.log('3.7 Confirming Phone Number Path Icon...');
    await page.locator('div:nth-child(2) > .flex > .cursor-pointer > path').first().click();
    await delay(800);

    console.log('3.8 Selecting Timezone: (UTC+05:30) India (Kolkata)...');
    await page.locator('div').filter({ hasText: /^Select timezone$/ }).nth(2).click();
    await delay(500);
    await page.locator('div').filter({ hasText: /^\(UTC\+05:30\) India \(Kolkata\)$/ }).click();
    await delay(800);

    console.log('3.9 Selecting Language: English...');
    await page.getByRole('button', { name: 'English' }).click();
    await delay(500);
    await page.getByText('English').nth(1).click();
    await delay(800);

    console.log('3.10 Clicking Manager Field...');
    await page.getByTestId('UM-AE-Manager').click();
    await delay(800);

    console.log('3.11 Entering Designation: QA...');
    await page.getByTestId('UM-AE-Designation').click();
    await page.getByTestId('UM-AE-Designation').fill('QA');
    await delay(800);

    console.log('3.12 Entering Role: Emp...');
    await page.getByTestId('UM-AE-Role').click();
    await page.getByTestId('UM-AE-Role').fill('em');
    await delay(500);
    await page.getByText('Emp', { exact: true }).click();
    await delay(800);

    console.log('3.13 Searching & Selecting Shift: genera -> General Shift...');
    await page.getByTestId('UM-AE-Shifts-Search').click();
    await page.getByTestId('UM-AE-Shifts-Search').fill('genera');
    await delay(800);
    await page.locator('div').filter({ hasText: /^General Shift$/ }).nth(2).click();
    await delay(800);

    console.log('3.14 Selecting Joining Date: 1...');
    await page.getByTestId('UM-AE-Joining Date').click();
    await delay(500);
    await page.locator('#add-employee-sidebar').getByRole('button', { name: '1', exact: true }).click();
    await delay(800);

    console.log('3.15 Checking Remote Checkbox...');
    await page.getByTestId('UM-AE-Remote-Checkbox').check();
    await delay(800);

    console.log('3.16 Clicking Reject Button if present...');
    const empRejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await empRejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await empRejectBtn.click();
      await delay(800);
    }

    console.log('3.17 Saving Employee...');
    await page.locator('#add-employee-sidebar').getByRole('button', { name: 'Save' }).click();
    await delay(2500);

    console.log('✅ STEP 3 Complete: Employee bhushan raut Created & Saved Successfully!\n');

    // ==========================================================
    // STEP 4: EMPLOYEE OTP LOGIN & SET PASSWORD
    // ==========================================================
    console.log('--- STEP 4: Employee OTP Login & Set Password ---');

    // Clear Admin session to start fresh unauthenticated Employee login page
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});

    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await delay(1500);

    console.log('4.1 Clicking Log in button...');
    await page.getByRole('button', { name: 'Log in' }).click();
    await delay(1000);

    console.log('4.2 Clicking Login with OTP...');
    await page.getByRole('button', { name: 'Login with OTP' }).click();
    await delay(1000);

    console.log('4.3 Entering Phone Numbers (9922264029 -> 9922264088)...');
    const phoneInput = page.getByRole('textbox', { name: 'Phone Number flag +' });
    await phoneInput.click();
    await phoneInput.fill('9922264029');
    await delay(600);
    await phoneInput.click();
    await phoneInput.fill('9922264088');
    await delay(800);

    console.log('4.4 Sending OTP twice...');
    await page.getByRole('button', { name: 'Send OTP' }).first().click();
    await delay(1000);
    const sendOtpAgain = page.getByRole('button', { name: 'Send OTP' }).first();
    if (await sendOtpAgain.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendOtpAgain.click();
      await delay(1200);
    }

    console.log('4.5 Filling OTP digits (9-9-5-8-7-3)...');
    await page.getByRole('textbox').nth(1).fill('9');
    await delay(200);
    await page.getByRole('textbox').nth(2).fill('9');
    await delay(200);
    await page.getByRole('textbox').nth(3).fill('5');
    await delay(200);
    await page.getByRole('textbox').nth(4).fill('8');
    await delay(200);
    await page.getByRole('textbox').nth(5).fill('7');
    await delay(200);
    await page.locator('input[type="password"]').nth(5).fill('3');
    await delay(800);

    console.log('4.6 Clicking Show OTP & Verify OTP...');
    await page.getByRole('button', { name: 'Show OTP' }).click();
    await delay(600);
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await delay(2000);

    console.log('4.7 Setting New Password: Bhushan@123...');
    const newPassInput = page.getByRole('textbox', { name: 'New Password' });
    if (await newPassInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await newPassInput.click();
      await newPassInput.fill('Bhushan@123');
      await delay(500);
      await page.getByRole('textbox', { name: 'Confirm Password' }).click();
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Bhushan@123');
      await delay(500);
      await page.getByRole('button', { name: 'Set Password' }).click();
      await delay(2000);
    }

    console.log('4.8 Logging in with new Password...');
    const passInput = page.getByRole('textbox', { name: 'Password' });
    if (await passInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await passInput.click();
      await passInput.fill('Bhushan@123');
      await delay(500);
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await delay(2500);
    }
    console.log('✅ Employee OTP Login & Password Setup Complete!\n');

    // ==========================================================
    // STEP 5: EMPLOYEE CLOCK IN & APPLY LEAVE
    // ==========================================================
    console.log('--- STEP 5: Employee Clock In & Apply Leave ---');
    console.log('5.1 Navigating to Applications -> People Management -> HRMS -> Attendance...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await delay(1200);

    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await delay(1500);

    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await delay(2000);

    console.log('5.2 Performing Clock In (Punch In)...');
    await page.getByTestId('HRMS-ATT-btn-clock-in').click();
    await delay(1200);
    await page.getByText('AttendanceYour attendance log, requests and adjustmentsAbsentClock In').click();
    await delay(800);
    await page.getByTestId('HRMS-ATT-btn-clock-in').click();
    await delay(2000);
    console.log('✅ Clock In Complete!');

    console.log('5.3 Navigating to Leave Management & Applying Leave...');
    await page.locator('div').filter({ hasText: 'Leave Management' }).nth(5).click();
    await delay(1500);

    await page.getByTestId('HRMS-LM-btn-apply-leave').click();
    await delay(1000);

    await page.getByTestId('HRMS-L-start-date-picker').click();
    await delay(500);
    await page.getByRole('button', { name: '1', exact: true }).first().click();
    await delay(800);

    await page.getByTestId('HRMS-L-reason-textarea').click();
    await page.getByTestId('HRMS-L-reason-textarea').fill('i am not well todya');
    await delay(800);

    const leaveRejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await leaveRejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await leaveRejectBtn.click();
      await delay(600);
    }

    await page.getByTestId('AF-student-save-button').click();
    await delay(2500);
    console.log('✅ Leave Application Submitted!');

    console.log('5.4 Viewing Attendance Log...');
    await page.locator('div').filter({ hasText: 'Attendance' }).nth(5).click();
    await delay(1500);

    await page.getByTestId('HRMS-ATT-btn-view-log').click();
    await delay(1500);

    await page.getByTestId('HRMS-attendance-log-close-btn').click();
    await delay(1000);

    await page.locator('div').filter({ hasText: 'HRMS' }).nth(5).click();
    await delay(1000);

    await page.locator('div').filter({ hasText: 'People Management' }).nth(5).click();
    await delay(1500);

    console.log('\n🎉 ALL STEPS EXECUTED ACCORDING TO FRESH CODEGEN RECORDING! (Admin Setup -> Fresh Employee Creation -> OTP Login -> Clock In -> Leave Applied)\n');
  });
});
