export type FrequencyUnit = 'MHz' | 'GHz';
export type PowerUnit = 'dBm' | 'W';
export type RangeUnit = 'km' | 'm';

export interface RFInputParams {
  frequency: number;
  frequencyUnit: FrequencyUnit;
  transmitPower: number;
  transmitPowerUnit: PowerUnit;
  txAntennaGain: number; // dBi
  rxAntennaGain: number; // dBi
  receiverSensitivity: number; // dBm
  systemLoss: number; // dB
}

export interface RFCalculationResult {
  frequencyMHz: number;
  transmitPowerdBm: number;
  txAntennaGain: number;
  rxAntennaGain: number;
  receiverSensitivity: number;
  systemLoss: number;
  allowableFSPL: number; // dB
  estimatedRangeKm: number; // km
  estimatedRangeMeters: number; // m
  wavelengthMeters: number; // m
  linkBudgetMarginAt1Km?: number; // dBm
  originalInput: RFInputParams;
}

export interface StoredCalculation {
  id: string;
  userId: string;
  frequency: number;
  frequencyUnit: FrequencyUnit;
  transmitPower: number;
  transmitPowerUnit: PowerUnit;
  txAntennaGain: number;
  rxAntennaGain: number;
  receiverSensitivity: number;
  systemLoss: number;
  calculatedFSPL: number;
  estimatedRange: number;
  rangeUnit: RangeUnit;
  wavelength: number;
  createdAt: string; // ISO string or formatted timestamp
}

export interface StepExplanation {
  stepNumber: number;
  title: string;
  formula: string;
  substitution: string;
  result: string;
  explanation: string;
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
}
