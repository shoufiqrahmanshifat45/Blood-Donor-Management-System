import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Search,
  HeartHandshake,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Hospital,
  ArrowRight,
  Activity,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { BANGLADESH_DISTRICTS } from '../../data/mockData';
import { BloodRequestItem } from '../../types/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Search shortcut state
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [thanaInput, setThanaInput] = useState('');

  // Live urgent blood requests
  const [urgentRequests, setUrgentRequests] = useState<BloodRequestItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: '1,200+',
    livesSaved: '3,800+',
    districtsCovered: '64',
    urgentFulfilled: '98%',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [requestsRes, dashSummary] = await Promise.allSettled([
          api.getBloodRequests({ urgency: 'Urgent', limit: 4 }),
          api.getDashboardSummary(),
        ]);

        if (requestsRes.status === 'fulfilled' && requestsRes.value?.requests) {
          setUrgentRequests(requestsRes.value.requests);
        }

        if (dashSummary.status === 'fulfilled' && dashSummary.value?.stats) {
          const donorStat = dashSummary.value.stats.find((s) => s.id === 'total-donors');
          if (donorStat) {
            setStats((prev) => ({ ...prev, totalDonors: String(donorStat.value) }));
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoadingRequests(false);
      }
    }
    loadData();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBloodGroup) params.append('group', selectedBloodGroup);
    if (selectedDistrict) params.append('district', selectedDistrict);
    if (thanaInput.trim()) params.append('thana', thanaInput.trim());
    navigate(`/find-donors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-red-50/30 to-slate-50 dark:from-[#0b1324] dark:via-[#0c162d] dark:to-[#070d19] border-b border-slate-200/60 dark:border-slate-800">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-red-500/10 via-rose-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Bangladesh Central Voluntary Blood Donation Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Every Drop Counts.{' '}
                <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent">
                  Every Donor
                </span>{' '}
                Is A Hero.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with verified voluntary blood donors in your upazila and district in real-time. Post emergency blood requests or register to donate and save lives across all 64 districts.
              </p>

              {/* Call-to-actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/find-donors"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Find Blood Donors
                </Link>

                <Link
                  to="/register-donor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-700/80 shadow-xs transition-all"
                >
                  <HeartHandshake className="w-4 h-4 text-red-500" />
                  Become a Donor
                </Link>

                <Link
                  to="/blood-requests"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Request Blood
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalDonors}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Donors</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.livesSaved}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Lives Saved</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.districtsCovered}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Districts Covered</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.urgentFulfilled}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Emergency Response</div>
                </div>
              </div>
            </div>

            {/* Right Hero: Quick Search Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/90 dark:border-slate-800 relative">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Instant Donor Search
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Find eligible donors ready near your hospital
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickSearch} className="mt-5 space-y-4">
                  {/* Blood Group Radio Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Required Blood Group
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {BLOOD_GROUPS.map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setSelectedBloodGroup(group)}
                          className={`py-2 text-sm font-bold rounded-xl transition-all ${
                            selectedBloodGroup === group
                              ? 'bg-red-600 text-white shadow-md shadow-red-500/30 scale-102'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District Select */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    >
                      {BANGLADESH_DISTRICTS.map((d: string) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Thana / Upazila (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mirpur, Dhanmondi, Uttara"
                      value={thanaInput}
                      onChange={(e) => setThanaInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Locate Available Donors
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    🔒 Public donor contact privacy enforced. No private medical data exposed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. URGENT BLOOD REQUESTS LIVE SECTION */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              <AlertCircle className="w-4 h-4" /> Live Patient Needs
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Urgent Blood Requests
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Patients requiring immediate transfusion support across hospitals.
            </p>
          </div>

          <Link
            to="/blood-requests"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
          >
            View All Blood Requests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-5"
              />
            ))}
          </div>
        ) : urgentRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-sm shadow-xs">
                      {req.bloodGroup}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                      {req.units} Unit(s)
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {req.patientName}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{req.hospital}</span>
                    </div>
                    {req.requiredDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Needed by: {new Date(req.requiredDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call: {req.contactPhone}
                  </a>
                  <Link
                    to={`/blood-requests`}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              No Critical Blood Shortages at This Moment
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Current hospital requirements are stable. Check the full list of published requests.
            </p>
          </div>
        )}
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 bg-white dark:bg-[#0a1120] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              Simple & Transparent
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How BloodLine Works
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Our 4-step coordination lifecycle ensures safe donation, donor protection, and rapid hospital fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Register as a Donor',
                desc: 'Sign up with your blood group, district, and thana. Keep your profile updated and declare emergency availability.',
                icon: HeartHandshake,
              },
              {
                step: '02',
                title: 'Get Matched',
                desc: 'Hospitals and patients in your upazila discover your availability through smart geolocation search filters.',
                icon: Search,
              },
              {
                step: '03',
                title: 'Donate Safely',
                desc: 'Attend your verified hospital donation appointment under clinical supervision and certified hygiene standards.',
                icon: Droplet,
              },
              {
                step: '04',
                title: 'Verified Record',
                desc: 'Authorized medical staff verify your donation units, automatically enforcing your 90-day rest period for health safety.',
                icon: ShieldCheck,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800"
              >
                <div className="text-3xl font-black text-red-500/20 dark:text-red-500/10 mb-3">
                  {step.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HEALTH TOOLS & QUIZ PREVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Activity className="w-3.5 h-3.5" /> Interactive Health Tools
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Wondering If You Are Eligible To Donate Today?
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">
              Use our quick 60-second Eligibility Assessment tool and Body Mass Index (BMI) calculator to check clinical weight and deferral guidelines.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/tools"
                className="px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm shadow-md hover:bg-red-50 transition-colors"
              >
                Check Eligibility Quiz
              </Link>
              <Link
                to="/tools"
                className="px-5 py-2.5 rounded-xl bg-red-800/60 hover:bg-red-800/90 text-white font-semibold text-sm border border-red-400/40 transition-colors"
              >
                BMI Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOR COMMUNITY */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ready to save a life today?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Join thousands of voluntary blood donors across Bangladesh. It takes only 2 minutes to create a member account.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-500/20 transition-all"
          >
            Create General Member Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In to Existing Account
          </Link>
        </div>
      </section>
    </div>
  );
};
