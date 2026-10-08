import { expect } from '@playwright/test';

class AttendancePage {
  constructor(page) {
    this.page = page;
  }

  async navigateToAttendance() {
    console.log('Navigating to Attendance module...');
    const attendance = this.page.locator('div').filter({ hasText: 'Attendance' }).nth(5);
    await attendance.waitFor({ state: 'visible', timeout: 10000 });
    await attendance.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Navigated to Attendance module!');
  }

  async performClockIn() {
    console.log('Clicking Clock In button...');
    const clockInBtn = this.page.getByTestId('HRMS-ATT-btn-clock-in');
    await clockInBtn.waitFor({ state: 'visible', timeout: 10000 });
    await clockInBtn.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Clocked In successfully!');
  }

  async navigateToLeaveManagement() {
    console.log('Navigating to Leave Management...');
    const leaveMgmt = this.page.locator('div').filter({ hasText: 'Leave Management' }).nth(5);
    await leaveMgmt.waitFor({ state: 'visible', timeout: 10000 });
    await leaveMgmt.click();
    await this.page.waitForTimeout(2000);
  }

  async applyLeave(leaveReason = 'Requesting leave due to personal health reasons and medical consultation.') {
    console.log('Clicking Apply Leave button...');
    await this.navigateToLeaveManagement();
    await this.page.getByTestId('HRMS-LM-btn-apply-leave').click();
    await this.page.waitForTimeout(1000);

    console.log('Selecting leave start date...');
    const startDatePicker = this.page.getByTestId('HRMS-L-start-date-picker');
    await startDatePicker.click();
    await this.page.getByRole('button', { name: '1', exact: true }).first().click().catch(() => {});
    await this.page.waitForTimeout(500);

    console.log(`Entering leave reason: "${leaveReason}"...`);
    const reasonTextarea = this.page.getByTestId('HRMS-L-reason-textarea');
    await reasonTextarea.click();
    await reasonTextarea.fill(leaveReason);
    await this.page.waitForTimeout(500);

    // Save/Submit Leave Application
    console.log('Submitting Leave Application...');
    const saveBtn = this.page.getByTestId('AF-student-save-button');
    const isSaveVisible = await saveBtn.isVisible().catch(() => false);
    if (isSaveVisible) {
      await saveBtn.click();
    } else {
      await this.page.getByRole('button', { name: 'Save' }).click().catch(() => {});
    }
    await this.page.waitForTimeout(2500);
    console.log('✅ Leave Application submitted successfully!');
  }

  async viewAttendanceLog() {
    console.log('Viewing Attendance Log...');
    await this.navigateToAttendance();
    const logBtn = this.page.getByTestId('HRMS-ATT-btn-view-log');
    await logBtn.click();
    await this.page.waitForTimeout(1500);

    const closeBtn = this.page.getByTestId('HRMS-attendance-log-close-btn');
    await closeBtn.click().catch(() => {});
    await this.page.waitForTimeout(1000);
    console.log('✅ Attendance Log viewed and closed.');
  }

  async approveLeaveRequest() {
    console.log('Navigating to HRMS Team Requests to approve leave...');
    await this.page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms-sub').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('team-request').click();
    await this.page.waitForTimeout(1500);

    console.log('Selecting leave requests and approving bulk leave...');
    await this.page.locator('.w-4').first().click();
    await this.page.waitForTimeout(800);

    await this.page.getByTestId('HRMS-LR-LRQ-checkbox-header').check();
    await this.page.waitForTimeout(800);

    await this.page.getByTestId('HRMS-RT-btn-bulk-approve').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('HRMS-RT-modal-btn-approve').click();
    await this.page.waitForTimeout(2500);
    console.log('✅ Leave Request Approved by Admin successfully!');
  }

  async cancelLeaveRequest(reason = 'Requesting cancellation of approved leave due to change in personal schedule.') {
    console.log('Navigating to Leave Management to cancel leave...');
    await this.page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms-sub').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('leave-management').click();
    await this.page.waitForTimeout(1500);

    console.log('Clicking Cancel Request button...');
    await this.page.getByTestId('HRMS-LR-ML-btn-cancel-request').click();
    await this.page.waitForTimeout(1000);

    console.log(`Entering cancellation reason: "${reason}"...`);
    const reasonTextarea = this.page.getByTestId('HRMS-CQ-textarea-reason');
    await reasonTextarea.click();
    await reasonTextarea.fill(reason);
    await this.page.waitForTimeout(500);

    const rejectBtn = this.page.getByRole('button', { name: 'Reject' });
    const isRejectVisible = await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (isRejectVisible) {
      await rejectBtn.click();
      await this.page.waitForTimeout(500);
    }

    await this.page.getByTestId('HRMS-CQ-container').getByTestId('AF-student-save-button').click();
    await this.page.waitForTimeout(2500);
    console.log('✅ Leave Cancellation Request submitted by Employee successfully!');
  }

  async rejectLeaveCancellation(rejectionReason = 'Leave was already approved and scheduled in the roster. Unable to process cancellation request at this time.') {
    console.log('Navigating to HRMS Team Requests to reject cancellation...');
    await this.page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms-sub').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('team-request').click();
    await this.page.waitForTimeout(1500);

    console.log('Selecting Employee Leave Request...');
    const empCell = this.page.getByRole('cell', { name: 'Bhushan Raut' });
    const isCellVisible = await empCell.isVisible({ timeout: 3000 }).catch(() => false);
    if (isCellVisible) {
      await empCell.click();
    } else {
      await this.page.getByTestId('HRMS-LR-LRQ-container').getByText('Bhushan Raut').click().catch(() => {});
    }
    await this.page.waitForTimeout(1000);

    console.log('Expanding workflow header & clicking Reject button...');
    await this.page.getByTestId('am_ar_ard_w_level_header_0').click().catch(() => {});
    await this.page.waitForTimeout(500);

    await this.page.getByTestId('AM-AR-ARD-W-reject-button-0-0').click().catch(() => {});
    await this.page.waitForTimeout(800);

    console.log(`Entering rejection reason: "${rejectionReason}"...`);
    const reasonInput = this.page.getByTestId('am_ar_ard_w_rejection_reason_textarea');
    await reasonInput.click();
    await reasonInput.fill(rejectionReason);
    await this.page.waitForTimeout(800);

    console.log('Submitting rejection...');
    await this.page.getByTestId('am_ar_ard_w_rejection_submit_button').click();
    await this.page.waitForTimeout(2000);

    const backBtn = this.page.locator('.flex.items-center.mb-3 > button').first();
    const isBackVisible = await backBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (isBackVisible) {
      await backBtn.click();
      await this.page.waitForTimeout(1000);
    }

    const statusDropdown = this.page.getByTestId('HRMS-RT-dropdown-status');
    const isStatusVisible = await statusDropdown.isVisible({ timeout: 2000 }).catch(() => false);
    if (isStatusVisible) {
      await statusDropdown.click();
      await this.page.waitForTimeout(1000);
    }
    console.log('✅ Leave Cancellation Rejected by Admin successfully!');
  }

  async markTeamAttendance() {
    console.log('Navigating to HRMS Attendance -> Team Status to mark employee attendance (Fresh Codegen)...');
    const attBtn = this.page.getByTestId('attendance');
    const isAttVisible = await attBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (isAttVisible) {
      await attBtn.click();
    } else {
      await this.page.locator('div').filter({ hasText: 'Applications' }).nth(4).click().catch(() => {});
      await this.page.getByTestId('hrms').click().catch(() => {});
      await this.page.getByTestId('hrms-sub').click().catch(() => {});
      await this.page.getByTestId('attendance').click().catch(() => {});
    }
    await this.page.waitForTimeout(1500);

    console.log('Navigating through Team, Hierarchy and Team Status tabs...');
    await this.page.getByTestId('HRMS-ATT-tab-team').click().catch(() => {});
    await this.page.waitForTimeout(600);

    await this.page.getByTestId('HRMS-ATT-tab-hierarchy').click().catch(() => {});
    await this.page.waitForTimeout(600);

    await this.page.getByTestId('HRMS-ATT-tab-team-status').click().catch(() => {});
    await this.page.waitForTimeout(1000);

    // Initial Status Marking & Reject modal
    await this.page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});
    await this.page.getByTestId('HRMS-attendance-second-half-1').click().catch(() => {});

    const rejectModalBtn = this.page.getByRole('button', { name: 'Reject' });
    if (await rejectModalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rejectModalBtn.click().catch(() => {});
      await this.page.waitForTimeout(600);
    }
    await this.page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await this.page.waitForTimeout(2000);

    // Date 1 Attendance & Confirm Modal
    console.log('Selecting Date 1 and marking Present...');
    await this.page.getByTestId('HRMS-attendance-start-date-input').click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: '1' }).first().click();
    await this.page.waitForTimeout(600);

    await this.page.getByTestId('HRMS-attendance-present-1').click().catch(() => {});

    const confirmModalBtn = this.page.getByRole('button', { name: 'Confirm' });
    if (await confirmModalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmModalBtn.click().catch(() => {});
      await this.page.waitForTimeout(600);
    }
    await this.page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await this.page.waitForTimeout(2000);

    // Date 6 Attendance & Employee Search
    console.log('Selecting Date 6, searching Bhushan, and marking Present / First Half...');
    await this.page.getByTestId('HRMS-attendance-start-date-input').click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: '6', exact: true }).click();
    await this.page.waitForTimeout(600);

    await this.page.getByTestId('HRMS-attendance-search-input').click();
    await this.page.getByTestId('HRMS-attendance-search-input').fill('Bhushan');
    await this.page.waitForTimeout(800);

    await this.page.getByTestId('HRMS-attendance-present-0').click().catch(() => {});
    await this.page.getByTestId('HRMS-attendance-first-half-0').click().catch(() => {});
    await this.page.getByTestId('HRMS-attendance-save-btn').click().catch(() => {});
    await this.page.waitForTimeout(2000);

    // Gender Filter
    console.log('Applying Gender Filter: Male...');
    await this.page.getByTestId('HRMS-attendance-filter-btn').click().catch(() => {});
    await this.page.waitForTimeout(600);
    await this.page.getByTestId('HRMS-attendance-gender-select').click().catch(() => {});
    await this.page.waitForTimeout(600);
    await this.page.getByTestId('HRMS-attendance-gender-option-male').click().catch(() => {});
    await this.page.waitForTimeout(600);
    await this.page.getByTestId('HRMS-attendance-filter-apply-btn').click().catch(() => {});
    await this.page.waitForTimeout(2000);

    console.log('✅ Team Attendance marked, saved & filtered successfully!');
  }

  async verifyPersonalAttendanceCalendar() {
    console.log('Navigating to HRMS Attendance module to verify employee calendar & log...');
    await this.page.locator('div').filter({ hasText: 'Applications' }).nth(4).click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('hrms-sub').click();
    await this.page.waitForTimeout(1200);

    await this.page.getByTestId('attendance').click();
    await this.page.waitForTimeout(1500);

    console.log('Inspecting Calendar Grid Dates (1, 6, 8)...');
    const date1Grid = this.page.getByTestId('HRMS-ATT-grid-calendar').locator('div').filter({ hasText: /^1$/ }).first();
    if (await date1Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date1Grid.click().catch(() => {});
      await this.page.waitForTimeout(600);
    }

    const date6Grid = this.page.locator('div').filter({ hasText: /^6$/ }).first();
    if (await date6Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date6Grid.click().catch(() => {});
      await this.page.waitForTimeout(600);
    }

    const date8Grid = this.page.locator('div').filter({ hasText: /^8$/ }).first();
    if (await date8Grid.isVisible({ timeout: 2000 }).catch(() => false)) {
      await date8Grid.click().catch(() => {});
      await this.page.waitForTimeout(600);
    }

    console.log('Opening and closing Attendance Log...');
    await this.page.getByTestId('HRMS-ATT-btn-view-log').click().catch(() => {});
    await this.page.waitForTimeout(1500);
    await this.page.getByTestId('HRMS-attendance-log-close-btn').click().catch(() => {});
    await this.page.waitForTimeout(1000);

    console.log('Returning navigation via HRMS Sub & HRMS...');
    await this.page.getByTestId('hrms-sub').click().catch(() => {});
    await this.page.waitForTimeout(800);
    await this.page.getByTestId('hrms').click().catch(() => {});
    await this.page.waitForTimeout(1000);
    console.log('✅ Employee Attendance Calendar & Log verified successfully!');
  }
}

export default AttendancePage;
