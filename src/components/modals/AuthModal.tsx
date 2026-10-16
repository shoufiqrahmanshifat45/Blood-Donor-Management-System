import React, { useState, useEffect } from 'react';
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
  Edit3,
  Save,
  RotateCcw,
  MapPin,
  KeyRound,
  Check,
} from 'lucide-react';
import { useAdminPhoto } from '../../utils/avatarStorage';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../../data/mockData';

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
  const { photo: adminPhoto } = useAdminPhoto();
  const { user, isAuthenticated, login, register, logout, updateProfile, changePassword } = useAuth();
  const [mode, setMode] = useState<'profile' | 'login' | 'register'>(
    !isAuthenticated && initialMode === 'profile' ? 'login' : initialMode
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Edit State for both Admin and Donor profiles
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('O+');
  const [editAge, setEditAge] = useState('25');
  const [editDistrict, setEditDistrict] = useState('Dhaka');
  const [editThana, setEditThana] = useState('Dhanmondi');
  const [editTotalDonations, setEditTotalDonations] = useState('0');
  const [editReadyForEmergency, setEditReadyForEmergency] = useState(true);
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Sync edit form with user when opening or user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      if (user.donorProfile) {
        setEditBloodGroup(user.donorProfile.bloodGroup || 'O+');
        setEditAge(String(user.donorProfile.age || 25));
        setEditDistrict(user.donorProfile.district || 'Dhaka');
        setEditThana(user.donorProfile.thana || 'Dhanmondi');
        setEditTotalDonations(String(user.donorProfile.totalDonations ?? 0));
        setEditReadyForEmergency(user.donorProfile.readyForEmergency ?? true);
        setEditIsAvailable(user.donorProfile.isAvailable ?? true);
      }
    }
  }, [user, isEditingProfile]);

  // Sync mode if user authentication state changes
  useEffect(() => {
    if (!isAuthenticated && mode === 'profile') {
      setMode('login');
    }
  }, [isAuthenticated, mode]);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    bloodGroup: 'O+',
    phone: '',
    role: 'DONOR',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const { success, error: notifyError } = useNotification();

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!loginForm.email.trim()) errors.email = 'Email address is required';
    if (!loginForm.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    setIsSubmitting(true);
    try {
      await login(loginForm.email.trim(), loginForm.password);
      success('Logged In Successfully', 'Secure session established.');
      setMode('profile');
      onClose();
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors: Record<string, string> = {};
        err.details.forEach((d: any) => {
          if (d.field) fieldErrors[d.field] = d.message;
        });
        setLoginErrors(fieldErrors);
      }
      notifyError('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!registerForm.name.trim()) errors.name = 'Full name is required';
    if (!registerForm.email.trim()) errors.email = 'Email address is required';
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
    setIsSubmitting(true);
    try {
      await register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim() || undefined,
        role: registerForm.role,
        password: registerForm.password,
      });
      success('Account Registered', 'Welcome to Blood Donor Management System!');
      setMode('profile');
      onClose();
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors: Record<string, string> = {};
        err.details.forEach((d: any) => {
          if (d.field) fieldErrors[d.field] = d.message;
        });
        setRegisterErrors(fieldErrors);
      }
      notifyError('Registration Failed', err.message || 'Unable to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      notifyError('Validation Error', 'Full Name is required');
      return;
    }
    setProfileSaving(true);
    try {
      const payload: any = {
        name: editName.trim(),
        phone: editPhone.trim() || null,
      };

      if (user?.donorProfile || user?.role === 'DONOR') {
        const donationCount = Math.max(0, parseInt(editTotalDonations, 10) || 0);
        payload.donor = {
          bloodGroup: editBloodGroup,
          age: parseInt(editAge, 10) || 25,
          district: editDistrict,
          thana: editThana,
          totalDonations: donationCount,
          readyForEmergency: editReadyForEmergency,
          isAvailable: editIsAvailable,
        };
      }

      await updateProfile(payload);

      if (changePasswordOpen && newPassword) {
        if (!currentPassword) {
          notifyError('Password Error', 'Current password is required to change password.');
          setProfileSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          notifyError('Password Error', 'New password must be at least 6 characters.');
          setProfileSaving(false);
          return;
        }
        await changePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setChangePasswordOpen(false);
      }

      success('Profile Updated', 'Your profile and donation information have been saved.');
      setIsEditingProfile(false);
    } catch (err: any) {
      notifyError('Update Failed', err.message || 'Could not update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      success('Signed Out', 'You have been safely logged out.');
      setMode('login');
    } catch (err) {
      notifyError('Sign Out Error', (err as Error).message);
    }
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
          {isAuthenticated && (
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
          )}
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
          {mode === 'profile' && user && (
            <div>
              {isEditingProfile ? (
                /* Edit Profile Form */
                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                      <Edit3 className="w-3.5 h-3.5 text-red-500" />
                      <span>Edit {user.role === 'DONOR' ? 'Donor Profile' : 'Admin Profile'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                      {user.role}
                    </span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+880 1711-000000"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Donor Specific Fields (Blood Group, Age, Location, Previous Blood Donation Count) */}
                  {(user.donorProfile || user.role === 'DONOR') && (
                    <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-red-600 dark:text-red-400">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Donor Registry Records</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Blood Group
                          </label>
                          <select
                            value={editBloodGroup}
                            onChange={(e) => setEditBloodGroup(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
                          >
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                              <option key={bg} value={bg}>
                                {bg}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Age (18-65)
                          </label>
                          <input
                            type="number"
                            min="18"
                            max="65"
                            value={editAge}
                            onChange={(e) => setEditAge(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            District
                          </label>
                          <select
                            value={editDistrict}
                            onChange={(e) => {
                              setEditDistrict(e.target.value);
                              const newThanas = BANGLADESH_THANAS[e.target.value] || ['Central'];
                              setEditThana(newThanas[0]);
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                          >
                            {BANGLADESH_DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Thana / Area
                          </label>
                          <select
                            value={editThana}
                            onChange={(e) => setEditThana(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                          >
                            {(BANGLADESH_THANAS[editDistrict] || ['Central']).map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Previous Blood Donation Count */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Lifetime Blood Donation Count
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          value={editTotalDonations}
                          onChange={(e) => setEditTotalDonations(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Total times you have donated blood across all verified drives
                        </p>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-1.5 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editReadyForEmergency}
                            onChange={(e) => setEditReadyForEmergency(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-red-600 accent-red-600"
                          />
                          <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
                            Ready for 24/7 urgent emergency requests
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editIsAvailable}
                            onChange={(e) => setEditIsAvailable(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-red-600 accent-red-600"
                          />
                          <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
                            Currently available to donate
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Password Change Collapsible */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setChangePasswordOpen(!changePasswordOpen)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      <span>{changePasswordOpen ? 'Cancel Password Change' : 'Change Password'}</span>
                    </button>

                    {changePasswordOpen && (
                      <div className="mt-2 space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#131d33]/60 border border-slate-200/80 dark:border-slate-800">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            New Password (min 6 chars)
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New secure password"
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Form Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile Summary View */
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-red-500/20 shadow-md">
                        <img
                          src={user.avatarUrl || adminPhoto}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#0c1527] rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </h4>
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                        {user.role}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <p className="text-[11px] text-slate-400">Blood Group</p>
                      <p className="text-base font-extrabold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                        <Droplet className="w-3.5 h-3.5" /> {user.donorProfile?.bloodGroup || 'Not linked'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Lifetime Donations</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {user.donorProfile ? `${user.donorProfile.totalDonations} Times` : '0 Times'}
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
                        {user.phone || 'No phone registered'}
                      </span>
                    </div>

                    {user.donorProfile && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131d33]/60">
                        <span className="text-slate-400 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Area:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {user.donorProfile.thana}, {user.donorProfile.district}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131d33]/60">
                      <span className="text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Account Status:
                      </span>
                      <span className="font-semibold text-emerald-600">
                        Active & Authenticated
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
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
