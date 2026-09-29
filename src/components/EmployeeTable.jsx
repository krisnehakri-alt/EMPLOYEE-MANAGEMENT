import React from 'react';
import { Eye, Edit2, Trash2, Users, Calendar, Phone, Mail, DollarSign, Building } from 'lucide-react';
import { formatCurrency, formatDate, getInitials, getStatusBadgeClass } from '../utils/formatters';

export const EmployeeTable = ({
  employees = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}) => {
  if (employees.length === 0 && !loading) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No employees found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          No records match your active search or filter criteria. Try adjusting your query or filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">Employee ID</th>
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Mobile</th>
              <th scope="col" className="px-6 py-4">Department</th>
              <th scope="col" className="px-6 py-4">Designation</th>
              <th scope="col" className="px-6 py-4">Joining Date</th>
              <th scope="col" className="px-6 py-4">Salary</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-slate-50/70 transition-colors duration-150 group"
              >
                {/* Employee ID */}
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-indigo-600 bg-indigo-50/30">
                  {employee.id}
                </td>

                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {getInitials(employee.name)}
                      </div>
                    )}
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {employee.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                  <span className="truncate max-w-[200px] block" title={employee.email}>
                    {employee.email}
                  </span>
                </td>

                {/* Mobile */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                  {employee.mobile || '-'}
                </td>

                {/* Department */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {employee.department}
                  </span>
                </td>

                {/* Designation */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                  {employee.designation}
                </td>

                {/* Joining Date */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                  {formatDate(employee.joiningDate)}
                </td>

                {/* Salary */}
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                  {formatCurrency(employee.salary)}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                      employee.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        employee.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {employee.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onView(employee.id)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(employee.id)}
                      title="Edit Employee"
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(employee)}
                      title="Delete Employee"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
