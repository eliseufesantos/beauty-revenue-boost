import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Answers } from '@/lib/calculations';
import eucalyptusLogo from '@/assets/eucalyptus-logo.png';
import { formQuestions, getButtonText } from '@/lib/formConfig';
import { GamifiedProgressBar } from './GamifiedProgressBar';
import { InfoCard, FeedbackType } from './InfoCard';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface Props {
  onComplete: (answers: Partial<Answers>) => void;
  initialAnswers: Partial<Answers>;
}

export function MultiStepForm({ onComplete, initialAnswers }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const { playSound, isMuted, toggleMute } = useSoundEffects();

  const currentQuestion = formQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === formQuestions.length - 1;

  // Check if milestone reached for celebratory sound
  useEffect(() => {
    const percentage = Math.round((currentQuestionIndex / formQuestions.length) * 100);
    if (percentage === 50 || percentage === 100) {
      if (percentage === 50) {
        playSound('milestone');
      } else if (percentage === 100) {
        playSound('completion');
      }
    }
  }, [currentQuestionIndex, playSound]);

  const handleOptionClick = (optionValue: string) => {
    setSelectedAnswer(optionValue);

    // Find the selected option to get feedback type
    const selectedOption = currentQuestion.options.find((opt) => opt.value === optionValue);

    if (selectedOption) {
      // Play sound based on feedback type
      playSound(selectedOption.feedbackType === 'good' ? 'good' : 'neutral');

      // Show info card after selection
      setShowInfoCard(true);

      // Save answer
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionValue,
      }));
    }
  };

  const handleContinue = () => {
    setShowInfoCard(false);
    setSelectedAnswer(null);

    if (isLastQuestion) {
      // Complete the form with all answers
      // Map our answers to the expected Answers format
      const mappedAnswers: Partial<Answers> = {
        // You can map specific answers to the Answers type as needed
        // For now, storing in a generic way
        ...initialAnswers,
        formResponses: userAnswers as any,
      };

      onComplete(mappedAnswers);
    } else {
      // Go to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectedOption = currentQuestion.options.find((opt) => opt.value === selectedAnswer);

  return (
    <section className="min-h-screen bg-background">
      {/* Gamified Progress Bar */}
      <GamifiedProgressBar
        currentStep={currentQuestionIndex}
        totalSteps={formQuestions.length}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Logo Header */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src={eucalyptusLogo}
            alt="Eucalyptus"
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            EUCALYPTUS
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Diagnóstico de Automação para Clínicas de Estética
          </p>
        </div>
      </div>

      {/* Question Area */}
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showInfoCard ? (
              <motion.div
                key={`question-${currentQuestionIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className="w-full p-4 sm:p-5 text-left bg-muted/30 hover:bg-primary/10
                               border-2 border-border hover:border-primary rounded-xl
                               transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                               focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={option.label}
                    >
                      <span className="text-base sm:text-lg md:text-xl font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              selectedOption && (
                <InfoCard
                  key={`info-${currentQuestionIndex}`}
                  type={selectedOption.feedbackType}
                  emoji={selectedOption.emoji}
                  title={selectedOption.title}
                  message={selectedOption.message}
                  nextHint={selectedOption.nextHint}
                  buttonText={getButtonText(currentQuestionIndex, formQuestions.length)}
                  onContinue={handleContinue}
                  isLastQuestion={isLastQuestion}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
