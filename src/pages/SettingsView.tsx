import React, { useState } from 'react';
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
} from 'lucide-react';
import adminPhoto from '../assets/admin-photo.png';
import { HELP_FAQS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'notifications' | 'help'>('profile');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emergencyAlerts: true,
    emailDigest: true,
    smsDispatch: true,
    appointmentReminders: true,
  });

  const { mode, setMode, customAccent, setCustomAccent } = useTheme();
  const { success } = useNotification();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Updated', 'Profile details saved successfully.');
  };

  const handleSaveNotifs = () => {
    success('Preferences Saved', 'Notification alert settings updated.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#ef4444]" />
            Settings & System Preferences
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure administrative profile, interface themes, notification channels, and browse system FAQs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto self-start sm:self-auto">
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
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'theme'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Theme & Appearance
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Card Summary (Col 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-red-500/20 shadow-md">
                <img
                  src={adminPhoto}
                  alt={adminProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 border-2 border-white dark:border-[#0c1527] rounded-full" />
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
                <span className="font-bold text-slate-800 dark:text-slate-200">Level 5 (Unrestricted)</span>
              </div>
            </div>
          </div>

          {/* Form (Col 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Administrator Information
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
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Tab */}
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

      {/* Notifications Tab */}
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

      {/* Help & FAQs Tab */}
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
