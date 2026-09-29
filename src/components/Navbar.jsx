import React from 'react';
import { Menu, Bell, Search, ShieldCheck, Database, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { USE_MOCK_API } from '../services/api';
import { getInitials } from '../utils/formatters';

export const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left side: Hamburger button + Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right side: REST API status pill, Notification bell, User badge */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* API Mode Indicator */}
        <div
          className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            USE_MOCK_API
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
          title={
            USE_MOCK_API
              ? 'Mock REST Server Active (Full CRUD + localStorage persistence)'
              : 'Live REST API Backend Connected'
          }
        >
          <Database className="w-3.5 h-3.5" />
          <span>{USE_MOCK_API ? 'Mock REST Engine' : 'Live REST API'}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* Profile Avatar Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs ring-2 ring-slate-100">
              {getInitials(user?.name || 'Admin')}
            </div>
          )}
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
