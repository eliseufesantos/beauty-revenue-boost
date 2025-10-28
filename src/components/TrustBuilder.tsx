import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Zap, MapPin } from 'lucide-react';
import fotoEliseu from '@/assets/foto-eliseu.jpg';
import eucalyptusLogo from '@/assets/eucalyptus-logo.svg';

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
        <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-border">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={eucalyptusLogo} alt="Eucalyptus" className="w-10 h-10 sm:w-12 sm:h-12" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">EUCALYPTUS</h2>
          </div>

          <div className="border-b border-t border-border py-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">ANTES DE CONTINUAR...</h2>
            <p className="text-base sm:text-lg font-medium mb-2">Por que você deveria confiar nesse diagnóstico?</p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 mb-8 border border-primary/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-background shadow-xl">
                  <img 
                    src={fotoEliseu} 
                    alt="Eliseu Mendes" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-3 text-sm sm:text-base max-w-lg">
                <p className="font-bold text-xl sm:text-2xl text-primary">Eliseu Mendes</p>
                <p className="text-muted-foreground">Engenheiro de software e fundador da Eucalyptus.</p>
                <p>Criei esse sistema porque EU MESMO sofria com leads esquecidos.</p>
                <p>Hoje uso o MESMO ecossistema para rodar minha consultoria.</p>
                <p className="font-semibold text-primary text-lg">Não é teoria. É o que funciona.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm bg-accent/20 p-3 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span>Mesmo sistema que uso</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm bg-accent/20 p-3 rounded-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span>3 clínicas atendidas</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm bg-accent/20 p-3 rounded-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span>São Paulo, SP</span>
            </div>
          </div>

          <div className="border-t border-b border-border py-4 mb-6">
            <p className="font-semibold mb-3 text-sm sm:text-base">As próximas perguntas vão mapear:</p>
            <ul className="space-y-2 text-sm sm:text-base">
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
            <label htmlFor="consent" className="text-xs sm:text-sm cursor-pointer leading-relaxed">
              Entendo que isso é um diagnóstico real, e vou fornecer informações verdadeiras (mesmo que aproximadas)
            </label>
          </div>

          <Button onClick={onStart} disabled={!checked} size="lg" className="w-full text-sm sm:text-base md:text-lg h-12 sm:h-14">
            COMEÇAR DIAGNÓSTICO COMPLETO
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
