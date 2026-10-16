import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Droplet,
  MapPin,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../../data/mockData';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const MemberProfile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error } = useNotification();

  // Basic Account Info
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Donor Profile Info
  const donor = user?.donorProfile;
  const [bloodGroup, setBloodGroup] = useState(donor?.bloodGroup || 'O+');
  const [gender, setGender] = useState(donor?.gender || 'Male');
  const [age, setAge] = useState<string>(donor?.age ? String(donor.age) : '24');
  const [district, setDistrict] = useState(donor?.district || 'Dhaka');
  const [thana, setThana] = useState(donor?.thana || 'Dhanmondi');
  const [totalDonations, setTotalDonations] = useState<string>(
    donor?.totalDonations !== undefined ? String(donor.totalDonations) : '0'
  );
  const [readyForEmergency, setReadyForEmergency] = useState(
    donor?.readyForEmergency !== undefined ? donor.readyForEmergency : true
  );
  const [isAvailable, setIsAvailable] = useState(
    donor?.isAvailable !== undefined ? donor.isAvailable : true
  );

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
      if (user.donorProfile) {
        setBloodGroup(user.donorProfile.bloodGroup || 'O+');
        setGender(user.donorProfile.gender || 'Male');
        setAge(String(user.donorProfile.age || '24'));
        setDistrict(user.donorProfile.district || 'Dhaka');
        setThana(user.donorProfile.thana || 'Dhanmondi');
        setTotalDonations(String(user.donorProfile.totalDonations || '0'));
        setReadyForEmergency(user.donorProfile.readyForEmergency !== false);
        setIsAvailable(user.donorProfile.isAvailable !== false);
      }
    }
  }, [user]);

  const thanaOptions = BANGLADESH_THANAS[district] || ['Central', 'North', 'South', 'East', 'West'];

  // Handle avatar image selection
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        error('Image Too Large', 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Validation Error', 'Full name is required.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || null,
        avatarUrl: avatarUrl || null,
        donor: {
          bloodGroup,
          gender,
          age: parseInt(age, 10) || 24,
          district,
          thana,
          totalDonations: Math.max(0, parseInt(totalDonations, 10) || 0),
          readyForEmergency,
          isAvailable,
        },
      });
      success('Profile Saved', 'Your member and donor information has been updated.');
    } catch (err: any) {
      error('Update Failed', err.message || 'Unable to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      error('Password Error', 'Please fill in current and new password fields.');
      return;
    }
    if (newPassword.length < 6) {
      error('Password Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Password Error', 'New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(currentPassword, newPassword);
      success('Password Updated', 'Your account password has been changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error('Password Update Failed', err.message || 'Current password was incorrect.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Profile & Donor Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, blood donation parameters, and emergency readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Role Privileges */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar & Identity Box */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/70 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center font-bold text-2xl text-red-600 dark:text-red-400 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.slice(0, 2).toUpperCase() || 'MB'
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer transition-colors"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name || 'Member'}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            {/* Read-Only Role & Verification Badges */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Account Role:</span>
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900">
                  {user?.role || 'DONOR'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Verification:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Member
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-left pt-1">
                🔒 System roles and administrative privileges are strictly protected and organization-managed.
              </p>
            </div>
          </div>

          {/* Password Change Box */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" /> Security & Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                {isChangingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Editable Permitted Information */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" /> Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Email Address (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    placeholder="01711234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Linked Donor Parameters */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500" /> Donor Parameters & Blood Group
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      const t = BANGLADESH_THANAS[e.target.value] || ['Central'];
                      setThana(t[0]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    {BANGLADESH_DISTRICTS.map((d: string) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Thana / Upazila
                  </label>
                  <select
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    {thanaOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Blood Donation Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={totalDonations}
                    onChange={(e) => setTotalDonations(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">Active Availability</h5>
                    <p className="text-[11px] text-slate-400">Available to receive hospital inquiries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded text-red-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-red-900 dark:text-red-200">Emergency Readiness</h5>
                    <p className="text-[11px] text-red-700 dark:text-red-300">Ready for emergency critical broadcasts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={readyForEmergency}
                    onChange={(e) => setReadyForEmergency(e.target.checked)}
                    className="w-5 h-5 rounded text-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/25 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
