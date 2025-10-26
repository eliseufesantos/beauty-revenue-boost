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
    labels: ['Organização', 'Automação', 'Conversão', 'Retenção', 'Previsibilidade'],
    datasets: [
      {
        label: 'Sua Pontuação',
        data: [
          results.scores.organization,
          results.scores.automation,
          results.scores.conversion,
          results.scores.retention,
          results.scores.predictability,
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
        <h2 className="text-4xl font-bold text-center mb-12">Seu Diagnóstico Completo</h2>

        {/* Radar Chart */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Scorecard de Performance</h3>
          <div className="max-w-md mx-auto">
            <Radar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Leakage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {results.leakages.map((leakage, index) => {
            const Icon = leakageIcons[leakage.type];
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
                  <Icon
                    className={`w-6 h-6 ${
                      leakage.type === 'critical'
                        ? 'text-destructive'
                        : leakage.type === 'high'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    }`}
                  />
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      leakage.type === 'critical'
                        ? 'bg-destructive/10 text-destructive'
                        : leakage.type === 'high'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/10 text-muted-foreground'
                    }`}
                  >
                    {leakage.type.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{leakage.label}</h4>
                <p className="text-3xl font-bold text-primary">
                  <CountUp end={leakage.value} duration={2} prefix="R$ " separator="." decimals={0} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">por mês</p>
              </motion.div>
            );
          })}
        </div>

        {/* Total Impact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-xl text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Impacto Total</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Vazamento Mensal Total</p>
              <p className="text-4xl font-bold">
                R$ <CountUp end={results.total} duration={2.5} separator="." decimals={0} />
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Impacto Anual</p>
              <p className="text-4xl font-bold">
                R$ <CountUp end={results.total * 12} duration={2.5} separator="." decimals={0} />
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-90 mb-1">Payback Estimado com Automação</p>
            <p className="text-2xl font-bold">
              <CountUp end={results.paybackDays} duration={2} /> dias
            </p>
            <p className="text-xs opacity-75 mt-2">
              Baseado em investimento médio de R$ 25.000 em sistema de gestão
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
