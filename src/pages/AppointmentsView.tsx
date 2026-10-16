import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  FileText,
  User,
  HeartPulse,
} from 'lucide-react';
import { api } from '../services/api';
import { DetailedAppointment, DetailedDonor } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';

interface AppointmentsViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ onNavigateTab }) => {
  const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Scheduled' | 'Completed' | 'Cancelled'>('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('ALL');

  // Book Appointment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    bloodGroup: 'O+',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '10:30 AM',
    location: 'Dhaka Medical College Hospital',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { success, error: notifyError } = useNotification();

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const hospitalList = [
    'Dhaka Medical College Hospital',
    'Square Hospital, Panthapath',
    'National Heart Foundation, Mirpur',
    'BSMMU (PG Hospital), Shahbagh',
    'Sandhani Central Blood Bank, DMCH',
    'Quantum Foundation Blood Lab, Shantinagar',
    'Chittagong Medical College Hospital',
    'Sylhet MAG Osmani Medical College',
  ];

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '11:45 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const [registeredDonors, setRegisteredDonors] = useState<DetailedDonor[]>([]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments();
      setAppointments(res);
    } catch {
      notifyError('Failed to load appointments', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    api.searchDonors({ limit: 100 }).then((res) => {
      if (res && res.donors) setRegisteredDonors(res.donors);
    }).catch(() => {});
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: 'Scheduled' | 'Completed' | 'Cancelled'
  ) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      success(
        'Status Updated',
        `Appointment has been marked as ${newStatus}.`
      );
    } catch {
      notifyError('Update Failed', 'Could not update appointment status.');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.donorName.trim()) errors.donorName = 'Donor name is required';
    if (!formData.donorPhone.trim()) {
      errors.donorPhone = 'Phone number is required';
    } else if (!/^(\+?880|0)1[3-9]\d{8}$/.test(formData.donorPhone.replace(/[\s-]/g, ''))) {
      errors.donorPhone = 'Valid Bangladeshi phone required (01XXXXXXXXX)';
    }
    if (!formData.appointmentDate) errors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) errors.appointmentTime = 'Time slot is required';
    if (!formData.location) errors.location = 'Donation center is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const newApt = await api.bookAppointment({
        donorName: formData.donorName.trim(),
        donorPhone: formData.donorPhone.trim(),
        bloodGroup: formData.bloodGroup as any,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        location: formData.location,
      });

      setAppointments((prev) => [newApt, ...prev]);
      success(
        'Appointment Scheduled',
        `Donation booking confirmed for ${formData.donorName} (${formData.bloodGroup}) on ${formData.appointmentDate}.`
      );
      setIsModalOpen(false);
      setFormData({
        donorName: '',
        donorPhone: '',
        bloodGroup: 'O+',
        appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        appointmentTime: '10:30 AM',
        location: 'Dhaka Medical College Hospital',
        notes: '',
      });
    } catch {
      notifyError('Scheduling Failed', 'Unable to book appointment at this time.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
    if (bloodGroupFilter !== 'ALL' && apt.bloodGroup !== bloodGroupFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = apt.donorName.toLowerCase().includes(q);
      const matchPhone = apt.donorPhone.includes(q);
      const matchLoc = apt.location.toLowerCase().includes(q);
      const matchGroup = apt.bloodGroup.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchLoc && !matchGroup) return false;
    }
    return true;
  });

  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#ef4444]" />
            Appointments Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Coordinate, schedule, and track voluntary and clinical blood donation sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs md:text-sm font-semibold shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0c1527] p-3.5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Total Bookings</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {appointments.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-3.5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Upcoming Scheduled</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 leading-tight">
              {scheduledCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-3.5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Completed Sessions</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
              {completedCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-3.5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Cancelled / Missed</p>
            <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-tight">
              {cancelledCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-[#0c1527] p-3.5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131d33] rounded-xl self-start overflow-x-auto max-w-full">
            {(['ALL', 'Scheduled', 'Completed', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab
                    ? 'bg-white dark:bg-[#0c1527] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All Bookings' : tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor name, phone, hospital..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        {/* Blood Group Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Group:
          </span>
          {bloodGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setBloodGroupFilter(grp)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                bloodGroupFilter === grp
                  ? 'bg-[#ef4444] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#131d33] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#182542]'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-[#15213b]">
          <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading scheduled appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-[#15213b] space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Appointments Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {search || bloodGroupFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or clear the filters.'
                : 'There are no donation appointments currently registered in the system.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Book First Appointment
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-[#15213b] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-50/80 dark:bg-[#101b33] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                <tr>
                  <th className="py-3 px-4">Donor Information</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Center / Hospital</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-[#101b33]/60 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {apt.donorName}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({apt.id})
                          </span>
                        </p>
                        <a
                          href={`tel:${apt.donorPhone}`}
                          className="text-[11.5px] text-slate-500 dark:text-slate-400 hover:text-[#ef4444] flex items-center gap-1.5 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {apt.donorPhone}
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold text-xs">
                        {apt.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {apt.appointmentDate}
                        </p>
                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {apt.appointmentTime}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-1.5 max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                            {apt.location}
                          </p>
                          {apt.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">
                              {apt.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : apt.status === 'Cancelled'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {apt.status === 'Completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : apt.status === 'Cancelled' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {apt.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Completed')}
                              title="Mark as Completed"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              title="Cancel Appointment"
                              className="p-1.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status !== 'Scheduled' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Scheduled')}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0c1527] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-[#15213b] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-[#ef4444] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Schedule Blood Donation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Book an official donation slot for a donor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAppointment} className="p-5 space-y-4 overflow-y-auto">
              {/* Preset Donor Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Quick Select from Registered Donors (Optional)
                </label>
                <select
                  onChange={(e) => {
                    const found = registeredDonors.find((d) => d.id === e.target.value);
                    if (found) {
                      setFormData({
                        ...formData,
                        donorName: found.name,
                        donorPhone: found.phone,
                        bloodGroup: found.bloodGroup,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">-- Choose registered donor --</option>
                  {registeredDonors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.bloodGroup}) - {d.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Donor Name & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Donor Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.donorName}
                    onChange={(e) =>
                      setFormData({ ...formData, donorName: e.target.value })
                    }
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {formErrors.donorName && (
                    <p className="text-[11px] text-red-500 mt-0.5">{formErrors.donorName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm font-bold text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.donorPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, donorPhone: e.target.value })
                  }
                  placeholder="+880 1711-234567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                {formErrors.donorPhone && (
                  <p className="text-[11px] text-red-500 mt-0.5">{formErrors.donorPhone}</p>
                )}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, appointmentDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  {formErrors.appointmentDate && (
                    <p className="text-[11px] text-red-500 mt-0.5">{formErrors.appointmentDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      setFormData({ ...formData, appointmentTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Center / Hospital */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Donation Center / Hospital *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {hospitalList.map((hosp) => (
                    <option key={hosp} value={hosp}>
                      {hosp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Notes / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="e.g. voluntary donation, first-time donor screening..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 text-white text-xs md:text-sm font-semibold rounded-xl shadow-md shadow-red-500/20 transition-all"
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
