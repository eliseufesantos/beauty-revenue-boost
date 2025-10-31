import { FeedbackType } from '../components/InfoCard';

export interface QuestionOption {
  value: string;
  label: string;
  feedbackType: FeedbackType;
  emoji: string;
  title: string;
  message: string;
  nextHint: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export const formQuestions: Question[] = [
  {
    id: 'crm',
    question: 'Você tem algum sistema de CRM?',
    options: [
      {
        value: 'yes_crm',
        label: 'Sim, uso CRM (Kommo, RD, outro)',
        feedbackType: 'good',
        emoji: '✅',
        title: 'Perfeito! Você já deu o primeiro passo.',
        message: 'Vamos ver como transformá-lo em uma máquina de conversão automática.',
        nextHint: 'Próxima: Como você gerencia seus leads...',
      },
      {
        value: 'no_crm_whatsapp',
        label: 'Não, uso WhatsApp/caderno/planilha',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Entendi. Esse é o gap mais comum em clínicas.',
        message: 'Sem CRM, 30-40% dos leads são esquecidos no caminho.',
        nextHint: 'Vamos mapear isso no diagnóstico...',
      },
      {
        value: 'no_structure',
        label: 'Não tenho nada estruturado',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Entendi. Esse é o gap mais comum em clínicas.',
        message: 'Sem CRM, 30-40% dos leads são esquecidos no caminho.',
        nextHint: 'Vamos mapear isso no diagnóstico...',
      },
    ],
  },
  {
    id: 'leads_volume',
    question: 'Quantos leads você recebe por mês?',
    options: [
      {
        value: '100_plus',
        label: '100+',
        feedbackType: 'good',
        emoji: '🎯',
        title: 'Excelente volume! Você já investe em captação.',
        message: 'Agora o desafio é converter esses leads de forma previsível.',
        nextHint: 'Próxima: Taxa de conversão atual...',
      },
      {
        value: '50_100',
        label: '50-100',
        feedbackType: 'good',
        emoji: '🎯',
        title: 'Excelente volume! Você já investe em captação.',
        message: 'Agora o desafio é converter esses leads de forma previsível.',
        nextHint: 'Próxima: Taxa de conversão atual...',
      },
      {
        value: '20_50',
        label: '20-50',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Volume moderado. Vamos focar em converter MAIS dos que você já tem.',
        message: 'Cada lead perdido custa R$ 2-3k em procedimentos.',
        nextHint: 'Seu diagnóstico vai mostrar o potencial escondido...',
      },
      {
        value: 'less_20',
        label: 'Menos de 20',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Volume moderado. Vamos focar em converter MAIS dos que você já tem.',
        message: 'Cada lead perdido custa R$ 2-3k em procedimentos.',
        nextHint: 'Seu diagnóstico vai mostrar o potencial escondido...',
      },
      {
        value: 'dont_know',
        label: 'Não sei ao certo',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Volume moderado. Vamos focar em converter MAIS dos que você já tem.',
        message: 'Cada lead perdido custa R$ 2-3k em procedimentos.',
        nextHint: 'Seu diagnóstico vai mostrar o potencial escondido...',
      },
    ],
  },
  {
    id: 'follow_up',
    question: 'Você tem processo de follow-up estruturado?',
    options: [
      {
        value: 'yes_structured',
        label: 'Sim, minha equipe segue um script/processo',
        feedbackType: 'good',
        emoji: '⭐',
        title: 'Ótimo! Processo estruturado é raro no mercado.',
        message: 'Vamos ver como automatizar isso e multiplicar resultados.',
        nextHint: 'Próxima: Tempo de resposta aos leads...',
      },
      {
        value: 'sometimes',
        label: 'Às vezes, quando dá tempo',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o maior vazamento de receita em clínicas.',
        message: '80% das conversões acontecem após o 5º contato (e a maioria desiste no 2º).',
        nextHint: 'Vamos calcular quanto isso está custando...',
      },
      {
        value: 'no_depends_memory',
        label: 'Não, depende da memória da equipe',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o maior vazamento de receita em clínicas.',
        message: '80% das conversões acontecem após o 5º contato (e a maioria desiste no 2º).',
        nextHint: 'Vamos calcular quanto isso está custando...',
      },
      {
        value: 'what_is_followup',
        label: 'O que é follow-up estruturado?',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o maior vazamento de receita em clínicas.',
        message: '80% das conversões acontecem após o 5º contato (e a maioria desiste no 2º).',
        nextHint: 'Vamos calcular quanto isso está custando...',
      },
    ],
  },
  {
    id: 'response_time',
    question: 'Quanto tempo demora para responder um lead novo?',
    options: [
      {
        value: 'less_5min',
        label: 'Menos de 5 minutos',
        feedbackType: 'good',
        emoji: '🚀',
        title: 'Impressionante! Velocidade é conversão.',
        message: 'Leads respondidos em <5min têm 400% mais chance de fechar.',
        nextHint: 'Próxima: Taxa de conversão atual...',
      },
      {
        value: '30min_2h',
        label: 'De 30min a 2h',
        feedbackType: 'neutral',
        emoji: '📊',
        title: 'Aqui está o problema. A cada minuto de atraso, conversão cai 10%.',
        message: 'Responder em 2h vs 5min = perder 70% das oportunidades.',
        nextHint: 'Vamos ver o impacto financeiro disso...',
      },
      {
        value: 'few_hours',
        label: 'Algumas horas',
        feedbackType: 'neutral',
        emoji: '📊',
        title: 'Aqui está o problema. A cada minuto de atraso, conversão cai 10%.',
        message: 'Responder em 2h vs 5min = perder 70% das oportunidades.',
        nextHint: 'Vamos ver o impacto financeiro disso...',
      },
      {
        value: 'next_day',
        label: 'Depende, às vezes só no dia seguinte',
        feedbackType: 'neutral',
        emoji: '📊',
        title: 'Aqui está o problema. A cada minuto de atraso, conversão cai 10%.',
        message: 'Responder em 2h vs 5min = perder 70% das oportunidades.',
        nextHint: 'Vamos ver o impacto financeiro disso...',
      },
    ],
  },
  {
    id: 'conversion_rate',
    question: 'Qual % dos seus leads viram pacientes pagantes?',
    options: [
      {
        value: '30_plus',
        label: '30% ou mais',
        feedbackType: 'good',
        emoji: '💡',
        title: 'Taxa sólida! Você converte bem manualmente.',
        message: 'Com automação, isso pode chegar a 40-50% (ou mais).',
        nextHint: 'Próxima: Pacientes que retornam...',
      },
      {
        value: '20_30',
        label: 'Entre 20-30%',
        feedbackType: 'good',
        emoji: '💡',
        title: 'Taxa sólida! Você converte bem manualmente.',
        message: 'Com automação, isso pode chegar a 40-50% (ou mais).',
        nextHint: 'Próxima: Pacientes que retornam...',
      },
      {
        value: 'less_20',
        label: 'Menos de 20%',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Taxa baixa indica vazamento em alguma etapa.',
        message: 'Clínicas organizadas convertem 30-40% dos leads qualificados.',
        nextHint: 'Seu diagnóstico vai apontar onde está o gargalo...',
      },
      {
        value: '10_20',
        label: 'Entre 10-20%',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Taxa baixa indica vazamento em alguma etapa.',
        message: 'Clínicas organizadas convertem 30-40% dos leads qualificados.',
        nextHint: 'Seu diagnóstico vai apontar onde está o gargalo...',
      },
      {
        value: 'no_idea',
        label: 'Não faço ideia',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Taxa baixa indica vazamento em alguma etapa.',
        message: 'Clínicas organizadas convertem 30-40% dos leads qualificados.',
        nextHint: 'Seu diagnóstico vai apontar onde está o gargalo...',
      },
    ],
  },
  {
    id: 'return_rate',
    question: 'Quantos % dos pacientes retornam após 6 meses?',
    options: [
      {
        value: '50_plus',
        label: '50% ou mais',
        feedbackType: 'good',
        emoji: '✅',
        title: 'Excelente retenção! Você entrega resultados.',
        message: 'Agora imagine ter isso em escala com lembretes automáticos.',
        nextHint: 'Próxima: Quanto tempo sua equipe gasta com tarefas manuais...',
      },
      {
        value: '30_50',
        label: 'Entre 30-50%',
        feedbackType: 'good',
        emoji: '✅',
        title: 'Excelente retenção! Você entrega resultados.',
        message: 'Agora imagine ter isso em escala com lembretes automáticos.',
        nextHint: 'Próxima: Quanto tempo sua equipe gasta com tarefas manuais...',
      },
      {
        value: 'less_30',
        label: 'Menos de 30%',
        feedbackType: 'neutral',
        emoji: '🔍',
        title: 'Retorno baixo = receita recorrente perdida.',
        message: 'Com lembretes automáticos, clínicas chegam a 60-70% de retorno.',
        nextHint: 'Cada paciente que não volta = R$ 5-10k perdidos...',
      },
      {
        value: '10_30',
        label: 'Entre 10-30%',
        feedbackType: 'neutral',
        emoji: '🔍',
        title: 'Retorno baixo = receita recorrente perdida.',
        message: 'Com lembretes automáticos, clínicas chegam a 60-70% de retorno.',
        nextHint: 'Cada paciente que não volta = R$ 5-10k perdidos...',
      },
      {
        value: 'dont_track',
        label: 'Não controlo isso',
        feedbackType: 'neutral',
        emoji: '🔍',
        title: 'Retorno baixo = receita recorrente perdida.',
        message: 'Com lembretes automáticos, clínicas chegam a 60-70% de retorno.',
        nextHint: 'Cada paciente que não volta = R$ 5-10k perdidos...',
      },
    ],
  },
  {
    id: 'manual_hours',
    question: 'Quanto tempo/dia sua equipe gasta em tarefas manuais repetitivas?',
    options: [
      {
        value: 'less_2h',
        label: 'Menos de 2h/dia',
        feedbackType: 'good',
        emoji: '🎯',
        title: 'Operação enxuta! Mas ainda dá pra otimizar.',
        message: '2h/dia = 40h/mês = R$ 3-5k em custo de equipe desperdiçado.',
        nextHint: 'Última pergunta: Investimento que faz sentido...',
      },
      {
        value: '2_4h',
        label: '2-4h/dia',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o custo oculto da gestão manual.',
        message: '4h/dia = 80h/mês = R$ 6-10k jogados fora + oportunidades perdidas.',
        nextHint: 'Última etapa: Vamos calcular o ROI...',
      },
      {
        value: 'more_4h',
        label: 'Mais de 4h/dia',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o custo oculto da gestão manual.',
        message: '4h/dia = 80h/mês = R$ 6-10k jogados fora + oportunidades perdidas.',
        nextHint: 'Última etapa: Vamos calcular o ROI...',
      },
      {
        value: 'not_sure',
        label: 'Não sei ao certo',
        feedbackType: 'neutral',
        emoji: '⚠️',
        title: 'Esse é o custo oculto da gestão manual.',
        message: '4h/dia = 80h/mês = R$ 6-10k jogados fora + oportunidades perdidas.',
        nextHint: 'Última etapa: Vamos calcular o ROI...',
      },
    ],
  },
  {
    id: 'investment',
    question: 'Qual investimento único faz sentido para resolver isso?',
    options: [
      {
        value: '10_20k',
        label: 'R$ 10-20k',
        feedbackType: 'good',
        emoji: '🎉',
        title: 'Perfeito! Você entende que investir em sistema é ROI.',
        message: 'Baseado nas suas respostas, o payback será em 45-90 dias.',
        nextHint: '',
      },
      {
        value: '20_30k',
        label: 'R$ 20-30k',
        feedbackType: 'good',
        emoji: '🎉',
        title: 'Perfeito! Você entende que investir em sistema é ROI.',
        message: 'Baseado nas suas respostas, o payback será em 45-90 dias.',
        nextHint: '',
      },
      {
        value: '30k_plus',
        label: 'Mais de R$ 30k',
        feedbackType: 'good',
        emoji: '🎉',
        title: 'Perfeito! Você entende que investir em sistema é ROI.',
        message: 'Baseado nas suas respostas, o payback será em 45-90 dias.',
        nextHint: '',
      },
      {
        value: '5_10k',
        label: 'R$ 5-10k',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Entendido. Vamos mostrar os números reais no diagnóstico.',
        message: 'Você vai ver que um sistema próprio sai mais barato que 2 meses de agência.',
        nextHint: '',
      },
      {
        value: 'less_5k',
        label: 'Menos de R$ 5k',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Entendido. Vamos mostrar os números reais no diagnóstico.',
        message: 'Você vai ver que um sistema próprio sai mais barato que 2 meses de agência.',
        nextHint: '',
      },
      {
        value: 'prefer_monthly',
        label: 'Prefiro mensalidade',
        feedbackType: 'neutral',
        emoji: '💭',
        title: 'Entendido. Vamos mostrar os números reais no diagnóstico.',
        message: 'Você vai ver que um sistema próprio sai mais barato que 2 meses de agência.',
        nextHint: '',
      },
    ],
  },
];

// Helper function to get button text based on question index
export const getButtonText = (questionIndex: number, totalQuestions: number): string => {
  if (questionIndex === totalQuestions - 1) {
    return 'Ver meu diagnóstico completo 🎯';
  }
  if (questionIndex < 5) {
    return 'Entendi, próxima pergunta →';
  }
  return 'Beleza, vamos seguir →';
};
