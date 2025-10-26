export interface QuickCalcInputs {
  leads: number;
  ticket: number;
}

export interface Answers {
  leads: number;
  ticket: number;
  attendRate: number;
  responseTime: '<5min' | '30min-2h' | '2-5h' | '+1day';
  hasFollowUp: 'yes' | 'inconsistent' | 'no';
  manualHours: number;
  conversionRate: number;
  returnRate: '<30%' | '30-50%' | '60%+' | 'unknown';
  dataManagement: 'whatsapp' | 'spreadsheet' | 'basic_crm' | 'complete_crm';
  goals: string[];
}

export interface Leakage {
  type: 'critical' | 'high' | 'medium';
  label: string;
  value: number;
}

export interface CalculationResults {
  leakages: Leakage[];
  total: number;
  paybackDays: number;
  scores: {
    organization: number;
    automation: number;
    conversion: number;
    retention: number;
    predictability: number;
  };
}

export function calculateQuickLeakage(inputs: QuickCalcInputs): number {
  const { leads, ticket } = inputs;
  // Conservative: 30% leads lost
  return leads * 0.3 * ticket * 0.4;
}

export function calculateLeakages(answers: Answers): CalculationResults {
  const { leads, ticket, attendRate, hasFollowUp, manualHours, conversionRate, returnRate } = answers;

  // 1. Leads esquecidos
  const leakage1 = leads * (1 - attendRate / 10) * ticket * 0.4;

  // 2. Follow-up perdido
  const followUpMult = hasFollowUp === 'no' ? 0.35 : hasFollowUp === 'inconsistent' ? 0.2 : 0.05;
  const leakage2 = leads * ticket * followUpMult;

  // 3. Tempo desperdiçado
  const leakage3 = manualHours * 30 * 80 * 0.75;

  // 4. Retorno baixo
  const returnMult =
    returnRate === '<30%' ? 0.15 : returnRate === '30-50%' ? 0.08 : returnRate === '60%+' ? 0.02 : 0.12;
  const clients = leads * (conversionRate / 10) * 0.4;
  const leakage4 = clients * ticket * 1.5 * returnMult;

  const total = leakage1 + leakage2 + leakage3 + leakage4;

  const scores = calculateScores(answers);

  return {
    leakages: [
      { type: 'critical', label: 'Leads esquecidos', value: leakage1 },
      { type: 'high', label: 'Follow-up perdido', value: leakage2 },
      { type: 'medium', label: 'Tempo desperdiçado', value: leakage3 },
      { type: 'medium', label: 'Retorno baixo', value: leakage4 },
    ],
    total,
    paybackDays: Math.round((25000 / total) * 30),
    scores,
  };
}

function calculateScores(answers: Answers) {
  const { attendRate, responseTime, hasFollowUp, manualHours, conversionRate, returnRate, dataManagement } = answers;

  // Organization (0-10)
  let organization = 5;
  if (dataManagement === 'complete_crm') organization = 9;
  else if (dataManagement === 'basic_crm') organization = 7;
  else if (dataManagement === 'spreadsheet') organization = 5;
  else organization = 2;

  // Automation (0-10)
  let automation = 10 - Math.min(manualHours, 8);
  if (responseTime === '<5min') automation += 2;
  if (hasFollowUp === 'yes') automation += 2;
  automation = Math.min(automation, 10);

  // Conversion (0-10)
  const conversion = Math.min((attendRate / 10) * 5 + (conversionRate / 10) * 5, 10);

  // Retention (0-10)
  let retention = 5;
  if (returnRate === '60%+') retention = 9;
  else if (returnRate === '30-50%') retention = 6;
  else if (returnRate === '<30%') retention = 3;
  else retention = 2;

  // Predictability (0-10)
  const predictability = (organization + automation) / 2;

  return {
    organization: Math.round(organization),
    automation: Math.round(automation),
    conversion: Math.round(conversion),
    retention: Math.round(retention),
    predictability: Math.round(predictability),
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
