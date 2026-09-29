import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/employees.json');

const router = express.Router();

// Helper to read employees JSON file
const readEmployees = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
};

// Helper to write employees JSON file
const writeEmployees = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
};

// Helper to generate next employee ID (EMP-XXXX)
const generateId = (employees) => {
  const ids = employees
    .map((e) => {
      const match = e.id && e.id.match(/EMP-(\d+)/);
      return match ? parseInt(match[1], 10) : 1000;
    })
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 1000;
  return `EMP-${max + 1}`;
};

// GET /api/employees
router.get('/', (req, res) => {
  let list = readEmployees();
  const { search, department, status } = req.query;

  // Search filter (Name, Email, Employee ID, Department, Designation)
  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (emp) =>
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.id && emp.id.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q)) ||
        (emp.designation && emp.designation.toLowerCase().includes(q))
    );
  }

  // Department filter
  if (department && department !== 'All') {
    list = list.filter((emp) => emp.department === department);
  }

  // Status filter
  if (status && status !== 'All') {
    list = list.filter((emp) => emp.status === status);
  }

  res.json(list);
});

// GET /api/employees/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const employees = readEmployees();
  const employee = employees.find((emp) => String(emp.id) === String(id));

  if (!employee) {
    return res.status(404).json({ message: `Employee with ID ${id} was not found.` });
  }

  res.json(employee);
});

// POST /api/employees
router.post('/', (req, res) => {
  const { name, email, mobile, department, designation, joiningDate, salary, status } = req.body;

  if (!name || !email || !mobile || !department || !designation || !joiningDate || salary === undefined || !status) {
    return res.status(400).json({ message: 'All required employee fields must be provided.' });
  }

  const employees = readEmployees();

  // Check duplicate email
  const existing = employees.find((e) => e.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ message: 'An employee with this email already exists.' });
  }

  const newEmployee = {
    id: generateId(employees),
    name: name.trim(),
    email: email.trim(),
    mobile: mobile.trim(),
    department,
    designation: designation.trim(),
    joiningDate,
    salary: Number(salary),
    status,
    createdAt: new Date().toISOString(),
  };

  employees.unshift(newEmployee);
  writeEmployees(employees);

  res.status(201).json(newEmployee);
});

// PUT /api/employees/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const employees = readEmployees();
  const index = employees.findIndex((emp) => String(emp.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ message: `Employee with ID ${id} was not found.` });
  }

  const { name, email, mobile, department, designation, joiningDate, salary, status } = req.body;

  // Check email conflict with another employee
  if (email) {
    const conflict = employees.find(
      (e, i) => i !== index && e.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (conflict) {
      return res.status(409).json({ message: 'Another employee is already registered with this email address.' });
    }
  }

  const updatedEmployee = {
    ...employees[index],
    ...(name && { name: name.trim() }),
    ...(email && { email: email.trim() }),
    ...(mobile && { mobile: mobile.trim() }),
    ...(department && { department }),
    ...(designation && { designation: designation.trim() }),
    ...(joiningDate && { joiningDate }),
    ...(salary !== undefined && { salary: Number(salary) }),
    ...(status && { status }),
    id: employees[index].id, // preserve ID
    updatedAt: new Date().toISOString(),
  };

  employees[index] = updatedEmployee;
  writeEmployees(employees);

  res.json(updatedEmployee);
});

// DELETE /api/employees/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const employees = readEmployees();
  const index = employees.findIndex((emp) => String(emp.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ message: `Employee with ID ${id} does not exist.` });
  }

  const deleted = employees.splice(index, 1)[0];
  writeEmployees(employees);

  res.json({ message: 'Employee deleted successfully', employee: deleted });
});

export default router;
