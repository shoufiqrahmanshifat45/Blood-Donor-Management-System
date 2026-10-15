import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Mail,
  Phone,
  Lock,
  Camera,
  Upload,
  RotateCcw,
  KeyRound,
  Eye,
  EyeOff,
  Database,
  Download,
  Trash2,
  Globe,
  Volume2,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAdminPhoto } from '../utils/avatarStorage';
import { HELP_FAQS, INITIAL_DONORS, RECENT_BLOOD_REQUESTS, BLOOD_STOCK_DATA } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'theme' | 'notifications' | 'system' | 'help'
  >('profile');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Photo management via custom hook
  const { photo: adminPhoto, updatePhoto, resetPhoto } = useAdminPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form (Admin name is locked as Shoufiq Rahman Shifat)
  const [adminProfile, setAdminProfile] = useState({
    name: 'Shoufiq Rahman Shifat', // Locked name per requirement
    role: 'System Administrator & Coordinator',
    email: 'shoufiq.shifat@bdms.org',
    phone: '+880 1711-892451',
    organization: 'Blood Donor Management Network Bangladesh',
    bloodGroup: 'O+',
    bio: 'Lead coordinator overseeing national blood reserve logistics, donor matching algorithms, and emergency dispatch.',
  });

  // Password & Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emergencyAlerts: true,
    emailDigest: true,
    smsDispatch: true,
    appointmentReminders: true,
  });

  // System & Regional Preferences
  const [regionalPrefs, setRegionalPrefs] = useState({
    language: 'English (US)',
    timezone: 'Asia/Dhaka (GMT+06:00)',
    dateFormat: 'DD/MM/YYYY',
    alertSound: true,
    autoDispatchRadius: '25 km',
  });

  const { mode, setMode, customAccent, setCustomAccent } = useTheme();
  const { success, error: notifyError } = useNotification();

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notifyError('Invalid File Format', 'Please upload an image file (PNG, JPG, WebP, GIF).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      notifyError('File Too Large', 'Please upload an image under 5 MB in size.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        updatePhoto(base64Data);
        success(
          'Photo Updated Successfully',
          'Your new profile photo is active across the dashboard and taskbar.'
        );
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-uploading the same file works
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetPhoto = () => {
    resetPhoto();
    success('Photo Restored', 'Profile photo has been reset to system default avatar.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Updated', 'Profile details saved successfully.');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      notifyError('Current Password Required', 'Please provide your existing password.');
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      notifyError('Weak Password', 'New password must contain at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notifyError('Passwords Do Not Match', 'New password and confirmation must match.');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    success('Password Updated', 'Your administrative security credentials have been updated.');
  };

  const handleSaveNotifs = () => {
    success('Preferences Saved', 'Notification alert settings updated.');
  };

  const handleSaveRegional = () => {
    success('Regional Preferences Saved', 'Language, timezone, and dispatch thresholds updated.');
  };

  // Export JSON Database Backup
  const handleExportDataBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      admin: 'Shoufiq Rahman Shifat',
      stats: {
        totalDonors: INITIAL_DONORS.length,
        totalRequests: RECENT_BLOOD_REQUESTS.length,
      },
      donors: INITIAL_DONORS,
      bloodRequests: RECENT_BLOOD_REQUESTS,
      inventory: BLOOD_STOCK_DATA,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BDMS_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    success('Backup Created', 'Full system database archive downloaded as JSON.');
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#ef4444]" />
            Settings & System Preferences
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure administrative profile, update avatar, security credentials, interface themes, and regional settings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto self-start sm:self-auto max-w-full">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Admin Profile
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Security
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'theme'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Theme
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'notifications'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'system'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Data & Backup
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'help'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help & FAQs
          </button>
        </div>
      </div>

      {/* Tab 1: Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Card Summary with Photo Management (Col 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex flex-col items-center text-center space-y-3.5">
            {/* Avatar with Camera Hover Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to update photo"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-red-500/20 shadow-md relative bg-slate-900">
                <img
                  src={adminPhoto}
                  alt={adminProfile.name}
                  className="w-full h-full object-cover object-center"
                />
                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                  <Camera className="w-5 h-5 mb-0.5 text-white" />
                  <span>Update Photo</span>
                </div>
              </div>

              {/* Camera Icon Badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-0 right-0 p-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white border-2 border-white dark:border-[#0c1527] rounded-full shadow-xs transition-transform hover:scale-110"
                title="Choose new photo"
                aria-label="Upload profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Photo Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Upload className="w-3 h-3" /> Update Photo
              </button>
              <button
                type="button"
                onClick={handleResetPhoto}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                title="Reset to default picture"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {adminProfile.name}
              </h2>
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {adminProfile.role}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                <Shield className="w-3 h-3 text-emerald-500" /> Verified Administrator
              </span>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-extrabold text-red-600">{adminProfile.bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">Active Duty</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dispatch Access:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Level 5 (Unrestricted)
                </span>
              </div>
            </div>
          </div>

          {/* Form (Col 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Administrator Profile & Contact Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Full Name (Locked)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={adminProfile.name}
                      readOnly
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-white cursor-not-allowed select-none"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={adminProfile.role}
                    onChange={(e) =>
                      setAdminProfile({ ...adminProfile, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) =>
                      setAdminProfile({ ...adminProfile, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={adminProfile.phone}
                    onChange={(e) =>
                      setAdminProfile({ ...adminProfile, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Organization / Unit
                </label>
                <input
                  type="text"
                  value={adminProfile.organization}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, organization: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Bio / Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={adminProfile.bio}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-xl shadow-md shadow-red-500/20 transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password Settings */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Change Password Form (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#ef4444]" />
                Change Administrative Password
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensure your account uses a strong, unique password with at least 6 characters.
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    New Password *
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Re-type new password"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Update Password
                </button>
              </div>
            </form>
          </div>

          {/* 2FA & Active Sessions (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Require OTP verification code upon login.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    success(
                      '2FA Updated',
                      e.target.checked ? 'Two-Factor Authentication is active.' : '2FA disabled.'
                    );
                  }}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-[11.5px] space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Method: SMS & Authenticator App
                </p>
                <p className="text-slate-400">+880 1711-892451 (Primary Device)</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Login Sessions</h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Windows PC • Edge Browser
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Current
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">IP: 127.0.0.1 • Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Theme Tab */}
      {activeTab === 'theme' && (
        <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Theme & Color Mode
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your preferred visual mode. Custom mode applies across taskbars and header widgets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean white background' },
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep navy dark palette' },
              { id: 'system', label: 'System Mode', icon: Laptop, desc: 'Follows OS preference' },
              { id: 'custom', label: 'Custom Mode', icon: Palette, desc: 'Custom accent colors' },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#ef4444] bg-red-50/50 dark:bg-red-950/20 shadow-xs ring-1 ring-[#ef4444]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131d33] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#ef4444]' : 'text-slate-400'}`} />
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{m.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {mode === 'custom' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Customize Theme Primary Accent Color
              </h4>
              <div className="flex items-center gap-3">
                {[
                  { id: 'crimson', name: 'Blood Crimson', hex: '#ef4444' },
                  { id: 'sapphire', name: 'Royal Sapphire', hex: '#2563eb' },
                  { id: 'emerald', name: 'Emerald Vitality', hex: '#059669' },
                  { id: 'amethyst', name: 'Amethyst Night', hex: '#7c3aed' },
                ].map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setCustomAccent(color.id as any)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        customAccent === color.id
                          ? 'border-white ring-2 ring-[#ef4444] scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] text-slate-500 font-medium">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notification & Emergency Dispatch Preferences
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control when the system sends automated audio, visual, and SMS notifications.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'emergencyAlerts',
                title: 'High-Priority Emergency SOS Broadcasts',
                desc: 'Receive immediate alerts when critical blood requests are posted.',
              },
              {
                id: 'emailDigest',
                title: 'Daily Inventory & Summary Digest',
                desc: 'Automated morning report containing blood stock balances.',
              },
              {
                id: 'smsDispatch',
                title: 'SMS Gateway Dispatch Notification',
                desc: 'Send automated confirmation SMS to donors on appointment booking.',
              },
              {
                id: 'appointmentReminders',
                title: 'Appointment Follow-up Reminders',
                desc: 'Remind donors 24 hours prior to their scheduled blood donation session.',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifPrefs as any)[item.id]}
                  onChange={(e) =>
                    setNotifPrefs({
                      ...notifPrefs,
                      [item.id]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveNotifs}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Save Notification Rules
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Data & System Backup Settings */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Regional & Dispatch (Col 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  Regional Localization & Dispatch Radii
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set platform default timezone, date format, and auto-dispatch matching parameters.
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      System Language
                    </label>
                    <select
                      value={regionalPrefs.language}
                      onChange={(e) => setRegionalPrefs({ ...regionalPrefs, language: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Timezone
                    </label>
                    <select
                      value={regionalPrefs.timezone}
                      onChange={(e) => setRegionalPrefs({ ...regionalPrefs, timezone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white"
                    >
                      <option value="Asia/Dhaka (GMT+06:00)">Asia/Dhaka (GMT+06:00)</option>
                      <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Date Formatting
                    </label>
                    <select
                      value={regionalPrefs.dateFormat}
                      onChange={(e) => setRegionalPrefs({ ...regionalPrefs, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 15/10/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Auto-Dispatch Matching Radius
                    </label>
                    <select
                      value={regionalPrefs.autoDispatchRadius}
                      onChange={(e) =>
                        setRegionalPrefs({ ...regionalPrefs, autoDispatchRadius: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white"
                    >
                      <option value="5 km">5 km (Immediate Urban)</option>
                      <option value="10 km">10 km (Metropolitan)</option>
                      <option value="25 km">25 km (District Radius)</option>
                      <option value="Entire District">Entire District</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveRegional}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Regional Settings
                </button>
              </div>
            </div>

            {/* Database Backup & Export (Col 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" />
                  System Data Backup & Archives
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export complete database snapshots for offline records and audits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 space-y-2.5">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Full Snapshot Export
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Includes all verified donors, emergency blood requests, inventory status, and booking logs.
                </p>
                <button
                  type="button"
                  onClick={handleExportDataBackup}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON Archive
                </button>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-2">
                <p className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Demo Store Cache Reset
                </p>
                <p className="text-[11px] text-red-700 dark:text-red-400 leading-relaxed">
                  Reset custom added donors and appointments back to factory baseline seed.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('bdms-persistent-donors');
                    localStorage.removeItem('bdms-persistent-requests');
                    localStorage.removeItem('bdms-persistent-appointments');
                    success('Cache Reset', 'System memory restored to initial seeds.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Reset Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Help & FAQs Tab */}
      {activeTab === 'help' && (
        <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Frequently Asked Questions & Coordinator Help
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant answers regarding blood donation eligibility, emergency dispatch, and platform management.
            </p>
          </div>

          <div className="space-y-2">
            {HELP_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50 dark:bg-[#131d33] hover:bg-slate-100 dark:hover:bg-[#182542] transition-colors"
                  >
                    <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0c1527] border-t border-slate-100 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Support Hotline Card */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                Need urgent technical or administrative support?
              </h4>
              <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
                Our national control center operates 24/7. Call our emergency hotline anytime.
              </p>
            </div>
            <a
              href="tel:999"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5" /> Call 999 Helpline
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
