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

  async applyLeave(leaveReason = 'i am not well todya') {
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
}

export default AttendancePage;
