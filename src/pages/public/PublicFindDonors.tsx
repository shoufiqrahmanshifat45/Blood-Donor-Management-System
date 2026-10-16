import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FindDonorsView } from '../FindDonorsView';

export const PublicFindDonors: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const group = searchParams.get('group') || 'O+';
  const district = searchParams.get('district') || 'Dhaka';
  const thana = searchParams.get('thana') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Blood Donors
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search registered voluntary blood donors by blood group, district, and upazila across Bangladesh.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <FindDonorsView
          initialBloodGroup={group}
          initialDistrict={district}
          initialThana={thana}
          onRequestBlood={() => navigate('/blood-requests')}
          onBookAppointment={() => navigate('/login')}
        />
      </div>
    </div>
  );
};
