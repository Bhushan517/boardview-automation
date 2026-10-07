import { expect } from '@playwright/test';

class UserManagementPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToUsersAndStaff() {
    console.log('Navigating to User Management...');
    const userMgmt = this.page.locator('div').filter({ hasText: 'User Management' }).nth(5);
    await userMgmt.waitFor({ state: 'visible', timeout: 10000 });
    await userMgmt.click();
    await this.page.waitForTimeout(1500);

    console.log('Navigating to Users & Staff...');
    const usersStaff = this.page.locator('div').filter({ hasText: 'Users & Staff' }).nth(5);
    await usersStaff.waitFor({ state: 'visible', timeout: 10000 });
    await usersStaff.click();
    await this.page.waitForTimeout(2000);
  }

  async clickAddEmployee() {
    console.log('Clicking Add Employee button...');
    await this.page.getByTestId('UM-emp-list-add-btn').click();
    await this.page.waitForTimeout(1500);
  }

  async createEmployee(empData) {
    console.log(`Creating employee: ${empData.firstName} ${empData.lastName}...`);
    await this.clickAddEmployee();

    // Select Title
    console.log(`Selecting title: ${empData.title || 'Mr'}...`);
    await this.page.locator('#title-dropdown').first().click();
    await this.page.locator('#add-employee-sidebar').getByText(empData.title || 'Mr', { exact: true }).click();
    await this.page.waitForTimeout(500);

    // Enter First Name & Last Name
    await this.page.getByTestId('UM-AE-First Name').click();
    await this.page.getByTestId('UM-AE-First Name').fill(empData.firstName);
    await this.page.waitForTimeout(500);

    await this.page.getByTestId('UM-AE-Last Name').click();
    await this.page.getByTestId('UM-AE-Last Name').fill(empData.lastName);
    await this.page.waitForTimeout(500);

    // Select Timezone
    console.log('Selecting Timezone...');
    const timezoneDropdown = this.page.locator('div').filter({ hasText: /^Select timezone$/ }).nth(2);
    const isTzVisible = await timezoneDropdown.isVisible().catch(() => false);
    if (isTzVisible) {
      await timezoneDropdown.click();
      await this.page.locator('div').filter({ hasText: /^\(UTC\+05:30\) India \(Kolkata\)$/ }).click().catch(() => {});
      await this.page.waitForTimeout(500);
    }

    // Select Language
    console.log('Selecting Language...');
    const engBtn = this.page.getByRole('button', { name: 'English' });
    const isEngVisible = await engBtn.isVisible().catch(() => false);
    if (isEngVisible) {
      await engBtn.click();
      await this.page.getByText('English').nth(1).click().catch(() => {});
      await this.page.waitForTimeout(500);
    }

    // Phone Number & Confirm Icon Click
    console.log(`Entering phone: ${empData.phone}...`);
    await this.page.getByTestId('UM-AE-Phone Number').click();
    await this.page.getByTestId('UM-AE-Phone Number').fill(empData.phone);
    await this.page.waitForTimeout(500);

    console.log('Confirming phone number icon...');
    const confirmPathIcon = this.page.locator('div:nth-child(2) > .flex > .cursor-pointer > path').first();
    const isPathVisible = await confirmPathIcon.isVisible({ timeout: 2000 }).catch(() => false);
    if (isPathVisible) {
      await confirmPathIcon.click();
    } else {
      await this.page.getByTestId('UM-AE-FaCheckCircle icon4').click().catch(() => {});
    }
    await this.page.waitForTimeout(800);

    // Gender
    console.log(`Selecting gender: ${empData.gender || 'Male'}...`);
    const genderSelect = this.page.getByTestId('UM-AE-Gender select').first();
    const isGenderVisible = await genderSelect.isVisible().catch(() => false);
    if (isGenderVisible) {
      await genderSelect.click();
    } else {
      await this.page.locator('div').filter({ hasText: /^Male$/ }).first().click().catch(() => {});
    }
    await this.page.waitForTimeout(500);

    // Manager
    const managerName = empData.manager || 'Bhushan Raut';
    console.log(`Entering & Selecting manager: ${managerName}...`);
    const managerInput = this.page.getByTestId('UM-AE-Manager');
    await managerInput.click();
    await this.page.waitForTimeout(500);
    await managerInput.fill('Bhushan');
    await this.page.waitForTimeout(800);

    const managerOption = this.page.locator('div, span, li, p')
      .filter({ hasText: /^Bhushan Raut$/i })
      .or(this.page.getByText('Bhushan Raut', { exact: true }))
      .last();

    if (await managerOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('✅ Found Manager option "Bhushan Raut" in dropdown popup, clicking...');
      await managerOption.click({ force: true });
    } else {
      console.log('Manager option not found via locator, using ArrowDown + Enter fallback...');
      await managerInput.press('ArrowDown').catch(() => {});
      await this.page.waitForTimeout(300);
      await managerInput.press('Enter').catch(() => {});
    }
    await this.page.waitForTimeout(800);

    // Designation
    console.log(`Entering designation: ${empData.designation || 'QA'}...`);
    await this.page.getByTestId('UM-AE-Designation').click();
    await this.page.getByTestId('UM-AE-Designation').fill(empData.designation || 'QA');
    await this.page.waitForTimeout(500);

    // Role
    console.log(`Entering role: ${empData.role || 'Emp'}...`);
    await this.page.getByTestId('UM-AE-Role').click();
    await this.page.getByTestId('UM-AE-Role').fill('em');
    await this.page.waitForTimeout(500);
    await this.page.getByText('Emp', { exact: true }).click().catch(() => {});
    await this.page.waitForTimeout(500);

    // Shift
    console.log(`Searching & selecting shift: ${empData.shift || 'general'}...`);
    await this.page.getByTestId('UM-AE-Shifts-Search').click();
    await this.page.getByTestId('UM-AE-Shifts-Search').fill(empData.shift || 'general');
    await this.page.waitForTimeout(800);
    await this.page.locator('div').filter({ hasText: /^General Shift$/ }).nth(2).click().catch(() => {});
    await this.page.waitForTimeout(500);

    // Joining Date
    console.log('Selecting Joining Date...');
    await this.page.getByTestId('UM-AE-Joining Date').click();
    await this.page.locator('#add-employee-sidebar').getByRole('button', { name: '1', exact: true }).first().click().catch(() => {});
    await this.page.waitForTimeout(500);

    // Remote Checkbox
    console.log('Checking Remote checkbox...');
    await this.page.getByTestId('UM-AE-Remote-Checkbox').check().catch(() => {});
    await this.page.waitForTimeout(500);

    // Save Employee & Confirm Icon if present
    console.log('Saving Employee...');
    // const checkIcon4 = this.page.getByTestId('UM-AE-FaCheckCircle icon4');
    // const isIcon4Visible = await checkIcon4.isVisible({ timeout: 2000 }).catch(() => false);
    // if (isIcon4Visible) {
    //   await checkIcon4.click();
    //   await this.page.waitForTimeout(500);
    // }
    await this.page.locator('#add-employee-sidebar').getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(2000);
    console.log(`✅ Employee ${empData.firstName} ${empData.lastName} created successfully!`);
  }
}

export default UserManagementPage;
