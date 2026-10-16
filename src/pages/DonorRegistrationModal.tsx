import React, { useState } from 'react';
import { X, UserPlus, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DonorRegistrationModal: React.FC<DonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
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

  if (!isOpen) return null;

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
      newErrors.phone = 'Enter a valid Bangladeshi phone number (e.g. +880 1711-234567 or 01711234567)';
    }
    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Enter a valid email address';
    }
    const weightNum = parseFloat(weightKg);
    if (!weightKg || isNaN(weightNum) || weightNum < 45) {
      newErrors.weightKg = 'Minimum donor weight is 45 kg (99 lbs)';
    }
    const donationsNum = parseInt(totalDonations, 10);
    if (isNaN(donationsNum) || donationsNum < 0) {
      newErrors.totalDonations = 'Please enter a valid donation count (0 or higher)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const weightNum = parseFloat(weightKg);
      const donationsNum = parseInt(totalDonations, 10);
      await api.createDonor({
        name: name.trim(),
        bloodGroup,
        gender,
        age: parseInt(age, 10),
        phone: phone.trim(),
        email: email.trim() || undefined,
        district,
        thana,
        totalDonations: !isNaN(donationsNum) ? donationsNum : 0,
        weightKg: !isNaN(weightNum) ? weightNum : 65,
        readyForEmergency,
        lastDonationDate: lastDonationDate || undefined,
      });

      success(
        'Donor Registered Successfully!',
        `${name.trim()} (${bloodGroup}) has been added to the active donor registry.`
      );
      if (onSuccess) onSuccess();
      onClose();

      // Reset
      setName('');
      setPhone('');
      setEmail('');
      setTotalDonations('0');
      setLastDonationDate('');
      setErrors({});
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors: Record<string, string> = {};
        err.details.forEach((d: any) => {
          if (d.field) fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      }
      error('Registration Failed', err.message || 'Unable to register donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1527] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-[#ef4444] flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Register as Blood Donor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Join our life-saving volunteer network across Bangladesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shoufiq Rahman"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border ${
                errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700/80 focus:border-red-500 focus:ring-red-500/20'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Blood Group & Gender */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-semibold"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal Donor)' : bg === 'AB+' ? '(Universal Recipient)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Age & Weight */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age (18-65) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border ${
                  errors.age ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                } text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all`}
              />
              {errors.age && <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg, min 45) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="45"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border ${
                  errors.weightKg ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                } text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all`}
              />
              {errors.weightKg && <p className="text-[11px] text-red-500 mt-1">{errors.weightKg}</p>}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1711-234567"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border ${
                  errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                } text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all`}
              />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
          </div>

          {/* District & Thana */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const newThanas = BANGLADESH_THANAS[e.target.value] || ['Central'];
                  setThana(newThanas[0]);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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
                Thana / Area <span className="text-red-500">*</span>
              </label>
              <select
                value={thana}
                onChange={(e) => setThana(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              >
                {thanaOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blood Donation Count & Last Donation Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Previous Blood Donation Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={totalDonations}
                onChange={(e) => setTotalDonations(e.target.value)}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border ${
                  errors.totalDonations ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                } text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-semibold`}
              />
              <p className="text-[10.5px] text-slate-400 mt-1">Times donated previously (0 if first-time donor)</p>
              {errors.totalDonations && <p className="text-[11px] text-red-500 mt-1">{errors.totalDonations}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Blood Donation Date
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <p className="text-[10.5px] text-slate-400 mt-1">Leave empty if first-time donor</p>
            </div>
          </div>

          {/* Ready for emergency checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={readyForEmergency}
                onChange={(e) => setReadyForEmergency(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                I am ready to receive 24/7 urgent emergency blood request alerts
              </span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="custom-accent-btn px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register as Donor'}
          </button>
        </div>
      </div>
    </div>
  );
};
