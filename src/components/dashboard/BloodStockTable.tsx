import React from 'react';
import { BloodStockItem } from '../../types/dashboard';

interface BloodStockTableProps {
  stock: BloodStockItem[];
  onViewAll?: () => void;
}

export const BloodStockTable: React.FC<BloodStockTableProps> = ({ stock, onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-base">Blood Stock</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              <th className="pb-2.5 font-medium">Blood Group</th>
              <th className="pb-2.5 font-medium text-center">Available Units</th>
              <th className="pb-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {stock.map((item) => (
              <tr key={item.bloodGroup} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold text-white ${
                      item.bloodGroup.includes('-') ? 'bg-[#2563eb]' : 'bg-[#ef4444]'
                    }`}
                  >
                    {item.bloodGroup}
                  </span>
                </td>
                <td className="py-2 text-center font-bold text-slate-800">
                  {item.units}
                </td>
                <td className="py-2 text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.status === 'Good'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
