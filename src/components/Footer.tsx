import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Radio, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                RF Communication Range Calculator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              An academic simulation software project for second-year Electronics and Communication Engineering students, modeling Friis free-space propagation and RF link budgets.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Pages
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('calculator')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Calculator
                </button>
              </li>
              <li>
                <button onClick={() => navigate('history')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  History
                </button>
              </li>
              <li>
                <button onClick={() => navigate('formulas')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Formulas & Derivations
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  About & Theory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Parameter Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Core Equation
            </h4>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              Pr = Pt + Gt + Gr - FSPL - L
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Based on Friis free-space attenuation: FSPL = 32.44 + 20 log₁₀(f) + 20 log₁₀(d)
            </p>
          </div>
        </div>

        {/* Disclaimer Bottom Row */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Theoretical simulation only. Real-world RF range is subject to terrain, antenna polarization, and multipath interference.
            </span>
          </div>
          <div>
            © 2026 E&C (Advanced Communication Technology). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
