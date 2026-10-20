import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HeartHandshake,
  Droplet,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Weight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../../data/mockData';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const PublicRegisterDonor: React.FC = () => {
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<typeof BLOOD_GROUPS[number]>('O+');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState<string>('24');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Dhanmondi');
  const [totalDonations, setTotalDonations] = useState<string>('0');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [weightKg, setWeightKg] = useState<string>('65');
  const [readyForEmergency, setReadyForEmergency] = useState(true);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const thanaOptions = BANGLADESH_THANAS[district] || ['Central', 'North', 'South', 'East', 'West'];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Eligible donor age must be between 18 and 65 years';
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+?880|0)1[3-9]\d{8}$/.test(cleanPhone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Enter a valid Bangladeshi phone number (e.g. 01711234567)';
    }
    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Enter a valid email address';
    }
    const weightNum = parseFloat(weightKg);
    if (!weightKg || isNaN(weightNum) || weightNum < 45) {
      newErrors.weight = 'Donors must weigh at least 45 kg for safe donation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createDonor({
        name: name.trim(),
        bloodGroup,
        gender,
        age: parseInt(age, 10),
        phone: phone.trim(),
        email: email.trim() || undefined,
        district,
        thana,
        totalDonations: Math.max(0, parseInt(totalDonations, 10) || 0),
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate).toISOString() : undefined,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        readyForEmergency,
      });

      success('Donor Registration Complete!', `Thank you ${name}! Your donor profile is now active.`);
      setIsCompleted(true);
    } catch (err: any) {
      error('Registration Failed', err.message || 'Unable to register donor at this time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome to the RedPulse Voluntary Donor Network!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
          Your voluntary donor registration has been recorded in the central database. When patients or hospitals in {thana}, {district} search for {bloodGroup} blood, your readiness helps save lives.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/find-donors"
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Search Donor Directory
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Create Login Account to Manage Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HeartHandshake className="w-3.5 h-3.5" /> Voluntary Blood Donation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Register As A Blood Donor
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Your voluntary donation can save up to three lives in emergency surgical and trauma care.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-red-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shoufiq Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.name
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setBloodGroup(g)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        bloodGroup === g
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Age (18-65) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.age
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Location */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Phone className="w-4 h-4 text-red-500" /> Contact & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  placeholder="01711234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.phone
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="donor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const newThanas = BANGLADESH_THANAS[e.target.value] || ['Central'];
                    setThana(newThanas[0]);
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
                  Thana / Upazila *
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
            </div>
          </div>

          {/* Section 3: Health & Donation Details */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Droplet className="w-4 h-4 text-red-500" /> Donation Background & Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Previous Donation Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={totalDonations}
                  onChange={(e) => setTotalDonations(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Weight in Kg (Min 45 kg) *
                </label>
                <input
                  type="number"
                  min="45"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.weight
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                />
                {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Last Donation Date
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Emergency Toggle */}
            <div className="mt-5 p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Available for Emergency Transfusions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Allow urgent blood request broadcasts to notify you in critical hospital situations.
                </p>
              </div>
              <input
                type="checkbox"
                checked={readyForEmergency}
                onChange={(e) => setReadyForEmergency(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-center transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              {isSubmitting ? 'Registering...' : 'Complete Donor Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
