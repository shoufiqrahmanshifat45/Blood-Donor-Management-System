import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Droplet,
  Users,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { generateReportPDF } from '../utils/pdfExport';
import { ChartSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import { RealTimeClock } from '../components/common/RealTimeClock';

export const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'year' | 'all'>('30d');
  const { data, loading, error, refresh } = useDashboardData();
  const { success } = useNotification();

  const totalDonors = data?.totalDonorsCount || '0';
  const totalDonations = data?.stats?.find((s) => s.id === 'total-donations')?.value || '0';
  const stockItems = data?.bloodStock || [];
  const totalUnitsAvailable = stockItems.reduce((sum, item) => sum + item.availableUnits, 0);
  const criticalShortageGroups = stockItems.filter((s) => s.status === 'Low' || s.status === 'Critical');
  const donorsByBloodGroup = data?.donorsByBloodGroup || [];
  const trends = data?.donorRegistrationTrends || [];

  const totalDonorsNum = parseInt(String(totalDonors).replace(/,/g, ''), 10) || 1;

  // Export PDF generator
  const handleExportPDF = () => {
    try {
      generateReportPDF({
        timeRange,
        adminName: 'BDMS Administrator',
      });
      success('Report Exported', 'The report PDF has been downloaded successfully.');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#ef4444]" />
            Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit blood inventory, seasonal demand fluctuations, and demographic statistics directly from database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <RealTimeClock variant="compact" />
          <button
            onClick={refresh}
            className="p-2 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Refresh database metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Time range selector */}
          <div className="flex items-center bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            {(
              [
                { id: '30d', label: '30D' },
                { id: '90d', label: '90D' },
                { id: 'year', label: '1 Year' },
                { id: 'all', label: 'All Time' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === t.id
                    ? 'bg-[#ef4444] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Donated Units</span>
            <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading && !data ? '...' : totalDonations}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified units across network</p>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Current In-Stock</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading && !data ? '...' : `${totalUnitsAvailable} Bags`}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +10.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all 8 blood groups in inventory</p>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Registered Donors</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading && !data ? '...' : totalDonors}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.0%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active verified donors in database</p>
        </div>

        <div className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Active Blood Requisitions</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading && !data ? '...' : data?.stats?.find((s) => s.id === 'blood-requests')?.value || '0'}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hospital requests tracked in system</p>
        </div>
      </div>

      {/* Main Grid: Stock Levels & Blood Group Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Blood Stock Reserve Audit (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#ef4444]" />
                Blood Stock Levels & Shortage Audit
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target reserve minimum: 30 units per group.
              </p>
            </div>
            {criticalShortageGroups.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                {criticalShortageGroups.length} Groups Low
              </span>
            )}
          </div>

          {loading && !data ? (
            <TableSkeleton rows={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stockItems.map((item) => {
                const maxScale = 150;
                const percent = Math.min(100, Math.round((item.availableUnits / maxScale) * 100));
                const isLow = item.status === 'Low' || item.status === 'Critical';
                return (
                  <div
                    key={item.bloodGroup}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-extrabold text-xs flex items-center justify-center">
                          {item.bloodGroup}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.availableUnits} Units
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLow
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                      <span>Reserved: {item.reservedUnits}</span>
                      <span>Capacity: 150</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Blood Group Demographic Distribution (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Donor Group Demographics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown across all 8 registered blood types
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left pb-2 font-medium">Group</th>
                  <th className="text-center pb-2 font-medium">Donors</th>
                  <th className="text-right pb-2 font-medium">Population Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {donorsByBloodGroup.map((d) => {
                  const share = ((d.count / totalDonorsNum) * 100).toFixed(1);
                  return (
                    <tr key={d.group} className="hover:bg-slate-50 dark:hover:bg-[#131d33]/50">
                      <td className="py-2.5 font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-[10px]">
                          {d.group}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {d.count}
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-600 dark:text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span>{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly Trajectory Performance Table */}
      <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Annual Donation & Acquisition Trajectory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live monthly intake performance and cumulative database donor retention.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {trends.map((t) => (
            <div
              key={t.month}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131d33] text-center border border-slate-100 dark:border-slate-800/80"
            >
              <p className="text-[11px] font-bold text-slate-400 uppercase">{t.month}</p>
              <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
                +{t.newDonors}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.totalDonors} total
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
