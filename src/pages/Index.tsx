import { useState, useRef, lazy, Suspense } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateLeakages } from '@/lib/calculations';
import { Answers } from '@/lib/calculations';

// Lazy load de componentes pesados
const QuickCalculator = lazy(() => import('@/components/QuickCalculator').then(m => ({ default: m.QuickCalculator })));
const TrustBuilder = lazy(() => import('@/components/TrustBuilder').then(m => ({ default: m.TrustBuilder })));
const MultiStepForm = lazy(() => import('@/components/MultiStepForm').then(m => ({ default: m.MultiStepForm })));
const AnalyzingLoader = lazy(() => import('@/components/AnalyzingLoader').then(m => ({ default: m.AnalyzingLoader })));
const ResultsDashboard = lazy(() => import('@/components/ResultsDashboard').then(m => ({ default: m.ResultsDashboard })));
const LeadCaptureForm = lazy(() => import('@/components/LeadCaptureForm').then(m => ({ default: m.LeadCaptureForm })));

// Loading spinner component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

type Section = 'quick' | 'trust' | 'form' | 'analyzing' | 'results' | 'lead';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('quick');
  const [results, setResults] = useState<any>(null);
  const { state, updateQuickCalc, giveConsent, updateAnswer } = useAssessment();

  const sectionRefs = {
    quick: useRef<HTMLDivElement>(null),
    trust: useRef<HTMLDivElement>(null),
    form: useRef<HTMLDivElement>(null),
    analyzing: useRef<HTMLDivElement>(null),
    results: useRef<HTMLDivElement>(null),
    lead: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (section: Section) => {
    setTimeout(() => {
      setCurrentSection(section);
      setTimeout(() => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 300);
  };

  const handleQuickCalc = (leads: number, ticket: number) => {
    updateQuickCalc(leads, ticket);
  };

  const handleStartAssessment = () => {
    giveConsent();
    scrollToSection('form');
  };

  const handleFormComplete = (answers: Partial<Answers>) => {
    const fullAnswers = { ...state.answers, ...answers } as Answers;
    const calculatedResults = calculateLeakages(fullAnswers);
    setResults(calculatedResults);
    scrollToSection('analyzing');
  };

  const handleAnalyzingComplete = () => {
    scrollToSection('results');
    // Auto-avançar para lead capture após 10 segundos
    setTimeout(() => {
      scrollToSection('lead');
    }, 10000);
  };

  return (
    <div className="bg-background">
      <Suspense fallback={<SectionLoader />}>
        {currentSection === 'quick' && (
          <div id="section-quick" ref={sectionRefs.quick}>
            <QuickCalculator
              onCalculate={handleQuickCalc}
              onContinue={() => scrollToSection('trust')}
            />
          </div>
        )}

        {currentSection === 'trust' && (
          <div id="section-trust" ref={sectionRefs.trust}>
            <TrustBuilder onStart={handleStartAssessment} />
          </div>
        )}

        {currentSection === 'form' && (
          <div id="section-form" ref={sectionRefs.form}>
            <MultiStepForm onComplete={handleFormComplete} initialAnswers={state.answers} />
          </div>
        )}

        {currentSection === 'analyzing' && (
          <div id="section-analyzing" ref={sectionRefs.analyzing}>
            <AnalyzingLoader onComplete={handleAnalyzingComplete} />
          </div>
        )}

        {currentSection === 'results' && results && (
          <div id="section-results" ref={sectionRefs.results}>
            <ResultsDashboard results={results} />
          </div>
        )}

        {currentSection === 'lead' && results && (
          <div id="section-lead" ref={sectionRefs.lead}>
            <LeadCaptureForm results={results} answers={state.answers} />
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default Index;
