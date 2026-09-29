import { mockServer } from './src/services/mockServer.js';
import { validateEmployeeForm, validateLoginForm } from './src/utils/validators.js';
import { formatCurrency, formatDate, getInitials } from './src/utils/formatters.js';

// Setup minimal localStorage mock in Node for test runner
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
};

async function runTests() {
  console.log('🧪 Starting StaffPulse System Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Login Authentication
  console.log('1. Authentication Tests:');
  try {
    const loginRes = await mockServer.login({ email: 'admin@staffpulse.com', password: 'admin123' });
    assert(loginRes.data.token.startsWith('mock-jwt-'), 'Admin login generates valid JWT token');
    assert(loginRes.data.user.email === 'admin@staffpulse.com', 'Admin user payload matches');
  } catch (e) {
    assert(false, `Admin login threw: ${e.message}`);
  }

  try {
    await mockServer.login({ email: 'admin@staffpulse.com', password: 'wrong' });
    assert(false, 'Invalid login should have failed');
  } catch (e) {
    assert(e.response && e.response.status === 401, 'Invalid password correctly returns 401');
  }

  // 2. Test Employee Fetching & Query Filters
  console.log('\n2. Employee Directory & Query Tests:');
  const allEmployees = await mockServer.getEmployees();
  assert(allEmployees.data.length >= 10, `Initial employee directory seeded with ${allEmployees.data.length} records`);

  const searchRes = await mockServer.getEmployees({ search: 'Sophia' });
  assert(searchRes.data.length === 1 && searchRes.data[0].name === 'Sophia Chen', 'Search by name "Sophia" dynamically returns Sophia Chen');

  const deptRes = await mockServer.getEmployees({ department: 'Engineering' });
  assert(deptRes.data.length >= 2 && deptRes.data.every((e) => e.department === 'Engineering'), 'Filter by department "Engineering" works');

  const statusRes = await mockServer.getEmployees({ status: 'Inactive' });
  assert(statusRes.data.length >= 1 && statusRes.data.every((e) => e.status === 'Inactive'), 'Filter by status "Inactive" works');

  // 3. Test Employee CRUD: Create (POST)
  console.log('\n3. Employee Create (POST) Tests:');
  const newEmpData = {
    name: 'Eleanor Vance',
    email: 'eleanor.vance@staffpulse.com',
    mobile: '+1 (555) 777-8899',
    department: 'Engineering',
    designation: 'Staff Security Engineer',
    joiningDate: '2024-04-01',
    salary: 138000,
    status: 'Active',
  };

  const createRes = await mockServer.createEmployee(newEmpData);
  assert(createRes.status === 201, 'Create employee returns 201 status');
  assert(createRes.data.id.startsWith('EMP-'), `New employee assigned ID ${createRes.data.id}`);

  // Test duplicate email rejection
  try {
    await mockServer.createEmployee(newEmpData);
    assert(false, 'Duplicate email should have failed');
  } catch (e) {
    assert(e.response && e.response.status === 409, 'Duplicate email correctly returns 409 Conflict');
  }

  // 4. Test Employee Details: Read (GET :id)
  console.log('\n4. Employee Details (GET :id) Tests:');
  const detailRes = await mockServer.getEmployeeById(createRes.data.id);
  assert(detailRes.data.name === 'Eleanor Vance', 'Employee details returned correctly by ID');

  try {
    await mockServer.getEmployeeById('EMP-99999');
    assert(false, 'Non-existent employee ID should fail');
  } catch (e) {
    assert(e.response && e.response.status === 404, 'Non-existent ID correctly returns 404 Not Found');
  }

  // 5. Test Employee Update: (PUT :id)
  console.log('\n5. Employee Update (PUT :id) Tests:');
  const updateRes = await mockServer.updateEmployee(createRes.data.id, {
    designation: 'Director of Security Architecture',
    salary: 160000,
  });
  assert(updateRes.data.designation === 'Director of Security Architecture', 'Employee designation successfully updated via PUT');
  assert(updateRes.data.salary === 160000, 'Employee salary successfully updated via PUT');

  // 6. Test Employee Delete: (DELETE :id)
  console.log('\n6. Employee Delete (DELETE :id) Tests:');
  const deleteRes = await mockServer.deleteEmployee(createRes.data.id);
  assert(deleteRes.status === 200, 'Delete employee returns 200 status');

  try {
    await mockServer.getEmployeeById(createRes.data.id);
    assert(false, 'Deleted employee should no longer exist');
  } catch (e) {
    assert(e.response && e.response.status === 404, 'Deleted employee confirmed purged (404)');
  }

  // 7. Test Form Validation
  console.log('\n7. Form Validation Tests:');
  const invalidForm = validateEmployeeForm({ name: '', email: 'invalid', mobile: '12', salary: '-100' });
  assert(!invalidForm.isValid, 'Empty/malformed employee form marked invalid');
  assert(invalidForm.errors.name !== undefined, 'Name validation triggered');
  assert(invalidForm.errors.email !== undefined, 'Email validation triggered');
  assert(invalidForm.errors.mobile !== undefined, 'Mobile validation triggered');
  assert(invalidForm.errors.salary !== undefined, 'Salary validation triggered');

  const validForm = validateEmployeeForm({
    name: 'Robert Stark',
    email: 'robert@company.com',
    mobile: '5551234567',
    department: 'Engineering',
    designation: 'Lead Engineer',
    joiningDate: '2023-01-01',
    salary: 120000,
    status: 'Active',
  });
  assert(validForm.isValid, 'Fully valid employee form passes validation');

  // 8. Test Formatters
  console.log('\n8. Formatter Tests:');
  assert(formatCurrency(125000) === '$125,000', `formatCurrency(125000) produces '$125,000'`);
  assert(getInitials('Alexander Mitchell') === 'AM', `getInitials('Alexander Mitchell') produces 'AM'`);

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
