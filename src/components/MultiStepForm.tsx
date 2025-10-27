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
  insight: (value: any) => {
    icon: any;
    title: string;
    body: string;
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
    insight: (value: number) => {
      if (value >= 8) {
        return {
          icon: Award,
          title: 'PARABÉNS!',
          body: `Você atende bem! ${value} de 10 leads é um ótimo número. Seu desafio agora é manter essa qualidade enquanto escala o volume. Com automação inteligente, dá pra chegar em 9-10/10 sem perder o toque humano.`,
        };
      }
      if (value >= 5) {
        return {
          icon: AlertTriangle,
          title: 'POTENCIAL IDENTIFICADO',
          body: `Você atende a maioria (${value}/10), mas está deixando ${10 - value} leads sem resposta. Isso representa ${((10 - value) / 10 * 100).toFixed(0)}% de oportunidades perdidas. Com triagem automática, você pode subir pra 8-9/10 facilmente.`,
        };
      }
      return {
        icon: AlertTriangle,
        title: 'ATENÇÃO: VAZAMENTO CRÍTICO',
        body: `Você perde mais da metade dos leads! Atender apenas ${value} de 10 significa que ${((10 - value) / 10 * 100).toFixed(0)}% da sua receita potencial está indo embora. A boa notícia? Isso é fácil de resolver com automação de recepção.`,
      };
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
    insight: (value: string) => {
      if (value === '<5min') {
        return {
          icon: Award,
          title: 'EXCELENTE!',
          body: 'Tempo de resposta rápido (<5min) é o MAIOR diferencial competitivo. Você está à frente de 90% do mercado. Manter isso em escala é o próximo desafio - e automação ajuda nisso.',
        };
      }
      if (value === '30min-2h') {
        return {
          icon: Lightbulb,
          title: 'BOM, MAS PODE MELHORAR',
          body: 'Tempo ok, mas cada minuto conta. Estudos mostram que respostas em <5min têm 400% mais conversão. Com respostas automáticas instantâneas + triagem humana depois, você mantém qualidade E velocidade.',
        };
      }
      if (value === '2-5h') {
        return {
          icon: AlertTriangle,
          title: 'ATENÇÃO: OPORTUNIDADE PERDIDA',
          body: 'Cada hora de atraso reduz drasticamente a chance de conversão. 2-5h é tempo suficiente pro lead esquecer de você OU procurar concorrência. Respostas automáticas podem resolver isso hoje mesmo.',
        };
      }
      return {
        icon: AlertTriangle,
        title: 'VAZAMENTO CRÍTICO DETECTADO',
        body: 'Mais de 1 dia? Seus leads já esfriaram completamente. A taxa de conversão em +24h é 10x menor. Você está perdendo dinheiro por algo que automação resolve em 1 semana.',
      };
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
    insight: (value: string) => {
      if (value === 'yes') {
        return {
          icon: Award,
          title: 'ÓTIMO! VOCÊ ESTÁ À FRENTE',
          body: 'Ter follow-up estruturado coloca você no top 20% das clínicas. O próximo passo? Automatizar esse processo pra garantir que NUNCA falhe, mesmo quando você está ocupado. Consistência = dinheiro.',
        };
      }
      if (value === 'inconsistent') {
        return {
          icon: Lightbulb,
          title: 'QUASE LÁ!',
          body: 'Follow-up existe, mas inconsistência mata resultado. Um lead esquecido = R$ perdido. Automação garante que TODO lead receba follow-up na hora certa, sem depender de memória ou tempo da equipe.',
        };
      }
      return {
        icon: DollarSign,
        title: 'VAZAMENTO CRÍTICO IDENTIFICADO',
        body: "65% dos leads que 'pensam melhor' NUNCA voltam sozinhos. Sem follow-up estruturado, você joga dinheiro no lixo todo dia. Boa notícia? Isso é o mais fácil de resolver com automação.",
      };
    },
  },
  {
    id: 'manualHours',
    text: 'Quantas horas POR DIA você ou sua equipe gastam respondendo WhatsApp/Instagram?',
    helper: '💡 Multiplique por quantas pessoas fazem isso. Ex: 2 pessoas x 4h = 8h/dia total',
    type: 'slider',
    min: 0,
    max: 8,
    insight: (hours: number) => {
      if (hours <= 2) {
        return {
          icon: Award,
          title: 'PARABÉNS! OPERAÇÃO ENXUTA',
          body: `Apenas ${hours}h/dia em atendimento manual é excelente! Sua operação já é eficiente. Com automação estratégica, dá pra manter esse tempo baixo mesmo dobrando o volume de leads.`,
        };
      }
      if (hours <= 4) {
        return {
          icon: Clock,
          title: 'TEMPO RAZOÁVEL, MAS ESCALÁVEL?',
          body: `${hours}h/dia = ${hours * 30}h/mês em tarefas repetitivas. Não é crítico agora, mas se você crescer 2x, vira ${hours * 2}h/dia. Automação permite crescer sem aumentar proporcionalmente a equipe.`,
        };
      }
      return {
        icon: Clock,
        title: 'MUITO TEMPO EM TAREFAS MANUAIS',
        body: `${hours}h/dia = ${hours * 30}h/mês desperdiçados em tarefas repetitivas!\n\nCom automação: Reduz para 30-50h/mês\nEconomia: R$ ${((hours * 30 - 40) * 80).toLocaleString('pt-BR')}/mês\n\nSua equipe poderia focar em VENDER, não em responder "qual o valor?"`,
      };
    },
  },
  {
    id: 'conversionRate',
    text: 'De cada 10 pessoas que AGENDAM avaliação, quantas FECHAM o procedimento?',
    helper: '💡 Não precisa ser exato. Dê um "chute educado".',
    type: 'slider',
    min: 0,
    max: 10,
    insight: (value: number) => {
      if (value >= 7) {
        return {
          icon: Award,
          title: 'CONVERSÃO EXCELENTE!',
          body: `${value}/10 (${(value * 10).toFixed(0)}%) é conversão de elite! Você está no top 10% do mercado. Foco agora é aumentar VOLUME de leads qualificados mantendo essa taxa. Parabéns!`,
        };
      }
      if (value >= 4) {
        return {
          icon: TrendingUp,
          title: 'CONVERSÃO MÉDIA DO MERCADO',
          body: `${value}/10 (${(value * 10).toFixed(0)}%) está na média. Com processo estruturado de vendas + scripts otimizados, clínicas sobem pra 7/10 facilmente. Isso representa +${((7 - value) / value * 100).toFixed(0)}% de receita com os MESMOS leads.`,
        };
      }
      return {
        icon: AlertTriangle,
        title: 'CONVERSÃO BAIXA = OPORTUNIDADE GRANDE',
        body: `${value}/10 (${(value * 10).toFixed(0)}%) indica processo de vendas fraco. A boa notícia? Dobrar pra ${value * 2}/10 é totalmente viável com: scripts de objeções, follow-up estruturado e proposta de valor clara. Foco aqui = ROI altíssimo.`,
      };
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
    insight: (value: string) => {
      if (value === '60%+') {
        return {
          icon: Award,
          title: 'PARABÉNS! FIDELIZAÇÃO DE ELITE',
          body: 'Taxa de 60%+ é EXCELENTE! Você está no top 10% das clínicas. Seu desafio agora é manter essa taxa enquanto escala o volume de pacientes. Lembretes automáticos ajudam nisso.',
        };
      }
      if (value === '30-50%') {
        return {
          icon: TrendingUp,
          title: 'POTENCIAL ENORME IDENTIFICADO',
          body: 'Sua taxa de 30-50% está na MÉDIA do mercado. Com lembretes automáticos baseados no procedimento e follow-up estruturado, dá pra subir pra 60%+ (aumentando receita em ~30% SEM novos leads).',
        };
      }
      if (value === '<30%') {
        return {
          icon: DollarSign,
          title: 'OPORTUNIDADE CRÍTICA: LIFETIME VALUE',
          body: 'Menos de 30% de retorno significa que você perde o MAIOR lucro: o lifetime value. Paciente que retorna 3x = 4x mais lucrativo. Sistema de lembretes pode DOBRAR essa taxa. É ouro na mesa.',
        };
      }
      return {
        icon: AlertTriangle,
        title: 'DADOS AUSENTES = DINHEIRO PERDIDO',
        body: 'Não controlar retorno de pacientes é deixar dinheiro na mesa. Clínicas top têm 60%+ de retorno porque SABEM quando cada paciente deve voltar e enviam lembretes. Sem dados, sem estratégia.',
      };
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
    insight: (value: string) => {
      if (value === 'complete_crm') {
        return {
          icon: Award,
          title: 'ESTRUTURA SÓLIDA!',
          body: 'CRM completo integrado é infraestrutura de clínica profissional. Agora é maximizar o uso: dashboards, automações, inteligência de dados. Você já tem a base, falta extrair 100% do potencial.',
        };
      }
      if (value === 'basic_crm') {
        return {
          icon: Lightbulb,
          title: 'TEM SISTEMA, MAS É SUFICIENTE?',
          body: 'CRM básico é melhor que planilha, mas deixa dinheiro na mesa. Sem integração (WhatsApp, Instagram, automações), você perde agilidade e dados valiosos. Upgrade pro completo = 3x mais retorno de pacientes.',
        };
      }
      if (value === 'spreadsheet') {
        return {
          icon: Clock,
          title: 'PLANILHA É MELHOR QUE NADA, MAS...',
          body: 'Planilha funciona pra 50-100 leads/mês. Depois disso, vira gargalo. Você perde tempo, esquece follow-ups, não tem visão real do negócio. CRM automatizado economiza 10h/semana + aumenta conversão em 40%.',
        };
      }
      return {
        icon: AlertTriangle,
        title: 'DADOS NA CABEÇA = GARGALO FATAL',
        body: 'Impossível escalar sem sistema. Você não sabe: qual procedimento mais rentável, melhor fonte de leads, taxa real de conversão, quando pacientes devem retornar. Dados organizados = decisões inteligentes = mais lucro.',
      };
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
    insight: (value: any) => {
      return {
        icon: TrendingUp,
        title: 'PERFEITO! ENTENDI SEU OBJETIVO',
        body: 'Vou calibrar o diagnóstico RADIX™ de acordo com suas prioridades. Em instantes você verá exatamente onde focar primeiro pra atingir esses objetivos.',
      };
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
                (() => {
                  const insight = question.insight(answers[question.id]);
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <insight.icon className="w-8 h-8 text-primary" />
                        <h4 className="text-2xl font-bold">{insight.title}</h4>
                      </div>
                      <p className="text-lg whitespace-pre-line">{insight.body}</p>
                    </div>
                  );
                })()
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
