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
    setCurrentSection(section);
    setTimeout(() => {
      sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    setTimeout(() => {
      scrollToSection('lead');
    }, 3000);
  };

  return (
    <div className="bg-background">
      <div ref={sectionRefs.quick}>
        {currentSection === 'quick' && (
          <QuickCalculator
            onCalculate={handleQuickCalc}
            onContinue={() => scrollToSection('trust')}
          />
        )}
      </div>

      <div ref={sectionRefs.trust}>
        {(currentSection === 'trust' || state.currentStep >= 1) && (
          <TrustBuilder onStart={handleStartAssessment} />
        )}
      </div>

      <div ref={sectionRefs.form}>
        {(currentSection === 'form' || state.currentStep >= 2) && (
          <MultiStepForm onComplete={handleFormComplete} initialAnswers={state.answers} />
        )}
      </div>

      <div ref={sectionRefs.analyzing}>
        {currentSection === 'analyzing' && <AnalyzingLoader onComplete={handleAnalyzingComplete} />}
      </div>

      <div ref={sectionRefs.results}>
        {currentSection === 'results' && results && <ResultsDashboard results={results} />}
      </div>

      <div ref={sectionRefs.lead}>
        {currentSection === 'lead' && results && (
          <LeadCaptureForm results={results} answers={state.answers} />
        )}
      </div>
    </div>
  );
};

export default Index;
