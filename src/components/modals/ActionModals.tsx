import React, { useState } from 'react';
import { X, CheckCircle2, Calculator, UserPlus, Droplet, Calendar } from 'lucide-react';

interface ActionModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export const ActionModals: React.FC<ActionModalsProps> = ({ activeModal, onClose }) => {
  // BMI Calculator State
  const [bmiWeight, setBmiWeight] = useState<string>('');
  const [bmiHeight, setBmiHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<{ score: number; status: string; eligible: boolean } | null>(null);

  // Add Donor State
  const [donorName, setDonorName] = useState('');
  const [donorBlood, setDonorBlood] = useState('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorSuccess, setDonorSuccess] = useState(false);

  // Blood Request State
  const [patientName, setPatientName] = useState('');
  const [requestBlood, setRequestBlood] = useState('A+');
  const [hospitalName, setHospitalName] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  if (!activeModal) return null;

  const calculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100; // cm to m
    if (w > 0 && h > 0) {
      const score = parseFloat((w / (h * h)).toFixed(1));
      let status = 'Normal weight';
      let eligible = true;
      if (score < 18.5) {
        status = 'Underweight';
        eligible = false;
      } else if (score >= 25 && score < 30) {
        status = 'Overweight';
        eligible = true;
      } else if (score >= 30) {
        status = 'Obese';
        eligible = false;
      }
      setBmiResult({ score, status, eligible });
    }
  };

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setDonorSuccess(true);
    setTimeout(() => {
      setDonorSuccess(false);
      onClose();
    }, 1500);
  };

  const handleRegisterRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* BMI Calculator Modal */}
        {activeModal === 'bmi-calculator' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">BMI & Eligibility Calculator</h3>
                <p className="text-xs text-slate-500">Calculate Body Mass Index for blood donation criteria</p>
              </div>
            </div>

            <form onSubmit={calculateBmi} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 68"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 172"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all"
              >
                Calculate BMI
              </button>

              {bmiResult && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-500">Calculated Score</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{bmiResult.score}</div>
                  <div className="text-sm font-semibold mt-1 text-slate-700">Status: {bmiResult.status}</div>
                  <div className={`text-xs font-bold mt-2 px-3 py-1 rounded-full inline-block ${
                    bmiResult.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {bmiResult.eligible ? '✓ Eligible for Blood Donation (Weight ≥ 50kg & Healthy BMI)' : '✗ Consultation required before donation'}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Add Donor Modal */}
        {activeModal === 'add-donor' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add New Blood Donor</h3>
                <p className="text-xs text-slate-500">Register a willing donor into the system</p>
              </div>
            </div>

            {donorSuccess ? (
              <div className="py-8 text-center text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                <h4 className="font-bold text-base text-slate-800">Donor Registered Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">Preview record added to current session.</p>
              </div>
            ) : (
              <form onSubmit={handleAddDonor} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter donor's full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={donorBlood}
                      onChange={(e) => setDonorBlood(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712-345678"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm shadow-sm transition-all"
                  >
                    Save Donor
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Register Blood Request Modal */}
        {activeModal === 'register-request' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplet className="w-5 h-5 fill-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Register Blood Request</h3>
                <p className="text-xs text-slate-500">Post an emergency or scheduled requirement</p>
              </div>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                <h4 className="font-bold text-base text-slate-800">Blood Request Broadcasted!</h4>
                <p className="text-xs text-slate-500 mt-1">Notification sent to nearby matching donors.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterRequest} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Required Group</label>
                    <select
                      value={requestBlood}
                      onChange={(e) => setRequestBlood(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka Medical College"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm shadow-sm transition-all"
                  >
                    Submit Blood Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Book Appointment Modal */}
        {activeModal === 'book-appointment' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Book Donation Slot</h3>
                <p className="text-xs text-slate-500">Schedule donor appointment with the blood bank</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Select an available time slot for your next blood donation appointment.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 mb-4">
              <button onClick={() => onClose()} className="p-3 border border-emerald-300 rounded-xl bg-emerald-50 text-emerald-800 text-center hover:bg-emerald-100">
                Tomorrow • 10:00 AM
              </button>
              <button onClick={() => onClose()} className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 text-center">
                Tomorrow • 02:30 PM
              </button>
              <button onClick={() => onClose()} className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 text-center">
                Thursday • 11:00 AM
              </button>
              <button onClick={() => onClose()} className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 text-center">
                Friday • 04:00 PM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
