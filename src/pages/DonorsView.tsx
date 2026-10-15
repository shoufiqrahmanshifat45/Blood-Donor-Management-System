import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { DetailedDonor } from '../data/mockData';
import { DonorProfileModal } from './DonorProfileModal';
import { DonorRegistrationModal } from './DonorRegistrationModal';

interface DonorsViewProps {
  onBookAppointment?: (donor: DetailedDonor) => void;
  onRequestBlood?: (donor: DetailedDonor) => void;
  initialSearchQuery?: string;
}

export const DonorsView: React.FC<DonorsViewProps> = ({
  onBookAppointment,
  onRequestBlood,
  initialSearchQuery = '',
}) => {
  const [donors, setDonors] = useState<DetailedDonor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'donations' | 'name' | 'age'>('donations');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [selectedDonor, setSelectedDonor] = useState<DetailedDonor | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const loadDonors = async () => {
    setLoading(true);
    try {
      const res = await api.searchDonors({});
      setDonors(res.donors);
    } catch {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filter & Sort Logic
  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.district.toLowerCase().includes(search.toLowerCase()) ||
      d.thana.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(search.toLowerCase());

    const matchesBg = selectedBloodGroup === 'ALL' || d.bloodGroup === selectedBloodGroup;
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    const matchesDistrict = selectedDistrict === 'ALL' || d.district === selectedDistrict;

    return matchesSearch && matchesBg && matchesStatus && matchesDistrict;
  });

  const sortedDonors = [...filteredDonors].sort((a, b) => {
    if (sortBy === 'donations') return b.totalDonations - a.totalDonations;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'age') return a.age - b.age;
    return 0;
  });

  // Pagination Slice
  const totalPages = Math.ceil(sortedDonors.length / pageSize) || 1;
  const paginatedDonors = sortedDonors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearch('');
    setSelectedBloodGroup('ALL');
    setSelectedStatus('ALL');
    setSelectedDistrict('ALL');
    setSortBy('donations');
    setCurrentPage(1);
  };

  // Metrics summary
  const totalEligible = donors.filter((d) => d.status === 'Eligible').length;
  const totalEmergency = donors.filter((d) => d.readyForEmergency).length;

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Donor Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified blood donors database supporting all 8 blood groups across Bangladesh
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="custom-accent-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#ef4444] text-white shadow-md shadow-red-500/25 hover:bg-red-600 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4 stroke-[2.2]" />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Registered</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{donors.length}</p>
          <span className="text-[10px] text-blue-500 font-semibold">Active in System</span>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Eligible Now</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{totalEligible}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready to Donate</span>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">24/7 Emergency SOS</p>
          <p className="text-xl font-bold text-red-500 mt-0.5">{totalEmergency}</p>
          <span className="text-[10px] text-red-500 font-semibold">Rapid Response</span>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Universal Donors (O-)</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
            {donors.filter((d) => d.bloodGroup === 'O-').length}
          </p>
          <span className="text-[10px] text-purple-500 font-semibold">Golden Rarity</span>
        </div>
      </div>

      {/* Main Filter & Control Panel */}
      <div className="p-4 bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3.5 shadow-2xs">
        {/* Search Bar + Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 search-bar-container">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none search-bar-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search donor name, phone, district, thana..."
              className="search-bar-input w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="Eligible">Eligible Only</option>
              <option value="Ineligible">Ineligible</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
            >
              <option value="donations">Sort by Donations</option>
              <option value="name">Sort by Name (A-Z)</option>
              <option value="age">Sort by Age</option>
            </select>

            {/* Clear Button */}
            {(search || selectedBloodGroup !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 8 Blood Group Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            Group:
          </span>
          {bloodGroups.map((bg) => {
            const isSelected = selectedBloodGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => {
                  setSelectedBloodGroup(bg);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'sidebar-active-tab bg-[#ef4444] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white dark:bg-[#0c1527] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading donor database...</div>
        ) : paginatedDonors.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No matching donors found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any donors matching your filter criteria. Try searching a different blood group or area.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Donor Name & Info</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Donations</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {paginatedDonors.map((d) => {
                  const isEligible = d.status === 'Eligible';
                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedDonor(d)}
                    >
                      {/* Blood Group Badge */}
                      <td className="py-3 px-4">
                        <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-black flex items-center justify-center text-sm shadow-2xs border border-red-200/50 dark:border-red-900/50">
                          {d.bloodGroup}
                        </div>
                      </td>

                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">
                          {d.name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">
                          {d.id} • {d.gender}, {d.age} yrs
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {d.thana}, {d.district}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="font-medium">{d.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{d.email}</div>
                      </td>

                      {/* Donations count */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg text-xs">
                          {d.totalDonations}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                            isEligible
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {d.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDonor(d)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`tel:${d.phone}`}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title={`Call ${d.name}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {sortedDonors.length > pageSize && (
          <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-800 dark:text-white">
                {Math.min(currentPage * pageSize, sortedDonors.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-800 dark:text-white">{sortedDonors.length}</span> donors
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedDonor && (
        <DonorProfileModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
          onBookAppointment={onBookAppointment}
          onRequestBlood={onRequestBlood}
        />
      )}

      {/* Registration Modal */}
      <DonorRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={loadDonors}
      />
    </div>
  );
};
