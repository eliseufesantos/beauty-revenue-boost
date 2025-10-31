import { motion } from 'framer-motion';
import { Button } from './ui/button';

export type FeedbackType = 'good' | 'neutral';

interface InfoCardProps {
  type: FeedbackType;
  emoji: string;
  title: string;
  message: string;
  nextHint: string;
  buttonText: string;
  onContinue: () => void;
  isLastQuestion?: boolean;
}

export const InfoCard = ({
  type,
  emoji,
  title,
  message,
  nextHint,
  buttonText,
  onContinue,
  isLastQuestion = false,
}: InfoCardProps) => {
  const isGood = type === 'good';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto mt-6"
    >
      <div
        className={`
          rounded-xl p-6 md:p-8 shadow-lg border-2 transition-all
          ${
            isGood
              ? 'bg-emerald-50/50 border-[#edd08c] dark:bg-emerald-950/20'
              : 'bg-orange-50/50 border-[#b87353] dark:bg-orange-950/20'
          }
        `}
      >
        {/* Emoji with animation */}
        <motion.div
          className="text-5xl md:text-6xl mb-4"
          initial={{ scale: 0.8 }}
          animate={
            isGood
              ? {
                  scale: [0.8, 1.1, 1],
                }
              : {
                  x: [0, -5, 5, -5, 5, 0],
                }
          }
          transition={{
            duration: isGood ? 0.6 : 0.4,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.div>

        {/* Title */}
        <h3
          className={`
            text-xl md:text-2xl font-bold mb-3
            ${isGood ? 'text-emerald-900 dark:text-emerald-100' : 'text-orange-900 dark:text-orange-100'}
          `}
        >
          {title}
        </h3>

        {/* Message */}
        <p className="text-base md:text-lg text-foreground/80 mb-4 leading-relaxed">
          {message}
        </p>

        {/* Next hint */}
        {!isLastQuestion && (
          <p className="text-sm text-muted-foreground italic mb-6">
            → {nextHint}
          </p>
        )}

        {/* Action Button */}
        <Button
          onClick={onContinue}
          className={`
            w-full md:w-auto min-w-[240px] h-12 md:h-14 text-base md:text-lg font-semibold
            rounded-lg shadow-md transition-all duration-150
            hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]
            ${
              isLastQuestion
                ? 'bg-gradient-to-r from-[#b87353] to-[#edd08c] hover:shadow-xl'
                : 'bg-gradient-to-r from-[#b87353] to-[#d69778] hover:shadow-lg'
            }
          `}
        >
          {buttonText}
        </Button>
      </div>
    </motion.div>
  );
};
