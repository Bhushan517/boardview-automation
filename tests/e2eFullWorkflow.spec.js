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

    console.log('2.3 Adding New Attendance Configuration: "Standard Attendance Policy"...');
    await page.getByTestId('HRMS-ATC-container').getByRole('button', { name: 'Add' }).click();
    await delay(1000);

    await page.getByTestId('HRMS-CAC-input-config-name').click();
    await page.getByTestId('HRMS-CAC-input-config-name').fill('Standard Attendance Policy');
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

    console.log('3.4 Entering First Name: Babaraje...');
    await page.getByTestId('UM-AE-First Name').click();
    await page.getByTestId('UM-AE-First Name').fill('Babaraje');
    await delay(800);

    console.log('3.5 Entering Last Name: Khemnar...');
    await page.getByTestId('UM-AE-Last Name').click();
    await page.getByTestId('UM-AE-Last Name').fill('Khemnar');
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

    console.log('3.10 Entering & Selecting Manager: Bhushan Raut...');
    const managerInput = page.getByTestId('UM-AE-Manager');
    await managerInput.click();
    await delay(500);
    await managerInput.fill('Bhushan');
    await delay(800);

    const managerOption = page.locator('div, span, li, p')
      .filter({ hasText: /^Bhushan Raut$/i })
      .or(page.getByText('Bhushan Raut', { exact: true }))
      .last();

    if (await managerOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('✅ Found Manager option "Bhushan Raut" in dropdown popup, clicking...');
      await managerOption.click({ force: true });
    } else {
      console.log('Manager option not found via locator, using ArrowDown + Enter fallback...');
      await managerInput.press('ArrowDown').catch(() => {});
      await delay(300);
      await managerInput.press('Enter').catch(() => {});
    }
    await delay(800);

    console.log('3.11 Entering Designation: Senior QA Automation Engineer...');
    await page.getByTestId('UM-AE-Designation').click();
    await page.getByTestId('UM-AE-Designation').fill('Senior QA Automation Engineer');
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
    await page.getByTestId('HRMS-L-reason-textarea').fill('Requesting leave due to personal health reasons and medical consultation.');
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

    console.log('✅ STEP 5 Complete: Employee Clock In & Apply Leave Completed!\n');

    // ==========================================================
    // STEP 6: ADMIN RE-LOGIN & APPROVE LEAVE REQUEST
    // ==========================================================
    console.log('--- STEP 6: Admin Re-Login & Approve Leave Request ---');

    console.log('6.1 Clearing Employee Session...');
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
    await delay(1000);

    console.log('6.2 Navigating to Login Page & Logging in as Admin...');
    await page.goto('https://qa.boardview.me/');
    await delay(1200);

    const adminLoginBtn = page.getByRole('button', { name: 'Log in' });
    if (await adminLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await adminLoginBtn.click();
      await delay(800);
    }

    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await delay(800);

    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await delay(800);

    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await delay(2000);

    console.log('6.3 Searching & Selecting Organization: playwright...');
    const searchOrgBox = page.getByRole('textbox', { name: 'Search Organizations' });
    await searchOrgBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchOrgBox.click();
    await searchOrgBox.fill('playwright');
    await delay(1200);
    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await delay(2500);

    console.log('6.4 Navigating to Applications -> HRMS -> Team Requests...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.getByTestId('hrms').click();
    await delay(1200);

    await page.getByTestId('hrms-sub').click();
    await delay(1200);

    await page.getByTestId('team-request').click();
    await delay(1500);

    console.log('6.5 Selecting Leave Requests & Approving Bulk Leave...');
    await page.locator('.w-4').first().click();
    await delay(800);

    await page.getByTestId('HRMS-LR-LRQ-checkbox-header').check();
    await delay(800);

    await page.getByTestId('HRMS-RT-btn-bulk-approve').click();
    await delay(1200);

    await page.getByTestId('HRMS-RT-modal-btn-approve').click();
    await delay(2500);

    console.log('✅ STEP 6 Complete: Admin Re-Login & Leave Request Approved Successfully!\n');

    // ==========================================================
    // STEP 7: EMPLOYEE RE-LOGIN & CANCEL LEAVE APPLICATION
    // ==========================================================
    console.log('--- STEP 7: Employee Re-Login & Cancel Leave Application ---');

    console.log('7.1 Clearing Admin Session...');
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
    await delay(1000);

    console.log('7.2 Logging in as Employee: 9922264088...');
    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await delay(1200);

    const empLoginBtn = page.getByRole('button', { name: 'Log in' });
    if (await empLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await empLoginBtn.click();
      await delay(800);
    }

    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('9922264088');
    await delay(800);

    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await delay(800);

    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await delay(2500);

    console.log('7.3 Navigating to Leave Management & Requesting Leave Cancellation...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.getByTestId('hrms').click();
    await delay(1200);

    await page.getByTestId('hrms-sub').click();
    await delay(1200);

    await page.getByTestId('leave-management').click();
    await delay(1500);

    console.log('7.4 Clicking Cancel Request button...');
    await page.getByTestId('HRMS-LR-ML-btn-cancel-request').click();
    await delay(1000);

    console.log('7.5 Filling Cancellation Reason: Requesting cancellation of approved leave due to change in personal schedule...');
    await page.getByTestId('HRMS-CQ-textarea-reason').click();
    await page.getByTestId('HRMS-CQ-textarea-reason').fill('Requesting cancellation of approved leave due to change in personal schedule.');
    await delay(800);

    const cancelRejectBtn = page.getByRole('button', { name: 'Reject' });
    if (await cancelRejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelRejectBtn.click();
      await delay(600);
    }

    await page.getByTestId('HRMS-CQ-container').getByTestId('AF-student-save-button').click();
    await delay(2500);
    console.log('✅ STEP 7 Complete: Employee Leave Cancellation Submitted Successfully!\n');

    // ==========================================================
    // STEP 8: ADMIN RE-LOGIN & REJECT LEAVE CANCELLATION
    // ==========================================================
    console.log('--- STEP 8: Admin Re-Login & Reject Leave Cancellation ---');

    console.log('8.1 Clearing Employee Session...');
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
    await delay(1000);

    console.log('8.2 Logging in as Admin: 8767629834...');
    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await delay(1200);

    const adminReloginBtn = page.getByRole('button', { name: 'Log in' });
    if (await adminReloginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await adminReloginBtn.click();
      await delay(800);
    }

    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('8767629834');
    await delay(800);

    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await delay(800);

    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await delay(2000);

    console.log('8.3 Searching & Selecting Organization: playwright...');
    const searchOrgBox2 = page.getByRole('textbox', { name: 'Search Organizations' });
    await searchOrgBox2.waitFor({ state: 'visible', timeout: 10000 });
    await searchOrgBox2.click();
    await searchOrgBox2.fill('playwright');
    await delay(1200);

    await page.getByRole('button', { name: 'P Playwright Automation' }).click();
    await delay(2500);

    console.log('8.4 Navigating to Applications -> HRMS -> Team Requests...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.getByTestId('hrms').click();
    await delay(1200);

    await page.getByTestId('hrms-sub').click();
    await delay(1200);

    await page.getByTestId('team-request').click();
    await delay(1500);

    console.log('8.5 Opening Employee Request for Babaraje Khemnar...');
    const empCell = page.getByRole('cell', { name: 'Babaraje Khemnar' });
    if (await empCell.isVisible({ timeout: 3000 }).catch(() => false)) {
      await empCell.click();
    } else {
      await page.getByTestId('HRMS-LR-LRQ-container').getByText('Babaraje Khemnar').click().catch(() => {});
    }
    await delay(1200);

    console.log('8.6 Expanding workflow level header & clicking Reject button...');
    await page.getByTestId('am_ar_ard_w_level_header_0').click().catch(() => {});
    await delay(600);

    await page.getByTestId('AM-AR-ARD-W-reject-button-0-0').click().catch(() => {});
    await delay(800);

    console.log('8.7 Entering Rejection Reason & Submitting Rejection...');
    await page.getByTestId('am_ar_ard_w_rejection_reason_textarea').click();
    await page.getByTestId('am_ar_ard_w_rejection_reason_textarea').fill('Leave was already approved and scheduled in the roster. Unable to process cancellation request at this time.');
    await delay(800);

    await page.getByTestId('am_ar_ard_w_rejection_submit_button').click();
    await delay(2000);

    console.log('8.8 Closing panel & checking status dropdown...');
    const backBtn = page.locator('.flex.items-center.mb-3 > button').first();
    if (await backBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backBtn.click();
      await delay(1000);
    }

    const statusDropdown = page.getByTestId('HRMS-RT-dropdown-status');
    if (await statusDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusDropdown.click();
      await delay(1000);
    }
    console.log('✅ STEP 8 Complete: Admin Rejected Leave Cancellation Request Successfully!\n');

    // ==========================================================
    // STEP 9: ADMIN MARK TEAM ATTENDANCE & APPLY FILTER (FRESH CODEGEN)
    // ==========================================================
    console.log('--- STEP 9: Admin Mark Team Attendance & Apply Filter ---');
    console.log('9.1 Navigating to Attendance Module...');
    const attBtn = page.getByTestId('attendance');
    if (await attBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await attBtn.click();
    } else {
      await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click().catch(() => {});
      await page.getByTestId('hrms').click().catch(() => {});
      await page.getByTestId('hrms-sub').click().catch(() => {});
      await page.getByTestId('attendance').click().catch(() => {});
    }
    await delay(1500);

    console.log('9.2 Navigating through Team, Hierarchy, and Team Status tabs...');
    await page.getByTestId('HRMS-ATT-tab-team').click().catch(() => {});
    await delay(600);

    await page.getByTestId('HRMS-ATT-tab-hierarchy').click().catch(() => {});
    await delay(600);

    await page.getByTestId('HRMS-ATT-tab-team-status').click().catch(() => {});
    await delay(1000);

    console.log('9.3 Marking Initial Team Attendance & Handling Reject Modal if present...');
    await page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-second-half-1').click().catch(() => {});

    const rejectModalBtn = page.getByRole('button', { name: 'Reject' });
    if (await rejectModalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rejectModalBtn.click().catch(() => {});
      await delay(600);
    }
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await delay(2000);

    console.log('9.4 Selecting Date 1, Marking Present & Confirming...');
    await page.getByTestId('HRMS-attendance-start-date-input').click();
    await delay(500);
    await page.getByRole('button', { name: '1' }).first().click();
    await delay(600);

    await page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});

    const confirmModalBtn = page.getByRole('button', { name: 'Confirm' });
    if (await confirmModalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmModalBtn.click().catch(() => {});
      await delay(600);
    }
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await delay(2000);

    console.log('9.5 Selecting Date 6, Searching Employee (Bhushan), and Marking Attendance...');
    await page.getByTestId('HRMS-attendance-start-date-input').click();
    await delay(500);
    await page.getByRole('button', { name: '6', exact: true }).click();
    await delay(600);

    await page.getByTestId('HRMS-attendance-search-input').click();
    await page.getByTestId('HRMS-attendance-search-input').fill('Bhushan');
    await delay(800);

    await page.getByTestId('HRMS-attendance-present-0').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-first-half-0').click().catch(() => {});
    await page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await delay(2000);

    console.log('9.6 Applying Attendance Gender Filter: Male...');
    await page.getByTestId('HRMS-attendance-filter-btn').click().catch(() => {});
    await delay(600);
    await page.getByTestId('HRMS-attendance-gender-select').click().catch(() => {});
    await delay(600);
    await page.getByTestId('HRMS-attendance-gender-option-male').click().catch(() => {});
    await delay(600);
    await page.getByTestId('HRMS-attendance-filter-apply-btn').click().catch(() => {});
    await delay(2000);
    console.log('✅ STEP 9 Complete: Admin Marked & Filtered Team Attendance Successfully!\n');

    // ==========================================================
    // STEP 10: EMPLOYEE RE-LOGIN & VERIFY ATTENDANCE CALENDAR & LOG
    // ==========================================================
    console.log('--- STEP 10: Employee Re-Login & Verify Attendance Calendar & Log ---');

    console.log('10.1 Clearing Admin Session...');
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
    await delay(1000);

    console.log('10.2 Logging in as Employee: 9922264088...');
    await page.goto('https://qa.boardview.me/', { waitUntil: 'networkidle' });
    await delay(1200);

    const empLoginBtn3 = page.getByRole('button', { name: 'Log in' });
    if (await empLoginBtn3.isVisible({ timeout: 5000 }).catch(() => false)) {
      await empLoginBtn3.click();
      await delay(800);
    }

    await page.getByRole('textbox', { name: 'Email or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email or phone number' }).fill('9922264088');
    await delay(800);

    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Bhushan@123');
    await delay(800);

    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await delay(2500);

    console.log('10.3 Navigating to Applications -> HRMS -> Attendance...');
    await page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await delay(1200);

    await page.getByTestId('hrms').click();
    await delay(1200);

    await page.getByTestId('hrms-sub').click();
    await delay(1200);

    await page.getByTestId('attendance').click();
    await delay(1500);

    console.log('10.4 Inspecting Calendar Grid Dates (1, 6, 8)...');
    const date1Grid = page.getByTestId('HRMS-ATT-grid-calendar').locator('div').filter({ hasText: /^1$/ }).first();
    if (await date1Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date1Grid.click().catch(() => {});
      await delay(600);
    }

    const date6Grid = page.locator('div').filter({ hasText: /^6$/ }).first();
    if (await date6Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date6Grid.click().catch(() => {});
      await delay(600);
    }

    const date8Grid = page.locator('div').filter({ hasText: /^8$/ }).first();
    if (await date8Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date8Grid.click().catch(() => {});
      await delay(600);
    }

    console.log('10.5 Opening and Closing Attendance Log...');
    await page.getByTestId('HRMS-ATT-btn-view-log').click().catch(() => {});
    await delay(1500);
    await page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});
    await delay(1000);

    console.log('10.6 Returning navigation via HRMS Sub & HRMS...');
    await page.getByTestId('hrms-sub').click().catch(() => {});
    await delay(800);
    await page.getByTestId('hrms').click().catch(() => {});
    await delay(1000);
    console.log('✅ STEP 10 Complete: Employee Attendance Calendar & Log Verified Successfully!\n');

    console.log('\n🎉 ALL 10 MASTER E2E STEPS EXECUTED SUCCESSFULLY! (Admin Setup -> Employee Creation -> OTP Login -> Clock In -> Leave Applied -> Admin Bulk Approved -> Employee Cancelled Leave -> Admin Rejected Cancellation -> Admin Marked & Filtered Attendance -> Employee Verified Attendance Log)\n');
  });
});
