import { useState, useRef, useEffect } from 'react';
import { QuickCalculator } from '@/components/QuickCalculator';
import { TrustBuilder } from '@/components/TrustBuilder';
import { MultiStepForm } from '@/components/MultiStepForm';
import { AnalyzingLoader } from '@/components/AnalyzingLoader';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateLeakages } from '@/lib/calculations';
import { Answers } from '@/lib/calculations';

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

  const handleLeadCaptureComplete = () => {
    // Reset to initial state
    setCurrentSection('quick');
    setResults(null);
  };

  return (
    <div className="bg-background">
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
          <LeadCaptureForm results={results} answers={state.answers} onComplete={handleLeadCaptureComplete} />
        </div>
      )}
    </div>
  );
};

export default Index;
