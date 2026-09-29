/**
 * Client-side Mock REST API engine with localStorage persistence
 * Emulates full REST endpoints when a live backend server is not running.
 */
import { INITIAL_EMPLOYEES, MOCK_USER } from './mockData.js';

const STORAGE_KEY = 'staffpulse_employees_data';
const AUTH_TOKEN_KEY = 'staffpulse_auth_token';
const AUTH_USER_KEY = 'staffpulse_auth_user';

// Initialize localStorage if empty
const getStoredEmployees = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    return [...INITIAL_EMPLOYEES];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored employees, resetting...', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    return [...INITIAL_EMPLOYEES];
  }
};

const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

// Generates next employee ID format EMP-XXXX
const generateNextId = (employees) => {
  const ids = employees
    .map((e) => {
      const match = e.id.match(/EMP-(\d+)/);
      return match ? parseInt(match[1], 10) : 1000;
    })
    .filter((n) => !isNaN(n));
  const max = ids.length > 0 ? Math.max(...ids) : 1000;
  return `EMP-${max + 1}`;
};

// Artificial delay helper to simulate real REST network latency
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockServer = {
  // Reset database back to default initial seed
  resetData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    return [...INITIAL_EMPLOYEES];
  },

  // POST /api/auth/login
  login: async (credentials) => {
    await delay(350);
    const { email, password } = credentials;

    // Accepts admin credentials or any valid email with password >= 6 characters for demo convenience
    if (email === 'admin@staffpulse.com' && password === 'admin123') {
      const mockToken = `mock-jwt-${btoa(email)}-${Date.now()}`;
      return {
        data: {
          token: mockToken,
          user: MOCK_USER,
          message: 'Login successful',
        },
      };
    }

    if (password && password.length >= 6) {
      const user = {
        id: 'USR-MOCK-02',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email,
        role: 'HR Manager',
        department: 'Operations',
      };
      const mockToken = `mock-jwt-${btoa(email)}-${Date.now()}`;
      return {
        data: {
          token: mockToken,
          user: user,
          message: 'Login successful',
        },
      };
    }

    const error = new Error('Invalid email or password');
    error.response = {
      status: 401,
      data: { message: 'Invalid email or password. Hint: admin@staffpulse.com / admin123' },
    };
    throw error;
  },

  // GET /api/employees
  getEmployees: async (params = {}) => {
    await delay(200);
    let list = getStoredEmployees();

    // Query parameters: search, department, status
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q)
      );
    }

    if (params.department && params.department !== 'All') {
      list = list.filter((emp) => emp.department === params.department);
    }

    if (params.status && params.status !== 'All') {
      list = list.filter((emp) => emp.status === params.status);
    }

    return {
      data: list,
      status: 200,
    };
  },

  // GET /api/employees/:id
  getEmployeeById: async (id) => {
    await delay(200);
    const employees = getStoredEmployees();
    const employee = employees.find((emp) => String(emp.id) === String(id));

    if (!employee) {
      const error = new Error('Employee not found');
      error.response = {
        status: 404,
        data: { message: `Employee with ID ${id} was not found` },
      };
      throw error;
    }

    return {
      data: employee,
      status: 200,
    };
  },

  // POST /api/employees
  createEmployee: async (data) => {
    await delay(300);
    const employees = getStoredEmployees();

    // Check duplicate email
    const exists = employees.some(
      (emp) => emp.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (exists) {
      const error = new Error('Email already registered');
      error.response = {
        status: 409,
        data: { message: 'An employee with this email already exists' },
      };
      throw error;
    }

    const newId = data.id || generateNextId(employees);
    const newEmployee = {
      ...data,
      id: newId,
      salary: Number(data.salary),
      createdAt: new Date().toISOString(),
    };

    employees.unshift(newEmployee);
    saveEmployees(employees);

    return {
      data: newEmployee,
      status: 201,
      message: 'Employee created successfully',
    };
  },

  // PUT /api/employees/:id
  updateEmployee: async (id, updatedFields) => {
    await delay(300);
    const employees = getStoredEmployees();
    const index = employees.findIndex((emp) => String(emp.id) === String(id));

    if (index === -1) {
      const error = new Error('Employee not found');
      error.response = {
        status: 404,
        data: { message: `Employee with ID ${id} was not found` },
      };
      throw error;
    }

    // Check duplicate email with another employee
    if (updatedFields.email) {
      const emailConflict = employees.some(
        (emp, i) =>
          i !== index &&
          emp.email.toLowerCase() === updatedFields.email.toLowerCase().trim()
      );
      if (emailConflict) {
        const error = new Error('Email already taken');
        error.response = {
          status: 409,
          data: { message: 'Another employee is already registered with this email' },
        };
        throw error;
      }
    }

    const updated = {
      ...employees[index],
      ...updatedFields,
      id: employees[index].id, // protect ID from alteration
      salary: Number(updatedFields.salary ?? employees[index].salary),
      updatedAt: new Date().toISOString(),
    };

    employees[index] = updated;
    saveEmployees(employees);

    return {
      data: updated,
      status: 200,
      message: 'Employee updated successfully',
    };
  },

  // DELETE /api/employees/:id
  deleteEmployee: async (id) => {
    await delay(250);
    const employees = getStoredEmployees();
    const index = employees.findIndex((emp) => String(emp.id) === String(id));

    if (index === -1) {
      const error = new Error('Employee not found');
      error.response = {
        status: 404,
        data: { message: `Employee with ID ${id} does not exist` },
      };
      throw error;
    }

    const deleted = employees.splice(index, 1)[0];
    saveEmployees(employees);

    return {
      data: deleted,
      status: 200,
      message: 'Employee deleted successfully',
    };
  },
};
