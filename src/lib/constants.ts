// RADIX Score Names Mapping
export const RADIX_NAMES: Record<string, string> = {
  recepcao: 'Recepção',
  automacao: 'Automação',
  dados: 'Dados',
  inteligencia: 'Inteligência',
  expansao: 'eXpansão'
};

// RADIX Score Labels for display
export const RADIX_LABELS = {
  recepcao: 'R - Recepção',
  automacao: 'A - Automação',
  dados: 'D - Dados',
  inteligencia: 'I - Inteligência',
  expansao: 'X - eXpansão'
};

// Get bottleneck from scores
export function getBottleneck(scores: Record<string, number>): { key: string; name: string; score: number } {
  const entries = Object.entries(scores);

  if (entries.length === 0) {
    return { key: 'recepcao', name: 'Recepção', score: 0 };
  }

  const [bottleneckKey, bottleneckScore] = entries.reduce((min, current) =>
    current[1] < min[1] ? current : min
  );

  return {
    key: bottleneckKey,
    name: RADIX_NAMES[bottleneckKey] || bottleneckKey,
    score: bottleneckScore
  };
}
