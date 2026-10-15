import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, Heart, ShieldCheck, Award, AlertCircle, Droplet, Clock } from 'lucide-react';
import { DetailedDonor } from '../data/mockData';

interface DonorProfileModalProps {
  donor: DetailedDonor | null;
  onClose: () => void;
  onRequestBlood?: (donor: DetailedDonor) => void;
  onBookAppointment?: (donor: DetailedDonor) => void;
}

export const DonorProfileModal: React.FC<DonorProfileModalProps> = ({
  donor,
  onClose,
  onRequestBlood,
  onBookAppointment,
}) => {
  if (!donor) return null;

  const isEligible = donor.status === 'Eligible';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1527] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Blood Group Hero */}
        <div className="relative p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-inner shrink-0">
              <span className="text-2xl font-black tracking-tight leading-none">{donor.bloodGroup}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Group</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{donor.name}</h3>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                  isEligible ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40' : 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
                }`}>
                  {donor.status}
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1 flex items-center gap-2">
                <span>Donor ID: {donor.id?.startsWith('DNR-') ? donor.id : `DNR-${donor.id?.slice(0, 8).toUpperCase()}`}</span>
                <span>•</span>
                <span>{donor.gender}, {donor.age} yrs</span>
                <span>•</span>
                <span>{donor.weightKg ? `${donor.weightKg} kg` : 'Standard'}</span>
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
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Donations</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{donor.totalDonations}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Hero Contributor</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Last Donated</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                {donor.lastDonationDate || 'First Time'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Recorded</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Emergency Dispatch</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {donor.readyForEmergency ? 'Available' : 'Standby'}
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
                <a href={`tel:${donor.phone}`} className="hover:underline font-medium">
                  {donor.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                {donor.email ? (
                  <a href={`mailto:${donor.email}`} className="hover:underline truncate">
                    {donor.email}
                  </a>
                ) : (
                  <span className="text-slate-400">No email registered</span>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 sm:col-span-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {donor.thana ? `${donor.thana}, ` : ''}{donor.district || 'Dhaka'}, Bangladesh
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
              {donor.notes || 'Registered in standard volunteer donor registry. Standard donation interval verified.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                ✓ Non-Smoker / Cleared
              </span>
              <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                ✓ Age Qualified ({donor.age} yrs)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                ✓ Weight Qualified ({donor.weightKg ? `${donor.weightKg} kg` : 'Standard'})
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
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Print Donor Card
          </button>

          <div className="flex items-center gap-2">
            {onBookAppointment && (
              <button
                onClick={() => {
                  onClose();
                  onBookAppointment(donor);
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
                  onRequestBlood(donor);
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
