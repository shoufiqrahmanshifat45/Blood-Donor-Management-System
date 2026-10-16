import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Plus,
  Phone,
  Building2,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Radio,
  Flame,
  Check,
  X,
  Droplet,
} from 'lucide-react';
import { api } from '../services/api';
import { BloodRequestItem, BloodGroup, RequestUrgency } from '../types/api';
import { useNotification } from '../context/NotificationContext';
import { RealTimeClock } from '../components/common/RealTimeClock';

interface BloodRequestsViewProps {
  onFindDonor?: (bloodGroup: string) => void;
}

export const BloodRequestsView: React.FC<BloodRequestsViewProps> = ({ onFindDonor }) => {
  const { success, error, info } = useNotification();
  const [requests, setRequests] = useState<BloodRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'fulfilled'>('all');
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  // New Request Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [hospital, setHospital] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState<RequestUrgency>('Urgent');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRecentRequests();
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospital.trim() || !contactPhone.trim()) {
      error('Incomplete Request', 'Please fill in patient name, hospital, and contact phone.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBloodRequest({
        patientName: patientName.trim(),
        hospital: hospital.trim(),
        bloodGroup,
        units: parseInt(units, 10) || 1,
        urgency,
        contactPhone: contactPhone.trim(),
        notes: notes.trim() || undefined,
      });

      success(
        'Blood Request Broadcasted!',
        `Request for ${units} unit(s) of ${bloodGroup} at ${hospital} has been dispatched.`
      );
      setIsModalOpen(false);
      setPatientName('');
      setHospital('');
      setContactPhone('');
      setNotes('');
      loadRequests();
    } catch (err) {
      error('Failed to create request', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Fulfilled' | 'Cancelled') => {
    try {
      await api.updateBloodRequestStatus(id, newStatus);
      success('Status Updated', `Request marked as ${newStatus}.`);
      loadRequests();
    } catch (err) {
      error('Update Failed', (err as Error).message);
    }
  };

  // Filtered requests
  const filtered = requests.filter((r) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'urgent'
        ? r.urgency === 'Urgent'
        : r.urgency === 'Fulfilled';

    const matchesSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital.toLowerCase().includes(search.toLowerCase()) ||
      r.contactPhone.includes(search);

    const matchesBg = selectedGroup === 'ALL' || r.bloodGroup === selectedGroup;

    return matchesTab && matchesSearch && matchesBg;
  });

  const urgentCount = requests.filter((r) => r.urgency === 'Urgent').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Blood Requests</span>
            {urgentCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse">
                {urgentCount} Urgent SOS
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time patient blood requests, hospital emergency dispatch, and fulfillment tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <RealTimeClock variant="compact" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="custom-accent-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Post Blood Request</span>
          </button>
        </div>
      </div>

      {/* Emergency Notice Banner */}
      <div className="p-4 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30 animate-bounce">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Emergency Blood Dispatch Active (24/7)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Urgent requests are automatically pushed to matching donors in the hospital’s district.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setActiveTab('urgent');
            setSelectedGroup('ALL');
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0 shadow-xs"
        >
          View {urgentCount} Urgent Cases
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="p-4 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#0c1527] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'urgent'
                  ? 'sidebar-active-tab bg-[#ef4444] text-white shadow-2xs'
                  : 'text-red-500 hover:text-red-600'
              }`}
            >
              <span>Urgent SOS</span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            </button>
            <button
              onClick={() => setActiveTab('fulfilled')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fulfilled'
                  ? 'bg-white dark:bg-[#0c1527] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fulfilled Archive
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-64 search-bar-container">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none search-bar-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, hospital..."
              className="search-bar-input w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* 8 Blood Groups Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Group:
          </span>
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedGroup === bg
                  ? 'sidebar-active-tab bg-[#ef4444] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800">
          Loading blood requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No requests found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'urgent'
              ? 'Great news! All emergency blood requests are currently matched and fulfilled.'
              : 'No requests match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((r) => {
            const isUrgent = r.urgency === 'Urgent';
            const isFulfilled = r.urgency === 'Fulfilled';

            return (
              <div
                key={r.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isUrgent
                    ? 'bg-red-50/20 dark:bg-red-950/20 border-red-200/80 dark:border-red-900/60 shadow-md shadow-red-500/5'
                    : 'bg-white dark:bg-[#0c1527] border-slate-100 dark:border-slate-800 shadow-2xs'
                }`}
              >
                {/* Card Top: Blood Group Badge + Urgency Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl font-black flex items-center justify-center text-base shadow-2xs border ${
                        ['A+', 'B+', 'O+', 'AB+'].includes(r.bloodGroup)
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                      }`}
                    >
                      {r.bloodGroup}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {r.patientName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {r.units} Unit{r.units > 1 ? 's' : ''} Needed • {r.timeAgo || 'Recent'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      isUrgent
                        ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
                        : isFulfilled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}
                  >
                    {r.urgency}
                  </span>
                </div>

                {/* Hospital and Contact */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{r.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <a href={`tel:${r.contactPhone}`} className="hover:underline font-semibold">
                      {r.contactPhone}
                    </a>
                  </div>
                  {r.notes && (
                    <p className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl mt-1">
                      "{r.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  {!isFulfilled ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(r.id, 'Fulfilled')}
                        className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Fulfill</span>
                      </button>
                      {onFindDonor && (
                        <button
                          onClick={() => onFindDonor(r.bloodGroup)}
                          className="custom-accent-btn py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#ef4444] text-white hover:bg-red-600 transition-colors shadow-2xs"
                        >
                          Find {r.bloodGroup}
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 w-full justify-center py-1">
                      <CheckCircle className="w-4 h-4" /> Fulfilled & Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Blood Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1527] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#ef4444] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Post Blood Request</h3>
                  <p className="text-xs text-slate-400">Broadcast patient requirement to registered donors</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Salma Begum"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
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
                    Units (Bags)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Name & City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Dhaka Medical College Hospital, Ward 4"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+880 1711-234567"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Urgent">🚨 Urgent (Immediate)</option>
                    <option value="Pending">⏳ Pending (Within 24h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Notes / Medical Condition
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Emergency surgery scheduled at 2:00 PM, ICU Bed 12"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="custom-accent-btn px-5 py-2 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Dispatch Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
