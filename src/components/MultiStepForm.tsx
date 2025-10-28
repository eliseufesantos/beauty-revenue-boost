import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, AlertTriangle, DollarSign, Clock, TrendingUp, Award } from 'lucide-react';
import { Answers } from '@/lib/calculations';

interface Props {
  onComplete: (answers: Partial<Answers>) => void;
  initialAnswers: Partial<Answers>;
}

interface Question {
  id: keyof Answers;
  text: string;
  helper?: string;
  type: 'slider' | 'cards';
  options?: Array<{ value: any; label: string; emoji?: string }>;
  min?: number;
  max?: number;
  insight: {
    icon: any;
    title: string | ((value: any) => string);
    body: string | ((value: any) => string);
  };
}

const questions: Question[] = [
  {
    id: 'attendRate',
    text: 'De cada 10 pessoas que demonstram interesse, quantas você consegue REALMENTE atender?',
    helper: '💡 Se não sabe o número exato, dê uma estimativa aproximada.',
    type: 'slider',
    min: 0,
    max: 10,
    insight: {
      icon: Lightbulb,
      title: (value: number) => {
        if (value >= 9) return 'EXCELENTE!';
        if (value >= 7) return 'BOM RESULTADO';
        if (value >= 5) return 'ATENÇÃO';
        return 'CRÍTICO';
      },
      body: (value: number) => {
        if (value >= 9) {
          return `Atender ${value} de 10 leads é resultado TOP. Seu desafio agora é manter essa qualidade enquanto aumenta o volume.`;
        } else if (value >= 7) {
          return `${value} de 10 é acima da média. Com pequenos ajustes no tempo de resposta, você pode chegar a 9-10.`;
        } else if (value >= 5) {
          return `${value} de 10 significa que você perde ${10-value} leads. Isso representa ${((10-value)/10*100).toFixed(0)}% de oportunidades não capturadas.`;
        } else {
          return `Atender apenas ${value} de 10 leads = perder ${10-value} oportunidades. Você está deixando mais de 50% da receita potencial na mesa.`;
        }
      },
    },
  },
  {
    id: 'responseTime',
    text: 'Quanto tempo, em média, você demora para responder um novo lead no WhatsApp?',
    type: 'cards',
    options: [
      { value: '<5min', label: 'Menos de 5min', emoji: '🟢' },
      { value: '30min-2h', label: '30min a 2h', emoji: '🟡' },
      { value: '2-5h', label: '2-5h', emoji: '🟠' },
      { value: '+1day', label: '+1 dia', emoji: '🔴' },
    ],
    insight: {
      icon: AlertTriangle,
      title: (value: string) => {
        if (value === '<5min') return 'EXCELENTE!';
        if (value === '30min-2h') return 'BOM, MAS PODE MELHORAR';
        if (value === '2-5h') return 'ATENÇÃO';
        return 'CRÍTICO';
      },
      body: (value: string) => {
        if (value === '<5min') {
          return 'Parabéns! Responder em menos de 5 minutos coloca você no TOP 5% das clínicas. Esse é o diferencial que aumenta conversão em até 300%.';
        } else if (value === '30min-2h') {
          return 'Você está na média do mercado. Mas sabia que reduzir para <5min pode TRIPLICAR sua taxa de conversão? Automação resolve isso.';
        } else if (value === '2-5h') {
          return 'ALERTA: Leads que esperam mais de 2h têm 400% menos chance de fechar. A cada hora de atraso, você perde dinheiro.';
        } else {
          return 'CRÍTICO: Responder após 1 dia = praticamente ZERO conversão. O lead já foi pro concorrente. Isso é dinheiro jogado fora todo dia.';
        }
      },
    },
  },
  {
    id: 'hasFollowUp',
    text: 'Você tem um processo de follow-up estruturado?',
    helper: '(Ex: lembrar o lead após 24h, 3 dias, 1 semana...)',
    type: 'cards',
    options: [
      { value: 'yes', label: '✅ Sim, tenho um sistema (manual ou automático)' },
      { value: 'inconsistent', label: '⚠️ Sim, mas é inconsistente' },
      { value: 'no', label: '❌ Não, respondo só quando o lead volta' },
    ],
    insight: {
      icon: DollarSign,
      title: (value: string) => {
        if (value === 'yes') return 'PARABÉNS!';
        if (value === 'inconsistent') return 'POTENCIAL IDENTIFICADO';
        return 'VAZAMENTO CRÍTICO';
      },
      body: (value: string) => {
        if (value === 'yes') {
          return 'Excelente! Ter follow-up estruturado coloca você à frente de 80% das clínicas. Agora foque em otimizar os intervalos e personalizar as mensagens.';
        } else if (value === 'inconsistent') {
          return 'Você está no caminho certo, mas inconsistência = dinheiro perdido. Automatizar o follow-up pode aumentar suas conversões em 40-60%.';
        } else {
          return "CRÍTICO: 65% dos leads que 'pensam melhor' NUNCA voltam sozinhos. Sem follow-up, você joga R$ milhares no lixo TODO MÊS.";
        }
      },
    },
  },
  {
    id: 'manualHours',
    text: 'Quantas horas POR DIA você ou sua equipe gastam respondendo WhatsApp/Instagram?',
    helper: '💡 Multiplique por quantas pessoas fazem isso. Ex: 2 pessoas x 4h = 8h/dia total',
    type: 'slider',
    min: 0,
    max: 8,
    insight: {
      icon: Clock,
      title: (hours: number) => {
        if (hours <= 1) return 'ÓTIMO!';
        if (hours <= 2) return 'BOM CONTROLE';
        if (hours <= 4) return 'ATENÇÃO';
        return 'CUSTO OCULTO CRÍTICO';
      },
      body: (hours: number) => {
        const monthlyHours = hours * 30;
        const savedHours = Math.max(monthlyHours - 30, 0);
        const savings = savedHours * 80;

        if (hours <= 1) {
          return `${hours}h/dia é excelente! Você já tem um processo eficiente. Automação pode reduzir ainda mais e liberar sua equipe para vendas e atendimento premium.`;
        } else if (hours <= 2) {
          return `${hours}h/dia = ${monthlyHours}h/mês. Está controlado, mas com automação você pode reduzir para ~30h/mês e economizar R$ ${savings.toLocaleString('pt-BR')}/mês.`;
        } else if (hours <= 4) {
          return `ATENÇÃO: ${hours}h/dia = ${monthlyHours}h/mês em tarefas repetitivas. Com automação, reduz para 30h/mês. Economia: R$ ${savings.toLocaleString('pt-BR')}/mês que podem ir pra crescimento.`;
        } else {
          return `CRÍTICO: ${hours}h/dia = ${monthlyHours}h/mês praticamente PERDIDAS. Isso é salário inteiro indo embora. Automação reduz pra 30h/mês = R$ ${savings.toLocaleString('pt-BR')}/mês economizados.`;
        }
      },
    },
  },
  {
    id: 'conversionRate',
    text: 'De cada 10 pessoas que AGENDAM avaliação, quantas FECHAM o procedimento?',
    helper: '💡 Não precisa ser exato. Dê um "chute educado".',
    type: 'slider',
    min: 0,
    max: 10,
    insight: {
      icon: TrendingUp,
      title: (value: number) => {
        const percentage = (value / 10) * 100;
        if (percentage >= 70) return 'EXCELENTE!';
        if (percentage >= 50) return 'ACIMA DA MÉDIA';
        if (percentage >= 30) return 'POTENCIAL IDENTIFICADO';
        return 'PRECISA MELHORAR';
      },
      body: (value: number) => {
        const percentage = (value / 10) * 100;
        if (percentage >= 70) {
          return `${value} de 10 = ${percentage.toFixed(0)}% de conversão! Você está no TOP 10% das clínicas. Agora foque em aumentar o volume de agendamentos.`;
        } else if (percentage >= 50) {
          return `${value} de 10 = ${percentage.toFixed(0)}% está ACIMA da média (média do setor: 40%). Com pequenos ajustes no processo de vendas, você pode chegar a 70%+.`;
        } else if (percentage >= 30) {
          return `${value} de 10 = ${percentage.toFixed(0)}% está na MÉDIA do mercado. Há muito espaço: otimizando consulta e follow-up pós-avaliação, você pode crescer 50-100%.`;
        } else {
          return `${value} de 10 = ${percentage.toFixed(0)}% está BAIXO. Isso significa problemas no processo de vendas ou qualificação. Com treinamento + processo, é possível DOBRAR ou TRIPLICAR.`;
        }
      },
    },
  },
  {
    id: 'returnRate',
    text: 'Quantos % dos seus pacientes RETORNAM para manutenção ou novos procedimentos?',
    helper: '(Ex: Botox recomendado a cada 4-6 meses)',
    type: 'cards',
    options: [
      { value: '<30%', label: 'Menos de 30%', emoji: '😢' },
      { value: '30-50%', label: '30% a 50%', emoji: '😐' },
      { value: '60%+', label: 'Mais de 60%', emoji: '😊' },
      { value: 'unknown', label: 'Não sei / Não controlo isso' },
    ],
    insight: {
      icon: Award,
      title: (value: string) => {
        if (value === '60%+') return 'PARABÉNS!';
        if (value === '30-50%') return 'POTENCIAL IDENTIFICADO';
        if (value === '<30%') return 'OPORTUNIDADE CRÍTICA';
        return 'DADOS AUSENTES';
      },
      body: (value: string) => {
        if (value === '60%+') {
          return 'Taxa de retorno acima de 60% é EXCELENTE! Você está no TOP 10% das clínicas. Continue assim e foque em aumentar o volume de novos pacientes.';
        } else if (value === '30-50%') {
          return 'Sua taxa está na MÉDIA do mercado. Mas com lembretes automáticos e programas de fidelidade, você pode subir pra 60%+ e aumentar receita em ~30% SEM captar mais leads.';
        } else if (value === '<30%') {
          return 'OPORTUNIDADE CRÍTICA: Menos de 30% de retorno significa perder o MAIOR lucro - o lifetime value. Paciente recorrente = 4x mais rentável. Sistema de lembretes pode DOBRAR isso.';
        } else {
          return 'ALERTA: Não controlar retorno é deixar dinheiro na mesa. Clínicas TOP têm 60%+ porque SABEM quando cada paciente deve voltar e enviam lembretes automáticos.';
        }
      },
    },
  },
  {
    id: 'dataManagement',
    text: 'Como você gerencia os dados dos seus pacientes?',
    type: 'cards',
    options: [
      { value: 'whatsapp', label: '📱 WhatsApp + Caderno/Cabeça' },
      { value: 'spreadsheet', label: '📊 Planilha Excel/Google' },
      { value: 'basic_crm', label: '💼 Sistema/CRM básico' },
      { value: 'complete_crm', label: '🏆 CRM completo integrado' },
    ],
    insight: {
      icon: Lightbulb,
      title: (value: string) => {
        if (value === 'complete_crm') return 'PARABÉNS!';
        if (value === 'basic_crm') return 'BOM COMEÇO';
        if (value === 'spreadsheet') return 'ATENÇÃO';
        return 'CRÍTICO';
      },
      body: (value: string) => {
        if (value === 'complete_crm') {
          return 'EXCELENTE! Ter CRM completo integrado coloca você na elite. Agora foque em usar TODOS os recursos: automações, segmentação, análise de dados. Muitas clínicas têm CRM mas usam só 20% do potencial.';
        } else if (value === 'basic_crm') {
          return 'Você está no caminho certo! Sistemas básicos resolvem 70% dos problemas. Mas CRM completo com automação pode TRIPLICAR seu retorno de pacientes e reduzir perda de leads em 80%.';
        } else if (value === 'spreadsheet') {
          return 'ATENÇÃO: Planilhas funcionam no começo, mas são MANUAIS demais. Você perde leads, esquece follow-ups, e não tem visão do funil. CRM adequado pode aumentar receita em 50-100%.';
        } else {
          return 'CRÍTICO: Gerenciar na cabeça/WhatsApp = CAOS inevitável. Você perde dados, esquece pacientes, não sabe onde está cada lead. Isso custa R$ milhares TODO MÊS em oportunidades perdidas.';
        }
      },
    },
  },
  {
    id: 'goals',
    text: 'Qual seu objetivo principal? (pode escolher mais de um)',
    type: 'cards',
    options: [
      { value: 'more_leads', label: 'Aumentar quantidade de leads' },
      { value: 'better_conversion', label: 'Melhorar conversão' },
      { value: 'save_time', label: 'Economizar tempo da equipe' },
      { value: 'more_return', label: 'Aumentar retorno de pacientes' },
      { value: 'predictability', label: 'Ter previsibilidade' },
    ],
    insight: {
      icon: TrendingUp,
      title: 'ENTENDIDO',
      body: 'Vou calibrar os resultados de acordo com seus objetivos.',
    },
  },
];

export function MultiStepForm({ onComplete, initialAnswers }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>(initialAnswers);
  const [showInsight, setShowInsight] = useState(false);
  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setLoading(true);

    // Loading: 1.5s
    setTimeout(() => {
      setLoading(false);
      setShowInsight(true);

      // Insight visível: 5s
      setTimeout(() => {
        setShowInsight(false);
        
        // Pausa antes de scroll: 1s
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            onComplete({ ...answers, [question.id]: value });
          }
        }, 1000);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="min-h-screen px-4 py-12">
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-20">
        <AnimatePresence mode="wait">
          {!showInsight ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-border"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{question.text}</h3>
              {question.helper && <p className="text-xs sm:text-sm text-muted-foreground mb-6">{question.helper}</p>}

              {question.type === 'slider' && (
                <div className="space-y-6">
                  <Slider
                    value={[(answers[question.id] as number) ?? 5]}
                    onValueChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v[0] }))}
                    min={question.min}
                    max={question.max}
                    step={1}
                    className="mb-4"
                  />
                  <p className="text-center text-2xl sm:text-3xl font-bold text-primary">{(answers[question.id] as number) ?? 5}</p>
                  <Button onClick={() => handleAnswer((answers[question.id] as number) ?? 5)} size="lg" className="w-full text-sm sm:text-base">
                    CONTINUAR
                  </Button>
                </div>
              )}

              {question.type === 'cards' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-3 sm:p-4 text-left bg-muted/20 hover:bg-primary/10 border border-border hover:border-primary rounded-xl transition-all"
                    >
                      <span className="text-sm sm:text-base md:text-lg">
                        {option.emoji && <span className="mr-2">{option.emoji}</span>}
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`insight-${currentQuestion}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 rounded-2xl p-8 border-2 border-primary"
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg">Analisando...</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <question.insight.icon className="w-8 h-8 text-primary" />
                    <h4 className="text-2xl font-bold">
                      {typeof question.insight.title === 'function'
                        ? question.insight.title(answers[question.id])
                        : question.insight.title}
                    </h4>
                  </div>
                  <p className="text-lg whitespace-pre-line">
                    {typeof question.insight.body === 'function'
                      ? question.insight.body(answers[question.id])
                      : question.insight.body}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
