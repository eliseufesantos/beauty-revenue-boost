import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { Answers } from '@/lib/calculations';
import eucalyptusLogo from '@/assets/eucalyptus-logo.png';

interface Props {
  onComplete: (answers: Partial<Answers>) => void;
  initialAnswers: Partial<Answers>;
}

interface Question {
  id: keyof Answers;
  text: string;
  type: 'cards' | 'slider';
  options?: Array<{ value: any; label: string; isGood: boolean }>;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    formatLabel: (value: number) => string;
    getThreshold: () => number; // valor acima do qual é considerado bom
  };
  goodTip: { emoji: string; title: string; text: string };
  badTip: { emoji: string; title: string; text: string };
}

const questions: Question[] = [
  {
    id: 'dataManagement',
    text: 'Como você gerencia os dados dos seus pacientes?',
    type: 'cards',
    options: [
      { value: 'complete_crm', label: '🏆 CRM completo integrado', isGood: true },
      { value: 'basic_crm', label: '💼 Sistema/CRM básico', isGood: true },
      { value: 'spreadsheet', label: '📊 Planilha Excel/Google', isGood: false },
      { value: 'whatsapp', label: '📱 WhatsApp + Caderno/Cabeça', isGood: false },
    ],
    goodTip: {
      emoji: '✅',
      title: 'Ótimo começo!',
      text: 'Vamos transformá-lo em máquina de conversão.',
    },
    badTip: {
      emoji: '⚠️',
      title: 'Aqui está o gap principal.',
      text: '30% dos leads se perdem sem CRM.',
    },
  },
  {
    id: 'hasFollowUp',
    text: 'Você tem um processo de follow-up estruturado?',
    type: 'cards',
    options: [
      { value: 'yes', label: '✅ Sim, tenho um sistema', isGood: true },
      { value: 'inconsistent', label: '⚠️ Sim, mas é inconsistente', isGood: false },
      { value: 'no', label: '❌ Não, respondo só quando o lead volta', isGood: false },
    ],
    goodTip: {
      emoji: '⭐',
      title: 'Processo estruturado é raro!',
      text: 'Vamos automatizar e multiplicar.',
    },
    badTip: {
      emoji: '⚠️',
      title: '80% das vendas = após 5º contato.',
      text: 'Maioria desiste no 2º.',
    },
  },
  {
    id: 'responseTime',
    text: 'Quanto tempo, em média, você demora para responder um novo lead?',
    type: 'cards',
    options: [
      { value: '<5min', label: '🟢 Menos de 5min', isGood: true },
      { value: '30min-2h', label: '🟡 30min a 2h', isGood: false },
      { value: '2-5h', label: '🟠 2-5h', isGood: false },
      { value: '+1day', label: '🔴 +1 dia', isGood: false },
    ],
    goodTip: {
      emoji: '🚀',
      title: 'Velocidade = conversão!',
      text: '<5min = 400% mais chance de fechar.',
    },
    badTip: {
      emoji: '📊',
      title: 'Cada minuto = -10% conversão.',
      text: '2h vs 5min = perder 70% dos leads.',
    },
  },
  {
    id: 'conversionRate',
    text: 'De cada 10 pessoas que AGENDAM, quantas FECHAM?',
    type: 'slider',
    sliderConfig: {
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 3,
      formatLabel: (value) => value === 0 ? 'Não sei' : `${value} de 10`,
      getThreshold: () => 2,
    },
    goodTip: {
      emoji: '💡',
      title: 'Taxa sólida!',
      text: 'Com automação: 40-50% é possível.',
    },
    badTip: {
      emoji: '⚠️',
      title: 'Taxa baixa = vazamento.',
      text: 'Clínicas organizadas fazem 30-40%.',
    },
  },
  {
    id: 'returnRate',
    text: 'Quantos % dos seus pacientes RETORNAM para manutenção?',
    type: 'cards',
    options: [
      { value: '60%+', label: '😊 Mais de 60%', isGood: true },
      { value: '30-50%', label: '😐 30% a 50%', isGood: true },
      { value: '<30%', label: '😢 Menos de 30%', isGood: false },
      { value: 'unknown', label: 'Não sei / Não controlo isso', isGood: false },
    ],
    goodTip: {
      emoji: '✅',
      title: 'Retenção excelente!',
      text: 'Lembretes automáticos escalam isso.',
    },
    badTip: {
      emoji: '🔍',
      title: 'Retorno baixo = receita perdida.',
      text: '60-70% é possível com lembretes.',
    },
  },
  {
    id: 'manualHours',
    text: 'Quantas horas POR DIA você gasta respondendo WhatsApp/Instagram?',
    type: 'slider',
    sliderConfig: {
      min: 0,
      max: 10,
      step: 0.5,
      defaultValue: 3,
      formatLabel: (value) => value === 0 ? 'Não sei' : `${value}h`,
      getThreshold: () => 2,
    },
    goodTip: {
      emoji: '🎯',
      title: 'Operação enxuta!',
      text: 'Ainda dá pra otimizar 50%.',
    },
    badTip: {
      emoji: '⚠️',
      title: '4h/dia = 80h/mês desperdiçadas.',
      text: 'R$ 6-10k jogados fora.',
    },
  },
];

// Audio helper
class AudioHelper {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    }
  }

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  playGoodSound() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  }

  playBadSound() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 400;
    gainNode.gain.value = 0.25;
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  }

  playMilestoneSound() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const frequencies = [523.25, 659.25, 783.99]; // C-E-G chord
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      gainNode.gain.value = 0.35 / frequencies.length;
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled.toString());
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

const getProgressText = (progress: number): string => {
  if (progress <= 12) return 'Vamos começar!';
  if (progress <= 37) return 'Ótimo!';
  if (progress <= 62) return 'Indo bem!';
  if (progress <= 87) return 'Quase lá!';
  if (progress <= 99) return 'Finalizando!';
  return '🎉 Completo!';
};

export function MultiStepForm({ onComplete, initialAnswers }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>(initialAnswers);
  const [showTip, setShowTip] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [isGoodAnswer, setIsGoodAnswer] = useState(false);
  const [audioHelper] = useState(() => new AudioHelper());
  const [soundEnabled, setSoundEnabled] = useState(() => audioHelper.isEnabled());

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const progressText = getProgressText(progress);

  // Sync with initialAnswers if they change (e.g., from QuickCalculator)
  useEffect(() => {
    setAnswers(prev => ({ ...initialAnswers, ...prev }));
  }, [initialAnswers]);

  useEffect(() => {
    // Play milestone sounds at 50% and 100%
    if (progress === 50 || progress === 100) {
      audioHelper.playMilestoneSound();
    }
  }, [progress]);

  const handleOptionClick = (option: any) => {
    const isGood = question.options?.find(opt => opt.value === option.value)?.isGood || false;
    
    setSelectedOption(option.value);
    setIsGoodAnswer(isGood);
    setAnswers(prev => ({ ...prev, [question.id]: option.value }));
    
    // Play sound
    if (isGood) {
      audioHelper.playGoodSound();
    } else {
      audioHelper.playBadSound();
    }
    
    // Show tip after 300ms
    setTimeout(() => {
      setShowTip(true);
    }, 300);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const handleSliderConfirm = () => {
    if (sliderValue === null || !question.sliderConfig) return;
    
    const threshold = question.sliderConfig.getThreshold();
    const isGood = sliderValue >= threshold;
    
    setIsGoodAnswer(isGood);
    setAnswers(prev => ({ ...prev, [question.id]: sliderValue }));
    
    // Play sound
    if (isGood) {
      audioHelper.playGoodSound();
    } else {
      audioHelper.playBadSound();
    }
    
    // Show tip after 300ms
    setTimeout(() => {
      setShowTip(true);
    }, 300);
  };

  const handleNext = () => {
    setShowTip(false);
    setSelectedOption(null);
    setSliderValue(null);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Merge current answers with initialAnswers to preserve QuickCalc values
        const finalAnswers: Partial<Answers> = {
          ...initialAnswers, // Preserve leads and ticket from QuickCalculator
          ...answers, // Override with form answers
          attendRate: 7, // Default value for compatibility
          goals: ['better_conversion'], // Default goal
        };
        onComplete(finalAnswers);
      }
    }, 300);
  };

  const toggleSound = () => {
    const newState = audioHelper.toggle();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen px-4 py-12 flex items-center justify-center" style={{ backgroundColor: '#fdf4e0' }}>
      {/* Progress Bar - Sticky */}
      <div className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none" style={{ backgroundColor: '#fdf4e0', height: '60px', borderBottom: '1px solid #e8dcc8' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <Progress 
              value={progress} 
              className="h-2" 
              style={{ 
                background: '#e8dcc8',
              }} 
            />
          </div>
          <span className="text-sm font-medium" style={{ color: '#595d5b' }}>{Math.round(progress)}%</span>
          <span className="text-sm font-bold hidden sm:inline" style={{ color: '#b87353' }}>{progressText}</span>
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors pointer-events-auto"
            aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" style={{ color: '#595d5b' }} />
            ) : (
              <VolumeX className="w-5 h-5" style={{ color: '#8d837c' }} />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto mt-16">
        {/* Logo + Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={eucalyptusLogo} alt="Eucalyptus" className="w-12 h-12 sm:w-14 sm:h-14" />
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#595d5b' }}>EUCALYPTUS</h2>
          </div>
          <p className="text-sm" style={{ color: '#8d837c' }}>Diagnóstico de Conversão</p>
        </motion.div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 sm:p-8 shadow-lg"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e8dcc8' }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#595d5b' }}>
              {question.text}
            </h3>

            {question.type === 'cards' && question.options && (
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.value;
                  const isDisabled = showTip;
                  const isDimmed = showTip && !isSelected;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      disabled={isDisabled}
                      className={`
                        w-full p-4 text-left rounded-xl text-base sm:text-lg
                        transition-all duration-200 ease-in-out
                        border-2
                        ${isSelected
                          ? 'bg-[#b87353] border-[#b87353] text-white shadow-lg scale-[1.02]'
                          : 'bg-[#fdf4e0] border-[#e8dcc8] text-[#595d5b] hover:border-[#b87353] hover:shadow-md hover:scale-[1.01]'
                        }
                        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}
                        ${isDimmed ? 'opacity-50' : 'opacity-100'}
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {question.type === 'slider' && question.sliderConfig && (
              <div className="space-y-6">
                <div className="px-2">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold" style={{ color: '#b87353' }}>
                      {question.sliderConfig.formatLabel(sliderValue ?? question.sliderConfig.defaultValue)}
                    </span>
                  </div>
                  <div className="py-4">
                    <Slider
                      value={[sliderValue ?? question.sliderConfig.defaultValue]}
                      onValueChange={handleSliderChange}
                      min={question.sliderConfig.min}
                      max={question.sliderConfig.max}
                      step={question.sliderConfig.step}
                      disabled={showTip}
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm" style={{ color: '#8d837c' }}>
                    <span>{question.sliderConfig.formatLabel(question.sliderConfig.min)}</span>
                    <span>{question.sliderConfig.formatLabel(question.sliderConfig.max)}</span>
                  </div>
                </div>
                {!showTip && (
                  <button
                    onClick={handleSliderConfirm}
                    className="
                      w-full py-3 px-8 rounded-lg font-semibold text-white
                      transition-all duration-200 ease-in-out
                      bg-gradient-to-br from-[#b87353] to-[#edd08c]
                      shadow-[0_2px_8px_rgba(184,115,83,0.3)]
                      hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_4px_12px_rgba(184,115,83,0.4)]
                      active:scale-[0.98]
                    "
                  >
                    Confirmar
                  </button>
                )}
              </div>
            )}

            {/* Tip Card - Inline */}
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 rounded-xl p-6 shadow-lg"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #b87353',
                    boxShadow: '0 4px 12px rgba(184, 115, 83, 0.15)',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{isGoodAnswer ? question.goodTip.emoji : question.badTip.emoji}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2" style={{ color: '#595d5b' }}>
                        {isGoodAnswer ? question.goodTip.title : question.badTip.title}
                      </h4>
                      <p className="text-base" style={{ color: '#595d5b' }}>
                        {isGoodAnswer ? question.goodTip.text : question.badTip.text}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="
                      w-full py-3 px-8 rounded-lg font-semibold text-white
                      transition-all duration-200 ease-in-out
                      bg-gradient-to-br from-[#b87353] to-[#edd08c]
                      shadow-[0_2px_8px_rgba(184,115,83,0.3)]
                      hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_4px_12px_rgba(184,115,83,0.4)]
                      active:scale-[0.98]
                    "
                  >
                    {currentQuestion === questions.length - 1 ? 'Ver Diagnóstico Completo 🎯' : 'Entendi, próxima →'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
