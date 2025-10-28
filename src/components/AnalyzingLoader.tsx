import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface Props {
  onComplete: () => void;
}

const messages = [
  '🧠 Analisando seus dados...',
  '💡 Processando 8 variáveis...',
  '📊 Comparando com 47 clínicas...',
  '💰 Calculando vazamentos ocultos...',
  '🎯 Gerando scorecard personalizado...',
];

export function AnalyzingLoader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    console.log('Loader started');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          console.log('Loader finished');
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

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
