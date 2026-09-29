import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { validateEmployeeForm } from '../utils/validators';
import { INITIAL_DEPARTMENTS } from '../services/mockData';

export const EmployeeForm = ({
  initialValues = null,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
    joiningDate: '',
    salary: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        mobile: initialValues.mobile || '',
        department: initialValues.department || '',
        designation: initialValues.designation || '',
        joiningDate: initialValues.joiningDate ? initialValues.joiningDate.substring(0, 10) : '',
        salary: initialValues.salary !== undefined ? initialValues.salary : '',
        status: initialValues.status || 'Active',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for field once user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: validationErrors } = validateEmployeeForm(formData);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const { isValid, errors: validationErrors } = validateEmployeeForm(formData);
    setErrors(validationErrors);

    if (!isValid) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      {/* Form Header */}
      <div className="px-6 sm:px-8 py-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Directory
          </button>
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? 'Update Employee Record' : 'Register New Employee'}
          </h2>
          <p className="text-sm text-slate-500">
            {isEdit
              ? 'Modify the employee details below. Changes will sync to the database.'
              : 'Fill in the information below to add a new employee to the directory.'}
          </p>
        </div>
      </div>

      {/* Global API error display if present */}
      {apiError && (
        <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-900 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to save employee</p>
            <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field: Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Jane Doe"
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.name}</p>}
          </div>

          {/* Field: Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. jane.doe@staffpulse.com"
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>}
          </div>

          {/* Field: Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Phone <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={() => handleBlur('mobile')}
                placeholder="e.g. +1 (555) 234-5678"
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.mobile
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.mobile && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.mobile}</p>}
          </div>

          {/* Field: Department */}
          <div>
            <label htmlFor="department" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Building className="h-4 w-4" />
              </div>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={() => handleBlur('department')}
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors bg-white ${
                  errors.department
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              >
                <option value="">Select a department</option>
                {INITIAL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.department}</p>}
          </div>

          {/* Field: Designation */}
          <div>
            <label htmlFor="designation" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Designation / Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                onBlur={() => handleBlur('designation')}
                placeholder="e.g. Senior Software Engineer"
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.designation
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.designation && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.designation}</p>}
          </div>

          {/* Field: Joining Date */}
          <div>
            <label htmlFor="joiningDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Joining Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                onBlur={() => handleBlur('joiningDate')}
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.joiningDate
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.joiningDate && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.joiningDate}</p>}
          </div>

          {/* Field: Salary */}
          <div>
            <label htmlFor="salary" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Annual Salary (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                type="number"
                id="salary"
                name="salary"
                min="0"
                step="500"
                value={formData.salary}
                onChange={handleChange}
                onBlur={() => handleBlur('salary')}
                placeholder="e.g. 95000"
                className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.salary
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900'
                }`}
              />
            </div>
            {errors.salary && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.salary}</p>}
          </div>

          {/* Field: Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Employment Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status === 'Active'
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                Active
              </label>

              <label
                className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status === 'Inactive'
                    ? 'border-slate-500 bg-slate-100 text-slate-800 font-semibold ring-1 ring-slate-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 sm:gap-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex justify-center items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center items-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? 'Saving Changes...' : 'Creating Employee...'}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Employee' : 'Add Employee'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
