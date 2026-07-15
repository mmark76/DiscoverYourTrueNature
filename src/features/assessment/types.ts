export type ArchetypeId = 'wolf' | 'owl' | 'eagle' | 'dolphin' | 'bear';

export type ScoreMap = Partial<Record<ArchetypeId, number>>;

export interface AssessmentOption {
  id: string;
  scores: ScoreMap;
}

export interface AssessmentQuestion {
  id: string;
  options: readonly AssessmentOption[];
}

export interface ArchetypeProfile {
  id: ArchetypeId;
  symbol: string;
}

export interface AssessmentResult {
  primary: ArchetypeProfile;
  secondary: ArchetypeProfile;
  confidence: number;
  scores: Record<ArchetypeId, number>;
}
