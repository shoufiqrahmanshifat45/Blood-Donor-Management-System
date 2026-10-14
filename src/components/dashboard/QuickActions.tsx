import React from 'react';
import {
  UserPlus,
  Droplet,
  Calendar,
  LineChart,
  Search,
  Calculator
} from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'add-donor',
      title: 'Add New Donor',
      icon: UserPlus,
      iconColor: 'text-[#ef4444]',
    },
    {
      id: 'register-request',
      title: 'Register Blood Request',
      icon: Droplet,
      iconColor: 'text-[#2563eb]',
      iconFill: true,
    },
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      icon: Calendar,
      iconColor: 'text-[#10b981]',
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      icon: LineChart,
      iconColor: 'text-[#a855f7]',
    },
    {
      id: 'search-blood-group',
      title: 'Search Blood Group',
      icon: Search,
      iconColor: 'text-[#2563eb]',
    },
    {
      id: 'bmi-calculator',
      title: 'Open BMI Calculator',
      icon: Calculator,
      iconColor: 'text-[#64748b]',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.id)}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 hover:border-red-300 hover:shadow-sm bg-white hover:bg-red-50/20 transition-all text-center"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
                <Icon
                  className={`w-6 h-6 ${act.iconColor} ${act.iconFill ? 'fill-current' : ''}`}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-red-600 transition-colors leading-tight">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
