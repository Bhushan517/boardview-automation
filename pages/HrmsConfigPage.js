import { expect } from '@playwright/test';

class HrmsConfigPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToHrmsConfiguration() {
    console.log('Navigating to HRMS Configuration...');
    const hrmsConfig = this.page.locator('div').filter({ hasText: /^HRMS Configuration$/ }).nth(1);
    await hrmsConfig.waitFor({ state: 'visible', timeout: 10000 });
    await hrmsConfig.click();
    await this.page.waitForTimeout(2000);
  }

  async clickAddConfiguration() {
    console.log('Clicking Add Attendance Configuration button...');
    // Target container's Add button to avoid strict mode ambiguity with Credit Leaves button
    const addBtn = this.page.getByTestId('HRMS-ATC-container').getByRole('button', { name: 'Add' });
    const isContainerBtnVisible = await addBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (isContainerBtnVisible) {
      await addBtn.click();
    } else {
      const addByFilter = this.page.getByTestId('HRMS-ATC-btn-add').filter({ hasText: 'Add' }).first();
      const isFilterVisible = await addByFilter.isVisible({ timeout: 3000 }).catch(() => false);
      if (isFilterVisible) {
        await addByFilter.click();
      } else {
        await this.page.getByTestId('HRMS-ATC-btn-add').last().click();
      }
    }
    await this.page.waitForTimeout(1000);
  }

  async enterConfigName(name) {
    console.log(`Entering config name: ${name}...`);
    const input = this.page.getByTestId('HRMS-CAC-input-config-name');
    await input.click();
    await input.fill(name);
    await this.page.waitForTimeout(800);
  }

  async setWorkingDays(days = '7') {
    console.log(`Setting working days per week: ${days}...`);
    const input = this.page.getByRole('row', { name: 'No of working days per week' }).getByTestId('HRMS-CAC-input-numeric');
    await input.click();
    await input.fill(days);
    await this.page.waitForTimeout(800);
  }

  async selectStartWeekday(weekday = 'Monday') {
    console.log(`Selecting start weekday: ${weekday}...`);
    await this.page.getByTestId('HRMS-CAC-dropdown-weekdays').click();
    await this.page.waitForTimeout(500);
    const dayOption = this.page.locator('div').filter({ hasText: new RegExp(`^${weekday}$`) }).first();
    const isVisible = await dayOption.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await dayOption.click();
    } else {
      await this.page.getByText(weekday, { exact: true }).first().click().catch(() => {});
    }
    await this.page.waitForTimeout(800);
  }

  async selectShift(shiftName = 'general') {
    console.log(`Searching & selecting shift: ${shiftName}...`);
    const shiftSearch = this.page.getByTestId('HRMS-CAC-input-shift-search');
    await shiftSearch.click();
    await shiftSearch.fill(shiftName);
    await this.page.waitForTimeout(1000);

    const shiftOptionByTestId = this.page.getByTestId('HRMS-CAC-shift-option').first();
    const isTestIdVisible = await shiftOptionByTestId.isVisible({ timeout: 3000 }).catch(() => false);

    if (isTestIdVisible) {
      await shiftOptionByTestId.click();
    } else {
      console.log('Using fallback for shift selection...');
      const optionText = this.page.getByText(shiftName, { exact: false }).first();
      const isTextVisible = await optionText.isVisible({ timeout: 3000 }).catch(() => false);
      if (isTextVisible) {
        await optionText.click();
      } else {
        await shiftSearch.press('ArrowDown');
        await shiftSearch.press('Enter');
      }
    }
    await this.page.waitForTimeout(800);
  }

  async setLateMarkRules({ maxLateMarks = '0', allowanceMinutes = '0', probationDuration = '0' } = {}) {
    console.log('Setting late mark rules & probation period...');
    
    // Max late marks allowed per month/period
    const maxLateInput = this.page.getByRole('row', { name: 'Max late marks allowed per' }).getByTestId('HRMS-CAC-input-numeric');
    await maxLateInput.click();
    await maxLateInput.fill(maxLateMarks);
    await this.page.waitForTimeout(600);

    // Late Mark Allowance Minutes
    const allowanceInput = this.page.getByRole('row', { name: 'Late Mark Allowance Minutes' }).getByTestId('HRMS-CAC-input-numeric');
    await allowanceInput.click();
    await allowanceInput.fill(allowanceMinutes);
    await this.page.waitForTimeout(600);

    // Probation Period Duration
    const probationInput = this.page.getByRole('row', { name: 'Probation Period Duration' }).getByTestId('HRMS-CAC-input-numeric');
    await probationInput.click();
    await probationInput.fill(probationDuration);
    await this.page.waitForTimeout(600);
  }

  async handleRejectModalIfPresent() {
    const rejectBtn = this.page.getByRole('button', { name: 'Reject' });
    const isVisible = await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      console.log('Clicking Reject button modal...');
      await rejectBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async selectDepartment(deptName = 'IT') {
    console.log(`Selecting department: ${deptName}...`);
    const deptSearch = this.page.getByTestId('HRMS-CAC-input-dept-search');
    const isDeptSearchVisible = await deptSearch.isVisible({ timeout: 2000 }).catch(() => false);
    if (isDeptSearchVisible) {
      await deptSearch.click();
      await this.page.waitForTimeout(800);
      const deptOption = this.page.getByTestId('HRMS-CAC-dept-dropdown').getByText(deptName, { exact: true });
      const isVisible = await deptOption.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        await deptOption.click();
      } else {
        await this.page.getByText(deptName, { exact: true }).first().click().catch(() => {});
      }
      await this.page.waitForTimeout(800);
    }
  }

  async selectLocation(locationName = 'Sangamner') {
    console.log(`Selecting location: ${locationName}...`);
    const locationSearch = this.page.getByTestId('HRMS-CAC-input-location-search');
    const isLocationSearchVisible = await locationSearch.isVisible({ timeout: 2000 }).catch(() => false);
    if (isLocationSearchVisible) {
      await locationSearch.click();
      await this.page.waitForTimeout(800);
      const locOption = this.page.getByText(locationName, { exact: false }).first();
      const isVisible = await locOption.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        await locOption.click();
      } else {
        await locationSearch.fill(locationName);
        await locationSearch.press('Enter');
      }
      await this.page.waitForTimeout(800);
    }
  }

  async clickSaveConfig() {
    console.log('Saving HRMS Attendance Configuration...');
    await this.page.getByTestId('HRMS-CAC-btn-save').click();
    await this.page.waitForTimeout(2500);
    console.log('✅ HRMS Attendance Configuration saved successfully!');
  }

  async navigateToAttendance() {
    console.log('Navigating to Attendance module...');
    const attendance = this.page.locator('div').filter({ hasText: 'Attendance' }).nth(5);
    await attendance.waitFor({ state: 'visible', timeout: 10000 });
    await attendance.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Navigated to Attendance module!');
  }

  // Combined creation workflow helper
  async createAttendanceConfiguration(configData) {
    await this.navigateToHrmsConfiguration();
    await this.clickAddConfiguration();
    await this.enterConfigName(configData.name);
    await this.setWorkingDays(configData.workingDays);
    await this.selectStartWeekday(configData.weekday);
    await this.selectShift(configData.shift);
    await this.setLateMarkRules({
      maxLateMarks: configData.maxLateMarks,
      allowanceMinutes: configData.allowanceMinutes,
      probationDuration: configData.probationDuration
    });
    await this.handleRejectModalIfPresent();
    await this.selectDepartment(configData.department);
    await this.selectLocation(configData.location);
    await this.clickSaveConfig();
    await this.navigateToAttendance();
  }
}

export default HrmsConfigPage;
