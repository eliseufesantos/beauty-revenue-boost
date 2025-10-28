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

function calculateRADIXScores(answers: Answers) {
  return {
    // R - Recepção
    recepcao: calculateRecepcaoScore(
      answers.attendRate,
      answers.responseTime
    ),

    // A - Automação
    automacao: calculateAutomacaoScore(
      answers.hasFollowUp,
      answers.manualHours
    ),

    // D - Dados
    dados: calculateDadosScore(
      answers.dataManagement
    ),

    // I - Inteligência
    inteligencia: calculateInteligenciaScore(
      answers.conversionRate,
      answers.hasFollowUp
    ),

    // X - eXpansão
    expansao: calculateExpansaoScore(
      answers.returnRate,
      answers.conversionRate
    )
  };
}

// Cálculos individuais

function calculateRecepcaoScore(attendRate: number, responseTime: string) {
  let score = (attendRate / 10) * 10; // base no atendimento

  // Penaliza tempo de resposta ruim
  if (responseTime === '+1day') score -= 4;
  else if (responseTime === '2-5h') score -= 2;
  else if (responseTime === '30min-2h') score -= 1;

  return Math.max(0, Math.min(10, score));
}

function calculateAutomacaoScore(hasFollowUp: string, manualHours: number) {
  let score = 5; // base neutra

  // Follow-up
  if (hasFollowUp === 'yes') score += 3;
  else if (hasFollowUp === 'inconsistent') score += 1;
  else score -= 2;

  // Horas manuais (quanto menos, melhor)
  if (manualHours < 2) score += 2;
  else if (manualHours > 4) score -= 3;

  return Math.max(0, Math.min(10, score));
}

function calculateDadosScore(dataOrg: string) {
  const scores: Record<string, number> = {
    'complete_crm': 9,
    'basic_crm': 6,
    'spreadsheet': 3,
    'whatsapp': 1
  };
  return scores[dataOrg] || 1;
}

function calculateInteligenciaScore(conversionRate: number, hasFollowUp: string) {
  let score = (conversionRate / 10) * 7; // 70% baseado em conversão

  // Follow-up adiciona inteligência
  if (hasFollowUp === 'yes') score += 3;
  else if (hasFollowUp === 'inconsistent') score += 1;

  return Math.max(0, Math.min(10, score));
}

function calculateExpansaoScore(returnRate: string, conversionRate: number) {
  const returnScores: Record<string, number> = {
    '60%+': 7,
    '30-50%': 4,
    '<30%': 2,
    'unknown': 2
  };

  let score = returnScores[returnRate] || 2;

  // Conversão alta = potencial de expansão
  if (conversionRate >= 7) score += 2;
  else if (conversionRate <= 4) score -= 1;

  return Math.max(0, Math.min(10, score));
}

// Mantém função antiga para compatibilidade
function calculateScores(answers: Answers) {
  return calculateRADIXScores(answers);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
