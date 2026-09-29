import { useState, useEffect, useCallback, useMemo } from 'react';
import { employeeService } from '../services/employeeService';
import { useToast } from './useToast';

export const useEmployees = (initialParams = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(initialParams.search || '');
  const [department, setDepartment] = useState(initialParams.department || 'All');
  const [status, setStatus] = useState(initialParams.status || 'All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = initialParams.itemsPerPage || 6;

  const { showError, showSuccess } = useToast();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees({
        search,
        department,
        status,
      });
      setEmployees(data || []);
    } catch (err) {
      console.error('Failed to load employees:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to fetch employees';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, department, status, showError]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // When filters change, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, status]);

  const deleteEmployee = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      showSuccess('Employee removed successfully');
      // Refresh list
      await fetchEmployees();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete employee';
      showError(msg);
      return false;
    }
  };

  // Pagination calculation
  const totalItems = employees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return employees.slice(startIndex, startIndex + itemsPerPage);
  }, [employees, currentPage, itemsPerPage]);

  // Stats calculation for dashboard
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const inactive = employees.filter((e) => e.status === 'Inactive').length;

    // Distinct departments count
    const depts = new Set(employees.map((e) => e.department).filter(Boolean));

    // Department breakdown
    const deptBreakdown = employees.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});

    // Recent employees (latest 5 by joiningDate or insertion)
    const recent = [...employees]
      .sort((a, b) => new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0))
      .slice(0, 5);

    return {
      total,
      active,
      inactive,
      departmentsCount: depts.size,
      deptBreakdown,
      recentEmployees: recent,
    };
  }, [employees]);

  return {
    employees,
    paginatedEmployees,
    loading,
    error,
    search,
    setSearch,
    department,
    setDepartment,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchEmployees,
    deleteEmployee,
    stats,
  };
};

export default useEmployees;
