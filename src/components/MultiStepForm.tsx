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
    title: string;
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
      title: 'INSIGHT',
      body: (value: number) =>
        `Se você atende apenas ${value} de 10 leads, está perdendo ${((10 - value) / 10) * 100}% da receita potencial.`,
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
      title: 'ATENÇÃO',
      body: 'Leads que recebem resposta em +2h têm 400% menos chance de conversão. Tempo de resposta é o fator #1 de conversão.',
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
      title: 'VAZAMENTO CRÍTICO',
      body: "65% dos leads que 'pensam melhor' NUNCA voltam espontaneamente. Sem follow-up estruturado, você está jogando dinheiro no lixo.",
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
      title: 'CUSTO OCULTO DETECTADO',
      body: (hours: number) =>
        `${hours} horas/dia = ${hours * 30} horas/mês\n\nCom automação: Reduz para 30h/mês\nEconomia: R$ ${((hours * 30 - 30) * 80).toLocaleString('pt-BR')}/mês`,
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
      title: 'COMPARATIVO DE MERCADO',
      body: (value: number) => {
        const percentage = (value / 10) * 100;
        if (percentage >= 70) return 'Você está no TOP! Foco agora é aumentar volume de leads.';
        if (percentage >= 45)
          return 'Você está ACIMA da média, mas tem potencial de crescer 20% apenas otimizando o atendimento.';
        return 'Há muito espaço para melhoria. Com processo estruturado, é possível dobrar sua conversão.';
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
      title: 'VAZAMENTO GIGANTE',
      body: 'O MAIOR lucro vem do LIFETIME VALUE. Paciente que retorna 3x = 4x mais lucrativo. Clínicas top têm 60%+ de retorno.',
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
      title: 'ORGANIZAÇÃO = DINHEIRO',
      body: 'Clínicas com CRM completo têm 3x mais retorno de pacientes e perdem 80% menos leads.',
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

      // Insight visível: 3s (reduzido de 5s)
      setTimeout(() => {
        // Avança diretamente sem mostrar pergunta anterior novamente
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setShowInsight(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          onComplete({ ...answers, [question.id]: value });
        }
      }, 3000);
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
                    <h4 className="text-2xl font-bold">{question.insight.title}</h4>
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
