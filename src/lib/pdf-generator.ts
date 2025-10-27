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
  doc.text('Diagnóstico Método RADIX™', 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(89, 93, 91); // dark gray
  doc.text(leadData.clinic, 20, 30);

  // Total Hidden Profit
  doc.setFontSize(16);
  doc.text('Lucro Oculto Total:', 20, 50);
  doc.setFontSize(24);
  doc.setTextColor(184, 115, 83);
  doc.text(formatCurrency(results.total), 20, 60);
  doc.setFontSize(10);
  doc.setTextColor(89, 93, 91);
  doc.text('por mês em oportunidade não capturada', 20, 68);

  // Opportunity layers
  doc.setFontSize(14);
  doc.setTextColor(89, 93, 91);
  doc.text('Camadas de Lucro Oculto:', 20, 80);

  let yPos = 90;
  results.leakages.forEach((leakage, index) => {
    doc.setFontSize(12);
    doc.text(`Camada ${index + 1} - ${leakage.label}:`, 30, yPos);
    doc.setFontSize(11);
    doc.setTextColor(184, 115, 83);
    doc.text(formatCurrency(leakage.value) + '/mês', 35, yPos + 6);
    doc.setTextColor(89, 93, 91);
    yPos += 14;
  });

  // RADIX Scores
  doc.setFontSize(14);
  doc.text('Score RADIX:', 20, yPos + 10);
  yPos += 20;

  const scoreLabels = {
    recepcao: 'R - Recepção',
    automacao: 'A - Automação',
    dados: 'D - Dados',
    inteligencia: 'I - Inteligência',
    expansao: 'X - eXpansão',
  };

  Object.entries(results.scores).forEach(([key, value]) => {
    doc.setFontSize(11);
    doc.text(`${scoreLabels[key as keyof typeof scoreLabels]}: ${value}/10`, 30, yPos);
    yPos += 8;
  });

  // Overall RADIX score
  const avgScore = (Object.values(results.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1);
  doc.setFontSize(12);
  doc.setTextColor(184, 115, 83);
  doc.text(`Score RADIX Geral: ${avgScore}/10`, 30, yPos + 5);
  yPos += 10;

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(141, 131, 124);
  doc.text('Diagnóstico gerado pelo Método RADIX™', 20, 275);
  doc.text('Eucalyptus Solutions © 2025', 20, 282);

  return doc.output('blob');
}
