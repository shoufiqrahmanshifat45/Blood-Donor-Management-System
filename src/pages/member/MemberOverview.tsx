import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Calendar,
  AlertCircle,
  Clock,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DonationItem, BloodRequestItem, AppointmentItem } from '../../types/api';
import { RealTimeClock } from '../../components/common/RealTimeClock';

export const MemberOverview: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [urgentRequests, setUrgentRequests] = useState<BloodRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [donationsRes, appointmentsRes, requestsRes] = await Promise.allSettled([
          api.getDonations(),
          api.getAppointments(),
          api.getBloodRequests({ urgency: 'Urgent', limit: 3 }),
        ]);

        if (donationsRes.status === 'fulfilled') setDonations(donationsRes.value || []);
        if (appointmentsRes.status === 'fulfilled') {
          const val: any = appointmentsRes.value;
          setAppointments(Array.isArray(val) ? val : val?.appointments || []);
        }
        if (requestsRes.status === 'fulfilled') setUrgentRequests(requestsRes.value?.requests || []);
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalDonations = user?.donorProfile?.totalDonations || donations.length;
  const isAvailable = user?.donorProfile?.isAvailable !== false;
  const nextEligible = user?.donorProfile?.nextEligibleDate
    ? new Date(user.donorProfile.nextEligibleDate).toLocaleDateString()
    : 'Eligible Today';

  return (
    <div className="space-y-6">
      {/* Top Header Row matching Admin Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Member Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time donor profile, blood requisitions, and donation history
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <RealTimeClock />
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <UserCheck className="w-3.5 h-3.5" />
            General Member & Donor Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Member'}!
          </h1>
          <p className="text-red-100 text-xs sm:text-sm leading-relaxed">
            Thank you for being part of Bangladesh's voluntary blood donor network. Your readiness directly protects lives during medical emergencies.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/member/appointments"
              className="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs shadow-sm hover:bg-red-50 transition-colors"
            >
              Book Donation Appointment
            </Link>
            <Link
              to="/member/requests"
              className="px-4 py-2 rounded-xl bg-red-800/60 hover:bg-red-800 text-white font-semibold text-xs border border-red-400/40 transition-colors"
            >
              Submit Blood Request
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Member Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donations */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Donations</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalDonations} <span className="text-xs font-normal text-slate-400">times</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> ~{totalDonations * 3} lives touched
          </p>
        </div>

        {/* Eligibility Status */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Eligibility Status</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {user?.donorProfile ? (isAvailable ? 'Eligible to Donate' : 'Cooldown Active') : 'Complete Profile'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Next Eligible: <span className="font-semibold text-slate-700 dark:text-slate-200">{nextEligible}</span>
          </p>
        </div>

        {/* Scheduled Appointments */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">My Appointments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {appointments.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            <Link to="/member/appointments" className="text-blue-600 dark:text-blue-400 hover:underline">
              View upcoming schedule &rarr;
            </Link>
          </p>
        </div>

        {/* Blood Group & Location */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Blood Group & Area</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-red-600 dark:text-red-400">
            {user?.donorProfile?.bloodGroup || 'Not Specified'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {user?.donorProfile?.thana ? `${user.donorProfile.thana}, ${user.donorProfile.district}` : 'Update in My Profile'}
          </p>
        </div>
      </div>

      {/* Row 2: Urgent Requests Live & My Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Community Needs */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Urgent Community Blood Requests
              </h3>
            </div>
            <Link
              to="/member/requests"
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          {urgentRequests.length > 0 ? (
            <div className="space-y-3">
              {urgentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.patientName} ({req.units} Units Needed)
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{req.hospital}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${req.contactPhone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold hover:bg-red-100 transition-colors shrink-0"
                  >
                    Respond
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No critical hospital requests published right now.
            </div>
          )}
        </div>

        {/* Member Shortcuts */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Member Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/member/donors"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-red-500" /> Search Donors by District
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/member/donation-history"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-emerald-500" /> View My Verified Donations
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/member/profile"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-500" /> Update Donor Profile & Readiness
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
