import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { calculateQuickLeakage, formatCurrency } from '@/lib/calculations';
import { AlertTriangle, Lock } from 'lucide-react';

interface Props {
  onCalculate: (leads: number, ticket: number) => void;
  onContinue: () => void;
}

export function QuickCalculator({ onCalculate, onContinue }: Props) {
  const [leads, setLeads] = useState(150);
  const [ticket, setTicket] = useState(2500);
  const [showResult, setShowResult] = useState(false);
  const [leakage, setLeakage] = useState(0);

  const handleCalculate = () => {
    const result = calculateQuickLeakage({ leads, ticket });
    setLeakage(result);
    onCalculate(leads, ticket);
    setShowResult(true);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4 leading-tight">
            Quanto Dinheiro Sua Clínica
            <br />
            Perde Por Mês com Desorganização?
          </h1>

          <p className="text-lg text-muted-foreground text-center mb-12">
            Descubra em 60 segundos os vazamentos invisíveis
            <br />
            que estão corroendo sua margem.
          </p>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl p-8 shadow-lg border border-border"
              >
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantos leads você recebe por mês?
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">(Instagram + WhatsApp + indicações)</p>
                    <Slider
                      value={[leads]}
                      onValueChange={(v) => setLeads(v[0])}
                      min={20}
                      max={500}
                      step={10}
                      className="mb-2"
                    />
                    <p className="text-right text-lg font-semibold text-primary">{leads} leads</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Qual o valor médio que um paciente gasta no primeiro procedimento?
                    </label>
                    <Slider
                      value={[ticket]}
                      onValueChange={(v) => setTicket(v[0])}
                      min={500}
                      max={10000}
                      step={100}
                      className="mb-2"
                    />
                    <p className="text-right text-lg font-semibold text-primary">{formatCurrency(ticket)}</p>
                  </div>

                  <Button onClick={handleCalculate} size="lg" className="w-full text-lg h-14">
                    CALCULAR MEUS VAZAMENTOS
                  </Button>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Seus dados são confidenciais e nunca serão compartilhados.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl p-8 shadow-xl border-2 border-primary"
              >
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">ALERTA DE VAZAMENTO DETECTADO</h2>
                </div>

                <p className="text-lg mb-4">Sua clínica pode estar perdendo:</p>

                <div className="bg-primary/10 rounded-xl p-6 mb-6 text-center">
                  <p className="text-5xl font-bold text-primary">
                    R$ <CountUp end={leakage} duration={2} separator="." />
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">por mês</p>
                </div>

                <p className="text-sm mb-4">Só em leads mal atendidos ou esquecidos.</p>

                <div className="border-t border-b border-border py-4 my-6">
                  <p className="font-semibold mb-3">Esse é um cálculo CONSERVADOR.</p>
                  <p className="text-sm mb-3">
                    Baseado em dados de 47 clínicas que analisamos em SP, 30% dos leads são perdidos por:
                  </p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Demora na resposta (+2h)</li>
                    <li>Falta de follow-up estruturado</li>
                    <li>Esquecimento manual</li>
                  </ul>
                </div>

                <p className="font-semibold mb-3">
                  Mas existem mais 3 vazamentos escondidos que ainda NÃO contamos nesse cálculo:
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✗</span>
                    <span>Follow-up mal executado (mais R$ 15-25k/mês)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✗</span>
                    <span>Pacientes que não retornam (mais R$ 8-15k/mês)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✗</span>
                    <span>Tempo da equipe desperdiçado (mais R$ 6-12k/mês)</span>
                  </li>
                </ul>

                <p className="text-center mb-6 font-medium">
                  Quer ver o número REAL da sua clínica?
                  <br />
                  <span className="text-sm text-muted-foreground">(Leva apenas 2 minutos)</span>
                </p>

                <div className="space-y-3">
                  <Button onClick={onContinue} size="lg" className="w-full text-lg h-14">
                    SIM, QUERO O DIAGNÓSTICO COMPLETO
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Não, vou continuar perdendo dinheiro
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
