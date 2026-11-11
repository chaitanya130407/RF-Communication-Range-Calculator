import { RFInputParams, RFCalculationResult, StepExplanation } from '../types/rf';

export const SPEED_OF_LIGHT = 3e8; // m/s

/**
 * Convert Frequency to MHz
 */
export function convertFrequencyToMHz(val: number, unit: 'MHz' | 'GHz'): number {
  return unit === 'GHz' ? val * 1000 : val;
}

/**
 * Convert Frequency to GHz
 */
export function convertFrequencyToGHz(val: number, unit: 'MHz' | 'GHz'): number {
  return unit === 'MHz' ? val / 1000 : val;
}

/**
 * Convert Power from Watts to dBm
 * P(dBm) = 10 * log10(P(mW))
 * P(mW) = P(W) * 1000
 */
export function wattsToDbm(watts: number): number {
  if (watts <= 0) return -Infinity;
  return 10 * Math.log10(watts * 1000);
}

/**
 * Convert Power from dBm to Watts
 * P(mW) = 10^(P(dBm)/10)
 * P(W) = P(mW) / 1000
 */
export function dbmToWatts(dbm: number): number {
  const mw = Math.pow(10, dbm / 10);
  return mw / 1000;
}

/**
 * Convert input power to dBm
 */
export function convertPowerToDbm(val: number, unit: 'dBm' | 'W'): number {
  return unit === 'W' ? wattsToDbm(val) : val;
}

/**
 * Convert power in dBm to W
 */
export function convertPowerToW(dbm: number): number {
  return dbmToWatts(dbm);
}

/**
 * Calculate Wavelength in meters:
 * λ = c / f_Hz
 */
export function calculateWavelength(frequencyMHz: number): number {
  const f_Hz = frequencyMHz * 1e6;
  return SPEED_OF_LIGHT / f_Hz;
}

/**
 * Calculate FSPL (dB) given distance in km and frequency in MHz:
 * FSPL(dB) = 32.44 + 20*log10(f_MHz) + 20*log10(d_km)
 */
export function calculateFSPL(frequencyMHz: number, distanceKm: number): number {
  if (distanceKm <= 0 || frequencyMHz <= 0) return 0;
  return 32.44 + 20 * Math.log10(frequencyMHz) + 20 * Math.log10(distanceKm);
}

/**
 * Calculate Received Power (dBm):
 * Pr = Pt + Gt + Gr - FSPL - L
 */
export function calculateReceivedPower(
  ptDbm: number,
  gtDbi: number,
  grDbi: number,
  lossDb: number,
  fsplDb: number
): number {
  return ptDbm + gtDbi + grDbi - fsplDb - lossDb;
}

/**
 * Main RF Range Calculation
 */
export function calculateRFRange(inputs: RFInputParams): RFCalculationResult {
  const f_MHz = convertFrequencyToMHz(inputs.frequency, inputs.frequencyUnit);
  const pt_dBm = convertPowerToDbm(inputs.transmitPower, inputs.transmitPowerUnit);

  // Maximum Allowable FSPL at threshold (Pr = Receiver Sensitivity)
  // Receiver Sensitivity = Pt + Gt + Gr - FSPL - L
  // FSPL = Pt + Gt + Gr - L - Receiver Sensitivity
  const allowableFSPL = pt_dBm + inputs.txAntennaGain + inputs.rxAntennaGain - inputs.systemLoss - inputs.receiverSensitivity;

  // Maximum Theoretical Distance in km:
  // FSPL = 32.44 + 20*log10(f_MHz) + 20*log10(d_km)
  // 20*log10(d_km) = FSPL - 32.44 - 20*log10(f_MHz)
  // d_km = 10^((FSPL - 32.44 - 20*log10(f_MHz)) / 20)
  const exponent = (allowableFSPL - 32.44 - 20 * Math.log10(f_MHz)) / 20;
  const distanceKm = Math.pow(10, exponent);
  const distanceMeters = distanceKm * 1000;
  const wavelengthMeters = calculateWavelength(f_MHz);

  // Link budget margin at reference 1 km:
  const fsplAt1Km = calculateFSPL(f_MHz, 1.0);
  const prAt1Km = calculateReceivedPower(pt_dBm, inputs.txAntennaGain, inputs.rxAntennaGain, inputs.systemLoss, fsplAt1Km);

  return {
    frequencyMHz: f_MHz,
    transmitPowerdBm: pt_dBm,
    txAntennaGain: inputs.txAntennaGain,
    rxAntennaGain: inputs.rxAntennaGain,
    receiverSensitivity: inputs.receiverSensitivity,
    systemLoss: inputs.systemLoss,
    allowableFSPL: Number(allowableFSPL.toFixed(2)),
    estimatedRangeKm: Number(distanceKm.toFixed(3)),
    estimatedRangeMeters: Number(distanceMeters.toFixed(1)),
    wavelengthMeters: Number(wavelengthMeters.toFixed(4)),
    linkBudgetMarginAt1Km: Number(prAt1Km.toFixed(2)),
    originalInput: inputs,
  };
}

/**
 * Generate Step-by-Step explanation with real values
 */
export function generateStepExplanation(calc: RFCalculationResult): StepExplanation[] {
  const { originalInput, frequencyMHz, transmitPowerdBm, allowableFSPL, estimatedRangeKm, estimatedRangeMeters, wavelengthMeters } = calc;

  return [
    {
      stepNumber: 1,
      title: 'Convert Frequency into MHz',
      formula: originalInput.frequencyUnit === 'GHz' ? 'f_MHz = f_GHz × 1000' : 'f_MHz = f (already in MHz)',
      substitution: originalInput.frequencyUnit === 'GHz' ? `${originalInput.frequency} GHz × 1000` : `${originalInput.frequency} MHz`,
      result: `${frequencyMHz.toFixed(2)} MHz`,
      explanation: 'All standard RF path loss propagation equations require frequency in Megahertz (MHz) for consistent scale.'
    },
    {
      stepNumber: 2,
      title: 'Convert Transmit Power into dBm (if required)',
      formula: originalInput.transmitPowerUnit === 'W' ? 'P(dBm) = 10 × log10(P(W) × 1000)' : 'P(dBm) = P (already in dBm)',
      substitution: originalInput.transmitPowerUnit === 'W' ? `10 × log10(${originalInput.transmitPower} W × 1000)` : `${originalInput.transmitPower} dBm`,
      result: `${transmitPowerdBm.toFixed(2)} dBm`,
      explanation: 'Transmit power must be expressed in decibels relative to 1 milliwatt (dBm) to allow direct algebraic addition with antenna gains and losses.'
    },
    {
      stepNumber: 3,
      title: 'Calculate Maximum Allowable Path Loss (FSPL)',
      formula: 'FSPL_max = Pt + Gt + Gr - L - Receiver Sensitivity',
      substitution: `${transmitPowerdBm.toFixed(2)} + ${calc.txAntennaGain} + ${calc.rxAntennaGain} - ${calc.systemLoss} - (${calc.receiverSensitivity})`,
      result: `${allowableFSPL.toFixed(2)} dB`,
      explanation: 'This determines the total allowable attenuation the signal can experience across free space before its power drops below the receiver detection threshold.'
    },
    {
      stepNumber: 4,
      title: 'Apply the Free Space Path Loss (FSPL) Formula',
      formula: 'FSPL(dB) = 32.44 + 20 × log10(f_MHz) + 20 × log10(d_km)',
      substitution: `${allowableFSPL.toFixed(2)} = 32.44 + 20 × log10(${frequencyMHz.toFixed(2)}) + 20 × log10(d_km)`,
      result: `20 × log10(d_km) = ${(allowableFSPL - 32.44 - 20 * Math.log10(frequencyMHz)).toFixed(2)}`,
      explanation: 'Relates total allowable loss to the RF carrier frequency and separation distance in kilometers.'
    },
    {
      stepNumber: 5,
      title: 'Solve for Maximum Theoretical Distance (d_km)',
      formula: 'd_km = 10^((FSPL - 32.44 - 20 × log10(f_MHz)) / 20)',
      substitution: `10^((${allowableFSPL.toFixed(2)} - 32.44 - ${(20 * Math.log10(frequencyMHz)).toFixed(2)}) / 20)`,
      result: `${estimatedRangeKm.toFixed(3)} km`,
      explanation: 'Applying the inverse logarithmic exponent yields the theoretical maximum line-of-sight distance.'
    },
    {
      stepNumber: 6,
      title: 'Convert Result into Meters and Kilometers',
      formula: 'd_m = d_km × 1000',
      substitution: `${estimatedRangeKm.toFixed(3)} km × 1000`,
      result: `${estimatedRangeMeters.toFixed(1)} m  (${estimatedRangeKm.toFixed(3)} km)`,
      explanation: 'Distance is formatted in both SI standard meters and practical kilometers for wireless planning.'
    },
    {
      stepNumber: 7,
      title: 'Calculate RF Wavelength (λ)',
      formula: 'λ = c / f_Hz = (3 × 10^8 m/s) / (f_MHz × 10^6)',
      substitution: `(3 × 10^8) / (${frequencyMHz.toFixed(2)} × 10^6)`,
      result: `${wavelengthMeters.toFixed(4)} m (${(wavelengthMeters * 100).toFixed(2)} cm)`,
      explanation: 'The physical wavelength dictates antenna sizing, quarter-wave elements, and Fresnel zone radii.'
    }
  ];
}

/**
 * Validate RF Inputs
 */
export function validateRFInputs(inputs: Partial<RFInputParams>): { isValid: boolean; error: string | null } {
  if (inputs.frequency === undefined || inputs.frequency === null || isNaN(inputs.frequency)) {
    return { isValid: false, error: 'Please enter a valid numeric frequency.' };
  }
  if (inputs.frequency <= 0) {
    return { isValid: false, error: 'Please enter a valid frequency greater than zero.' };
  }

  if (inputs.transmitPower === undefined || inputs.transmitPower === null || isNaN(inputs.transmitPower)) {
    return { isValid: false, error: 'Please enter a valid transmit power.' };
  }
  if (inputs.transmitPowerUnit === 'W' && inputs.transmitPower <= 0) {
    return { isValid: false, error: 'Transmit power in Watts must be greater than zero.' };
  }

  if (inputs.txAntennaGain === undefined || isNaN(inputs.txAntennaGain)) {
    return { isValid: false, error: 'Please enter a valid numeric transmitter antenna gain (dBi).' };
  }

  if (inputs.rxAntennaGain === undefined || isNaN(inputs.rxAntennaGain)) {
    return { isValid: false, error: 'Please enter a valid numeric receiver antenna gain (dBi).' };
  }

  if (inputs.receiverSensitivity === undefined || isNaN(inputs.receiverSensitivity)) {
    return { isValid: false, error: 'Please enter a valid numeric receiver sensitivity (dBm).' };
  }

  if (inputs.systemLoss === undefined || isNaN(inputs.systemLoss)) {
    return { isValid: false, error: 'Please enter a valid system/cable loss (dB).' };
  }
  if (inputs.systemLoss < 0) {
    return { isValid: false, error: 'System loss cannot be negative (losses are positive dB values).' };
  }

  return { isValid: true, error: null };
}

/**
 * Generate Graph 1 Data: Distance vs Received Power (Pr vs d)
 */
export function generateDistanceVsPowerCurve(calc: RFCalculationResult) {
  const maxD = Math.max(calc.estimatedRangeKm * 1.15, 0.1);
  const points: { distanceKm: number; receivedPowerDbm: number }[] = [];
  const steps = 30;

  // Start from small distance (e.g. 0.005 km or 5 meters)
  const minD = Math.max(maxD * 0.01, 0.005);
  const logMin = Math.log10(minD);
  const logMax = Math.log10(maxD);

  for (let i = 0; i <= steps; i++) {
    const logVal = logMin + (i / steps) * (logMax - logMin);
    const d = Math.pow(10, logVal);
    const fspl = calculateFSPL(calc.frequencyMHz, d);
    const pr = calculateReceivedPower(
      calc.transmitPowerdBm,
      calc.txAntennaGain,
      calc.rxAntennaGain,
      calc.systemLoss,
      fspl
    );
    points.push({
      distanceKm: Number(d.toFixed(3)),
      receivedPowerDbm: Number(pr.toFixed(2)),
    });
  }

  return {
    points,
    sensitivityThreshold: calc.receiverSensitivity,
    maxDistanceKm: calc.estimatedRangeKm,
  };
}

/**
 * Generate Graph 2 Data: Frequency vs Theoretical Range
 */
export function generateFrequencyVsRangeCurve(calc: RFCalculationResult) {
  const centerF = calc.frequencyMHz;
  // Span from 0.2x to 3x frequency or reasonable RF bands
  const minF = Math.max(centerF * 0.2, 10);
  const maxF = centerF * 2.5;
  const points: { frequencyMHz: number; rangeKm: number }[] = [];
  const steps = 25;

  for (let i = 0; i <= steps; i++) {
    const f = minF + (i / steps) * (maxF - minF);
    // Range at this frequency with same link budget:
    const exponent = (calc.allowableFSPL - 32.44 - 20 * Math.log10(f)) / 20;
    const d = Math.pow(10, exponent);
    points.push({
      frequencyMHz: Number(f.toFixed(1)),
      rangeKm: Number(d.toFixed(3)),
    });
  }

  return {
    points,
    currentFrequencyMHz: calc.frequencyMHz,
    currentRangeKm: calc.estimatedRangeKm,
  };
}

/**
 * Generate Graph 3 Data: Transmit Power vs Theoretical Range
 */
export function generatePowerVsRangeCurve(calc: RFCalculationResult) {
  const currentPt = calc.transmitPowerdBm;
  // Span Pt - 15 dBm to Pt + 15 dBm (capped reasonably)
  const minPt = Math.max(currentPt - 15, -30);
  const maxPt = currentPt + 15;
  const points: { powerDbm: number; powerWatts: number; rangeKm: number }[] = [];
  const steps = 25;

  for (let i = 0; i <= steps; i++) {
    const pt = minPt + (i / steps) * (maxPt - minPt);
    const fspl = pt + calc.txAntennaGain + calc.rxAntennaGain - calc.systemLoss - calc.receiverSensitivity;
    const exponent = (fspl - 32.44 - 20 * Math.log10(calc.frequencyMHz)) / 20;
    const d = Math.pow(10, exponent);
    points.push({
      powerDbm: Number(pt.toFixed(1)),
      powerWatts: Number(dbmToWatts(pt).toFixed(4)),
      rangeKm: Number(d.toFixed(3)),
    });
  }

  return {
    points,
    currentPowerDbm: calc.transmitPowerdBm,
    currentRangeKm: calc.estimatedRangeKm,
  };
}
