import { useState, useEffect } from 'react';
import { Answers } from '@/lib/calculations';

const STORAGE_KEY = 'eucalyptus_assessment';

export interface AssessmentState {
  currentStep: number;
  quickCalc?: { leads: number; ticket: number };
  answers: Partial<Answers>;
  consentGiven: boolean;
}

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { currentStep: 0, answers: {}, consentGiven: false };
      }
    }
    return { currentStep: 0, answers: {}, consentGiven: false };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateQuickCalc = (leads: number, ticket: number) => {
    setState((prev) => ({
      ...prev,
      quickCalc: { leads, ticket },
      answers: { ...prev.answers, leads, ticket },
    }));
  };

  const giveConsent = () => {
    setState((prev) => ({ ...prev, consentGiven: true }));
  };

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [key]: value },
    }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ currentStep: 0, answers: {}, consentGiven: false });
  };

  return {
    state,
    updateQuickCalc,
    giveConsent,
    updateAnswer,
    nextStep,
    reset,
  };
}
