import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface Props {
  onComplete: () => void;
}

const LOADER_DURATION = 6000; // 6 segundos fixos
const MESSAGE_INTERVAL = 1200; // 1.2s cada mensagem

const messages = [
  '🧠 Analisando seus dados...',
  '💡 Processando 8 variáveis...',
  '📊 Comparando com 47 clínicas...',
  '💰 Calculando lucro oculto...',
  '✨ Gerando diagnóstico RADIX...',
];

export function AnalyzingLoader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    console.log('Loader START:', startTime);

    // Progress bar: incrementa linearmente de 0 a 100 em 6 segundos
    // Atualiza a cada 60ms para suavidade (100 updates em 6s)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / LOADER_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 60);

    // Após exatos 6 segundos, completa o loader
    const completeTimer = setTimeout(() => {
      const endTime = Date.now();
      console.log('Loader END:', endTime);
      console.log('Duration:', endTime - startTime, 'ms');
      setProgress(100);
      setTimeout(onComplete, 500);
    }, LOADER_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    // Mensagens trocam a cada 1.2s
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, MESSAGE_INTERVAL);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          <motion.h3
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-bold mb-2"
          >
            {messages[messageIndex]}
          </motion.h3>

          <p className="text-muted-foreground mb-8">Isso levará apenas alguns segundos</p>

          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm font-medium">{Math.round(progress)}%</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
