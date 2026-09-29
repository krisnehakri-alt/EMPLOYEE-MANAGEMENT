import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'Dashboard Overview';
    if (path === '/employees') return 'Employee Directory';
    if (path === '/employees/new') return 'Add New Employee';
    if (path.includes('/edit')) return 'Edit Employee';
    if (path.startsWith('/employees/')) return 'Employee Profile Details';
    if (path === '/profile') return 'My Administrator Profile';
    return 'StaffPulse Portal';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <Navbar
          pageTitle={getPageTitle()}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Dynamic Outlet Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
