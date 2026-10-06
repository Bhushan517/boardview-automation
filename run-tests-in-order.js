const { execSync } = require('child_process');

console.log('\n🚀 Starting BoardView Professional Sequential Execution...\n');
console.log('═'.repeat(65));
console.log('  1. Phase 1: Login Form Validations & Negative Tests');
console.log('  2. Phase 2: Valid Login & HRMS Attendance Configuration');
console.log('═'.repeat(65) + '\n');

try {
  execSync('npx playwright test tests/masterSuite.spec.js --headed', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('\n✅ ALL TEST SUITES PASSED SUCCESSFULLY!');
} catch (error) {
  console.log('\n❌ TEST EXECUTION FAILED');
  process.exit(1);
}
