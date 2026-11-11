import { jsPDF } from 'jspdf';
import { RFCalculationResult, StoredCalculation } from '../types/rf';
import { generateStepExplanation } from './rfCalculations';

/**
 * Trigger file download from Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a single RF Calculation to CSV format
 */
export function exportCalculationToCSV(calc: RFCalculationResult, userEmail?: string | null) {
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleString();
  const steps = generateStepExplanation(calc);

  const rows: (string | number)[][] = [
    ['RF COMMUNICATION RANGE CALCULATOR - LINK BUDGET REPORT'],
    ['Generated At', dateStr],
    ['Timestamp (ISO)', timestamp],
    ['User Account', userEmail || 'Unauthenticated / Guest Student'],
    ['Simulation Type', 'Theoretical Free Space Path Loss (FSPL)'],
    [],
    ['--- SUMMARY OF RESULTS ---'],
    ['Metric', 'Value', 'Unit', 'Notes'],
    ['Estimated Theoretical Range (km)', calc.estimatedRangeKm.toFixed(3), 'km', 'Maximum line-of-sight propagation distance'],
    ['Estimated Theoretical Range (m)', calc.estimatedRangeMeters.toFixed(1), 'm', 'Converted SI standard'],
    ['Maximum Allowable FSPL', calc.allowableFSPL.toFixed(2), 'dB', 'Pt + Gt + Gr - L - Receiver Sensitivity'],
    ['Wavelength (λ)', calc.wavelengthMeters.toFixed(4), 'm', `c / f (${(calc.wavelengthMeters * 100).toFixed(2)} cm)`],
    ['Link Budget Margin @ 1 km', calc.linkBudgetMarginAt1Km !== undefined ? calc.linkBudgetMarginAt1Km.toFixed(2) : '—', 'dBm', 'Received power at standard reference distance'],
    [],
    ['--- INPUT PARAMETERS ---'],
    ['Parameter', 'Entered Value', 'Entered Unit', 'Standardized (MHz / dBm)'],
    ['Carrier Frequency', calc.originalInput.frequency, calc.originalInput.frequencyUnit, `${calc.frequencyMHz.toFixed(2)} MHz`],
    ['Transmit Power (Pt)', calc.originalInput.transmitPower, calc.originalInput.transmitPowerUnit, `${calc.transmitPowerdBm.toFixed(2)} dBm`],
    ['Transmitter Antenna Gain (Gt)', calc.txAntennaGain, 'dBi', `${calc.txAntennaGain} dBi`],
    ['Receiver Antenna Gain (Gr)', calc.rxAntennaGain, 'dBi', `${calc.rxAntennaGain} dBi`],
    ['Receiver Sensitivity', calc.receiverSensitivity, 'dBm', `${calc.receiverSensitivity} dBm`],
    ['System / Cable Loss (L)', calc.systemLoss, 'dB', `${calc.systemLoss} dB`],
    [],
    ['--- STEP-BY-STEP DERIVATION ---'],
    ['Step #', 'Title', 'Formula', 'Substitution', 'Calculated Result'],
    ...steps.map((s) => [
      s.stepNumber,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.formula.replace(/"/g, '""')}"`,
      `"${s.substitution.replace(/"/g, '""')}"`,
      `"${s.result.replace(/"/g, '""')}"`,
    ]),
    [],
    ['--- DISCLAIMER ---'],
    ['"This calculation provides a theoretical estimate based mainly on free-space propagation. Actual RF range may differ due to obstacles, terrain, antenna orientation, interference, multipath propagation, atmospheric conditions, hardware limitations, and other environmental factors."'],
  ];

  const csvContent = rows
    .map((row) => row.join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `RF_Link_Budget_Calculation_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Export full calculation history table to CSV format
 */
export function exportHistoryToCSV(records: StoredCalculation[], userEmail?: string | null) {
  const headers = [
    'Record_ID',
    'Date_Recorded',
    'Frequency',
    'Frequency_Unit',
    'Transmit_Power',
    'Transmit_Power_Unit',
    'Tx_Gain_dBi',
    'Rx_Gain_dBi',
    'Receiver_Sensitivity_dBm',
    'System_Loss_dB',
    'Allowable_FSPL_dB',
    'Estimated_Range',
    'Range_Unit',
    'Wavelength_m',
  ];

  const dataRows = records.map((r) => [
    r.id,
    `"${r.createdAt.replace(/"/g, '""')}"`,
    r.frequency,
    r.frequencyUnit,
    r.transmitPower,
    r.transmitPowerUnit,
    r.txAntennaGain,
    r.rxAntennaGain,
    r.receiverSensitivity,
    r.systemLoss,
    r.calculatedFSPL.toFixed(2),
    r.estimatedRange.toFixed(3),
    r.rangeUnit,
    r.wavelength.toFixed(4),
  ]);

  const metaRows = [
    ['RF COMMUNICATION RANGE CALCULATOR - USER CALCULATION HISTORY'],
    ['User Email', userEmail || 'Authenticated User'],
    ['Exported At', new Date().toLocaleString()],
    ['Total Records', records.length],
    [],
  ];

  const csvContent = [
    ...metaRows.map((r) => r.join(',')),
    headers.join(','),
    ...dataRows.map((r) => r.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `RF_Calculation_History_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Export calculation as a professional PDF documentation report using jsPDF
 */
export function exportCalculationToPDF(calc: RFCalculationResult, userEmail?: string | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Header Bar with College ECE Branding
  doc.setFillColor(37, 99, 235); // Blue 600
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RF COMMUNICATION RANGE & LINK BUDGET SIMULATION REPORT', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Second-Year Electronics & Communication Engineering (ECE) Coursework Simulation', margin + 6, y + 14);

  y += 28;

  // Meta info box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin + 4, y + 6);
  doc.text(`Student Account: ${userEmail || 'Guest / Local Session'}`, margin + 4, y + 12);
  doc.text(`Theoretical Model: Free Space Path Loss (FSPL) & Friis Propagation`, margin + contentWidth / 2, y + 6);
  doc.text(`Standard Constant: Speed of Light c = 3.0 × 10⁸ m/s`, margin + contentWidth / 2, y + 12);

  y += 24;

  // Section 1: Executive Result Highlight Card
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'FD');

  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ESTIMATED THEORETICAL RF COMMUNICATION RANGE', margin + 6, y + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(`${calc.estimatedRangeKm.toFixed(3)} km`, margin + 6, y + 16);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`(${calc.estimatedRangeMeters.toLocaleString()} meters)`, margin + 45, y + 16);

  // Key metrics row inside highlight card
  doc.setDrawColor(219, 234, 254);
  doc.line(margin + 6, y + 21, margin + contentWidth - 6, y + 21);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(`Allowable FSPL: `, margin + 6, y + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${calc.allowableFSPL.toFixed(2)} dB`, margin + 30, y + 27);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Wavelength (λ): `, margin + 65, y + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${calc.wavelengthMeters.toFixed(4)} m (${(calc.wavelengthMeters * 100).toFixed(2)} cm)`, margin + 92, y + 27);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Link Margin @ 1 km: `, margin + 130, y + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${calc.linkBudgetMarginAt1Km?.toFixed(2)} dBm`, margin + 160, y + 27);

  y += 38;

  // Section 2: Input Simulation Parameters Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Simulation Input Parameters', margin, y);
  y += 5;

  const tableHeaders = ['Parameter Description', 'Symbol', 'Entered Value', 'Internal Standardized'];
  const tableData = [
    ['Carrier Frequency', 'f', `${calc.originalInput.frequency} ${calc.originalInput.frequencyUnit}`, `${calc.frequencyMHz.toFixed(2)} MHz`],
    ['Transmitter Output Power', 'Pt', `${calc.originalInput.transmitPower} ${calc.originalInput.transmitPowerUnit}`, `${calc.transmitPowerdBm.toFixed(2)} dBm`],
    ['Transmitter Antenna Gain', 'Gt', `${calc.txAntennaGain} dBi`, `${calc.txAntennaGain} dBi`],
    ['Receiver Antenna Gain', 'Gr', `${calc.rxAntennaGain} dBi`, `${calc.rxAntennaGain} dBi`],
    ['Receiver Sensitivity Threshold', 'Pr_sens', `${calc.receiverSensitivity} dBm`, `${calc.receiverSensitivity} dBm`],
    ['System / Cable / Connector Loss', 'L', `${calc.systemLoss} dB`, `${calc.systemLoss} dB`],
  ];

  // Draw simple clean parameter table
  const colWidths = [65, 20, 45, 52];
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  let currentX = margin + 3;
  tableHeaders.forEach((th, i) => {
    doc.text(th, currentX, y + 5);
    currentX += colWidths[i];
  });
  y += 7;

  doc.setFont('helvetica', 'normal');
  tableData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);

    currentX = margin + 3;
    row.forEach((cell, i) => {
      if (i === 1) doc.setFont('courier', 'bold');
      else if (i === 3) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');

      doc.setTextColor(30, 41, 59);
      doc.text(cell, currentX, y + 4.5);
      currentX += colWidths[i];
    });
    y += 6;
  });

  y += 6;

  // Section 3: Step-by-Step Derivations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Step-by-Step Mathematical Derivation', margin, y);
  y += 5;

  const steps = generateStepExplanation(calc);

  steps.forEach((step) => {
    // Check if new page is needed
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 15;
    }

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    doc.text(`Step ${step.stepNumber}: ${step.title}`, margin + 3, y + 4.5);

    doc.setTextColor(15, 23, 42);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Formula: ${step.formula}  =>  Result: ${step.result}`, margin + 3, y + 8.5);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.text(step.explanation, margin + 3, y + 12);

    y += 16;
  });

  // Section 4: Engineering Disclaimer & Sign-off
  if (y > pageHeight - 35) {
    doc.addPage();
    y = 15;
  }

  y += 2;
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.text('Project Limitation & Theoretical Propagation Notice:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  const disclaimer = 'This calculator provides a theoretical estimate based mainly on free-space propagation. Actual RF range may differ due to obstacles, terrain, antenna orientation, interference, multipath propagation, atmospheric conditions, hardware limitations, and other environmental factors.';
  doc.text(doc.splitTextToSize(disclaimer, contentWidth - 8), margin + 4, y + 9);

  // Footer on page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `RF Communication Range Calculator | Second-Year ECE Simulation Project | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  const filename = `RF_Link_Budget_Report_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
