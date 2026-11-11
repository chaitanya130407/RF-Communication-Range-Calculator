import React, { useState } from 'react';
import { useCalculations } from '../context/CalculationContext';
import { useNavigation } from '../context/NavigationContext';
import { CalculationModal } from '../components/CalculationModal';
import { StoredCalculation, RFInputParams } from '../types/rf';
import {
  LayoutDashboard,
  Zap,
  History,
  TrendingUp,
  Clock,
  Radio,
  Eye,
  Trash2,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { PageId } from '../context/NavigationContext';

interface DashboardPageProps {
  onNavigate?: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const navContext = useNavigation();
  const {
    calculations,
    stats,
    deleteCalculation,
    selectCalculationForViewing,
    performAndSaveCalculation,
  } = useCalculations();

  const navigate = onNavigate || navContext.navigate;
  const [selectedCalc, setSelectedCalc] = useState<StoredCalculation | null>(null);
  const [runningPreset, setRunningPreset] = useState<string | null>(null);

  const hasCalculations = calculations.length > 0;

  const handleLoadInCalculator = (calc: StoredCalculation) => {
    selectCalculationForViewing(calc);
    navigate('calculator');
  };

  const handleRunPreset = async (preset: {
    name: string;
    params: RFInputParams;
  }) => {
    setRunningPreset(preset.name);
    try {
      await performAndSaveCalculation(preset.params);
    } catch (err) {
      console.error('Preset error:', err);
    } finally {
      setRunningPreset(null);
    }
  };

  const presets = [
    {
      name: 'Wi-Fi 2.4 GHz (IoT / Router)',
      desc: '2400 MHz • 20 dBm (100 mW) • 2.15 dBi Dipole',
      params: {
        frequency: 2400,
        frequencyUnit: 'MHz' as const,
        transmitPower: 20,
        transmitPowerUnit: 'dBm' as const,
        txAntennaGain: 2.15,
        rxAntennaGain: 2.15,
        receiverSensitivity: -85,
        systemLoss: 2,
      },
    },
    {
      name: 'LoRa 868 MHz (Long-Range Telemetry)',
      desc: '868 MHz • 14 dBm (25 mW) • -125 dBm Sensitivity',
      params: {
        frequency: 868,
        frequencyUnit: 'MHz' as const,
        transmitPower: 14,
        transmitPowerUnit: 'dBm' as const,
        txAntennaGain: 3,
        rxAntennaGain: 3,
        receiverSensitivity: -125,
        systemLoss: 1.5,
      },
    },
    {
      name: '5.8 GHz Point-to-Point Bridge',
      desc: '5800 MHz • 24 dBm (250 mW) • 12 dBi Directional Dish',
      params: {
        frequency: 5800,
        frequencyUnit: 'MHz' as const,
        transmitPower: 24,
        transmitPowerUnit: 'dBm' as const,
        txAntennaGain: 12,
        rxAntennaGain: 12,
        receiverSensitivity: -90,
        systemLoss: 3,
      },
    },
    {
      name: 'UHF Radio Telemetry 433 MHz',
      desc: '433 MHz • 10 dBm (10 mW) • Dipole Antennas',
      params: {
        frequency: 433,
        frequencyUnit: 'MHz' as const,
        transmitPower: 10,
        transmitPowerUnit: 'dBm' as const,
        txAntennaGain: 2.15,
        rxAntennaGain: 2.15,
        receiverSensitivity: -105,
        systemLoss: 1,
      },
    },
  ];

  return (
    <div className="space-y-8 py-4 sm:py-6">
      {/* Top Bar with Title & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-blue-600" />
            <span>RF Range Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time theoretical RF link budget metrics, calculation records, and propagation simulation
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('calculator')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Calculate Range</span>
          </button>
          <button
            onClick={() => navigate('history')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>History</span>
          </button>
          <button
            onClick={() => navigate('formulas')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Formulas</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Calculations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Calculations</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalCalculations}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Saved simulation sessions
          </span>
        </div>

        {/* Latest Calculated Range */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Latest Range</span>
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white truncate">
            {stats.latestRange}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Most recent simulation result
          </span>
        </div>

        {/* Average Calculated Range */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Range</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white truncate">
            {stats.averageRange}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Mean of stored calculations
          </span>
        </div>

        {/* Last Calculation Date */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Last Calculation</span>
            <span className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate" title={stats.lastCalculationDate}>
            {stats.lastCalculationDate}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Timestamp of last activity
          </span>
        </div>
      </div>

      {/* Quick Preset Simulations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Instant RF Simulation Presets
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            1-Click Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              disabled={runningPreset === preset.name}
              onClick={() => handleRunPreset(preset)}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {preset.name}
                </span>
                <Zap className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {preset.desc}
              </p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                {runningPreset === preset.name ? 'Calculating...' : 'Run Simulation →'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {!hasCalculations ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Radio className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No calculations yet.
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Start your first RF range calculation or click any instant preset above.
            </p>
          </div>
          <button
            onClick={() => navigate('calculator')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Launch RF Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Recent Calculations Overview */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <History className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Calculations
              </h3>
            </div>
            <button
              onClick={() => navigate('history')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({calculations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Frequency</th>
                  <th className="px-5 py-3.5">Pt (Power)</th>
                  <th className="px-5 py-3.5">Antenna (Gt/Gr)</th>
                  <th className="px-5 py-3.5">FSPL</th>
                  <th className="px-5 py-3.5">Estimated Range</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {calculations.slice(0, 6).map((calc) => (
                  <tr key={calc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                      {calc.createdAt}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {calc.frequency} {calc.frequencyUnit}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {calc.transmitPower} {calc.transmitPowerUnit}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {calc.txAntennaGain} / {calc.rxAntennaGain} dBi
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {calc.calculatedFSPL.toFixed(2)} dB
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">
                        {calc.estimatedRange.toFixed(3)} {calc.rangeUnit}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCalc(calc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                          title="Delete Calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Engineering note */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Real-time theoretical simulation engine modeling Friis transmission formula and Free Space Path Loss (FSPL).</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">Mathematical Standard Model</span>
      </div>

      {/* Details Modal */}
      {selectedCalc && (
        <CalculationModal
          calculation={selectedCalc}
          onClose={() => setSelectedCalc(null)}
          onLoadIntoCalculator={handleLoadInCalculator}
        />
      )}
    </div>
  );
};
