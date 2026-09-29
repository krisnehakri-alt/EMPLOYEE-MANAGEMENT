import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  RefreshCw,
  X,
  Building,
  SlidersHorizontal,
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import ConfirmationModal from '../components/ConfirmationModal';
import Pagination from '../components/Pagination';
import { TableSkeleton } from '../components/LoadingSpinner';
import { INITIAL_DEPARTMENTS } from '../services/mockData';

export const Employees = () => {
  const navigate = useNavigate();

  const {
    employees,
    paginatedEmployees,
    loading,
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
  } = useEmployees({ itemsPerPage: 6 });

  // Modal State for Delete Confirmation
  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDelete = (employee) => {
    setSelectedEmployeeForDelete(employee);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) {
      setSelectedEmployeeForDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployeeForDelete) return;

    setIsDeleting(true);
    const success = await deleteEmployee(selectedEmployeeForDelete.id);
    setIsDeleting(false);

    if (success) {
      setSelectedEmployeeForDelete(null);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All');
    setStatus('All');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Employee Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Employee Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {totalItems} {totalItems === 1 ? 'employee' : 'employees'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your corporate directory, view profiles, update roles, and review compensation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={fetchEmployees}
            title="Refresh Directory"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <Link
            to="/employees/new"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Dynamic Search by Name, Email, Employee ID, Department */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID, or department..."
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex-1 sm:flex-initial min-w-[150px]">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="All">All Departments</option>
              {INITIAL_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-initial min-w-[130px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters Button (shown when filter active) */}
          {(search || department !== 'All' || status !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Employee Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="space-y-0">
          <EmployeeTable
            employees={paginatedEmployees}
            loading={loading}
            onView={(id) => navigate(`/employees/${id}`)}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
            onDelete={handleOpenDelete}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Confirmation Modal for Delete Action */}
      <ConfirmationModal
        isOpen={!!selectedEmployeeForDelete}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Employee Deletion"
        message="Are you sure you want to delete this employee from the system? This action will remove all their organizational records permanently."
        employeeInfo={selectedEmployeeForDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Employees;
