import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  ShieldCheck,
  Award,
  AlertCircle,
  Droplet,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { DetailedDonor, BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../data/mockData';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface DonorProfileModalProps {
  donor: DetailedDonor | null;
  onClose: () => void;
  onRequestBlood?: (donor: DetailedDonor) => void;
  onBookAppointment?: (donor: DetailedDonor) => void;
  onDonorUpdated?: (updatedDonor: DetailedDonor) => void;
}

export const DonorProfileModal: React.FC<DonorProfileModalProps> = ({
  donor: initialDonor,
  onClose,
  onRequestBlood,
  onBookAppointment,
  onDonorUpdated,
}) => {
  if (!initialDonor) return null;

  const [currentDonor, setCurrentDonor] = useState<DetailedDonor>(initialDonor);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  // Form edit fields
  const [name, setName] = useState(initialDonor.name || '');
  const [bloodGroup, setBloodGroup] = useState(initialDonor.bloodGroup || 'O+');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialDonor.gender || 'Male');
  const [age, setAge] = useState(String(initialDonor.age || 25));
  const [phone, setPhone] = useState(initialDonor.phone || '');
  const [email, setEmail] = useState(initialDonor.email || '');
  const [district, setDistrict] = useState(initialDonor.district || 'Dhaka');
  const [thana, setThana] = useState(initialDonor.thana || 'Dhanmondi');
  const [totalDonations, setTotalDonations] = useState(String(initialDonor.totalDonations ?? 0));
  const [status, setStatus] = useState(initialDonor.status || 'Eligible');
  const [weightKg, setWeightKg] = useState(String(initialDonor.weightKg || 65));
  const [readyForEmergency, setReadyForEmergency] = useState(initialDonor.readyForEmergency ?? true);
  const [isAvailable, setIsAvailable] = useState(true);

  // Sync state if initialDonor changes
  useEffect(() => {
    if (initialDonor) {
      setCurrentDonor(initialDonor);
      setName(initialDonor.name || '');
      setBloodGroup(initialDonor.bloodGroup || 'O+');
      setGender(initialDonor.gender || 'Male');
      setAge(String(initialDonor.age || 25));
      setPhone(initialDonor.phone || '');
      setEmail(initialDonor.email || '');
      setDistrict(initialDonor.district || 'Dhaka');
      setThana(initialDonor.thana || 'Dhanmondi');
      setTotalDonations(String(initialDonor.totalDonations ?? 0));
      setStatus(initialDonor.status || 'Eligible');
      setWeightKg(String(initialDonor.weightKg || 65));
      setReadyForEmergency(initialDonor.readyForEmergency ?? true);
    }
  }, [initialDonor]);

  const thanaOptions = BANGLADESH_THANAS[district] || ['Central', 'North', 'South', 'East', 'West'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notifyError('Validation Error', 'Full Name is required');
      return;
    }
    if (!phone.trim()) {
      notifyError('Validation Error', 'Phone Number is required');
      return;
    }

    setIsSaving(true);
    try {
      const donationsNum = Math.max(0, parseInt(totalDonations, 10) || 0);
      const ageNum = parseInt(age, 10) || 25;
      const weightNum = parseFloat(weightKg) || 65;

      const updated = await api.updateDonor(currentDonor.id, {
        name: name.trim(),
        bloodGroup: bloodGroup as any,
        gender,
        age: ageNum,
        phone: phone.trim(),
        email: email.trim() || undefined,
        district,
        thana,
        totalDonations: donationsNum,
        status: status as any,
        weightKg: weightNum,
        readyForEmergency,
        isAvailable,
      });

      setCurrentDonor(updated);
      setIsEditing(false);
      if (onDonorUpdated) onDonorUpdated(updated);
      success('Donor Profile Updated', `${name.trim()}'s profile details and donation records have been saved.`);
    } catch (err: any) {
      notifyError('Update Failed', err.message || 'Could not update donor details');
    } finally {
      setIsSaving(false);
    }
  };

  const isEligible = currentDonor.status === 'Eligible';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1527] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Blood Group Hero */}
        <div className="relative p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-inner shrink-0">
              <span className="text-2xl font-black tracking-tight leading-none">{currentDonor.bloodGroup}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Group</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{currentDonor.name}</h3>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                  isEligible ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40' : 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
                }`}>
                  {currentDonor.status}
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1 flex items-center gap-2">
                <span>Donor ID: {currentDonor.id?.startsWith('DNR-') ? currentDonor.id : `DNR-${currentDonor.id?.slice(0, 8).toUpperCase()}`}</span>
                <span>•</span>
                <span>{currentDonor.gender}, {currentDonor.age} yrs</span>
                <span>•</span>
                <span>{currentDonor.weightKg ? `${currentDonor.weightKg} kg` : 'Standard'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {isEditing ? (
            /* Donor Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Edit3 className="w-4 h-4 text-red-500" />
                  <span>Update Donor Profile & Record</span>
                </div>
                <span className="text-xs text-slate-400">ID: {currentDonor.id?.slice(0, 8)}</span>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Email & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="donor@example.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age (18-65)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Blood Group & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* District & Thana */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      const newThanas = BANGLADESH_THANAS[e.target.value] || ['Central'];
                      setThana(newThanas[0]);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thana / Upazila
                  </label>
                  <select
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {thanaOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lifetime Blood Donation Count & Donor Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Blood Donations Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={totalDonations}
                    onChange={(e) => setTotalDonations(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Recorded previous times donated</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Eligibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Eligible">Eligible</option>
                    <option value="Ineligible">Ineligible (Deferred)</option>
                    <option value="Pending">Pending Verification</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={readyForEmergency}
                    onChange={(e) => setReadyForEmergency(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 accent-red-600"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Available for 24/7 Emergency Dispatch
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 accent-red-600"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Active & Available for Donation
                  </span>
                </label>
              </div>

              {/* Action Buttons for Edit */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Saving...' : 'Save Donor Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* Standard Profile View */
            <>
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Donations</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{currentDonor.totalDonations}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Hero Contributor</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Last Donated</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {currentDonor.lastDonationDate || 'First Time'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recorded</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Emergency Dispatch</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {currentDonor.readyForEmergency ? 'Available' : 'Standby'}
                  </p>
                  <p className="text-[10px] text-blue-500 font-semibold mt-0.5">24/7 Standby</p>
                </div>
              </div>

              {/* Contact and Location */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Contact & Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                    <Phone className="w-4 h-4 text-red-500 shrink-0" />
                    <a href={`tel:${currentDonor.phone}`} className="hover:underline font-medium">
                      {currentDonor.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    {currentDonor.email ? (
                      <a href={`mailto:${currentDonor.email}`} className="hover:underline truncate">
                        {currentDonor.email}
                      </a>
                    ) : (
                      <span className="text-slate-400">No email registered</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      {currentDonor.thana ? `${currentDonor.thana}, ` : ''}{currentDonor.district || 'Dhaka'}, Bangladesh
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical & Screening Info */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Screening & Verification
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentDonor.notes || 'Registered in standard volunteer donor registry. Standard donation interval verified.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    ✓ Cleared Donor Registry
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                    ✓ Age Qualified ({currentDonor.age} yrs)
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                    ✓ Weight Qualified ({currentDonor.weightKg ? `${currentDonor.weightKg} kg` : 'Standard'})
                  </span>
                </div>
              </div>

              {/* Informational Medical Notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Informational Notice:</strong> Donor eligibility status and compatibility records are informational only and do not constitute medical advice or a clinical guarantee. Final eligibility and cross-match compatibility must be verified with qualified healthcare professionals or blood transfusion services.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              Print Donor Card
            </button>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-300 border border-red-200/60 dark:border-red-800/40 transition-colors"
                title="Edit Donor Profile and Records"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Donor</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onBookAppointment && (
              <button
                onClick={() => {
                  onClose();
                  onBookAppointment(currentDonor);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors"
              >
                Schedule Donation
              </button>
            )}
            {onRequestBlood && (
              <button
                onClick={() => {
                  onClose();
                  onRequestBlood(currentDonor);
                }}
                className="custom-accent-btn px-4 py-2 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Request This Donor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
