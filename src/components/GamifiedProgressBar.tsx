import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

interface GamifiedProgressBarProps {
  currentStep: number;
  totalSteps: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GamifiedProgressBar = ({
  currentStep,
  totalSteps,
  isMuted,
  onToggleMute
}: GamifiedProgressBarProps) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  const getProgressText = () => {
    if (percentage === 0) return '🎯 Vamos começar!';
    if (percentage < 50) return `Ótimo! ${percentage}% completo`;
    if (percentage < 90) return `🔥 Quase lá! ${percentage}% completo`;
    if (percentage < 100) return `⭐ Última pergunta! ${percentage}% completo`;
    return '🎉 Diagnóstico completo!';
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Progress Text */}
          <motion.div
            key={percentage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-foreground/80 whitespace-nowrap"
          >
            {getProgressText()}
          </motion.div>

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, #b87353 0%, #edd08c 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1], // cubic-bezier ease-out
              }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Confetti particles on milestone (desktop only) */}
            {(percentage === 50 || percentage === 100) && (
              <motion.div
                className="hidden md:block absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.6 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: i % 2 === 0 ? '#b87353' : '#edd08c',
                      left: `${percentage}%`,
                      top: '50%',
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, -20 - Math.random() * 20],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Percentage Badge */}
          <motion.div
            key={percentage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold text-foreground/70 min-w-[3rem] text-center"
          >
            {percentage}%
          </motion.div>

          {/* Mute/Unmute Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="h-8 w-8 shrink-0"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-foreground/70" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
