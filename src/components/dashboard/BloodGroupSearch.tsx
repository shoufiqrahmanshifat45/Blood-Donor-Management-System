import React, { useState } from 'react';
import { Droplet, MapPin, Landmark, Search } from 'lucide-react';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../../data/mockData';
import { SearchBloodGroupHeaderLogo } from '../common/DashboardIcons';

interface BloodGroupSearchProps {
  onSearch?: (bloodGroup: string, district: string, thana: string) => void;
}

export const BloodGroupSearch: React.FC<BloodGroupSearchProps> = ({ onSearch }) => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const thanas = district && BANGLADESH_THANAS[district] ? BANGLADESH_THANAS[district] : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(bloodGroup, district, thana);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.02)]">
      {/* Header matching reference mockup */}
      <div className="flex items-center gap-3 mb-4">
        <SearchBloodGroupHeaderLogo className="w-7 h-8 shrink-0" />
        <div>
          <h3 className="font-bold text-[#0f172a] text-[15px] leading-tight">Search Blood Group</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Find donors by blood group and location</p>
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-center">
        {/* Select Blood Group */}
        <div className="relative">
          <Droplet className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none fill-slate-300 stroke-none" />
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white border border-slate-200/80 rounded-xl text-xs md:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer transition-colors"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Select District */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setThana('');
            }}
            className="w-full pl-9 pr-8 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white border border-slate-200/80 rounded-xl text-xs md:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer transition-colors"
          >
            <option value="">Select District</option>
            {BANGLADESH_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Select Thana (Optional) */}
        <div className="relative">
          <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={thana}
            onChange={(e) => setThana(e.target.value)}
            disabled={!district || thanas.length === 0}
            className="w-full pl-8 pr-6 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white border border-slate-200/80 rounded-xl text-[11.5px] sm:text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <option value="">Select Thana (Optional)</option>
            {thanas.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 px-6 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm shadow-red-500/20 active:scale-[0.99] transition-all"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};
