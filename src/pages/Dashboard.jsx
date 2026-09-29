import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Calendar,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getInitials, getStatusBadgeClass } from '../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { employees, stats, loading } = useEmployees();

  if (loading && employees.length === 0) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Loading enterprise dashboard metrics..." />
      </div>
    );
  }

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const activeRate = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            {currentDate}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Administrator'}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is what's happening with your workforce and team distribution today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/employees/new"
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
          <Link
            to="/employees"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
          >
            <span>Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Employees"
          value={stats.total}
          icon={Users}
          colorScheme="indigo"
          subtitle="All recorded staff members"
        />

        <StatsCard
          title="Active Employees"
          value={stats.active}
          icon={UserCheck}
          colorScheme="emerald"
          subtitle={`${activeRate}% of total workforce`}
        />

        <StatsCard
          title="Inactive Employees"
          value={stats.inactive}
          icon={UserX}
          colorScheme="amber"
          subtitle="On leave or offboarding"
        />

        <StatsCard
          title="Departments"
          value={stats.departmentsCount}
          icon={Building2}
          colorScheme="blue"
          subtitle="Functional divisions"
        />
      </div>

      {/* Two Column Grid: Recent Employees & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Recent Employees */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Employees</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest additions to the organization roster
              </p>
            </div>
            <Link
              to="/employees"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View All Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentEmployees.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No employee records available yet.
              </div>
            ) : (
              stats.recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {emp.avatar ? (
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {getInitials(emp.name)}
                      </div>
                    )}
                    <div className="min-w-0 truncate">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {emp.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {emp.designation} • <span className="text-slate-400">{emp.department}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                    <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                      Joined {formatDate(emp.joiningDate)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 span): Department Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Department Mix</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Headcount distribution across teams
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(stats.deptBreakdown).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No data</p>
              ) : (
                Object.entries(stats.deptBreakdown).map(([dept, count]) => {
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={dept} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 truncate max-w-[180px]">{dept}</span>
                        <span className="text-slate-500">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-950">REST API Ready</p>
              <p className="text-[11px] text-indigo-800 mt-1">
                Endpoints for GET, POST, PUT, DELETE are fully active with simulated or live backend connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
