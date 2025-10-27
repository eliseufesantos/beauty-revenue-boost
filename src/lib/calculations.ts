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
    recepcao: number;
    automacao: number;
    dados: number;
    inteligencia: number;
    expansao: number;
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
      { type: 'critical', label: 'Recepção não otimizada', value: leakage1 },
      { type: 'high', label: 'Inteligência de conversão', value: leakage2 },
      { type: 'medium', label: 'Automação inexistente', value: leakage3 },
      { type: 'medium', label: 'Expansão limitada', value: leakage4 },
    ],
    total,
    paybackDays: Math.round((25000 / total) * 30),
    scores,
  };
}

function calculateScores(answers: Answers) {
  const { attendRate, responseTime, hasFollowUp, manualHours, conversionRate, returnRate, dataManagement } = answers;

  // R - Recepção (baseado em atendimento + tempo resposta)
  let recepcao = (attendRate / 10) * 5;
  if (responseTime === '<5min') recepcao += 5;
  else if (responseTime === '30min-2h') recepcao += 3;
  else if (responseTime === '2-5h') recepcao += 2;
  else recepcao += 1;
  recepcao = Math.min(recepcao, 10);

  // A - Automação (baseado em follow-up + horas manuais)
  let automacao = 10 - Math.min(manualHours, 8);
  if (hasFollowUp === 'yes') automacao += 2;
  else if (hasFollowUp === 'inconsistent') automacao += 1;
  automacao = Math.min(automacao, 10);

  // D - Dados (baseado em organização)
  let dados = 5;
  if (dataManagement === 'complete_crm') dados = 9;
  else if (dataManagement === 'basic_crm') dados = 7;
  else if (dataManagement === 'spreadsheet') dados = 5;
  else dados = 2;

  // I - Inteligência (baseado em conversão + follow-up)
  let inteligencia = (conversionRate / 10) * 7;
  if (hasFollowUp === 'yes') inteligencia += 3;
  else if (hasFollowUp === 'inconsistent') inteligencia += 1;
  inteligencia = Math.min(inteligencia, 10);

  // X - eXpansão (baseado em retorno + conversão)
  let expansao = (conversionRate / 10) * 5;
  if (returnRate === '60%+') expansao += 5;
  else if (returnRate === '30-50%') expansao += 3;
  else if (returnRate === '<30%') expansao += 1;
  else expansao += 0;
  expansao = Math.min(expansao, 10);

  return {
    recepcao: Math.round(recepcao),
    automacao: Math.round(automacao),
    dados: Math.round(dados),
    inteligencia: Math.round(inteligencia),
    expansao: Math.round(expansao),
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
