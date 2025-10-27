import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { CalculationResults, formatCurrency, Answers } from '@/lib/calculations';
import { AlertCircle, TrendingDown, Clock, Users, Target } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  results: CalculationResults;
  answers: Answers;
}

interface PillarAnalysis {
  name: string;
  score: number;
  emoji: string;
  problem: string;
  impact: string;
  solution: string;
}

function generatePersonalizedAnalysis(scores: CalculationResults['scores'], answers: Answers): PillarAnalysis[] {
  const pillars = [
    { name: 'Recepção', value: scores.recepcao, key: 'R' as const },
    { name: 'Automação', value: scores.automacao, key: 'A' as const },
    { name: 'Dados', value: scores.dados, key: 'D' as const },
    { name: 'Inteligência', value: scores.inteligencia, key: 'I' as const },
    { name: 'Expansão', value: scores.expansao, key: 'X' as const },
  ];

  const worstThree = pillars.sort((a, b) => a.value - b.value).slice(0, 3);

  return worstThree.map((pillar, idx) => {
    const emoji = idx === 0 ? '🔴' : idx === 1 ? '🟠' : '🟡';

    let analysis: Omit<PillarAnalysis, 'emoji'>;

    switch(pillar.key) {
      case 'R':
        analysis = {
          name: pillar.name,
          score: pillar.value,
          problem: `Você atende apenas ${answers.attendRate} de 10 leads e demora ${answers.responseTime === '<5min' ? 'menos de 5min' : answers.responseTime === '30min-2h' ? '30min a 2h' : answers.responseTime === '2-5h' ? '2 a 5h' : 'mais de 1 dia'} pra responder`,
          impact: `Isso representa ${((10 - answers.attendRate) / 10 * 100).toFixed(0)}% de oportunidades perdidas todo mês`,
          solution: 'Automação de respostas iniciais + triagem inteligente pode dobrar seu atendimento sem aumentar equipe',
        };
        break;

      case 'A':
        analysis = {
          name: pillar.name,
          score: pillar.value,
          problem: `Sua equipe gasta ${answers.manualHours}h/dia em tarefas manuais repetitivas`,
          impact: `Aproximadamente R$ ${(answers.manualHours * 30 * 80).toLocaleString('pt-BR')} por mês desperdiçados em tempo`,
          solution: 'Chatbot + CRM automatizado reduz isso pra 30-50h/mês (economia de 70%+) liberando equipe pra vender',
        };
        break;

      case 'D':
        const orgLevel = answers.dataManagement;
        const orgText = orgLevel === 'whatsapp' ? 'cabeça/WhatsApp' : orgLevel === 'spreadsheet' ? 'planilhas' : orgLevel === 'basic_crm' ? 'sistema básico sem integração' : 'CRM completo';
        analysis = {
          name: pillar.name,
          score: pillar.value,
          problem: `Dados em ${orgText} ${orgLevel !== 'complete_crm' ? '= impossível escalar' : 'mas falta extrair 100% do potencial'}`,
          impact: orgLevel !== 'complete_crm'
            ? 'Você não sabe: procedimento mais rentável, melhor fonte de leads, taxa real de conversão'
            : 'Com dashboards e inteligência de dados, você pode aumentar conversão em 30%+',
          solution: orgLevel !== 'complete_crm'
            ? 'CRM estruturado + dashboards te dá visão 360º da operação e decisões baseadas em dados'
            : 'Integrar automações avançadas e IA pra prever comportamento de pacientes',
        };
        break;

      case 'I':
        analysis = {
          name: pillar.name,
          score: pillar.value,
          problem: `Conversão de ${answers.conversionRate}/10 + follow-up ${answers.hasFollowUp === 'yes' ? 'estruturado' : answers.hasFollowUp === 'inconsistent' ? 'inconsistente' : 'inexistente'}`,
          impact: answers.conversionRate < 7
            ? `Clínicas top convertem 7+/10. Você está perdendo ${((7 - answers.conversionRate) / answers.conversionRate * 100).toFixed(0)}% de receita possível`
            : 'Manter essa conversão alta enquanto escala é o desafio',
          solution: answers.conversionRate < 7
            ? 'Scripts de vendas otimizados + sequência automática de follow-up aumenta conversão em 40%'
            : 'Automação garante que TODO lead receba o melhor processo, sem depender de "dia bom" da equipe',
        };
        break;

      case 'X':
        const returnText = answers.returnRate === '60%+' ? '60%+' : answers.returnRate === '30-50%' ? '30-50%' : answers.returnRate === '<30%' ? 'menos de 30%' : 'desconhecida';
        analysis = {
          name: pillar.name,
          score: pillar.value,
          problem: `Taxa de retorno ${returnText} indica fidelização ${answers.returnRate === '60%+' ? 'excelente' : 'baixa'}`,
          impact: answers.returnRate !== '60%+'
            ? 'Você perde o MAIOR lucro: lifetime value (paciente recorrente = 4x mais rentável que novo)'
            : 'Manter 60%+ enquanto aumenta base de pacientes é crítico pra crescimento sustentável',
          solution: answers.returnRate !== '60%+'
            ? 'Sistema de lembretes automáticos baseado no procedimento aumenta retorno pra 60%+ facilmente'
            : 'Automação de lembretes garante que NENHUM paciente seja esquecido, mesmo com 1000+ pacientes',
        };
        break;
    }

    return { ...analysis, emoji };
  });
}

export function ResultsDashboard({ results, answers }: Props) {
  const personalizedAnalysis = generatePersonalizedAnalysis(results.scores, answers);

  const chartData = {
    labels: ['R - Recepção', 'A - Automação', 'D - Dados', 'I - Inteligência', 'X - eXpansão'],
    datasets: [
      {
        label: 'Score RADIX',
        data: [
          results.scores.recepcao,
          results.scores.automacao,
          results.scores.dados,
          results.scores.inteligencia,
          results.scores.expansao,
        ],
        backgroundColor: 'rgba(184, 115, 83, 0.3)',
        borderColor: 'rgba(184, 115, 83, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(184, 115, 83, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const leakageIcons = {
    critical: AlertCircle,
    high: TrendingDown,
    medium: Clock,
  };

  return (
    <section className="min-h-screen px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Diagnóstico Método RADIX™</h2>

        {/* Radar Chart */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Score RADIX</h3>
          <div className="max-w-md mx-auto">
            <Radar data={chartData} options={chartOptions} />
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-2">Score RADIX Geral</p>
            <p className="text-3xl font-bold text-primary">
              {((results.scores.recepcao + results.scores.automacao + results.scores.dados + results.scores.inteligencia + results.scores.expansao) / 5).toFixed(1)}/10
            </p>
          </div>
        </div>

        {/* Opportunity Layers */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">💰 Camadas de Lucro Oculto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.leakages.map((leakage, index) => {
              const priorityLabel = leakage.type === 'critical' || leakage.type === 'high' 
                ? 'Prioridade Alta' 
                : 'Prioridade Média';
              const emoji = leakage.type === 'critical' ? '🔴' : leakage.type === 'high' ? '🟠' : '🟡';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-card rounded-xl p-6 border-2 ${
                    leakage.type === 'critical'
                      ? 'border-destructive'
                      : leakage.type === 'high'
                        ? 'border-primary'
                        : 'border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{emoji}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        leakage.type === 'critical' || leakage.type === 'high'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/10 text-muted-foreground'
                      }`}
                    >
                      {priorityLabel}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">Camada {index + 1}</h4>
                  <p className="text-sm mb-3 text-muted-foreground">{leakage.label}</p>
                  <p className="text-3xl font-bold text-primary">
                    <CountUp end={leakage.value} duration={2} prefix="R$ " separator="." decimals={0} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">por mês em oportunidade</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Total Impact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-xl text-white"
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-3xl font-bold mb-2">Diagnóstico Método RADIX™ Completo</h3>
            <p className="text-sm opacity-90">
              Identificamos {results.leakages.length} camadas de lucro oculto na sua operação
            </p>
          </div>

          <div className="border-2 border-white/20 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm opacity-90 mb-2">LUCRO OCULTO TOTAL</p>
            <p className="text-5xl font-bold mb-4">
              R$ <CountUp end={results.total} duration={2.5} separator="." decimals={0} />
            </p>
            <p className="text-sm opacity-90 mb-1">por mês</p>
            <div className="border-t border-white/20 my-4"></div>
            <p className="text-sm opacity-90 mb-1">Potencial Anual</p>
            <p className="text-3xl font-bold">
              R$ <CountUp end={results.total * 12} duration={2.5} separator="." decimals={0} />
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-sm mb-2">
              Esse valor está "adormecido" na sua operação.
            </p>
            <p className="text-sm font-semibold">
              Com o Ecossistema Eucalyptus, clientes recuperam 60-80% desse potencial em 90 dias.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-90 mb-1">🎯 Seu maior gargalo está em</p>
            <p className="text-xl font-bold">
              {Object.entries(results.scores).reduce((a, b) => a[1] < b[1] ? a : b)[0].charAt(0).toUpperCase() + Object.entries(results.scores).reduce((a, b) => a[1] < b[1] ? a : b)[0].slice(1)}
            </p>
          </div>
        </motion.div>

        {/* Personalized Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">Análise Personalizada: Seus 3 Maiores Gargalos</h3>
          </div>

          <p className="text-muted-foreground mb-6">
            Baseado nas suas respostas, identificamos os principais pontos de atenção na sua operação:
          </p>

          <div className="space-y-6">
            {personalizedAnalysis.map((analysis, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="border-l-4 border-primary pl-6 py-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{analysis.emoji}</span>
                  <div>
                    <h4 className="text-lg font-bold">
                      {idx + 1}. {analysis.name} <span className="text-muted-foreground text-sm">(Score: {analysis.score}/10)</span>
                    </h4>
                  </div>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div>
                    <p className="font-semibold text-primary mb-1">📊 Situação Atual:</p>
                    <p className="text-muted-foreground">{analysis.problem}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-destructive mb-1">💥 Impacto:</p>
                    <p className="text-muted-foreground">{analysis.impact}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-green-600 mb-1">✅ Solução:</p>
                    <p className="text-muted-foreground">{analysis.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">💡 Próximo passo:</strong> Esses 3 gargalos são seus
              pontos de alavancagem. Resolver o #1 sozinho pode recuperar 40-60% do lucro oculto
              identificado. O Ecossistema Eucalyptus resolve os 3 simultaneamente.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
