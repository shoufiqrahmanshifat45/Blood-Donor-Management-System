import React from 'react';
import { BloodStockItem } from '../../types/dashboard';
import { getBloodGroupColor } from '../../utils/bloodGroupColors';
import { Table, Column } from '../common/Table';

interface BloodStockTableProps {
  stock: BloodStockItem[];
  onViewAll?: () => void;
}

export const BloodStockTable: React.FC<BloodStockTableProps> = ({ stock, onViewAll }) => {
  const columns: Column<BloodStockItem>[] = [
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      className: 'pb-1.5 font-medium text-[10.5px]',
      render: (item) => {
        const colorDef = getBloodGroupColor(item.bloodGroup);
        return (
          <span
            style={{ backgroundColor: colorDef.hex }}
            className="w-[34px] h-[22px] rounded text-[10.5px] font-bold text-white shadow-xs inline-flex items-center justify-center shrink-0 tracking-tight"
          >
            {item.bloodGroup}
          </span>
        );
      },
    },
    {
      key: 'units',
      header: 'Available Units',
      align: 'center',
      className: 'pb-1.5 font-medium text-[10.5px]',
      render: (item) => (
        <span className="font-bold text-[#0f172a] text-[11.5px]">{item.units}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      className: 'pb-1.5 font-medium text-[10.5px]',
      render: (item) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            item.status === 'Good'
              ? 'bg-[#e6f9ed] text-[#16a34a]'
              : 'bg-[#fef7e6] text-[#d97706]'
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[#0f172a] text-[14px]">Blood Stock</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-[#ef4444] hover:text-[#dc2626] transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto flex-1">
        <Table
          columns={columns}
          data={stock}
          keyExtractor={(item) => item.bloodGroup}
          compact
        />
      </div>
    </div>
  );
};
