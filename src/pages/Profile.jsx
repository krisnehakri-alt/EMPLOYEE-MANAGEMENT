import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  Shield,
  Key,
  RotateCcw,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { employeeService } from '../services/employeeService';
import { USE_MOCK_API } from '../services/api';
import { getInitials } from '../utils/formatters';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [name, setName] = useState(user?.name || 'Sarah Connor');
  const [email, setEmail] = useState(user?.email || 'admin@staffpulse.com');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateUserProfile({ name, email });
    setIsSaving(false);
    showSuccess('Admin profile updated successfully');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all employee records back to default demo data?')) {
      employeeService.resetMockData();
      showInfo('Employee database reset to initial demonstration state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-2xl flex items-center justify-center ring-4 ring-slate-100 shadow-md">
              {getInitials(user?.name || 'Admin')}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-white">
            <Shield className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'Sarah Connor'}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {user?.role || 'HR Administrator'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{user?.email || 'admin@staffpulse.com'}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Human Resources Directorate
            </span>
            <span className="flex items-center">
              <Key className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Full System Admin Permissions
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Details</h2>
          <p className="text-xs text-slate-500 mb-6">
            Update your administrator account identity.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* REST API & System Configuration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900">API & Environment</h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  USE_MOCK_API
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <Database className="w-3 h-3 mr-1" />
                {USE_MOCK_API ? 'Mock REST Server' : 'Live REST API'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              REST API connection parameters and developer tools.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Base API URL:</span>
                <code className="text-indigo-600 font-mono text-[11px] break-all">
                  {import.meta.env.VITE_API_BASE_URL || '/api'}
                </code>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Configured REST Endpoints:</span>
                <ul className="text-slate-600 font-mono text-[10px] space-y-1 mt-1">
                  <li>• POST /api/auth/login</li>
                  <li>• GET /api/employees</li>
                  <li>• GET /api/employees/:id</li>
                  <li>• POST /api/employees</li>
                  <li>• PUT /api/employees/:id</li>
                  <li>• DELETE /api/employees/:id</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">Demo Database</span>
              <span className="text-[11px] text-slate-400">Restore default employee list</span>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
