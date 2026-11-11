import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { RFCalculationResult, StoredCalculation, RFInputParams } from '../types/rf';
import { calculateRFRange } from '../utils/rfCalculations';

const STORAGE_KEY = 'rf_range_calculations_v1';

interface CalculationStats {
  totalCalculations: number;
  latestRange: string;
  averageRange: string;
  lastCalculationDate: string;
}

interface CalculationContextType {
  calculations: StoredCalculation[];
  stats: CalculationStats;
  loading: boolean;
  activeCalculation: RFCalculationResult | null;
  setActiveCalculation: (calc: RFCalculationResult | null) => void;
  performAndSaveCalculation: (inputs: RFInputParams) => Promise<RFCalculationResult>;
  deleteCalculation: (id: string) => Promise<void>;
  clearAllCalculations: () => Promise<void>;
  selectCalculationForViewing: (calc: StoredCalculation) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export const CalculationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculations, setCalculations] = useState<StoredCalculation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse calculations from localStorage:', err);
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [activeCalculation, setActiveCalculation] = useState<RFCalculationResult | null>(null);

  // Sync to localStorage whenever calculations list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
    } catch (err) {
      console.warn('Failed to persist calculations to localStorage:', err);
    }
  }, [calculations]);

  // Derived real-time statistics (Strictly NO FAKE DATA)
  const stats: CalculationStats = useMemo(() => {
    if (!calculations || calculations.length === 0) {
      return {
        totalCalculations: 0,
        latestRange: '—',
        averageRange: '—',
        lastCalculationDate: '—',
      };
    }

    const total = calculations.length;
    const latest = `${calculations[0].estimatedRange.toFixed(3)} ${calculations[0].rangeUnit}`;
    const sumKm = calculations.reduce((acc, curr) => {
      const val = curr.rangeUnit === 'm' ? curr.estimatedRange / 1000 : curr.estimatedRange;
      return acc + val;
    }, 0);
    const avg = `${(sumKm / total).toFixed(3)} km`;
    const lastDate = calculations[0].createdAt;

    return {
      totalCalculations: total,
      latestRange: latest,
      averageRange: avg,
      lastCalculationDate: lastDate,
    };
  }, [calculations]);

  // Perform RF calculation and persist to calculation records
  const performAndSaveCalculation = async (inputs: RFInputParams): Promise<RFCalculationResult> => {
    setLoading(true);
    try {
      const result = calculateRFRange(inputs);
      setActiveCalculation(result);

      const newRecord: StoredCalculation = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        userId: 'local_user',
        frequency: inputs.frequency,
        frequencyUnit: inputs.frequencyUnit,
        transmitPower: inputs.transmitPower,
        transmitPowerUnit: inputs.transmitPowerUnit,
        txAntennaGain: inputs.txAntennaGain,
        rxAntennaGain: inputs.rxAntennaGain,
        receiverSensitivity: inputs.receiverSensitivity,
        systemLoss: inputs.systemLoss,
        calculatedFSPL: result.allowableFSPL,
        estimatedRange: result.estimatedRangeKm,
        rangeUnit: 'km',
        wavelength: result.wavelengthMeters,
        createdAt: new Date().toLocaleString(),
      };

      setCalculations((prev) => [newRecord, ...prev]);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Delete an individual calculation record
  const deleteCalculation = async (id: string) => {
    setCalculations((prev) => prev.filter((calc) => calc.id !== id));
  };

  // Clear all history
  const clearAllCalculations = async () => {
    setCalculations([]);
    setActiveCalculation(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear storage:', err);
    }
  };

  // Load a historic calculation into active state for viewing formulas/graphs
  const selectCalculationForViewing = (stored: StoredCalculation) => {
    const input: RFInputParams = {
      frequency: stored.frequency,
      frequencyUnit: stored.frequencyUnit,
      transmitPower: stored.transmitPower,
      transmitPowerUnit: stored.transmitPowerUnit,
      txAntennaGain: stored.txAntennaGain,
      rxAntennaGain: stored.rxAntennaGain,
      receiverSensitivity: stored.receiverSensitivity,
      systemLoss: stored.systemLoss,
    };
    const result = calculateRFRange(input);
    setActiveCalculation(result);
  };

  return (
    <CalculationContext.Provider
      value={{
        calculations,
        stats,
        loading,
        activeCalculation,
        setActiveCalculation,
        performAndSaveCalculation,
        deleteCalculation,
        clearAllCalculations,
        selectCalculationForViewing,
      }}
    >
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculations = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculations must be used within a CalculationProvider');
  }
  return context;
};
