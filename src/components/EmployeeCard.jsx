import React from 'react';
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldCheck,
  Edit2,
  Trash2,
  ArrowLeft,
  UserCheck,
  UserX,
} from 'lucide-react';
import { formatCurrency, formatDate, getInitials, getStatusBadgeClass } from '../utils/formatters';

export const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  onBack,
}) => {
  if (!employee) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Top Banner Accent */}
      <div className="h-32 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 relative">
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-semibold text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>

        <div className="absolute top-6 right-6 flex items-center space-x-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(employee.id)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(employee)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-100 bg-rose-500/40 hover:bg-rose-500/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-10">
        {/* Header Profile Section */}
        <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="relative">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-3xl flex items-center justify-center ring-4 ring-white shadow-md">
                  {getInitials(employee.name)}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ring-2 ring-white ${
                  employee.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                }`}
                title={`Status: ${employee.status}`}
              >
                {employee.status === 'Active' ? (
                  <UserCheck className="w-3.5 h-3.5" />
                ) : (
                  <UserX className="w-3.5 h-3.5" />
                )}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2.5">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-lg">
                  {employee.id}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {employee.name}
              </h2>
              <p className="text-slate-500 font-medium text-sm flex items-center justify-center sm:justify-start mt-0.5">
                <Briefcase className="w-4 h-4 mr-1.5 text-slate-400" />
                {employee.designation} • {employee.department}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Contact Information */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-indigo-600" />
              Contact Information
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Corporate Email</p>
                <a
                  href={`mailto:${employee.email}`}
                  className="text-sm font-semibold text-indigo-600 hover:underline flex items-center mt-0.5"
                >
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  {employee.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Mobile Phone</p>
                <a
                  href={`tel:${employee.mobile}`}
                  className="text-sm font-semibold text-slate-800 hover:text-indigo-600 flex items-center mt-0.5"
                >
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  {employee.mobile || 'Not specified'}
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Employment Details */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
              <Building className="w-4 h-4 mr-2 text-indigo-600" />
              Department & Role
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Assigned Department</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Building className="w-4 h-4 mr-2 text-slate-400" />
                  {employee.department}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Designation / Title</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                  {employee.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Compensation & Records */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
              Compensation
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Annual Base Salary</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                  {formatCurrency(employee.salary)}
                </p>
                <span className="text-xs text-slate-400">Paid in monthly salary cycle</span>
              </div>
            </div>
          </div>

          {/* Card 4: Tenancy & Joining Date */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
              Tenure & Status
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Official Joining Date</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {formatDate(employee.joiningDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Current Employment State</p>
                <div className="flex items-center space-x-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-800">
                    {employee.status === 'Active' ? 'Active Employee in Good Standing' : 'Inactive / On Leave'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
