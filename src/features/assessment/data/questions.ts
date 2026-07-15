import type { AssessmentQuestion } from '../types';

export const assessmentQuestions = [
  {
    id: 'crisis-response',
    options: [
      { id: 'take-command', scores: { eagle: 2, wolf: 1 } },
      { id: 'observe-first', scores: { owl: 2, bear: 1 } },
      { id: 'steady-people', scores: { dolphin: 2, bear: 1 } },
    ],
  },
  {
    id: 'decision-style',
    options: [
      { id: 'evidence', scores: { owl: 2, bear: 1 } },
      { id: 'instinct', scores: { eagle: 2, wolf: 1 } },
      { id: 'perspectives', scores: { dolphin: 2, bear: 1 } },
    ],
  },
  {
    id: 'trust-circle',
    options: [
      { id: 'small-circle', scores: { wolf: 2, bear: 1 } },
      { id: 'wide-network', scores: { dolphin: 2, eagle: 1 } },
      { id: 'earned-respect', scores: { owl: 1, eagle: 1, bear: 1 } },
    ],
  },
  {
    id: 'conflict',
    options: [
      { id: 'direct', scores: { eagle: 2, wolf: 1 } },
      { id: 'common-ground', scores: { dolphin: 2, bear: 1 } },
      { id: 'analyze', scores: { owl: 2, wolf: 1 } },
    ],
  },
  {
    id: 'motivation',
    options: [
      { id: 'ambitious-goal', scores: { eagle: 2, wolf: 1 } },
      { id: 'mastery', scores: { owl: 2, wolf: 1 } },
      { id: 'protect-contribute', scores: { bear: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'change',
    options: [
      { id: 'explore', scores: { eagle: 2, dolphin: 1 } },
      { id: 'plan', scores: { wolf: 2, owl: 1 } },
      { id: 'stabilize', scores: { bear: 2, owl: 1 } },
      { id: 'adapt-with-people', scores: { dolphin: 2, bear: 1 } },
    ],
  },
  {
    id: 'pressure',
    options: [
      { id: 'command', scores: { eagle: 2, wolf: 1 } },
      { id: 'calm-analysis', scores: { owl: 2, bear: 1 } },
      { id: 'protect-team', scores: { dolphin: 2, bear: 1 } },
    ],
  },
  {
    id: 'working-style',
    options: [
      { id: 'deep-focus', scores: { owl: 2, wolf: 1 } },
      { id: 'trusted-team', scores: { wolf: 2, bear: 1 } },
      { id: 'dynamic-group', scores: { dolphin: 2, eagle: 1 } },
    ],
  },
  {
    id: 'risk',
    options: [
      { id: 'calculated-risk', scores: { eagle: 2, wolf: 1 } },
      { id: 'evidence-first', scores: { owl: 2, bear: 1 } },
      { id: 'human-impact', scores: { dolphin: 2, bear: 1 } },
    ],
  },
  {
    id: 'core-value',
    options: [
      { id: 'freedom', scores: { wolf: 2, eagle: 1 } },
      { id: 'truth', scores: { owl: 2, eagle: 1 } },
      { id: 'connection', scores: { dolphin: 2, bear: 1 } },
      { id: 'security', scores: { bear: 2, wolf: 1 } },
    ],
  },
] as const satisfies readonly AssessmentQuestion[];

export type AssessmentQuestionId = (typeof assessmentQuestions)[number]['id'];
export type AssessmentOptionId = (typeof assessmentQuestions)[number]['options'][number]['id'];
export type AssessmentQuestionData = (typeof assessmentQuestions)[number];
