/**
 * Full-stack integration test against the LIVE Express REST API
 * Tests: Login, CRUD operations, search, filter, error handling, edge cases
 */

const BASE = 'http://localhost:5000/api';
let passed = 0;
let failed = 0;
let token = null;

async function req(method, path, body, useAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  let data;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

function assert(cond, msg) {
  if (cond) { console.log(`  ✅ ${msg}`); passed++; }
  else       { console.error(`  ❌ ${msg}`); failed++; }
}

console.log('\n🚀 StaffPulse Live REST API Integration Tests\n' + '='.repeat(50));

// ── 1. Auth ─────────────────────────────────────────────
console.log('\n🔐 1. Authentication');
{
  const r = await req('POST', '/auth/login', { email: 'admin@staffpulse.com', password: 'admin123' }, false);
  assert(r.status === 200, 'POST /auth/login → 200 OK');
  assert(typeof r.data.token === 'string' && r.data.token.length > 10, 'Token returned in response');
  assert(r.data.user.email === 'admin@staffpulse.com', 'User payload matches admin email');
  token = r.data.token;
}
{
  const r = await req('POST', '/auth/login', { email: 'admin@staffpulse.com', password: 'wrong' }, false);
  assert(r.status === 401, 'POST /auth/login with wrong password → 401 Unauthorized');
}
{
  const r = await req('POST', '/auth/login', {}, false);
  assert(r.status === 400, 'POST /auth/login with empty body → 400 Bad Request');
}

// ── 2. Health Check ──────────────────────────────────────
console.log('\n🩺 2. Health Check');
{
  const r = await req('GET', '/health', null, false);
  assert(r.status === 200, 'GET /health → 200 OK');
  assert(r.data.status === 'healthy', 'Health check reports "healthy"');
}

// ── 3. GET All Employees ─────────────────────────────────
console.log('\n📋 3. GET /api/employees');
let employees;
{
  const r = await req('GET', '/employees');
  assert(r.status === 200, 'GET /employees → 200 OK');
  assert(Array.isArray(r.data), 'Response is an array');
  assert(r.data.length === 10, `Seed data contains 10 employees (got ${r.data.length})`);
  employees = r.data;
}

// ── 4. Search & Filter ───────────────────────────────────
console.log('\n🔍 4. Search & Filter');
{
  const r = await req('GET', '/employees?search=sophia');
  assert(r.status === 200, 'Search "sophia" → 200 OK');
  assert(r.data.length === 1 && r.data[0].name === 'Sophia Chen', 'Search returns Sophia Chen');
}
{
  const r = await req('GET', '/employees?search=EMP-1003');
  assert(r.status === 200, 'Search by employee ID → 200 OK');
  assert(r.data.length === 1 && r.data[0].id === 'EMP-1003', 'Search by ID returns Marcus Vance');
}
{
  const r = await req('GET', '/employees?department=Engineering');
  assert(r.status === 200, 'Filter by Engineering → 200 OK');
  assert(r.data.length >= 2 && r.data.every(e => e.department === 'Engineering'), 'All results are Engineering');
}
{
  const r = await req('GET', '/employees?status=Inactive');
  assert(r.status === 200, 'Filter by Inactive → 200 OK');
  assert(r.data.length >= 1 && r.data.every(e => e.status === 'Inactive'), 'All results are Inactive');
}
{
  const r = await req('GET', '/employees?department=Engineering&status=Active');
  assert(r.status === 200, 'Combined filter (Engineering + Active) → 200 OK');
  assert(r.data.every(e => e.department === 'Engineering' && e.status === 'Active'), 'Combined filter works');
}

// ── 5. GET Single Employee ───────────────────────────────
console.log('\n👤 5. GET /api/employees/:id');
{
  const r = await req('GET', '/employees/EMP-1001');
  assert(r.status === 200, 'GET /employees/EMP-1001 → 200 OK');
  assert(r.data.name === 'Alexander Mitchell', 'Returns correct employee by ID');
}
{
  const r = await req('GET', '/employees/EMP-NONEXISTENT');
  assert(r.status === 404, 'GET /employees/EMP-NONEXISTENT → 404 Not Found');
  assert(typeof r.data.message === 'string', 'Error response has message field');
}

// ── 6. POST Create Employee ──────────────────────────────
console.log('\n➕ 6. POST /api/employees');
let createdId;
{
  const r = await req('POST', '/employees', {
    name: 'Jordan Taylor',
    email: 'jordan.taylor@staffpulse.com',
    mobile: '+1 (555) 987-6543',
    department: 'Engineering',
    designation: 'Cloud Security Specialist',
    joiningDate: '2024-03-01',
    salary: 125000,
    status: 'Active'
  });
  assert(r.status === 201, 'POST /employees → 201 Created');
  assert(r.data.id && r.data.id.startsWith('EMP-'), `New employee assigned ID: ${r.data.id}`);
  assert(r.data.name === 'Jordan Taylor', 'Created employee name matches');
  assert(Number(r.data.salary) === 125000, 'Salary stored as number');
  createdId = r.data.id;
}
{
  const r = await req('POST', '/employees', {
    name: 'Dupe Test',
    email: 'jordan.taylor@staffpulse.com',  // same email
    mobile: '5551234567',
    department: 'Engineering',
    designation: 'Tester',
    joiningDate: '2024-01-01',
    salary: 80000,
    status: 'Active'
  });
  assert(r.status === 409, 'Duplicate email → 409 Conflict');
}
{
  const r = await req('POST', '/employees', { name: 'Missing Fields' });
  assert(r.status === 400, 'Missing required fields → 400 Bad Request');
}

// ── 7. PUT Update Employee ───────────────────────────────
console.log('\n✏️  7. PUT /api/employees/:id');
{
  const r = await req('PUT', `/employees/${createdId}`, {
    designation: 'Senior Cloud Security Specialist',
    salary: 140000
  });
  assert(r.status === 200, `PUT /employees/${createdId} → 200 OK`);
  assert(r.data.designation === 'Senior Cloud Security Specialist', 'Designation updated correctly');
  assert(Number(r.data.salary) === 140000, 'Salary updated to 140000');
  assert(r.data.id === createdId, 'Employee ID preserved through update');
}
{
  const r = await req('PUT', '/employees/EMP-NONEXISTENT', { name: 'Ghost' });
  assert(r.status === 404, 'PUT non-existent employee → 404 Not Found');
}

// ── 8. DELETE Employee ───────────────────────────────────
console.log('\n🗑️  8. DELETE /api/employees/:id');
{
  const r = await req('DELETE', `/employees/${createdId}`);
  assert(r.status === 200, `DELETE /employees/${createdId} → 200 OK`);
  assert(typeof r.data.message === 'string', 'Delete response has message');
}
{
  const r = await req('GET', `/employees/${createdId}`);
  assert(r.status === 404, 'Deleted employee is no longer retrievable (404)');
}
{
  const r = await req('DELETE', '/employees/EMP-NONEXISTENT');
  assert(r.status === 404, 'DELETE non-existent employee → 404 Not Found');
}

// ── 9. Restore original data count ──────────────────────
console.log('\n🔄 9. Data Integrity After CRUD');
{
  const r = await req('GET', '/employees');
  assert(r.status === 200, 'GET /employees after CRUD operations → 200 OK');
  assert(r.data.length === 10, `Data restored to 10 records (got ${r.data.length})`);
}

// ── Summary ──────────────────────────────────────────────
console.log('\n' + '='.repeat(50));
console.log(`📊 SUMMARY: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('🎉 ALL TESTS PASSED - Live REST API is fully functional!');
else console.error(`⚠️  ${failed} test(s) failed.`);
console.log('='.repeat(50) + '\n');

if (failed > 0) process.exit(1);
