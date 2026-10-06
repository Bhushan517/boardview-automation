import { expect } from '@playwright/test';

class BoardPage {
  constructor(page) {
    this.page = page;
  }

  // Navigate to HRMS Module (with deliberate delays so execution is slow and visible)
  async navigateToHrmsModule() {
    console.log('Clicking Applications...');
    const applications = this.page.locator('div').filter({ hasText: 'Applications' }).nth(4);
    await applications.waitFor({ state: 'visible', timeout: 10000 });
    await applications.click();
    await this.page.waitForTimeout(2000);

    console.log('Clicking People Management...');
    const peopleMgmt = this.page.locator('div').filter({ hasText: 'People Management' }).nth(5);
    await peopleMgmt.waitFor({ state: 'visible', timeout: 10000 });
    await peopleMgmt.click();
    await this.page.waitForTimeout(2000);

    console.log('Clicking HRMS...');
    const hrms = this.page.locator('div').filter({ hasText: 'HRMS' }).nth(5);
    await hrms.waitFor({ state: 'visible', timeout: 10000 });
    await hrms.click();
    await this.page.waitForTimeout(3000);
    console.log('✅ HRMS Module opened successfully!');
  }
}

export default BoardPage;
