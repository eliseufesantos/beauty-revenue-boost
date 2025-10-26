import jsPDF from 'jspdf';
import { CalculationResults, formatCurrency } from './calculations';

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
  clinic: string;
}

export function generatePDF(results: CalculationResults, leadData: LeadData): Blob {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(184, 115, 83); // terracotta
  doc.text('Diagnóstico de Vazamentos', 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(89, 93, 91); // dark gray
  doc.text(leadData.clinic, 20, 30);

  // Total Leakage
  doc.setFontSize(16);
  doc.text('Vazamento Total Mensal:', 20, 50);
  doc.setFontSize(24);
  doc.setTextColor(184, 115, 83);
  doc.text(formatCurrency(results.total), 20, 60);

  // Leakages breakdown
  doc.setFontSize(14);
  doc.setTextColor(89, 93, 91);
  doc.text('Detalhamento:', 20, 80);

  let yPos = 90;
  results.leakages.forEach((leakage) => {
    doc.setFontSize(12);
    doc.text(`${leakage.label}: ${formatCurrency(leakage.value)}`, 30, yPos);
    yPos += 10;
  });

  // Scores
  doc.setFontSize(14);
  doc.text('Pontuações:', 20, yPos + 10);
  yPos += 20;

  const scoreLabels = {
    organization: 'Organização',
    automation: 'Automação',
    conversion: 'Conversão',
    retention: 'Retenção',
    predictability: 'Previsibilidade',
  };

  Object.entries(results.scores).forEach(([key, value]) => {
    doc.setFontSize(11);
    doc.text(`${scoreLabels[key as keyof typeof scoreLabels]}: ${value}/10`, 30, yPos);
    yPos += 8;
  });

  // Payback
  doc.setFontSize(12);
  doc.setTextColor(184, 115, 83);
  doc.text(`Payback estimado: ${results.paybackDays} dias`, 20, yPos + 15);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(141, 131, 124);
  doc.text('Eucalyptus Solutions - eucalyptus.solutions', 20, 280);

  return doc.output('blob');
}
