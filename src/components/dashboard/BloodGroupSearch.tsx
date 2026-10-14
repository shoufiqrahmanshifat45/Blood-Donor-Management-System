import React, { useState } from 'react';
import { Droplet, MapPin, Landmark, Search } from 'lucide-react';
import { BANGLADESH_DISTRICTS, BANGLADESH_THANAS } from '../../data/mockData';
import { SearchBloodGroupHeaderLogo } from '../common/DashboardIcons';
import { FilterSelect } from '../common/FilterSelect';
import { Button } from '../common/FormInputs';

interface BloodGroupSearchProps {
  onSearch?: (bloodGroup: string, district: string, thana: string) => void;
  isLoading?: boolean;
}

export const BloodGroupSearch: React.FC<BloodGroupSearchProps> = ({ onSearch, isLoading = false }) => {
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
    <div className="bg-white dark:bg-[#0c1527] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-[0_1px_6px_rgba(0,0,0,0.02)] transition-colors">
      {/* Header matching reference mockup */}
      <div className="flex items-center gap-3 mb-4">
        <SearchBloodGroupHeaderLogo className="w-7 h-8 shrink-0" />
        <div>
          <h3 className="font-bold text-[#0f172a] dark:text-white text-[15px] leading-tight">Search Blood Group</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Find donors by blood group and location</p>
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-center">
        {/* Select Blood Group */}
        <FilterSelect
          value={bloodGroup}
          onChange={setBloodGroup}
          options={bloodGroups.map((bg) => ({ value: bg, label: bg }))}
          placeholder="Select Blood Group"
          icon={<Droplet className="w-4 h-4 text-slate-400 fill-slate-300 stroke-none" />}
        />

        {/* Select District */}
        <FilterSelect
          value={district}
          onChange={(val) => {
            setDistrict(val);
            setThana('');
          }}
          options={BANGLADESH_DISTRICTS.map((dist) => ({ value: dist, label: dist }))}
          placeholder="Select District"
          icon={<MapPin className="w-4 h-4 text-slate-400" />}
        />

        {/* Select Thana (Optional) */}
        <FilterSelect
          value={thana}
          onChange={setThana}
          options={thanas.map((th) => ({ value: th, label: th }))}
          placeholder="Select Thana (Optional)"
          disabled={!district || thanas.length === 0}
          icon={<Landmark className="w-4 h-4 text-slate-400" />}
        />

        {/* Search Button */}
        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Search className="w-4 h-4 stroke-[2.2]" />}
            className="custom-accent-btn w-full py-2.5 text-xs md:text-sm"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};
