import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Zap, MapPin } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function TrustBuilder({ onStart }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <div className="border-b border-t border-border py-4 mb-6">
            <h2 className="text-2xl font-bold text-center mb-4">ANTES DE CONTINUAR...</h2>
            <p className="text-lg font-medium mb-2">Por que você deveria confiar nesse diagnóstico?</p>
          </div>

          <div className="space-y-4 mb-6">
            <p>Sou Eliseu Santos, engenheiro de software e fundador da Eucalyptus.</p>
            <p>Criei esse sistema porque EU MESMO sofria com leads esquecidos.</p>
            <p>Hoje uso o MESMO ecossistema para rodar minha consultoria.</p>
            <p className="font-semibold">Não é teoria. É o que funciona.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm bg-accent/20 p-3 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
              <span>Mesmo sistema que uso</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-accent/20 p-3 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
              <span>3 clínicas atendidas</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-accent/20 p-3 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <span>São Paulo, SP</span>
            </div>
          </div>

          <div className="border-t border-b border-border py-4 mb-6">
            <p className="font-semibold mb-3">As próximas perguntas vão mapear:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Onde você perde dinheiro (e quanto)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Quanto tempo sua equipe desperdiça</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Qual seu potencial de crescimento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Payback do investimento em automação</span>
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 mb-6 p-4 bg-muted/20 rounded-lg">
            <Checkbox id="consent" checked={checked} onCheckedChange={(c) => setChecked(c as boolean)} />
            <label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
              Entendo que isso é um diagnóstico real, e vou fornecer informações verdadeiras (mesmo que aproximadas)
            </label>
          </div>

          <Button onClick={onStart} disabled={!checked} size="lg" className="w-full text-lg h-14">
            COMEÇAR DIAGNÓSTICO COMPLETO
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
