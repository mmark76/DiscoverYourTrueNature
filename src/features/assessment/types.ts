export type ArchetypeId = 'wolf' | 'owl' | 'eagle' | 'dolphin' | 'bear';

export type ScoreMap = Partial<Record<ArchetypeId, number>>;

export interface AssessmentOption {
  id: string;
  label: string;
  scores: ScoreMap;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: AssessmentOption[];
}

export interface ArchetypeProfile {
  id: ArchetypeId;
  name: string;
  symbol: string;
  summary: string;
  strengths: string[];
  watchOuts: string[];
}

export interface AssessmentResult {
  primary: ArchetypeProfile;
  secondary: ArchetypeProfile;
  confidence: number;
  scores: Record<ArchetypeId, number>;
}
