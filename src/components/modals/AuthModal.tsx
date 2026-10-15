import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  UserPlus,
  LogIn,
  CheckCircle2,
  Droplet,
  Eye,
  EyeOff,
} from 'lucide-react';
import adminPhoto from '../../assets/admin-photo.png';
import { useNotification } from '../../context/NotificationContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'profile' | 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'profile',
}) => {
  const [mode, setMode] = useState<'profile' | 'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Current logged in user (locked to Shoufiq Rahman Shifat)
  const [currentUser, setCurrentUser] = useState({
    name: 'Shoufiq Rahman Shifat',
    email: 'shoufiq.shifat@bdms.org',
    role: 'Admin & System Coordinator',
    phone: '+880 1711-892451',
    bloodGroup: 'O+',
    totalDonations: 14,
    lastDonated: '3 months ago',
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const { success, error: notifyError } = useNotification();

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!loginForm.email.trim()) errors.email = 'Email address is required';
    if (!loginForm.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    success('Logged In Successfully', `Welcome back, ${currentUser.name}!`);
    setMode('profile');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!registerForm.name.trim()) errors.name = 'Full name is required';
    if (!registerForm.email.trim()) errors.email = 'Email address is required';
    if (!registerForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!registerForm.password || registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});
    success('Account Registered', 'New coordinator account created successfully!');
    setMode('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0c1527] w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-[#15213b] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-[#ef4444] flex items-center justify-center">
              <User className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {mode === 'profile'
                  ? 'User Account Profile'
                  : mode === 'login'
                  ? 'Sign In to Portal'
                  : 'Register New Account'}
              </h3>
              <p className="text-[11.5px] text-slate-400">
                Blood Donor Management Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection (Profile / Login / Register) */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 bg-slate-50/50 dark:bg-[#101b33]/40">
          <button
            onClick={() => setMode('profile')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
              mode === 'profile'
                ? 'border-[#ef4444] text-[#ef4444]'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setMode('login')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
              mode === 'login'
                ? 'border-[#ef4444] text-[#ef4444]'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
              mode === 'register'
                ? 'border-[#ef4444] text-[#ef4444]'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto">
          {/* View 1: Active User Profile */}
          {mode === 'profile' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-red-500/20 shadow-md">
                    <img
                      src={adminPhoto}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#0c1527] rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {currentUser.role}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="text-[11px] text-slate-400">Blood Group</p>
                  <p className="text-base font-extrabold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                    <Droplet className="w-3.5 h-3.5" /> {currentUser.bloodGroup}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Lifetime Donations</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {currentUser.totalDonations} Times
                  </p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131d33]/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {currentUser.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131d33]/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Account Security:
                  </span>
                  <span className="font-semibold text-emerald-600">
                    2FA Verified Admin
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    success('Session Maintained', 'Already signed in as Shoufiq Rahman Shifat.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> System Active
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Switch Account
                </button>
              </div>
            </div>
          )}

          {/* View 2: Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    placeholder="shoufiq.shifat@bdms.org"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[11px] text-red-500 mt-0.5">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-[11px] text-red-500 mt-0.5">{loginErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-red-600" />
                  <span>Remember session</span>
                </label>
                <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[#ef4444] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs md:text-sm font-semibold shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" /> Sign In to Portal
              </button>

              <p className="text-center text-xs text-slate-400 pt-2">
                Don't have a coordinator account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#ef4444] hover:underline"
                >
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* View 3: Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  placeholder="e.g. Dr. Sabrina Akhter"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                {registerErrors.name && (
                  <p className="text-[11px] text-red-500 mt-0.5">{registerErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    placeholder="sabrina@example.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {registerErrors.email && (
                    <p className="text-[11px] text-red-500 mt-0.5">{registerErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={registerForm.bloodGroup}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, phone: e.target.value })
                  }
                  placeholder="+880 1819-000000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                {registerErrors.phone && (
                  <p className="text-[11px] text-red-500 mt-0.5">{registerErrors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {registerErrors.password && (
                    <p className="text-[11px] text-red-500 mt-0.5">{registerErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-0.5">{registerErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs md:text-sm font-semibold shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </button>

              <p className="text-center text-xs text-slate-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#ef4444] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
