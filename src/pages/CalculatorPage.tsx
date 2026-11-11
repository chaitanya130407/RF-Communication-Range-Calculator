import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCalculations } from '../context/CalculationContext';
import { useNavigation } from '../context/NavigationContext';
import { GlobalBackButton } from '../components/GlobalBackButton';
import { RFCharts } from '../components/RFCharts';
import { RFInputParams, FrequencyUnit, PowerUnit } from '../types/rf';
import { validateRFInputs, generateStepExplanation } from '../utils/rfCalculations';
import { exportCalculationToPDF, exportCalculationToCSV } from '../utils/exportUtils';
import {
  Calculator,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Radio,
  ArrowRight,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  FileText,
  Table,
} from 'lucide-react';
import { PageId } from '../context/NavigationContext';

interface CalculatorPageProps {
  onNavigate?: (page: PageId) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onNavigate }) => {
  const navContext = useNavigation();
  const { activeCalculation, performAndSaveCalculation } = useCalculations();
  const navigate = onNavigate || navContext.navigate;

  // Form State initialized to empty/clean standard input
  const [frequency, setFrequency] = useState<string>('2400');
  const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>('MHz');
  const [transmitPower, setTransmitPower] = useState<string>('20');
  const [transmitPowerUnit, setTransmitPowerUnit] = useState<PowerUnit>('dBm');
  const [txAntennaGain, setTxAntennaGain] = useState<string>('2.15');
  const [rxAntennaGain, setRxAntennaGain] = useState<string>('2.15');
  const [receiverSensitivity, setReceiverSensitivity] = useState<string>('-95');
  const [systemLoss, setSystemLoss] = useState<string>('2');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showStepDetails, setShowStepDetails] = useState<boolean>(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportPDF = () => {
    if (!activeCalculation) return;
    try {
      exportCalculationToPDF(activeCalculation);
      setExportNotice('PDF Report successfully generated and downloaded.');
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  const handleExportCSV = () => {
    if (!activeCalculation) return;
    try {
      exportCalculationToCSV(activeCalculation);
      setExportNotice('CSV Calculation Data successfully downloaded.');
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('CSV export error:', err);
    }
  };

  // Clear form to fresh blank state
  const handleReset = () => {
    setFrequency('');
    setTransmitPower('');
    setTxAntennaGain('0');
    setRxAntennaGain('0');
    setReceiverSensitivity('');
    setSystemLoss('0');
    setValidationError(null);
    setSaveSuccess(false);
  };

  // Submit calculation
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSaveSuccess(false);

    const fNum = parseFloat(frequency);
    const ptNum = parseFloat(transmitPower);
    const gtNum = parseFloat(txAntennaGain);
    const grNum = parseFloat(rxAntennaGain);
    const sensNum = parseFloat(receiverSensitivity);
    const lossNum = parseFloat(systemLoss);

    const inputData: RFInputParams = {
      frequency: fNum,
      frequencyUnit,
      transmitPower: ptNum,
      transmitPowerUnit,
      txAntennaGain: isNaN(gtNum) ? 0 : gtNum,
      rxAntennaGain: isNaN(grNum) ? 0 : grNum,
      receiverSensitivity: sensNum,
      systemLoss: isNaN(lossNum) ? 0 : lossNum,
    };

    const validation = validateRFInputs(inputData);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    try {
      setIsCalculating(true);
      await performAndSaveCalculation(inputData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('Calculation error:', err);
      setValidationError('Failed to save calculation to Firebase. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const steps = activeCalculation ? generateStepExplanation(activeCalculation) : [];

  return (
    <div className="space-y-8 py-4 sm:py-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GlobalBackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-7 h-7 text-blue-600" />
              <span>RF Link Budget Calculator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Compute theoretical maximum line-of-sight communication range using FSPL equations
            </p>
          </div>
        </div>

        {/* User state indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Auto-Save Enabled
          </span>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left/Top, Results on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>Simulation Parameters</span>
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Frequency */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <span>Frequency (f)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400" title="Carrier frequency of transmission">
                    Carrier wave
                  </span>
                </div>
                <div className="flex rounded-xl shadow-2xs">
                  <input
                    type="number"
                    step="any"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. 2400"
                    className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                  <select
                    value={frequencyUnit}
                    onChange={(e) => setFrequencyUnit(e.target.value as FrequencyUnit)}
                    className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-r-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="MHz">MHz</option>
                    <option value="GHz">GHz</option>
                  </select>
                </div>
              </div>

              {/* Transmit Power */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <span>Transmit Power (Pt)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Transmitter output</span>
                </div>
                <div className="flex rounded-xl shadow-2xs">
                  <input
                    type="number"
                    step="any"
                    required
                    value={transmitPower}
                    onChange={(e) => setTransmitPower(e.target.value)}
                    placeholder="e.g. 20 (dBm) or 0.1 (W)"
                    className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                  <select
                    value={transmitPowerUnit}
                    onChange={(e) => setTransmitPowerUnit(e.target.value as PowerUnit)}
                    className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-r-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="dBm">dBm</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>

              {/* Tx Antenna Gain (Gt) & Rx Antenna Gain (Gr) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Tx Gain (Gt) [dBi]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={txAntennaGain}
                    onChange={(e) => setTxAntennaGain(e.target.value)}
                    placeholder="e.g. 2.15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Rx Gain (Gr) [dBi]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={rxAntennaGain}
                    onChange={(e) => setRxAntennaGain(e.target.value)}
                    placeholder="e.g. 2.15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Receiver Sensitivity */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <span>Receiver Sensitivity [dBm]</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Min detectable signal</span>
                </div>
                <input
                  type="number"
                  step="any"
                  required
                  value={receiverSensitivity}
                  onChange={(e) => setReceiverSensitivity(e.target.value)}
                  placeholder="e.g. -95"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* System/Cable Loss (L) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    System / Cable Loss (L) [dB]
                  </label>
                  <span className="text-[11px] text-slate-400">Connectors + feedlines</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={systemLoss}
                  onChange={(e) => setSystemLoss(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error Message */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Success Badge */}
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Calculated & saved to your calculation records!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isCalculating ? 'Computing Range...' : 'CALCULATE RANGE'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Parameter Explanations Quick Reference Card (Section 6) */}
          <div className="bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>RF Acronym Reference</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
              <div><strong>Pt:</strong> Transmit Power</div>
              <div><strong>Pr:</strong> Received Power</div>
              <div><strong>Gt:</strong> Tx Antenna Gain</div>
              <div><strong>Gr:</strong> Rx Antenna Gain</div>
              <div><strong>FSPL:</strong> Free Space Path Loss</div>
              <div><strong>L:</strong> System/Cable Loss</div>
              <div><strong>λ:</strong> Wavelength (c/f)</div>
              <div><strong>c:</strong> 3 × 10⁸ m/s</div>
            </div>
          </div>
        </div>

        {/* Calculation Results & Explanations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeCalculation ? (
            <>
              {/* Main Result Cards (Section 9) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Calculation Results
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportPDF}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shadow-2xs cursor-pointer"
                      title="Download formatted PDF documentation report"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Export PDF</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs cursor-pointer"
                      title="Download calculation data as CSV file"
                    >
                      <Table className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Export CSV</span>
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden md:inline ml-1">
                      λ = {activeCalculation.wavelengthMeters.toFixed(4)} m
                    </span>
                  </div>
                </div>

                {exportNotice && (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>{exportNotice}</span>
                  </div>
                )}

                {/* Primary Hero Result */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/15">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100 block">
                    Estimated Theoretical RF Communication Range
                  </span>
                  <div className="flex flex-wrap items-baseline gap-3 mt-2">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {activeCalculation.estimatedRangeKm.toFixed(3)} km
                    </span>
                    <span className="text-lg font-medium text-blue-200">
                      ({activeCalculation.estimatedRangeMeters.toLocaleString()} meters)
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/90 mt-3 pt-3 border-t border-white/15">
                    Theoretical maximum line-of-sight distance where received power equals receiver sensitivity ({activeCalculation.receiverSensitivity} dBm).
                  </p>
                </div>

                {/* 3 Secondary Result Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Max Allowable FSPL
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                      {activeCalculation.allowableFSPL.toFixed(2)} dB
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      Pt + Gt + Gr - L - RxSens
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Wavelength (λ)
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                      {activeCalculation.wavelengthMeters.toFixed(4)} m
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      c / f = {(activeCalculation.wavelengthMeters * 100).toFixed(2)} cm
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Link Budget @ 1 km
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                      {activeCalculation.linkBudgetMarginAt1Km?.toFixed(2)} dBm
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      Received power at 1.0 km
                    </span>
                  </div>
                </div>

                {/* Parameters Summary Row */}
                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Frequency</span>
                    <strong className="text-slate-900 dark:text-white">{activeCalculation.frequencyMHz.toFixed(2)} MHz</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Transmit Power</span>
                    <strong className="text-slate-900 dark:text-white">{activeCalculation.transmitPowerdBm.toFixed(2)} dBm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Antenna Gains</span>
                    <strong className="text-slate-900 dark:text-white">{activeCalculation.txAntennaGain} / {activeCalculation.rxAntennaGain} dBi</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">System Loss</span>
                    <strong className="text-slate-900 dark:text-white">{activeCalculation.systemLoss} dB</strong>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Calculation Explanation (Section 10) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowStepDetails(!showStepDetails)}
                  className="w-full p-5 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <Layers className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        How was this result calculated?
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Step-by-step mathematical substitution using your entered values
                      </p>
                    </div>
                  </div>
                  {showStepDetails ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>

                {showStepDetails && (
                  <div className="p-5 sm:p-6 space-y-4 border-t border-slate-200 dark:border-slate-800">
                    {steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs sm:text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-slate-900 dark:text-white mb-1.5">
                          <span>
                            Step {step.stepNumber}: {step.title}
                          </span>
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                            {step.result}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                          <div className="text-slate-500 dark:text-slate-400">{step.formula}</div>
                          <div className="font-semibold text-blue-600 dark:text-blue-400">= {step.substitution}</div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                          {step.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Prompt to run calculation first */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ready to Compute Range
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Fill in the RF parameters on the left and click <strong>CALCULATE RANGE</strong> to inspect estimated theoretical range, FSPL, and step-by-step derivations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Graphs Section (Section 11) */}
      <div className="pt-4">
        <RFCharts calculation={activeCalculation} />
      </div>
    </div>
  );
};
