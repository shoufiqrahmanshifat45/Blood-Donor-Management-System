import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AppointmentItem } from '../../types/api';

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

export const MemberAppointments: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Appointment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState('Dhaka Medical College Hospital');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAppointments();
      setAppointments(Array.isArray(res) ? res : res.appointments || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await api.createAppointment({
        donorName: user.name,
        donorPhone: user.phone || '01700000000',
        bloodGroup: (user.donorProfile?.bloodGroup as any) || 'O+',
        appointmentDate,
        appointmentTime,
        location,
        notes: notes.trim() || undefined,
      });

      success('Appointment Scheduled', `Your donation appointment at ${location} is confirmed.`);
      setIsModalOpen(false);
      setNotes('');
      loadAppointments();
    } catch (err: any) {
      error('Booking Failed', err.message || 'Unable to schedule appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.updateAppointmentStatus(id, 'Cancelled');
      success('Cancelled', 'Your appointment has been cancelled.');
      loadAppointments();
    } catch (err: any) {
      error('Error', err.message || 'Unable to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule and manage your voluntary blood donation appointments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-xs shadow-md shadow-red-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule New Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Scheduled Donation Sessions
          </h3>
          <span className="text-xs text-slate-400">
            {appointments.length} Total Registered Sessions
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-900/40">
                    <CalendarIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {item.location}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.status === 'Cancelled'
                            ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.appointmentDate).toLocaleDateString()} at {item.appointmentTime}
                      </span>
                      <span>Blood Group: <strong className="text-red-600 dark:text-red-400">{item.bloodGroup}</strong></span>
                    </div>

                    {item.notes && (
                      <p className="mt-1.5 text-xs text-slate-500 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {item.status === 'Scheduled' && (
                  <button
                    onClick={() => handleCancel(item.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold self-start sm:self-auto transition-colors"
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              No Appointments Scheduled
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Ready to donate? Pick a clinic location and convenient time slot to schedule your session.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/20 hover:bg-red-700 transition-colors"
              >
                Schedule Appointment Now &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-red-600" /> Book Donation Session
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Hospital / Clinic Location *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                >
                  <option value="Dhaka Medical College Hospital">Dhaka Medical College Hospital</option>
                  <option value="Bangabandhu Sheikh Mujib Medical University (BSMMU)">BSMMU Hospital</option>
                  <option value="National Institute of Cardiovascular Diseases">NICVD Blood Bank</option>
                  <option value="Bangladesh Red Crescent Blood Center">Bangladesh Red Crescent Blood Center</option>
                  <option value="Chittagong Medical College Hospital">Chittagong Medical College Hospital</option>
                  <option value="Sylhet MAG Osmani Medical College">Sylhet MAG Osmani Medical College</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Special Notes / Queries
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. First time donor, morning preferred."
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
                  {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
