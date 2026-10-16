import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Calendar,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { DonationItem } from '../../types/api';
import { useAuth } from '../../context/AuthContext';

export const MemberDonationHistory: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyDonations() {
      try {
        const data = await api.getDonations();
        setDonations(data);
      } catch {
        // Handled
      } finally {
        setLoading(false);
      }
    }
    fetchMyDonations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Donation History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official verified clinical donation records associated with your donor profile.
          </p>
        </div>

        <Link
          to="/member/appointments"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-500/20 transition-all self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          Schedule Next Donation
        </Link>
      </div>

      {/* Summary Box */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-lg">
            <Droplet className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Lifetime Verified Contributions
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Registered blood donor: <span className="font-semibold text-red-600 dark:text-red-400">{user?.donorProfile?.bloodGroup || 'BDMS Donor'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {donations.length || user?.donorProfile?.totalDonations || 0}
            </div>
            <div className="text-[11px] text-slate-400">Total Donations</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {((donations.length || user?.donorProfile?.totalDonations || 0) * 3)}
            </div>
            <div className="text-[11px] text-slate-400">Estimated Lives Saved</div>
          </div>
        </div>
      </div>

      {/* Donation Records List */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Verified Clinical Records
          </h3>
          <span className="text-xs text-slate-400">
            🔒 Privacy enforced: Scoped strictly to your account
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : donations.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {donations.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {item.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.units || 1} Unit(s) Donated
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Verified Record
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.donationDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      {item.verifiedBy && (
                        <span className="text-[11px] text-slate-400">
                          Verified by: {item.verifiedBy.name} ({item.verifiedBy.role})
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-slate-400">
                    ID: {item.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              No Verified Donations Recorded Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              When you donate at an authorized hospital or clinic, medical staff verify the units directly into your profile here.
            </p>
            <div className="pt-2">
              <Link
                to="/member/appointments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/20 hover:bg-red-700 transition-colors"
              >
                Book Your First Donation Appointment &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
