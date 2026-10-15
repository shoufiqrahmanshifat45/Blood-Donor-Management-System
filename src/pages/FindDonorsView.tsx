import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Droplet,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS, BLOOD_COMPATIBILITY, DetailedDonor } from '../data/mockData';
import { api } from '../services/api';
import { DonorProfileModal } from './DonorProfileModal';
import { useNotification } from '../context/NotificationContext';

interface FindDonorsViewProps {
  initialBloodGroup?: string;
  onBookAppointment?: (donor: DetailedDonor) => void;
  onRequestBlood?: (donor: DetailedDonor) => void;
}

export const FindDonorsView: React.FC<FindDonorsViewProps> = ({
  initialBloodGroup = 'O+',
  onBookAppointment,
  onRequestBlood,
}) => {
  const { info, success } = useNotification();
  const [selectedGroup, setSelectedGroup] = useState<string>(initialBloodGroup || 'O+');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [selectedThana, setSelectedThana] = useState<string>('');
  const [onlyEmergency, setOnlyEmergency] = useState(false);

  const [donors, setDonors] = useState<DetailedDonor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DetailedDonor | null>(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const thanas = BANGLADESH_THANAS[selectedDistrict] || ['Central', 'North', 'South', 'East', 'West'];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.searchDonors({
        bloodGroup: selectedGroup,
        district: selectedDistrict,
        thana: selectedThana,
      });

      let results = res.donors;
      if (onlyEmergency) {
        results = results.filter((d) => d.readyForEmergency);
      }
      setDonors(results);
    } catch {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const compat = BLOOD_COMPATIBILITY[selectedGroup] || {
    canDonateTo: [],
    canReceiveFrom: [],
    desc: '',
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Find Blood Donors
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Locate compatible blood donors in your district with instant contact and emergency dispatch
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="p-5 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Blood Group Select Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Patient’s Blood Group (Required):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bloodGroups.map((bg) => {
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedGroup(bg)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'sidebar-active-tab bg-[#ef4444] text-white border-transparent shadow-md shadow-red-500/25 scale-102'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-red-400'
                    }`}
                  >
                    <span className="text-sm font-black">{bg}</span>
                    <span className="text-[9px] opacity-80 mt-0.5">
                      {bg === 'O-' ? 'Universal' : bg === 'AB+' ? 'Recipient' : 'Rh+ / Rh-'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* District & Thana */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                District:
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedThana('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500 font-medium"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thana / Area (Optional):
              </label>
              <select
                value={selectedThana}
                onChange={(e) => setSelectedThana(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="">All Thanas in {selectedDistrict}</option>
                {thanas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="custom-accent-btn w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
                <span>Search Matching Donors</span>
              </button>
            </div>
          </div>

          {/* Emergency SOS Toggle */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyEmergency}
                onChange={(e) => setOnlyEmergency(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Only show 24/7 Rapid Emergency Response Donors
              </span>
            </label>

            <span className="text-[11px] text-slate-400">
              Compatible blood types automatically matched
            </span>
          </div>
        </form>
      </div>

      {/* Blood Group Compatibility Guide Card */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-red-50/30 dark:from-slate-900/40 dark:to-red-950/20 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {selectedGroup} Compatibility Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{compat.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Can Receive From:</p>
            <div className="flex gap-1 mt-1">
              {compat.canReceiveFrom.map((bg) => (
                <span
                  key={bg}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]"
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Can Give To:</p>
            <div className="flex gap-1 mt-1">
              {compat.canDonateTo.map((bg) => (
                <span
                  key={bg}
                  className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px]"
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Matching Donors in {selectedDistrict} ({donors.length})
          </h3>
          {donors.length > 0 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified & Screened
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800">
            Searching compatible donors in {selectedDistrict}...
          </div>
        ) : donors.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Droplet className="w-6 h-6 text-red-400" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {hasSearched ? 'No donors found in this area' : 'Click "Search Matching Donors" to view donors'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You can expand your search to neighboring thanas or broadcast an urgent SOS blood request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {donors.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-black flex items-center justify-center text-base shadow-2xs border border-red-200/50 dark:border-red-900/50">
                      {d.bloodGroup}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {d.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {d.gender}, {d.age} yrs • {d.totalDonations} donations
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Eligible
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {d.thana}, {d.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <a href={`tel:${d.phone}`} className="hover:underline font-semibold text-slate-800 dark:text-slate-200">
                      {d.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDonor(d)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    View Profile
                  </button>
                  <a
                    href={`tel:${d.phone}`}
                    className="custom-accent-btn px-3 py-2 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-xs hover:bg-red-600 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDonor && (
        <DonorProfileModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
          onBookAppointment={onBookAppointment}
          onRequestBlood={onRequestBlood}
        />
      )}
    </div>
  );
};
