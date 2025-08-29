export interface Drug {
  name: string;
  description: string;
  classes: string[];
  dosage?: string;
  frequency?: string;
}

export interface DrugInteraction {
  pair: [string, string];
  severity: 'low' | 'moderate' | 'high';
  explanation: string;
}

export interface DosageRecommendation {
  drug: string;
  recommendation: string;
  warning?: string | null;
}

export interface AlternativeSuggestion {
  forDrug: string;
  reason: string;
  suggestion: string;
  suggestedDrug: string;
}

export interface AnalysisResult {
  drugs: Drug[];
  interactions: DrugInteraction[];
  dosageRecommendations: DosageRecommendation[];
  alternativeSuggestions: AlternativeSuggestion[];
}

export interface AlternativeFinderResult {
  suggestedDrug: string;
  reasoning: string;
  benefits: string;
  considerations: string;
}