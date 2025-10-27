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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center mb-4 leading-tight px-2">
            Quanto Lucro Oculto Sua Clínica
            <br />
            Deixa na Mesa Todo Mês?
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground text-center mb-12 px-2">
            Diagnóstico RADIX: descubra em 60 segundos
            <br className="hidden sm:block" />
            as oportunidades invisíveis na sua operação.
          </p>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-border"
              >
                <div className="space-y-6 sm:space-y-8">
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
                    <p className="text-right text-base sm:text-lg font-semibold text-primary">{leads} leads</p>
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
                    <p className="text-right text-base sm:text-lg font-semibold text-primary">{formatCurrency(ticket)}</p>
                  </div>

                  <Button onClick={handleCalculate} size="lg" className="w-full text-base sm:text-lg h-12 sm:h-14">
                    DESCOBRIR MEU LUCRO OCULTO
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
                className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-primary"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">💎</div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">LUCRO OCULTO DETECTADO</h2>
                </div>

                <p className="text-base sm:text-lg mb-4">Sua clínica tem aproximadamente:</p>

                <div className="bg-primary/10 rounded-xl p-4 sm:p-6 mb-6 text-center">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                    R$ <CountUp end={leakage} duration={2} separator="." />
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">por mês em receita potencial não capturada</p>
                </div>

                <div className="border-t border-b border-border py-4 my-6">
                  <p className="font-semibold mb-3">Esse cálculo considera apenas leads mal atendidos.</p>
                  <p className="text-sm mb-3">
                    O Diagnóstico RADIX completo identifica 4 outras camadas de oportunidade:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Follow-up não otimizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Pacientes que não retornam</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Processos manuais ineficientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Dados desorganizados</span>
                    </li>
                  </ul>
                </div>

                <p className="text-center mb-6 font-medium text-sm sm:text-base">
                  Quer o diagnóstico completo?
                  <br />
                  <span className="text-sm text-muted-foreground">(Leva apenas 2 minutos)</span>
                </p>

                <div className="space-y-3">
                  <Button onClick={onContinue} size="lg" className="w-full text-sm sm:text-base md:text-lg h-12 sm:h-14">
                    SIM, QUERO O MÉTODO RADIX COMPLETO
                  </Button>
                  <Button variant="outline" size="lg" className="w-full text-sm sm:text-base">
                    Não, prefiro deixar dinheiro na mesa
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
