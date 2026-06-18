/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Lock, User as UserIcon, ShieldAlert, Sparkles, Building, CheckCircle2, Eye, EyeOff, ShieldCheck, Mail, Phone 
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentUser: User;
}

export default function LoginModal({ onClose, onLoginSuccess, currentUser }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState<UserRole>('tenant');
  
  // Login Form States
  const [email, setEmail] = useState('suryakant11th@gmail.com');
  const [password, setPassword] = useState('');
  
  // Sign-Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Update email suggestion based on active portal tab
  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg('');
    setPassword('');
    // Suggested pre-fills for easy testing in live preview
    if (!isSignUp) {
      if (role === 'tenant') {
        setEmail('suryakant11th@gmail.com');
      } else if (role === 'owner') {
        setEmail('anil.staymate@gmail.com');
      } else {
        setEmail('suryakant11th@gmail.com');
      }
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      // Interactive Signup flow logic
      if (!signupName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!signupPhone.trim()) {
        setErrorMsg('Please enter your contact phone number.');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        // Build a dynamic registered user account state
        const registeredUser: User = {
          id: `user-${Math.floor(Math.random() * 1000050)}`,
          name: signupName,
          email: signupEmail,
          phone: activeTab === 'tenant' ? `******${signupPhone.slice(-4)}` : signupPhone, // Mask phone for tenants
          role: activeTab,
          verifiedKYC: activeTab === 'owner', // Preset owner to true for demonstration convenience
          walletBalance: 0 // New users start with 0 balance
        };
        onLoginSuccess(registeredUser);
        onClose();
      }, 1500);

    } else {
      // Existing Sign-in flow logic
      if (activeTab === 'admin') {
        // Admin Authentication Check
        if (email === 'suryakant11th@gmail.com' && password === 'ravikant9934') {
          setIsSuccess(true);
          setTimeout(() => {
            const adminUser: User = {
              id: 'user-suryakant',
              name: 'Suryakant Sharma (Admin)',
              email: 'suryakant11th@gmail.com',
              phone: '8862966355', // Secure admin phone
              role: 'admin',
              verifiedKYC: true,
              walletBalance: currentUser.walletBalance || 0
            };
            onLoginSuccess(adminUser);
            onClose();
          }, 1200);
        } else {
          setErrorMsg('Incorrect Admin Email or Password. Please try again with authorized credentials.');
        }
      } else if (activeTab === 'owner') {
        // Owner Quick Login
        setIsSuccess(true);
        setTimeout(() => {
          const ownerUser: User = {
            id: 'user-anil',
            name: 'Anil Kumar',
            email: 'anil.staymate@gmail.com',
            phone: '+91 98765 43210',
            role: 'owner',
            verifiedKYC: true,
            walletBalance: currentUser.walletBalance || 0
          };
          onLoginSuccess(ownerUser);
          onClose();
        }, 1200);
      } else {
        // Student/Tenant Login
        setIsSuccess(true);
        setTimeout(() => {
          const tenantUser: User = {
            id: 'user-suryakant',
            name: 'Suryakant Sharma',
            email: 'suryakant11th@gmail.com',
            phone: '******6355', // Masked phone number as requested to prevent direct call exposure
            role: 'tenant',
            verifiedKYC: false,
            walletBalance: currentUser.walletBalance || 0
          };
          onLoginSuccess(tenantUser);
          onClose();
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden card-shadow">
        
        {/* Banner header decoration */}
        <div className="p-6 bg-gradient-to-r from-brand-600 to-indigo-700 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all cursor-pointer"
            id="close-login-modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
              StayMate Secure Portal
            </span>
          </div>
          
          <h2 className="font-display font-extrabold text-xl mt-2 tracking-tight">
            {isSignUp ? "Create New StayMate Account" : "Sign In to StayMate Portal"}
          </h2>
          <p className="text-xs text-brand-100 mt-1 max-w-sm">
            {isSignUp 
              ? "Join India's most trusted student co-living network. Set up your profile in 60 seconds."
              : "Access platform dashboards, view premium co-living listings, and coordinate secure rentals."
            }
          </p>
        </div>

        {/* Custom Tab selector */}
        <div className="grid grid-cols-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5">
          <button
            type="button"
            onClick={() => handleTabChange('tenant')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'tenant' 
                ? 'bg-white dark:bg-slate-850 text-brand-600 dark:text-white shadow-sm font-extrabold border-b-2 border-brand-500 sm:border-b-0' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            🎓 Student/Tenant
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('owner')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'owner' 
                ? 'bg-white dark:bg-slate-850 text-brand-600 dark:text-white shadow-sm font-extrabold border-b-2 border-brand-500 sm:border-b-0' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            🏡 Property Owner
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'admin' 
                ? 'bg-white dark:bg-slate-855 text-brand-600 dark:text-white shadow-sm font-extrabold border-b-2 border-brand-500 sm:border-b-0' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
            }`}
          >
            👑 Administrator
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-base text-slate-800 dark:text-white">
                  {isSignUp ? "Account Registration Complete!" : "Authentication Successful"}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isSignUp ? "Welcome aboard! Synchronizing account profile and loading panels..." : "Initializing dynamic stay credentials and sync schemas..."}
                </p>
              </div>

              {activeTab === 'admin' && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl max-w-sm mx-auto text-[10px] text-amber-700 dark:text-amber-300">
                  🛡️ <strong>Private contact warning:</strong> Your phone number (8862966355) is safely hidden from renters to prevent unsolicited calls.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-450 font-medium flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSignUp ? (
                /* =================== SIGN UP FLOW FIELDS =================== */
                <>
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="e.g. Suryakant Sharma"
                        required
                        autoFocus
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="e.g. name@example.com"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="10-digit mobile number..."
                        required
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {activeTab === 'tenant' && (
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 block mt-1">
                        🔒 Privacy Guard enabled: Your phone number will be automatically masked from public listings.
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Choose Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="Create strong account password..."
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* =================== EXISTING LOGIN FLOW FLOW =================== */
                <>
                  {/* Email Address */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="Enter email..."
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {activeTab === 'tenant' && (
                      <span className="text-[10px] text-slate-400 block mt-1">Simulated Email: suryakant11th@gmail.com</span>
                    )}
                    {activeTab === 'owner' && (
                      <span className="text-[10px] text-slate-400 block mt-1">Simulated Email: anil.staymate@gmail.com</span>
                    )}
                    {activeTab === 'admin' && (
                      <span className="text-[10px] text-slate-400 block mt-1">Admin login email: suryakant11th@gmail.com</span>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        placeholder="Enter account passcode..."
                        required={activeTab === 'admin'}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {activeTab === 'admin' ? (
                      <span className="text-[10px] text-rose-500 font-semibold block mt-1">🔑 Enter admin passcode to authenticate.</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block mt-1">Can enter any password to login.</span>
                    )}
                  </div>
                </>
              )}

              {/* Helper Notice for Privacy Protection */}
              {activeTab === 'admin' && !isSignUp && (
                <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-[10px] text-brand-700 dark:text-brand-350 leading-relaxed font-normal">
                  📌 <strong>Premium Privacy Masking:</strong> For your phone number (8862966355), standard users will be blocked from viewing it. The system automatically prompts users to query you via email first, so your mobile stays completely private!
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  {isSignUp ? `Register as a new ${activeTab === 'tenant' ? 'Tenant' : activeTab === 'owner' ? 'Owner' : 'Admin'}` : 'Confirm details & Log in'}
                </button>
              </div>

              {/* Toggle Switch between Login and Sign Up */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                {isSignUp ? (
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setErrorMsg('');
                      }}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    First time on StayMate?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setErrorMsg('');
                      }}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                    >
                      Create an account now
                    </button>
                  </p>
                )}
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
