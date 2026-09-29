import api, { USE_MOCK_API } from './api';
import { mockServer } from './mockServer';

export const employeeService = {
  /**
   * Fetch all employees with optional query filters (search, department, status)
   * GET /api/employees
   * @param {{ search?: string, department?: string, status?: string }} params
   */
  getEmployees: async (params = {}) => {
    if (USE_MOCK_API) {
      const res = await mockServer.getEmployees(params);
      return res.data;
    }
    const response = await api.get('/employees', { params });
    return response.data;
  },

  /**
   * Fetch single employee details by ID
   * GET /api/employees/:id
   * @param {string|number} id
   */
  getEmployeeById: async (id) => {
    if (USE_MOCK_API) {
      const res = await mockServer.getEmployeeById(id);
      return res.data;
    }
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Create a new employee
   * POST /api/employees
   * @param {object} employeeData
   */
  createEmployee: async (employeeData) => {
    if (USE_MOCK_API) {
      const res = await mockServer.createEmployee(employeeData);
      return res.data;
    }
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  /**
   * Update existing employee details
   * PUT /api/employees/:id
   * @param {string|number} id
   * @param {object} employeeData
   */
  updateEmployee: async (id, employeeData) => {
    if (USE_MOCK_API) {
      const res = await mockServer.updateEmployee(id, employeeData);
      return res.data;
    }
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  /**
   * Delete employee by ID
   * DELETE /api/employees/:id
   * @param {string|number} id
   */
  deleteEmployee: async (id) => {
    if (USE_MOCK_API) {
      const res = await mockServer.deleteEmployee(id);
      return res.data;
    }
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  /**
   * Reset mock data to factory state
   */
  resetMockData: () => {
    return mockServer.resetData();
  }
};
