import React from 'react';
import { BloodStockItem } from '../../types/dashboard';

interface BloodStockTableProps {
  stock: BloodStockItem[];
  onViewAll?: () => void;
}

export const BloodStockTable: React.FC<BloodStockTableProps> = ({ stock, onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl p-4.5 p-4 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[#0f172a] text-[14px]">Blood Stock</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#ef4444] hover:text-[#dc2626] transition-colors"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 text-[10.5px]">
              <th className="pb-1.5 font-medium">Blood Group</th>
              <th className="pb-1.5 font-medium text-center">Available Units</th>
              <th className="pb-1.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {stock.map((item) => (
              <tr key={item.bloodGroup} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-1">
                  <span
                    className={`inline-flex items-center justify-center w-5.5 h-4.5 rounded text-[10px] font-bold text-white shadow-2xs ${
                      item.bloodGroup === 'A-' || item.bloodGroup === 'O-'
                        ? 'bg-[#2563eb]'
                        : 'bg-[#ef4444]'
                    }`}
                  >
                    {item.bloodGroup}
                  </span>
                </td>
                <td className="py-1 text-center font-bold text-[#0f172a] text-[11.5px]">
                  {item.units}
                </td>
                <td className="py-1 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.status === 'Good'
                        ? 'bg-[#e6f9ed] text-[#16a34a]'
                        : 'bg-[#fef7e6] text-[#d97706]'
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
