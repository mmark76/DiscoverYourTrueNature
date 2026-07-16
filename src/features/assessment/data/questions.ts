import type { AssessmentQuestion } from '../types.ts';

export const fixedAssessmentQuestions = [
  {
    id: 'b01-new-group', category: 'behavior', scenarioId: 'entering-new-social-group',
    primaryDimension: 'extraversion', secondaryDimensions: ['independence', 'agreeableness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b01-a', vector: { extraversion: 1, independence: -0.35 } },
      { id: 'b01-b', vector: { extraversion: 0.35, agreeableness: 0.35 } },
      { id: 'b01-c', vector: { extraversion: -0.35, agreeableness: 0.55 } },
      { id: 'b01-d', vector: { extraversion: -1, independence: 0.45 } },
    ],
  },
  {
    id: 'b02-sudden-change', category: 'behavior', scenarioId: 'unexpected-change',
    primaryDimension: 'emotionalStability', secondaryDimensions: ['flexibility', 'conscientiousness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b02-a', vector: { emotionalStability: 0.8, flexibility: -0.65 } },
      { id: 'b02-b', vector: { emotionalStability: 1, conscientiousness: 0.55 } },
      { id: 'b02-c', vector: { emotionalStability: 0.45, flexibility: 1 } },
      { id: 'b02-d', vector: { emotionalStability: 0.35, flexibility: 0.4, conscientiousness: -0.25 } },
    ],
  },
  {
    id: 'b03-plan-day', category: 'behavior', scenarioId: 'planning-free-day',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['flexibility', 'novelty'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b03-a', vector: { conscientiousness: 1, flexibility: -0.75, novelty: -0.35 } },
      { id: 'b03-b', vector: { conscientiousness: 0.35, flexibility: 0.15 } },
      { id: 'b03-c', vector: { conscientiousness: -0.35, flexibility: 0.65 } },
      { id: 'b03-d', vector: { conscientiousness: -1, flexibility: 1, novelty: 0.55 } },
    ],
  },
  {
    id: 'b04-quick-choice', category: 'behavior', scenarioId: 'making-quick-decision',
    primaryDimension: 'emotionalStability', secondaryDimensions: ['initiative', 'conscientiousness', 'agreeableness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b04-a', vector: { emotionalStability: 1, initiative: 0.65 } },
      { id: 'b04-b', vector: { emotionalStability: 0.35, conscientiousness: 0.65 } },
      { id: 'b04-c', vector: { emotionalStability: 0.2, agreeableness: 0.35 } },
      { id: 'b04-d', vector: { emotionalStability: 0.1, agreeableness: 0.7 } },
    ],
  },
  {
    id: 'b05-disagreement', category: 'behavior', scenarioId: 'handling-disagreement',
    primaryDimension: 'agreeableness', secondaryDimensions: ['directness', 'fairness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b05-a', vector: { agreeableness: -1, directness: 1, fairness: 0.45 } },
      { id: 'b05-b', vector: { agreeableness: -0.35, directness: 0.45, fairness: 0.8 } },
      { id: 'b05-c', vector: { agreeableness: 0.35, directness: -0.15, fairness: 0.65 } },
      { id: 'b05-d', vector: { agreeableness: 1, directness: -0.8, fairness: 0.25 } },
    ],
  },
  {
    id: 'b06-helping-someone', category: 'behavior', scenarioId: 'helping-another-person',
    primaryDimension: 'agreeableness', secondaryDimensions: ['initiative', 'independence'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b06-a', vector: { agreeableness: 1, initiative: -0.25, independence: -0.55 } },
      { id: 'b06-b', vector: { agreeableness: 0.65, initiative: 0.65 } },
      { id: 'b06-c', vector: { agreeableness: 0.55, independence: 0.35 } },
      { id: 'b06-d', vector: { agreeableness: 0.45, initiative: -0.25, independence: 0.75 } },
    ],
  },
  {
    id: 'b07-solo-task', category: 'behavior', scenarioId: 'working-alone',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['independence', 'flexibility'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b07-a', vector: { conscientiousness: 1, independence: 0.55, flexibility: -0.45 } },
      { id: 'b07-b', vector: { conscientiousness: 0.35, independence: 1 } },
      { id: 'b07-c', vector: { conscientiousness: -0.35, flexibility: 0.7 } },
      { id: 'b07-d', vector: { conscientiousness: -1, independence: -0.45, flexibility: 0.35 } },
    ],
  },
  {
    id: 'b08-shared-activity', category: 'behavior', scenarioId: 'working-in-team',
    primaryDimension: 'extraversion', secondaryDimensions: ['initiative', 'agreeableness', 'independence'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b08-a', vector: { extraversion: 1, initiative: 0.7 } },
      { id: 'b08-b', vector: { extraversion: 0.35, agreeableness: 0.8 } },
      { id: 'b08-c', vector: { extraversion: -0.35, initiative: -0.55, agreeableness: 0.45 } },
      { id: 'b08-d', vector: { extraversion: -1, independence: 0.65 } },
    ],
  },
  {
    id: 'b09-pressure', category: 'behavior', scenarioId: 'responding-to-pressure',
    primaryDimension: 'emotionalStability', secondaryDimensions: ['conscientiousness', 'initiative'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b09-a', vector: { emotionalStability: 0.85, conscientiousness: 0.65 } },
      { id: 'b09-b', vector: { emotionalStability: 0.65, initiative: 0.65 } },
      { id: 'b09-c', vector: { emotionalStability: 0.55, conscientiousness: 0.4 } },
      { id: 'b09-d', vector: { emotionalStability: 0.35, initiative: -0.45, conscientiousness: 0.25 } },
    ],
  },
  {
    id: 'b10-unfamiliar-start', category: 'behavior', scenarioId: 'starting-unfamiliar-thing',
    primaryDimension: 'openness', secondaryDimensions: ['novelty', 'initiative', 'conscientiousness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b10-a', vector: { openness: 1, novelty: 0.9, initiative: 0.5 } },
      { id: 'b10-b', vector: { openness: 0.35, conscientiousness: 0.45 } },
      { id: 'b10-c', vector: { openness: -0.35, novelty: -0.4 } },
      { id: 'b10-d', vector: { openness: -1, novelty: -0.9, conscientiousness: 0.55 } },
    ],
  },
  {
    id: 'b11-share-opinion', category: 'behavior', scenarioId: 'communicating-opinion',
    primaryDimension: 'agreeableness', secondaryDimensions: ['directness', 'extraversion'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b11-a', vector: { agreeableness: -1, directness: 1, extraversion: 0.4 } },
      { id: 'b11-b', vector: { agreeableness: -0.35, directness: 0.35 } },
      { id: 'b11-c', vector: { agreeableness: 0.35, directness: -0.35 } },
      { id: 'b11-d', vector: { agreeableness: 1, directness: -1, extraversion: -0.3 } },
    ],
  },
  {
    id: 'b12-picture-details', category: 'behavior', scenarioId: 'noticing-picture-and-details',
    primaryDimension: 'openness', secondaryDimensions: ['conscientiousness', 'flexibility'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b12-a', vector: { openness: 1, flexibility: 0.45 } },
      { id: 'b12-b', vector: { openness: 0.35, conscientiousness: 0.4 } },
      { id: 'b12-c', vector: { openness: -0.35, conscientiousness: 0.75 } },
      { id: 'b12-d', vector: { openness: -1, conscientiousness: 0.25 } },
    ],
  },
  {
    id: 'b13-unclaimed-task', category: 'behavior', scenarioId: 'taking-initiative',
    primaryDimension: 'extraversion', secondaryDimensions: ['initiative', 'independence', 'agreeableness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b13-a', vector: { extraversion: 0.35, initiative: 1 } },
      { id: 'b13-b', vector: { extraversion: 1, initiative: 0.45, agreeableness: 0.35 } },
      { id: 'b13-c', vector: { extraversion: -0.35, initiative: -0.35, independence: 0.4 } },
      { id: 'b13-d', vector: { extraversion: -1, initiative: -1, agreeableness: 0.45 } },
    ],
  },
  {
    id: 'b14-routine', category: 'behavior', scenarioId: 'maintaining-routine',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['novelty', 'flexibility'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b14-a', vector: { conscientiousness: 1, novelty: -0.8, flexibility: -0.65 } },
      { id: 'b14-b', vector: { conscientiousness: 0.35, flexibility: 0.25 } },
      { id: 'b14-c', vector: { conscientiousness: -0.35, novelty: 0.45, flexibility: 0.65 } },
      { id: 'b14-d', vector: { conscientiousness: -1, novelty: 0.8, flexibility: 1 } },
    ],
  },
  {
    id: 'b15-disappointment', category: 'behavior', scenarioId: 'recovering-after-disappointment',
    primaryDimension: 'emotionalStability', secondaryDimensions: ['agreeableness', 'initiative', 'independence'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b15-a', vector: { emotionalStability: 0.8, initiative: 0.45 } },
      { id: 'b15-b', vector: { emotionalStability: 0.6, agreeableness: 0.45 } },
      { id: 'b15-c', vector: { emotionalStability: 0.45, independence: 0.65 } },
      { id: 'b15-d', vector: { emotionalStability: 0.55, agreeableness: 0.65 } },
    ],
  },
  {
    id: 'b16-new-place', category: 'behavior', scenarioId: 'exploring-new-place',
    primaryDimension: 'openness', secondaryDimensions: ['novelty', 'independence', 'conscientiousness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b16-a', vector: { openness: 1, novelty: 1, independence: 0.5 } },
      { id: 'b16-b', vector: { openness: 0.35, novelty: 0.4, conscientiousness: 0.35 } },
      { id: 'b16-c', vector: { openness: -0.35, novelty: -0.4, independence: 0.45 } },
      { id: 'b16-d', vector: { openness: -1, novelty: -1, conscientiousness: 0.55 } },
    ],
  },
  {
    id: 'b17-responsibility', category: 'behavior', scenarioId: 'managing-responsibility',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['fairness', 'initiative', 'flexibility'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b17-a', vector: { conscientiousness: 1, fairness: 0.75, initiative: 0.45 } },
      { id: 'b17-b', vector: { conscientiousness: 0.35, fairness: 0.55 } },
      { id: 'b17-c', vector: { conscientiousness: -0.35, flexibility: 0.55 } },
      { id: 'b17-d', vector: { conscientiousness: -1, flexibility: 0.8 } },
    ],
  },
  {
    id: 'b18-plan-fails', category: 'behavior', scenarioId: 'adapting-when-plans-fail',
    primaryDimension: 'openness', secondaryDimensions: ['flexibility', 'emotionalStability', 'conscientiousness'],
    weightClass: 'normal', adaptiveEligible: false,
    options: [
      { id: 'b18-a', vector: { openness: 1, flexibility: 1, emotionalStability: 0.35 } },
      { id: 'b18-b', vector: { openness: 0.35, flexibility: 0.35, conscientiousness: 0.4 } },
      { id: 'b18-c', vector: { openness: -0.35, flexibility: -0.35, emotionalStability: 0.5 } },
      { id: 'b18-d', vector: { openness: -1, flexibility: -1, conscientiousness: 0.65 } },
    ],
  },
  {
    id: 'p01-free-time', category: 'preference', scenarioId: 'hobbies-and-free-time',
    primaryDimension: 'extraversion', secondaryDimensions: ['openness', 'independence'],
    weightClass: 'lower', adaptiveEligible: false,
    options: [
      { id: 'p01-a', vector: { extraversion: 1, openness: 0.35 } },
      { id: 'p01-b', vector: { extraversion: 0.35, independence: -0.45 } },
      { id: 'p01-c', vector: { extraversion: -0.35, independence: 0.4 } },
      { id: 'p01-d', vector: { extraversion: -1, openness: 0.55, independence: 0.7 } },
    ],
  },
  {
    id: 'p02-stories', category: 'preference', scenarioId: 'stories-and-fictional-worlds',
    primaryDimension: 'openness', secondaryDimensions: ['novelty', 'extraversion'],
    weightClass: 'lower', adaptiveEligible: false,
    options: [
      { id: 'p02-a', vector: { openness: 0.35, extraversion: -0.35 } },
      { id: 'p02-b', vector: { openness: 0.55, novelty: 0.25 } },
      { id: 'p02-c', vector: { openness: 1, novelty: 0.65 } },
      { id: 'p02-d', vector: { openness: -0.35, novelty: 0.45, extraversion: 0.75 } },
    ],
  },
  {
    id: 'p03-music', category: 'preference', scenarioId: 'experiencing-music',
    primaryDimension: 'openness', secondaryDimensions: ['extraversion', 'novelty'],
    weightClass: 'lower', adaptiveEligible: false,
    options: [
      { id: 'p03-a', vector: { openness: 1, novelty: 1 } },
      { id: 'p03-b', vector: { openness: 0.35, extraversion: 0.8 } },
      { id: 'p03-c', vector: { openness: 0, extraversion: -0.4 } },
      { id: 'p03-d', vector: { openness: -0.7, novelty: -0.8 } },
    ],
  },
  {
    id: 'p04-outing', category: 'preference', scenarioId: 'outing-and-environment',
    primaryDimension: 'openness', secondaryDimensions: ['novelty', 'extraversion'],
    weightClass: 'lower', adaptiveEligible: false,
    options: [
      { id: 'p04-a', vector: { openness: -0.65, novelty: -0.7, extraversion: -0.4 } },
      { id: 'p04-b', vector: { openness: 0.1, novelty: -0.25, extraversion: -0.6 } },
      { id: 'p04-c', vector: { openness: 1, novelty: 1, extraversion: -0.15 } },
      { id: 'p04-d', vector: { openness: 0.45, novelty: 0.6, extraversion: 1 } },
    ],
  },
  {
    id: 'p05-learning-interest', category: 'preference', scenarioId: 'learning-and-personal-interests',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['openness', 'flexibility', 'novelty'],
    weightClass: 'lower', adaptiveEligible: false,
    options: [
      { id: 'p05-a', vector: { conscientiousness: 1, openness: 0.35, flexibility: -0.45 } },
      { id: 'p05-b', vector: { conscientiousness: 0.35, openness: 0.75 } },
      { id: 'p05-c', vector: { conscientiousness: -0.35, flexibility: 0.7 } },
      { id: 'p05-d', vector: { conscientiousness: -1, openness: 0.45, novelty: 0.55 } },
    ],
  },
] as const satisfies readonly AssessmentQuestion[];

export const adaptiveQuestionBank = [
  {
    id: 'a01-short-notice', category: 'adaptive', scenarioId: 'short-notice-invitation',
    primaryDimension: 'extraversion', secondaryDimensions: ['independence', 'flexibility'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a01-a', vector: { extraversion: 1, flexibility: 0.55 } },
      { id: 'a01-b', vector: { extraversion: 0.35, independence: -0.55 } },
      { id: 'a01-c', vector: { extraversion: -0.35, independence: 0.35, flexibility: 0.4 } },
      { id: 'a01-d', vector: { extraversion: -1, independence: 1 } },
    ],
  },
  {
    id: 'a02-change-structure', category: 'adaptive', scenarioId: 'rebuilding-after-change',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['flexibility', 'novelty'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a02-a', vector: { conscientiousness: 1, flexibility: -0.7 } },
      { id: 'a02-b', vector: { conscientiousness: 0.35, flexibility: -0.15 } },
      { id: 'a02-c', vector: { conscientiousness: -0.35, flexibility: 0.55 } },
      { id: 'a02-d', vector: { conscientiousness: -1, flexibility: 1, novelty: 0.45 } },
    ],
  },
  {
    id: 'a03-uncertain-route', category: 'adaptive', scenarioId: 'trying-unfamiliar-element',
    primaryDimension: 'openness', secondaryDimensions: ['novelty', 'emotionalStability', 'conscientiousness'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a03-a', vector: { openness: 1, novelty: 1 } },
      { id: 'a03-b', vector: { openness: 0.35, emotionalStability: 0.45 } },
      { id: 'a03-c', vector: { openness: -0.35, conscientiousness: 0.4 } },
      { id: 'a03-d', vector: { openness: -1, novelty: -1 } },
    ],
  },
  {
    id: 'a04-tense-conversation', category: 'adaptive', scenarioId: 'responding-to-misunderstood-idea',
    primaryDimension: 'agreeableness', secondaryDimensions: ['directness', 'fairness'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a04-a', vector: { agreeableness: -1, directness: 1 } },
      { id: 'a04-b', vector: { agreeableness: -0.35, directness: 0.35, fairness: 0.75 } },
      { id: 'a04-c', vector: { agreeableness: 0.35, directness: -0.25 } },
      { id: 'a04-d', vector: { agreeableness: 1, directness: -0.9 } },
    ],
  },
  {
    id: 'a05-setback-reset', category: 'adaptive', scenarioId: 'minor-mistake-before-arrival',
    primaryDimension: 'emotionalStability', secondaryDimensions: ['flexibility', 'initiative'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a05-a', vector: { emotionalStability: 0.9, initiative: 0.55 } },
      { id: 'a05-b', vector: { emotionalStability: 0.7, flexibility: 0.45 } },
      { id: 'a05-c', vector: { emotionalStability: 0.55, initiative: -0.35 } },
      { id: 'a05-d', vector: { emotionalStability: 0.45, flexibility: 0.55, initiative: -0.45 } },
    ],
  },
  {
    id: 'a06-shared-decision', category: 'adaptive', scenarioId: 'naming-shared-creation',
    primaryDimension: 'initiative', secondaryDimensions: ['agreeableness', 'fairness'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a06-a', vector: { initiative: 1, agreeableness: -0.35 } },
      { id: 'a06-b', vector: { initiative: 0.35, fairness: 0.75 } },
      { id: 'a06-c', vector: { initiative: -0.35, agreeableness: 0.55 } },
      { id: 'a06-d', vector: { initiative: -1, agreeableness: 0.85 } },
    ],
  },
  {
    id: 'a07-open-afternoon', category: 'adaptive', scenarioId: 'using-unexpected-time-gap',
    primaryDimension: 'flexibility', secondaryDimensions: ['conscientiousness', 'novelty'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a07-a', vector: { flexibility: -1, conscientiousness: 0.85 } },
      { id: 'a07-b', vector: { flexibility: -0.35, conscientiousness: 0.35 } },
      { id: 'a07-c', vector: { flexibility: 0.35, novelty: 0.35 } },
      { id: 'a07-d', vector: { flexibility: 1, novelty: 0.8 } },
    ],
  },
  {
    id: 'a08-new-idea', category: 'adaptive', scenarioId: 'responding-to-new-idea',
    primaryDimension: 'openness', secondaryDimensions: ['initiative', 'directness', 'agreeableness', 'conscientiousness'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a08-a', vector: { openness: 1, initiative: 0.65 } },
      { id: 'a08-b', vector: { openness: 0.35, directness: 0.35 } },
      { id: 'a08-c', vector: { openness: -0.35, agreeableness: 0.45 } },
      { id: 'a08-d', vector: { openness: -1, conscientiousness: 0.55 } },
    ],
  },
  {
    id: 'a09-recharge-evening', category: 'adaptive', scenarioId: 'recharging-after-social-days',
    primaryDimension: 'extraversion', secondaryDimensions: ['independence'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a09-a', vector: { extraversion: 1, independence: -0.35 } },
      { id: 'a09-b', vector: { extraversion: 0.35, independence: -0.25 } },
      { id: 'a09-c', vector: { extraversion: -0.35, independence: 0.2 } },
      { id: 'a09-d', vector: { extraversion: -1, independence: 1 } },
    ],
  },
  {
    id: 'a10-promise-change', category: 'adaptive', scenarioId: 'changing-a-promise',
    primaryDimension: 'conscientiousness', secondaryDimensions: ['agreeableness', 'fairness', 'flexibility', 'independence'],
    weightClass: 'differentiator', adaptiveEligible: true,
    options: [
      { id: 'a10-a', vector: { conscientiousness: 1, fairness: 0.85 } },
      { id: 'a10-b', vector: { conscientiousness: 0.35, agreeableness: 0.65 } },
      { id: 'a10-c', vector: { conscientiousness: -0.35, flexibility: 0.55 } },
      { id: 'a10-d', vector: { conscientiousness: -0.8, agreeableness: 0.75, independence: -0.65 } },
    ],
  },
] as const satisfies readonly AssessmentQuestion[];

export const allAssessmentQuestions = [
  ...fixedAssessmentQuestions,
  ...adaptiveQuestionBank,
] as const;

export const fixedAssessmentQuestionCount = 23;
export const completedAssessmentQuestionCount = 25;

export type FixedAssessmentQuestionId = (typeof fixedAssessmentQuestions)[number]['id'];
export type AdaptiveAssessmentQuestionId = (typeof adaptiveQuestionBank)[number]['id'];
export type AssessmentQuestionId = (typeof allAssessmentQuestions)[number]['id'];
export type AssessmentOptionId = (typeof allAssessmentQuestions)[number]['options'][number]['id'];
export type AssessmentQuestionData = (typeof allAssessmentQuestions)[number];

export const assessmentQuestionById: ReadonlyMap<string, AssessmentQuestionData> = new Map(
  allAssessmentQuestions.map((question) => [question.id, question]),
);
