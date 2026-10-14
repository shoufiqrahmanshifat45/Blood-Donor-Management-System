import React from 'react';
import {
  AddNewDonorActionIcon,
  RegisterBloodRequestActionIcon,
  BookAppointmentActionIcon,
  ViewReportsActionIcon,
  SearchBloodGroupActionIcon,
  BmiCalculatorActionIcon,
} from '../common/DashboardIcons';

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'add-donor',
      title: 'Add New Donor',
      icon: AddNewDonorActionIcon,
    },
    {
      id: 'register-request',
      title: 'Register Blood Request',
      icon: RegisterBloodRequestActionIcon,
    },
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      icon: BookAppointmentActionIcon,
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      icon: ViewReportsActionIcon,
    },
    {
      id: 'search-blood-group',
      title: 'Search Blood Group',
      icon: SearchBloodGroupActionIcon,
    },
    {
      id: 'bmi-calculator',
      title: 'Open BMI Calculator',
      icon: BmiCalculatorActionIcon,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-bold text-[#0f172a] text-[15px]">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          const isSelected = act.id === 'search-blood-group';
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.id)}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center min-h-[82px] ${
                isSelected
                  ? 'border-[#3b82f6] bg-[#eff6ff]/60 shadow-xs'
                  : 'border-slate-200/70 hover:border-red-200 hover:shadow-xs bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105">
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-semibold transition-colors leading-tight ${
                  isSelected ? 'text-[#2563eb]' : 'text-slate-700 group-hover:text-red-600'
                }`}
              >
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
