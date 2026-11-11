import { StoredCalculation } from '../types/rf';
import { calculateRFRange, generateStepExplanation } from '../utils/rfCalculations';
import { exportCalculationToPDF, exportCalculationToCSV } from '../utils/exportUtils';
import { X, Radio, ArrowRight, Layers, Clock, Zap, FileText, Table } from 'lucide-react';

interface CalculationModalProps {
  calculation: StoredCalculation | null;
  onClose: () => void;
  onLoadIntoCalculator?: (calc: StoredCalculation) => void;
}

export const CalculationModal: React.FC<CalculationModalProps> = ({
  calculation,
  onClose,
  onLoadIntoCalculator,
}) => {
  if (!calculation) return null;

  const result = calculateRFRange({
    frequency: calculation.frequency,
    frequencyUnit: calculation.frequencyUnit,
    transmitPower: calculation.transmitPower,
    transmitPowerUnit: calculation.transmitPowerUnit,
    txAntennaGain: calculation.txAntennaGain,
    rxAntennaGain: calculation.rxAntennaGain,
    receiverSensitivity: calculation.receiverSensitivity,
    systemLoss: calculation.systemLoss,
  });

  const steps = generateStepExplanation(result);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Radio className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Calculation Record Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Recorded: {calculation.createdAt}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Result Highlight Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-md">
            <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase">
              Theoretical Estimated Range
            </span>
            <div className="flex flex-wrap items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {result.estimatedRangeKm.toFixed(3)} km
              </span>
              <span className="text-sm font-medium text-blue-200">
                ({result.estimatedRangeMeters.toLocaleString()} m)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20 text-xs">
              <div>
                <span className="text-blue-200 block">Allowable FSPL</span>
                <span className="font-bold text-sm">{result.allowableFSPL.toFixed(2)} dB</span>
              </div>
              <div>
                <span className="text-blue-200 block">Wavelength (λ)</span>
                <span className="font-bold text-sm">{result.wavelengthMeters.toFixed(4)} m</span>
              </div>
              <div>
                <span className="text-blue-200 block">Link Margin @ 1km</span>
                <span className="font-bold text-sm">{result.linkBudgetMarginAt1Km?.toFixed(2)} dBm</span>
              </div>
            </div>
          </div>

          {/* Parameters Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Input Parameters Used</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Frequency</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.frequency} {calculation.frequencyUnit}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Transmit Power (Pt)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.transmitPower} {calculation.transmitPowerUnit}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Tx Gain (Gt)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.txAntennaGain} dBi
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Rx Gain (Gr)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.rxAntennaGain} dBi
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Rx Sensitivity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.receiverSensitivity} dBm
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">System Loss (L)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {calculation.systemLoss} dB
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Breakdown Accordion/List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Mathematical Derivation Steps
            </h4>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-1.5">
                    <span>
                      {step.stepNumber}. {step.title}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                      {step.result}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                    <div>{step.formula}</div>
                    <div className="text-slate-400 dark:text-slate-500 mt-1">= {step.substitution}</div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCalculationToPDF(result, null)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => exportCalculationToCSV(result, null)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {onLoadIntoCalculator && (
              <button
                onClick={() => {
                  onLoadIntoCalculator(calculation);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Load in Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
