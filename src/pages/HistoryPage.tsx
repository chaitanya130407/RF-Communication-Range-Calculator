import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCalculations } from '../context/CalculationContext';
import { useNavigation } from '../context/NavigationContext';
import { GlobalBackButton } from '../components/GlobalBackButton';
import { CalculationModal } from '../components/CalculationModal';
import { StoredCalculation } from '../types/rf';
import { exportHistoryToCSV } from '../utils/exportUtils';
import {
  History,
  Trash2,
  Eye,
  AlertTriangle,
  Zap,
  Radio,
  Search,
  ArrowRight,
  Shield,
  Layers,
  Table,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from '../context/NavigationContext';

interface HistoryPageProps {
  onNavigate?: (page: PageId) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const navContext = useNavigation();
  const {
    calculations,
    loading,
    deleteCalculation,
    clearAllCalculations,
    selectCalculationForViewing,
  } = useCalculations();

  const navigate = onNavigate || navContext.navigate;

  const [selectedCalc, setSelectedCalc] = useState<StoredCalculation | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportHistoryCSV = () => {
    if (calculations.length === 0) return;
    try {
      exportHistoryToCSV(calculations);
      setExportNotice(`Exported all ${calculations.length} history records as CSV.`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('Export history error:', err);
    }
  };

  const filteredCalculations = calculations.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.frequency.toString().includes(term) ||
      c.frequencyUnit.toLowerCase().includes(term) ||
      c.transmitPower.toString().includes(term) ||
      c.estimatedRange.toString().includes(term) ||
      c.createdAt.toLowerCase().includes(term)
    );
  });

  const handleClearHistory = async () => {
    try {
      setIsDeleting(true);
      await clearAllCalculations();
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLoadInCalculator = (calc: StoredCalculation) => {
    selectCalculationForViewing(calc);
    navigate('calculator');
  };

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GlobalBackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <History className="w-7 h-7 text-blue-600" />
              <span>Calculation History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Saved simulation calculations with theoretical RF link budget metrics
            </p>
          </div>
        </div>

        {calculations.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportHistoryCSV}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900/60 transition-colors cursor-pointer shadow-2xs"
              title="Export all calculation history records as CSV"
            >
              <Table className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export History CSV</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Table or Empty State */}
      {calculations.length === 0 ? (
        /* Empty State strictly matching Section 18 */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Your calculation history is empty.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven't performed any calculations yet. Every calculation you run will automatically appear here.
            </p>
          </div>
          <button
            onClick={() => navigate('calculator')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Start First Calculation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden space-y-4">
          {/* Search bar & count */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history (frequency, date, power)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing {filteredCalculations.length} of {calculations.length} calculations
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Frequency</th>
                  <th className="px-5 py-3.5">Transmit Power</th>
                  <th className="px-5 py-3.5">Antenna Gains</th>
                  <th className="px-5 py-3.5">Rx Sensitivity</th>
                  <th className="px-5 py-3.5">System Loss</th>
                  <th className="px-5 py-3.5">FSPL</th>
                  <th className="px-5 py-3.5">Estimated Range</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCalculations.map((calc) => (
                  <tr
                    key={calc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
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
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {calc.receiverSensitivity} dBm
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {calc.systemLoss} dB
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
                      <div className="flex items-center justify-end gap-1.5">
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

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear Calculation History?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                This will permanently delete all {calculations.length} calculation records. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
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
