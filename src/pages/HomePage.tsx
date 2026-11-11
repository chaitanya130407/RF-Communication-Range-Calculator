import React from 'react';
import { useNavigation, PageId } from '../context/NavigationContext';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Wifi,
  Antenna,
  Cpu,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';

interface HomePageProps {
  onNavigate?: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const navContext = useNavigation();
  const navigate = onNavigate || navContext.navigate;

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-14 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            RF Communication <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Range Calculator
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            A software-only simulation environment for Electronics and Communication Engineering students to calculate, model, and visualize theoretical RF communication link budgets and maximum propagation distances.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => navigate('calculator')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Start Calculation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-100 border border-slate-700 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Go to Dashboard</span>
            </button>

            <button
              onClick={() => navigate('formulas')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review RF Formulas</span>
            </button>
          </div>
        </div>
      </section>

      {/* Brief Explanation of RF Communication */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Wifi className="w-3.5 h-3.5" />
            <span>Fundamentals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What is RF Communication?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Radio Frequency (RF) communication</strong> is the wireless transmission of data signals through electromagnetic waves within the frequency spectrum from roughly 3 kHz to 300 GHz. An RF transmitter modulates electromagnetic energy and emits it into space via an antenna.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            As waves propagate through space, their power density dissipates inversely with the square of the distance (the inverse-square law). The <strong>theoretical communication range</strong> is the maximum distance at which the received signal power (Pr) remains equal to or greater than the receiver’s internal sensitivity threshold (Pr_sensitivity).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Antenna className="w-5 h-5 text-blue-600" />
            <span>Core Link Budget Equation</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-sm sm:text-base text-blue-600 dark:text-blue-400 text-center font-bold">
            Pr = Pt + Gt + Gr - FSPL - L
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div>• <strong className="text-slate-800 dark:text-slate-200">Pt:</strong> Transmit Power</div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">Gt:</strong> Tx Antenna Gain</div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">Gr:</strong> Rx Antenna Gain</div>
            <div>• <strong className="text-slate-800 dark:text-slate-200">L:</strong> System & Cable Loss</div>
            <div className="col-span-2">• <strong className="text-slate-800 dark:text-slate-200">FSPL:</strong> Free Space Path Loss</div>
          </div>
        </div>
      </section>

      {/* Main Project Features */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Key Project Features
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built strictly to academic standards for 2nd-year Electronics and Communication Engineering courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Precise RF Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates allowable Free Space Path Loss (FSPL), RF wavelength, link budget, and maximum theoretical distance with unit conversions (MHz ↔ GHz, W ↔ dBm).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Interactive Chart.js Curves
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamic plots for Distance vs Received Power, Frequency vs Range, and Transmit Power vs Range generated strictly from actual calculated simulations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Isolated Cloud Firestore
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Authenticated user calculations are secured using strict Firebase Security Rules. Zero fake data, private calculation logs, and per-user database separation.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Disclaimer & Limitation Banner */}
      <section className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Project Limitation & Simulation Scope
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              This calculator provides a theoretical estimate based mainly on free-space propagation. Actual RF range may differ due to obstacles, terrain, antenna orientation, interference, multipath propagation, atmospheric conditions, hardware limitations, and other environmental factors. Always refer to results as the <strong>Estimated Theoretical RF Communication Range</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
