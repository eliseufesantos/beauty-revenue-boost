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
  const { leads, ticket, attendRate, hasFollowUp, manualHours, conversionRate, returnRate, dataManagement } = answers;

  // 1. Leads esquecidos (Recepção)
  const leakage1 = leads * (1 - attendRate / 10) * ticket * 0.4;

  // 2. Follow-up perdido (Inteligência)
  const followUpMult = hasFollowUp === 'no' ? 0.35 : hasFollowUp === 'inconsistent' ? 0.2 : 0.05;
  const leakage2 = leads * ticket * followUpMult;

  // 3. Tempo desperdiçado (Automação)
  const leakage3 = manualHours * 30 * 80 * 0.75;

  // 4. Retorno baixo (Expansão)
  const returnMult =
    returnRate === '<30%' ? 0.15 : returnRate === '30-50%' ? 0.08 : returnRate === '60%+' ? 0.02 : 0.12;
  const clients = leads * (conversionRate / 10) * 0.4;
  const leakage4 = clients * ticket * 1.5 * returnMult;

  // 5. Dados desorganizados
  const dataMult =
    dataManagement === 'whatsapp' ? 0.12 :
    dataManagement === 'spreadsheet' ? 0.08 :
    dataManagement === 'basic_crm' ? 0.04 : 0.01;
  const leakage5 = leads * ticket * dataMult;

  const scores = calculateScores(answers);

  // Calcula TODAS as camadas possíveis com scores
  const allLeakages = [
    {
      camada: 'Recepção não otimizada',
      valor: leakage1,
      score: scores.recepcao,
      prioridade: leakage1 > leads * ticket * 0.15 ? 'critical' : leakage1 > leads * ticket * 0.08 ? 'high' : 'medium',
    },
    {
      camada: 'Inteligência de conversão',
      valor: leakage2,
      score: scores.inteligencia,
      prioridade: leakage2 > leads * ticket * 0.2 ? 'critical' : leakage2 > leads * ticket * 0.1 ? 'high' : 'medium',
    },
    {
      camada: 'Automação inexistente',
      valor: leakage3,
      score: scores.automacao,
      prioridade: leakage3 > 5000 ? 'high' : 'medium',
    },
    {
      camada: 'Expansão limitada',
      valor: leakage4,
      score: scores.expansao,
      prioridade: leakage4 > leads * ticket * 0.1 ? 'high' : 'medium',
    },
    {
      camada: 'Dados desorganizados',
      valor: leakage5,
      score: scores.dados,
      prioridade: leakage5 > leads * ticket * 0.08 ? 'high' : 'medium',
    },
  ];

  // Ordena por VALOR (maior primeiro) e pega TOP 4
  const sortedLeakages = allLeakages
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 4)
    .map((leak) => ({
      type: leak.prioridade as 'critical' | 'high' | 'medium',
      label: leak.camada,
      value: Math.round(leak.valor),
    }));

  const total = leakage1 + leakage2 + leakage3 + leakage4 + leakage5;

  return {
    leakages: sortedLeakages,
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
