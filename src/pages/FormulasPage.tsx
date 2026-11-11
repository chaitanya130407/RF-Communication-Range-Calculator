import React from 'react';
import { GlobalBackButton } from '../components/GlobalBackButton';
import {
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  FileCode,
} from 'lucide-react';

export const FormulasPage: React.FC = () => {
  const acronyms = [
    { code: 'RF', name: 'Radio Frequency', desc: 'Electromagnetic signals used for wireless communications.' },
    { code: 'Pt', name: 'Transmit Power', desc: 'RF power emitted by the transmitter amplifier (dBm or Watts).' },
    { code: 'Pr', name: 'Received Power', desc: 'RF power delivered to the receiving system after path attenuation.' },
    { code: 'Gt', name: 'Transmitter Antenna Gain', desc: 'Directional signal concentration of the transmitting antenna (dBi).' },
    { code: 'Gr', name: 'Receiver Antenna Gain', desc: 'Directional aperture gain of the receiving antenna (dBi).' },
    { code: 'FSPL', name: 'Free Space Path Loss', desc: 'Geometric power loss of an electromagnetic wave spreading in free space.' },
    { code: 'L', name: 'System / Cable Loss', desc: 'Attenuation caused by feedlines, connectors, jumpers, and filtering.' },
    { code: 'f', name: 'Frequency', desc: 'Oscillation rate of the RF carrier wave (Hz, MHz, or GHz).' },
    { code: 'd', name: 'Distance', desc: 'Physical separation distance between transmitter and receiver (meters or km).' },
    { code: 'λ', name: 'Wavelength', desc: 'Spatial period of the wave (λ = c / f), determining antenna sizing.' },
    { code: 'c', name: 'Speed of Light', desc: 'Electromagnetic propagation velocity in vacuum: 3 × 10⁸ m/s.' },
    { code: 'RSSI', name: 'Received Signal Strength Indicator', desc: 'Relative received signal power level measured in milliwatts/dBm.' },
    { code: 'SNR', name: 'Signal-to-Noise Ratio', desc: 'Ratio of desired signal power to background thermal noise power.' },
    { code: 'dB', name: 'Decibel', desc: 'Logarithmic ratio expressing gain or loss (dimensionless).' },
    { code: 'dBm', name: 'Decibel relative to 1 milliwatt', desc: 'Absolute RF power scale referenced to 1 mW (0 dBm = 1 mW).' },
    { code: 'dBi', name: 'Decibel Isotropic', desc: 'Antenna gain referenced to a hypothetical isotropic lossless radiator.' },
    { code: 'Tx', name: 'Transmitter', desc: 'System component modulating and radiating RF power.' },
    { code: 'Rx', name: 'Receiver', desc: 'System component detecting, amplifying, and demodulating incoming signals.' },
  ];

  return (
    <div className="space-y-10 py-4 sm:py-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <GlobalBackButton />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <span>RF Formulas & Parameter Guide</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Theoretical derivations and engineering definitions for 2nd-Year ECE students
          </p>
        </div>
      </div>

      {/* Section 6: Parameter Full Forms & Abbreviations */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Parameter Full Forms & Engineering Units
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {acronyms.map((item) => (
            <div
              key={item.code}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {item.code}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  Standard RF
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Mathematical Formulas & Derivations */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Core RF Link Budget Formulas
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formula 1: FSPL */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Formula 1
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Free Space Path Loss (FSPL)
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm text-center font-bold text-blue-700 dark:text-blue-300">
              FSPL(dB) = 32.44 + 20 log₁₀(f_MHz) + 20 log₁₀(d_km)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Derived from Friis transmission equation in free space. The constant <strong>32.44</strong> accounts for unit scaling factors when frequency f is supplied in <strong>Megahertz (MHz)</strong> and distance d in <strong>Kilometers (km)</strong> with speed of light c = 3 × 10⁸ m/s.
            </p>
          </div>

          {/* Formula 2: Link Budget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Formula 2
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              General RF Link Budget
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm text-center font-bold text-blue-700 dark:text-blue-300">
              Pr = Pt + Gt + Gr - FSPL - L
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates received power Pr (dBm) by summing transmitter power Pt (dBm), transmitter antenna gain Gt (dBi), and receiver antenna gain Gr (dBi), subtracting propagation path loss FSPL (dB) and hardware system losses L (dB).
            </p>
          </div>

          {/* Formula 3: Maximum Range Derivation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Formula 3
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Maximum Theoretical Communication Range
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              At the absolute boundary of communication, received power equals the receiver sensitivity threshold (Pr = Receiver Sensitivity).
            </p>
            <div className="space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>FSPL_max = Pt + Gt + Gr - L - Receiver Sensitivity</div>
              <div className="font-bold text-blue-600 dark:text-blue-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                d_km = 10^((FSPL_max - 32.44 - 20 log₁₀(f_MHz)) / 20)
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The result gives maximum theoretical line-of-sight distance d_km and d_m = d_km × 1000.
            </p>
          </div>

          {/* Formula 4: Wavelength & Unit Conversions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Formula 4 & Conversions
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              RF Wavelength & Unit Conversions
            </h3>
            <div className="space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>Wavelength: λ = c / f = (3 × 10⁸ m/s) / f_Hz</div>
              <div>Frequency: 1 GHz = 1000 MHz</div>
              <div>Watts to dBm: P(dBm) = 10 × log₁₀(P(W) × 1000)</div>
              <div>dBm to Watts: P(W) = 10^(P(dBm) / 10) / 1000</div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              These relationships ensure that regardless of student input units (W vs dBm, MHz vs GHz), the simulator standardizes units prior to logarithmic calculation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 19: Sample Calculation strictly labeled */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Educational Sample Walkthrough
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed step-by-step example demonstrating manual computation
              </p>
            </div>
          </div>

          {/* Strict label required by Section 19 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Illustrative Example – Not Saved to User History</span>
          </div>
        </div>

        {/* Example Problem Statement */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
          <p className="font-bold text-slate-900 dark:text-white">
            Problem Scenario:
          </p>
          <p>
            A 2.4 GHz Wi-Fi transmitter operates with transmit power Pt = 100 mW (20 dBm), transmitting dipole antenna gain Gt = 2.15 dBi, receiving dipole antenna gain Gr = 2.15 dBi, system/cable loss L = 2 dB, and receiver sensitivity threshold Pr_sens = -95 dBm. Calculate the theoretical maximum line-of-sight communication range.
          </p>
        </div>

        {/* Step-by-Step walkthrough of example */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 1: Convert Frequency to MHz</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">f_MHz = 2.4 GHz × 1000 = 2400 MHz</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 2: Convert Power to dBm</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">P(dBm) = 10 × log₁₀(100 mW) = 20 dBm</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 3: Calculate Allowable Path Loss</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
              FSPL_max = 20 + 2.15 + 2.15 - 2 - (-95) = 117.30 dB
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 4 & 5: Apply FSPL & Solve for Distance</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
              20 log₁₀(d_km) = 117.30 - 32.44 - 20 log₁₀(2400) = 117.30 - 32.44 - 67.60 = 17.26 dB
            </p>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
              d_km = 10^(17.26 / 20) = 10^(0.863) ≈ 7.295 km
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 6: Convert to Meters</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
              d_m = 7.295 km × 1000 = 7,295 meters
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white">Step 7: RF Wavelength</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
              λ = (3 × 10⁸ m/s) / (2.4 × 10⁹ Hz) = 0.125 meters (12.5 cm)
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 text-center">
          Note: This educational example is strictly for reference and is never injected into Firebase, dashboard statistics, or graphs.
        </div>
      </section>
    </div>
  );
};
