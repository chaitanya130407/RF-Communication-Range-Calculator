import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { RFCalculationResult } from '../types/rf';
import {
  generateDistanceVsPowerCurve,
  generateFrequencyVsRangeCurve,
  generatePowerVsRangeCurve,
} from '../utils/rfCalculations';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Radio, Zap, Activity, Info } from 'lucide-react';

Chart.register(...registerables);

interface RFChartsProps {
  calculation: RFCalculationResult | null;
  onNavigateToCalculator?: () => void;
}

export const RFCharts: React.FC<RFChartsProps> = ({ calculation, onNavigateToCalculator }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'distance' | 'frequency' | 'power'>('distance');

  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef3 = useRef<HTMLCanvasElement | null>(null);

  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  const chartInstance3 = useRef<Chart | null>(null);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';

  // Render Graph 1: Distance vs Received Power
  useEffect(() => {
    if (!calculation || !canvasRef1.current) return;

    if (chartInstance1.current) {
      chartInstance1.current.destroy();
    }

    const { points, sensitivityThreshold } = generateDistanceVsPowerCurve(calculation);

    const labels = points.map((p) => `${p.distanceKm.toFixed(2)} km`);
    const dataValues = points.map((p) => p.receivedPowerDbm);
    const sensitivityData = points.map(() => sensitivityThreshold);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Received Power (Pr)',
            data: dataValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            fill: true,
            tension: 0.25,
            borderWidth: 2.5,
            pointRadius: 2,
            pointHoverRadius: 6,
          },
          {
            label: `Receiver Sensitivity Threshold (${sensitivityThreshold} dBm)`,
            data: sensitivityData,
            borderColor: '#ef4444',
            borderDash: [6, 4],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'inherit', size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y} dBm`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Separation Distance (km)',
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: {
              color: textColor,
              maxTicksLimit: 8,
            },
            grid: { color: gridColor },
          },
          y: {
            title: {
              display: true,
              text: 'Received Signal Power (dBm)',
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: { color: textColor },
            grid: { color: gridColor },
          },
        },
      },
    };

    chartInstance1.current = new Chart(canvasRef1.current, config);

    return () => {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
    };
  }, [calculation, isDark, activeTab]);

  // Render Graph 2: Frequency vs Theoretical Communication Range
  useEffect(() => {
    if (!calculation || !canvasRef2.current) return;

    if (chartInstance2.current) {
      chartInstance2.current.destroy();
    }

    const { points, currentFrequencyMHz } = generateFrequencyVsRangeCurve(calculation);

    const labels = points.map((p) => `${p.frequencyMHz.toFixed(0)} MHz`);
    const dataValues = points.map((p) => p.rangeKm);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Theoretical Communication Range (km)',
            data: dataValues,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 2,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'inherit', size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `Theoretical Range: ${context.parsed.y} km`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `Carrier Frequency (Operating: ${currentFrequencyMHz.toFixed(1)} MHz)`,
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: {
              color: textColor,
              maxTicksLimit: 8,
            },
            grid: { color: gridColor },
          },
          y: {
            title: {
              display: true,
              text: 'Max Theoretical Range (km)',
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: { color: textColor },
            grid: { color: gridColor },
          },
        },
      },
    };

    chartInstance2.current = new Chart(canvasRef2.current, config);

    return () => {
      if (chartInstance2.current) {
        chartInstance2.current.destroy();
      }
    };
  }, [calculation, isDark, activeTab]);

  // Render Graph 3: Transmit Power vs Theoretical Communication Range
  useEffect(() => {
    if (!calculation || !canvasRef3.current) return;

    if (chartInstance3.current) {
      chartInstance3.current.destroy();
    }

    const { points, currentPowerDbm } = generatePowerVsRangeCurve(calculation);

    const labels = points.map((p) => `${p.powerDbm.toFixed(1)} dBm`);
    const dataValues = points.map((p) => p.rangeKm);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Estimated Range (km)',
            data: dataValues,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.12)',
            fill: true,
            tension: 0.25,
            borderWidth: 2.5,
            pointRadius: 2,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'inherit', size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `Theoretical Range: ${context.parsed.y} km`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `Transmit Power (Pt) [Current: ${currentPowerDbm.toFixed(1)} dBm]`,
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: {
              color: textColor,
              maxTicksLimit: 8,
            },
            grid: { color: gridColor },
          },
          y: {
            title: {
              display: true,
              text: 'Max Theoretical Range (km)',
              color: textColor,
              font: { weight: 'bold' },
            },
            ticks: { color: textColor },
            grid: { color: gridColor },
          },
        },
      },
    };

    chartInstance3.current = new Chart(canvasRef3.current, config);

    return () => {
      if (chartInstance3.current) {
        chartInstance3.current.destroy();
      }
    };
  }, [calculation, isDark, activeTab]);

  // EMPTY STATE: Strictly compliant with Section 2 & 11
  if (!calculation) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <LineChart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          No graph data available.
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Perform a calculation to generate the graph.
        </p>
        {onNavigateToCalculator && (
          <button
            onClick={onNavigateToCalculator}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
          >
            <Zap className="w-4 h-4" />
            Go to Calculator
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      {/* Header & Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Theoretical RF Propagation Graphs
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plotted using current parameters: {calculation.frequencyMHz.toFixed(1)} MHz, {calculation.transmitPowerdBm.toFixed(1)} dBm Pt
            </p>
          </div>

          {/* Graph Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('distance')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'distance'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              1. Distance vs Power
            </button>
            <button
              onClick={() => setActiveTab('frequency')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'frequency'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              2. Frequency vs Range
            </button>
            <button
              onClick={() => setActiveTab('power')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'power'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              3. Power vs Range
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="p-4 sm:p-6">
        <div className="h-72 sm:h-96 w-full relative">
          <div className={activeTab === 'distance' ? 'h-full w-full' : 'hidden'}>
            <canvas ref={canvasRef1} />
          </div>
          <div className={activeTab === 'frequency' ? 'h-full w-full' : 'hidden'}>
            <canvas ref={canvasRef2} />
          </div>
          <div className={activeTab === 'power' ? 'h-full w-full' : 'hidden'}>
            <canvas ref={canvasRef3} />
          </div>
        </div>

        {/* Insight footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
          <div>
            {activeTab === 'distance' && (
              <span>
                <strong>Graph 1 Interpretation:</strong> As distance increases, received power drops logarithmically following the inverse-square law. The red dashed line denotes the receiver sensitivity limit ({calculation.receiverSensitivity} dBm) where communication terminates at <strong>{calculation.estimatedRangeKm.toFixed(3)} km</strong>.
              </span>
            )}
            {activeTab === 'frequency' && (
              <span>
                <strong>Graph 2 Interpretation:</strong> Path loss increases with frequency (FSPL ∝ f²). Therefore, higher frequency carriers (e.g. 5 GHz) achieve shorter line-of-sight range compared to lower frequencies (e.g. 433 MHz) under equal transmitter and antenna parameters.
              </span>
            )}
            {activeTab === 'power' && (
              <span>
                <strong>Graph 3 Interpretation:</strong> Range increases with transmit power (Pt). Every +6 dB increase in transmit power approximately doubles the theoretical line-of-sight communication range in free space.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
