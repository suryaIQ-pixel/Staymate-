/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, User as UserIcon, LogIn, Layout, BookOpen, ShieldCheck, Sun, Moon, Lock, ShieldAlert, X, Eye, EyeOff } from 'lucide-react';
import { User, UserRole } from '../types';
import LoginModal from './LoginModal';

interface NavbarProps {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  showBookings: boolean;
  setShowBookings: (show: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  setView: (view: 'explore' | 'owner-dashboard' | 'admin-dashboard') => void;
  activeView: string;
}

export default function Navbar({
  currentUser,
  setCurrentUser,
  showBookings,
  setShowBookings,
  darkMode,
  setDarkMode,
  setView,
  activeView
 }: NavbarProps) {
  
  const [isLoginPortalOpen, setIsLoginPortalOpen] = React.useState(false);

  // Quick Switch Roles opens the centralized Portal
  const handleRoleChange = (role: UserRole) => {
    setIsLoginPortalOpen(true);
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors border-b ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    } card-shadow`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setView('explore'); setShowBookings(false); }}>
          <div className="bg-brand-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Home className="w-5 h-5" id="logo-icon" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-brand-600 block leading-tight">StayMate</span>
            <span className="text-[10px] text-slate-400 font-sans tracking-wide block -mt-1 uppercase">Premium Student Stays</span>
          </div>
        </div>

        {/* Middle Navigation - Quick Tabs */}
        <nav className="hidden md:flex space-x-6">
          <button 
            id="nav-explore"
            onClick={() => { setView('explore'); setShowBookings(false); }}
            className={`font-sans font-medium text-sm transition-colors py-2 px-1 border-b-2 ${
              activeView === 'explore' && !showBookings
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Find Accommodation
          </button>
          
          {currentUser.role === 'owner' && (
            <button 
              id="nav-owner-dash"
              onClick={() => { setView('owner-dashboard'); setShowBookings(false); }}
              className={`font-sans font-medium text-sm transition-colors py-2 px-1 border-b-2 ${
                activeView === 'owner-dashboard'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Owner Console
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button 
              id="nav-admin-dash"
              onClick={() => { setView('admin-dashboard'); setShowBookings(false); }}
              className={`font-sans font-medium text-sm transition-colors py-2 px-1 border-b-2 ${
                activeView === 'admin-dashboard'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Platform Admin Panel
            </button>
          )}
        </nav>

        {/* Right Access Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Real Portal Trigger Button */}
          <button
            onClick={() => setIsLoginPortalOpen(true)}
            className="flex items-center space-x-1 py-1.5 px-2.5 bg-brand-50 hover:bg-brand-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-brand-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all hover:scale-[1.02] cursor-pointer shrink-0 border border-brand-100 dark:border-slate-700"
            id="btn-trigger-login-portal"
          >
            <LogIn className="w-3.5 h-3.5 mr-0.5 text-brand-600" />
            <span>Login Portal</span>
          </button>

          {/* Quick Role Simulator Info */}
          <div className="hidden sm:flex items-center rounded-lg p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <select
              id="role-simulator"
              value={currentUser.role}
              onChange={(e) => {
                setIsLoginPortalOpen(true);
              }}
              className="text-[11px] bg-transparent font-medium border-0 focus:ring-0 cursor-pointer text-slate-600 dark:text-slate-200"
            >
              <option value="tenant" className="dark:bg-slate-900">🎓 Student/Tenant</option>
              <option value="owner" className="dark:bg-slate-900">🏡 Property Owner</option>
              <option value="admin" className="dark:bg-slate-900">👑 Admin Console</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggler"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Actions */}
          {currentUser.role === 'tenant' && (
            <button 
              id="btn-nav-bookings"
              onClick={() => setShowBookings(!showBookings)}
              className={`relative p-2 rounded-lg transition-colors flex items-center space-x-1 border cursor-pointer ${
                showBookings 
                  ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-slate-800 dark:border-slate-700' 
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">My Bookings</span>
            </button>
          )}

          {/* User Profile Badge (Clickable to change logins) */}
          <div 
            onClick={() => setIsLoginPortalOpen(true)}
            className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-85 select-none"
            title="Click to Switch Accounts / Authenticate"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-display font-bold text-xs ring-2 ring-brand-100 dark:ring-offset-slate-900">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 block font-normal flex items-center">
                {currentUser.verifiedKYC ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-500 mr-0.5" />
                    Verified KYC
                  </>
                ) : (
                  'Pending Verified'
                )}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* SECURE INTERACTIVE LOGIN PORTAL MODAL */}
      {isLoginPortalOpen && (
        <LoginModal 
          onClose={() => setIsLoginPortalOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={(user: User) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              setView('admin-dashboard');
            } else if (user.role === 'owner') {
              setView('owner-dashboard');
            } else {
              setView('explore');
            }
            setShowBookings(false);
          }}
        />
      )}
    </header>
  );
}
