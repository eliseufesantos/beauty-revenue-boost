import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Lightbulb, AlertTriangle, DollarSign, Clock, TrendingUp, Award, Volume2, VolumeX } from 'lucide-react';
import { Answers } from '@/lib/calculations';
import eucalyptusLogo from '@/assets/eucalyptus-logo.png';

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
    nextHint: string;
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
      title: 'Aqui está o problema',
      body: (value: number) =>
        `Se você atende apenas ${value} de 10 leads, está perdendo ${((10 - value) / 10) * 100}% da receita potencial. Cada lead perdido é dinheiro deixado na mesa.`,
      nextHint: '→ Vamos ver quanto tempo você demora para responder...',
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
      title: 'Aqui está o problema',
      body: 'A cada minuto de atraso, conversão cai 10%. Responder em 2h vs 5min = perder 70% das oportunidades.',
      nextHint: '→ Vamos ver o impacto financeiro disso...',
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
      title: 'Vazamento crítico detectado',
      body: "65% dos leads que 'pensam melhor' NUNCA voltam espontaneamente. Sem follow-up estruturado, você está jogando dinheiro no lixo.",
      nextHint: '→ Vamos calcular quanto tempo você perde...',
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
      title: 'Custo oculto detectado',
      body: (hours: number) =>
        `${hours} horas/dia = ${hours * 30} horas/mês.\n\nCom automação: Reduz para 30h/mês.\nEconomia: R$ ${((hours * 30 - 30) * 80).toLocaleString('pt-BR')}/mês em custos operacionais.`,
      nextHint: '→ Vamos ver sua taxa de conversão...',
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
      title: 'Comparativo de mercado',
      body: (value: number) => {
        const percentage = (value / 10) * 100;
        if (percentage >= 70) return 'Você está no TOP! Foco agora é aumentar volume de leads e manter essa excelência.';
        if (percentage >= 45)
          return 'Você está ACIMA da média, mas tem potencial de crescer 20% apenas otimizando o atendimento pós-agendamento.';
        return 'Há muito espaço para melhoria. Com processo estruturado, é possível dobrar sua conversão em 60-90 dias.';
      },
      nextHint: '→ Vamos ver a retenção de clientes...',
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
      title: 'Vazamento gigante',
      body: 'O MAIOR lucro vem do LIFETIME VALUE. Paciente que retorna 3x = 4x mais lucrativo. Clínicas top têm 60%+ de retorno com follow-up automatizado.',
      nextHint: '→ Vamos ver como você gerencia os dados...',
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
      title: 'Organização = Dinheiro',
      body: 'Clínicas com CRM completo têm 3x mais retorno de pacientes e perdem 80% menos leads. Dados organizados permitem follow-up estratégico.',
      nextHint: '→ Última pergunta: seus objetivos principais...',
    },
  },
  {
    id: 'goals',
    text: 'Qual seu objetivo principal? (escolha o mais importante)',
    type: 'cards',
    options: [
      { value: 'more_leads', label: '📈 Aumentar quantidade de leads' },
      { value: 'better_conversion', label: '💰 Melhorar conversão' },
      { value: 'save_time', label: '⏰ Economizar tempo da equipe' },
      { value: 'more_return', label: '🔄 Aumentar retorno de pacientes' },
      { value: 'predictability', label: '📊 Ter previsibilidade' },
    ],
    insight: {
      icon: TrendingUp,
      title: 'Entendido!',
      body: 'Vou calibrar os resultados de acordo com seus objetivos. Você está prestes a descobrir exatamente onde está perdendo dinheiro.',
      nextHint: '→ Preparando seu diagnóstico personalizado...',
    },
  },
];

// Função para obter texto dinâmico baseado na porcentagem
function getProgressText(percentage: number): string {
  if (percentage <= 12) return 'Vamos começar!';
  if (percentage <= 37) return 'Ótimo! Continuando...';
  if (percentage <= 62) return 'Você está indo bem!';
  if (percentage <= 87) return 'Quase lá! Última etapa...';
  if (percentage <= 99) return 'Finalizando diagnóstico!';
  return '🎉 Completo!';
}

export function MultiStepForm({ onComplete, initialAnswers }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>(initialAnswers);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('soundMuted') === 'true';
  });

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const progressText = getProgressText(progress);

  const playSound = (isComplete = false) => {
    if (isMuted) return;

    const audio = new Audio(
      isComplete
        ? 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hXEwxMoePyw3AkBD2U2fPJdykGKH3M8deMPwsWY7jp7KRRFApGn+PywnEmBTiP1vPOeiwGJHTE8d+PPwsVYbbp7KVTEgxKpOTzxG8lBDqT2PLKdykFKIDN8tmJOQgSZ77s6qBQEgxIpOPyxnIiBzmP1fLMeCsFI3fH8N+RQAkTYLXq66lUFApLpuPzw28kBDyU2fPJeCwGKH7M8dqLPQsVZLrp66ZTEgxJpeTxwm4kBDmR1fPOeiwGJHTE8eCOPgsVYrfq7KVUEQxKo+TzxHAlBTqT2PLKeCkFKIDO8dmKOQgSZb/r66JSEgxIo+Pyx3ElBTmP1/PMeCkFI3fF8OCRP'
        : 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
    );
    audio.volume = isComplete ? 0.35 : 0.3;
    audio.play().catch(() => {});
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('soundMuted', String(newMuted));
  };

  const handleAnswerSelection = (value: any) => {
    setSelectedAnswer(value);
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setShowInsight(true);
    playSound(false);
  };

  const handleNextQuestion = () => {
    setShowInsight(false);
    setSelectedAnswer(null);

    // Tocar som em marcos importantes (50%, 100%)
    const isImportantMilestone = progress >= 50 && currentQuestion === questions.length - 1;
    if (isImportantMilestone) {
      playSound(true);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete({ ...answers, [question.id]: selectedAnswer });
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-primary))]">
      {/* PROGRESS BAR - Sticky Top - 60px */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--bg-primary))] border-b-2 border-[hsl(var(--progress-bg))] shadow-sm">
        <div className="w-full px-6 py-3 flex items-center justify-between gap-4" style={{ height: '60px' }}>
          {/* Logo/Ícone Esquerda */}
          <div className="flex-shrink-0">
            <span className="text-3xl">🎯</span>
          </div>

          {/* Barra de Progresso Centro */}
          <div className="flex-1 max-w-2xl flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(var(--progress-bg))' }}>
              <div
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, hsl(var(--highlight)) 0%, hsl(var(--secondary)) 100%)',
                }}
              />
            </div>
            <span className="text-lg font-bold text-[hsl(var(--text-primary))] whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Texto Dinâmico */}
          <div className="hidden md:block flex-shrink-0">
            <span className="text-sm text-[hsl(var(--accent))]">{progressText}</span>
          </div>

          {/* Botão Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 p-2 hover:bg-[hsl(var(--hover-bg))] rounded-lg transition-colors"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-[hsl(var(--accent))]" />
            ) : (
              <Volume2 className="w-6 h-6 text-[hsl(var(--accent))]" />
            )}
          </button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="pt-20 px-4 py-12">
        {/* LOGO + TÍTULO EUCALYPTUS */}
        <div className="text-center mb-8">
          <img src={eucalyptusLogo} alt="Eucalyptus" className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-wider text-[hsl(var(--text-primary))] mb-2">
            EUCALYPTUS
          </h1>
          <p className="text-base text-[hsl(var(--accent))]">
            Diagnóstico de Automação para Clínicas de Estética
          </p>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div className="max-w-[700px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border-2"
              style={{ borderColor: 'hsl(var(--progress-bg))' }}
            >
              {/* PERGUNTA */}
              <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--text-primary))] mb-2">
                {question.text}
              </h3>
              {question.helper && (
                <p className="text-sm text-[hsl(var(--accent))] mb-6">{question.helper}</p>
              )}

              {/* TIPO SLIDER */}
              {question.type === 'slider' && (
                <div className="space-y-6">
                  <Slider
                    value={[(answers[question.id] as number) ?? 5]}
                    onValueChange={(v) => {
                      setAnswers((prev) => ({ ...prev, [question.id]: v[0] }));
                      setSelectedAnswer(v[0]);
                    }}
                    min={question.min}
                    max={question.max}
                    step={1}
                    className="mb-4"
                  />
                  <p className="text-center text-3xl font-bold" style={{ color: 'hsl(var(--highlight))' }}>
                    {(answers[question.id] as number) ?? 5}
                  </p>
                  <Button
                    onClick={() => handleAnswerSelection((answers[question.id] as number) ?? 5)}
                    size="lg"
                    className="w-full text-base font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--highlight)) 0%, hsl(var(--secondary)) 100%)',
                      color: 'white',
                    }}
                  >
                    CONTINUAR
                  </Button>
                </div>
              )}

              {/* TIPO CARDS (OPÇÕES) */}
              {question.type === 'cards' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswerSelection(option.value)}
                        className="w-full p-4 text-left rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: isSelected ? 'hsl(var(--selected-bg))' : 'white',
                          border: isSelected ? '3px solid hsl(var(--highlight))' : '2px solid hsl(var(--progress-bg))',
                          boxShadow: isSelected ? '0 2px 8px rgba(184, 115, 83, 0.2)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'hsl(var(--highlight))';
                            e.currentTarget.style.backgroundColor = 'hsl(var(--hover-bg))';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'hsl(var(--progress-bg))';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <span className="text-base md:text-lg text-[hsl(var(--text-primary))]">
                          {option.emoji && <span className="mr-2">{option.emoji}</span>}
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CARD INFORMATIVO INLINE */}
              <AnimatePresence>
                {showInsight && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 rounded-xl p-6 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'hsl(var(--highlight))',
                      boxShadow: '0 4px 12px rgba(184, 115, 83, 0.15)',
                    }}
                  >
                    {/* Título com Ícone */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📊</span>
                      <h4 className="text-xl font-bold text-[hsl(var(--text-primary))]">
                        {question.insight.title}
                      </h4>
                    </div>

                    {/* Corpo do Insight */}
                    <p
                      className="text-base leading-relaxed text-[hsl(var(--text-primary))] mb-4 whitespace-pre-line"
                    >
                      {typeof question.insight.body === 'function'
                        ? question.insight.body(selectedAnswer)
                        : question.insight.body}
                    </p>

                    {/* Antecipação da próxima */}
                    <p className="text-sm italic text-[hsl(var(--accent))] mb-6">
                      {question.insight.nextHint}
                    </p>

                    {/* Botão dentro do card */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleNextQuestion}
                        size="lg"
                        className="px-8 py-3 text-base font-semibold rounded-lg transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--highlight)) 0%, hsl(var(--secondary)) 100%)',
                          color: 'white',
                          border: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.filter = 'brightness(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.filter = 'brightness(1)';
                        }}
                      >
                        Entendi, próxima pergunta →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
