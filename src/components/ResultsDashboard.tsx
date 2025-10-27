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
import { CalculationResults, formatCurrency } from '@/lib/calculations';
import { AlertCircle, TrendingDown, Clock, Users } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  results: CalculationResults;
}

export function ResultsDashboard({ results }: Props) {
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
      </motion.div>
    </section>
  );
}
