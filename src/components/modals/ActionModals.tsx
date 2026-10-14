import React, { useState } from 'react';
import { Calculator, UserPlus, Droplet, Calendar, HeartHandshake } from 'lucide-react';
import { Dialog } from '../common/Dialog';
import { FormField, TextInput, SelectInput, Button } from '../common/FormInputs';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { BloodGroup } from '../../types/api';

interface ActionModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ActionModals: React.FC<ActionModalsProps> = ({
  activeModal,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // BMI Calculator State
  const [bmiWeight, setBmiWeight] = useState<string>('');
  const [bmiHeight, setBmiHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<{ score: number; status: string; eligible: boolean } | null>(null);

  // Add Donor State
  const [donorName, setDonorName] = useState('');
  const [donorBlood, setDonorBlood] = useState<BloodGroup>('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorDistrict, setDonorDistrict] = useState('Dhaka');
  const [donorAge, setDonorAge] = useState('25');

  // Blood Request State
  const [patientName, setPatientName] = useState('');
  const [requestBlood, setRequestBlood] = useState<BloodGroup>('A+');
  const [hospitalName, setHospitalName] = useState('');
  const [requestPhone, setRequestPhone] = useState('');
  const [requestUnits, setRequestUnits] = useState('1');

  // Appointment State
  const [appointmentDate, setAppointmentDate] = useState('Tomorrow • 10:00 AM');

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

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

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createDonor({
        name: donorName,
        bloodGroup: donorBlood,
        gender: 'Male',
        age: parseInt(donorAge, 10) || 25,
        phone: donorPhone,
        district: donorDistrict,
        thana: 'Central',
      });
      success('Donor Registered!', `${donorName} (${donorBlood}) added to active donors.`);
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setDonorName('');
      setDonorPhone('');
    } catch (err) {
      error('Registration Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createBloodRequest({
        patientName,
        hospital: hospitalName,
        bloodGroup: requestBlood,
        units: parseInt(requestUnits, 10) || 1,
        urgency: 'Urgent',
        contactPhone: requestPhone || '+880 1711-000000',
      });
      success('Blood Request Broadcasted!', `Request for ${patientName} at ${hospitalName} is live.`);
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setPatientName('');
      setHospitalName('');
    } catch (err) {
      error('Request Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSlot = async (slot: string) => {
    setIsSubmitting(true);
    try {
      await api.bookAppointment({
        donorName: 'Current User',
        donorPhone: '+880 1700-000000',
        bloodGroup: 'O+',
        appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        appointmentTime: slot,
        location: 'Dhaka Central Blood Bank',
      });
      success('Slot Booked!', `Appointment confirmed for ${slot}.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error('Booking Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. BMI & Eligibility Calculator Dialog */}
      <Dialog
        isOpen={activeModal === 'bmi-calculator'}
        onClose={onClose}
        title="BMI & Eligibility Calculator"
        description="Calculate Body Mass Index for blood donation criteria"
        icon={<Calculator className="w-5 h-5 text-blue-600" />}
      >
        <form onSubmit={calculateBmi} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Weight (kg)" required>
              <TextInput
                type="number"
                step="0.1"
                required
                placeholder="e.g. 68"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(e.target.value)}
              />
            </FormField>
            <FormField label="Height (cm)" required>
              <TextInput
                type="number"
                step="0.1"
                required
                placeholder="e.g. 172"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(e.target.value)}
              />
            </FormField>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Calculate BMI
          </Button>

          {bmiResult && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center animate-in fade-in">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Calculated Score
              </span>
              <div className="text-3xl font-extrabold text-[#0f172a] mt-0.5">
                {bmiResult.score}
              </div>
              <div className="text-[13px] font-semibold mt-1 text-slate-700">
                Status: {bmiResult.status}
              </div>
              <div
                className={`text-[11.5px] font-bold mt-2.5 px-3 py-1 rounded-full inline-block ${
                  bmiResult.eligible
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {bmiResult.eligible
                  ? '✓ Eligible for Blood Donation (Weight ≥ 50kg & Healthy BMI)'
                  : '✗ Medical consultation required before blood donation'}
              </div>
            </div>
          )}
        </form>
      </Dialog>

      {/* 2. Add New Donor Dialog */}
      <Dialog
        isOpen={activeModal === 'add-donor'}
        onClose={onClose}
        title="Add New Blood Donor"
        description="Register a willing donor into the system database"
        icon={<UserPlus className="w-5 h-5 text-red-600" />}
      >
        <form onSubmit={handleAddDonor} className="space-y-3.5">
          <FormField label="Full Name" required>
            <TextInput
              type="text"
              required
              placeholder="Enter donor's full name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Blood Group" required>
              <SelectInput
                value={donorBlood}
                onChange={(e) => setDonorBlood(e.target.value as BloodGroup)}
                options={bloodGroupOptions}
              />
            </FormField>
            <FormField label="Age" required>
              <TextInput
                type="number"
                min="18"
                max="65"
                required
                placeholder="e.g. 25"
                value={donorAge}
                onChange={(e) => setDonorAge(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone Number" required>
              <TextInput
                type="tel"
                required
                placeholder="+880 1712-345678"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
              />
            </FormField>
            <FormField label="District" required>
              <TextInput
                type="text"
                required
                placeholder="e.g. Dhaka"
                value={donorDistrict}
                onChange={(e) => setDonorDistrict(e.target.value)}
              />
            </FormField>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full py-2.5"
            >
              Save Donor Record
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 3. Register Blood Request Dialog */}
      <Dialog
        isOpen={activeModal === 'register-request'}
        onClose={onClose}
        title="Register Blood Request"
        description="Post an emergency or scheduled requirement for patients"
        icon={<Droplet className="w-5 h-5 text-blue-600 fill-blue-600" />}
      >
        <form onSubmit={handleRegisterRequest} className="space-y-3.5">
          <FormField label="Patient Name" required>
            <TextInput
              type="text"
              required
              placeholder="Enter patient full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Required Group" required>
              <SelectInput
                value={requestBlood}
                onChange={(e) => setRequestBlood(e.target.value as BloodGroup)}
                options={bloodGroupOptions}
              />
            </FormField>
            <FormField label="Units Needed" required>
              <TextInput
                type="number"
                min="1"
                max="10"
                required
                value={requestUnits}
                onChange={(e) => setRequestUnits(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Hospital / Medical Facility" required>
            <TextInput
              type="text"
              required
              placeholder="e.g. Dhaka Medical College Hospital"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
          </FormField>

          <FormField label="Emergency Contact Phone" required>
            <TextInput
              type="tel"
              required
              placeholder="+880 1711-234567"
              value={requestPhone}
              onChange={(e) => setRequestPhone(e.target.value)}
            />
          </FormField>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full py-2.5"
            >
              Broadcast Blood Request
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 4. Book Donation Appointment Dialog */}
      <Dialog
        isOpen={activeModal === 'book-appointment'}
        onClose={onClose}
        title="Book Donation Slot"
        description="Schedule a convenient donor appointment with the blood bank"
        icon={<Calendar className="w-5 h-5 text-emerald-600" />}
      >
        <p className="text-[13px] text-slate-600 mb-3">
          Select an available time slot for your next blood donation visit:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 mb-2">
          {[
            'Tomorrow • 10:00 AM',
            'Tomorrow • 02:30 PM',
            'Thursday • 11:00 AM',
            'Friday • 04:00 PM',
          ].map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => handleBookSlot(slot)}
              disabled={isSubmitting}
              className={`p-3 border rounded-xl text-center transition-all ${
                appointmentDate === slot
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </Dialog>
    </>
  );
};
