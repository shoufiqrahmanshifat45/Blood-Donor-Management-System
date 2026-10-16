import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Plus,
  Phone,
  Hospital,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Droplet,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { BloodRequestItem, BloodGroup, RequestUrgency } from '../../types/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const MemberRequests: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [activeTab, setActiveTab] = useState<'all' | 'my-requests'>('all');
  const [requests, setRequests] = useState<BloodRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  // Submit Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState<RequestUrgency>('Urgent');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const query: any = {};
      if (selectedGroup !== 'ALL') query.bloodGroup = selectedGroup;
      if (activeTab === 'my-requests' && user?.id) {
        query.requesterId = user.id;
      }

      const res = await api.getBloodRequests(query);
      setRequests(res.requests || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [activeTab, selectedGroup]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim() || !contactPhone.trim()) {
      error('Validation Error', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBloodRequest({
        patientName: patientName.trim(),
        hospital: hospitalName.trim(),
        bloodGroup,
        units: parseInt(units, 10) || 1,
        urgency,
        contactPhone: contactPhone.trim(),
        notes: notes.trim() || undefined,
      });

      success('Blood Request Broadcasted', 'Your emergency blood request is now published.');
      setIsModalOpen(false);
      setPatientName('');
      setHospitalName('');
      setNotes('');
      loadRequests();
    } catch (err: any) {
      error('Submission Failed', err.message || 'Unable to broadcast blood request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Blood Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse published emergency patient requests or broadcast your own request.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-xs shadow-md shadow-red-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Submit Blood Request
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All Published Requests
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'my-requests'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            My Submitted Requests
          </button>
        </div>

        {/* Blood Group Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Filter Group:
          </span>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))
        ) : requests.length > 0 ? (
          requests.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-red-200 dark:hover:border-red-900/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-sm shadow-xs">
                    {item.bloodGroup}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.urgency === 'Urgent'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
                        : item.urgency === 'Fulfilled'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.urgency} ({item.units} Units)
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.patientName}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Hospital className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{item.hospital}</span>
                  </div>
                  {item.requiredDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>Required by: {new Date(item.requiredDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {item.notes && (
                    <p className="mt-1 text-[11px] text-slate-400 italic line-clamp-2">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${item.contactPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" /> Call: {item.contactPhone}
                </a>
                <span className="text-[11px] text-slate-400">
                  {(item.fulfilledUnits ?? 0) > 0 ? `${item.fulfilledUnits}/${item.units} Donated` : 'Needs Donors'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {activeTab === 'my-requests' ? 'You Have Not Submitted Any Blood Requests' : 'No Matching Blood Requests Found'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {activeTab === 'my-requests'
                ? 'If you or someone in your family needs emergency blood transfusion, click "Submit Blood Request" to broadcast.'
                : 'Current request requirements are fulfilled for this filter.'}
            </p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" /> Broadcast Blood Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Hospital & Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
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
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as RequestUrgency)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <option value="Urgent">Urgent (Within hours)</option>
                    <option value="Pending">Pending (Next 24-48h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01711234567"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Surgery scheduled tomorrow morning, attendants ready."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20"
                >
                  {isSubmitting ? 'Broadcasting...' : 'Publish Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
