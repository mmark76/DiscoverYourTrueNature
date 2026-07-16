import type { AssessmentQuestion } from '../types.ts';

export const assessmentQuestions = [
  { id: 'affiliation-collaboration', dimension: 'affiliation', options: [
    { id: 'affiliation-collaboration-a', value: -2 }, { id: 'affiliation-collaboration-b', value: 1 },
    { id: 'affiliation-collaboration-c', value: 2 }, { id: 'affiliation-collaboration-d', value: -1 },
  ] },
  { id: 'reasoning-incomplete', dimension: 'reasoning', options: [
    { id: 'reasoning-incomplete-a', value: 2 }, { id: 'reasoning-incomplete-b', value: -1 },
    { id: 'reasoning-incomplete-c', value: -2 }, { id: 'reasoning-incomplete-d', value: 1 },
  ] },
  { id: 'tempo-deadline', dimension: 'tempo', options: [
    { id: 'tempo-deadline-a', value: 1 }, { id: 'tempo-deadline-b', value: -2 },
    { id: 'tempo-deadline-c', value: -1 }, { id: 'tempo-deadline-d', value: 2 },
  ] },
  { id: 'structure-project', dimension: 'structure', options: [
    { id: 'structure-project-a', value: -1 }, { id: 'structure-project-b', value: 2 },
    { id: 'structure-project-c', value: 1 }, { id: 'structure-project-d', value: -2 },
  ] },
  { id: 'influence-direction', dimension: 'influence', options: [
    { id: 'influence-direction-a', value: 2 }, { id: 'influence-direction-b', value: -2 },
    { id: 'influence-direction-c', value: 1 }, { id: 'influence-direction-d', value: -1 },
  ] },
  { id: 'exploration-opportunity', dimension: 'exploration', options: [
    { id: 'exploration-opportunity-a', value: -2 }, { id: 'exploration-opportunity-b', value: 2 },
    { id: 'exploration-opportunity-c', value: -1 }, { id: 'exploration-opportunity-d', value: 1 },
  ] },
  { id: 'expression-new-group', dimension: 'expression', options: [
    { id: 'expression-new-group-a', value: 1 }, { id: 'expression-new-group-b', value: -1 },
    { id: 'expression-new-group-c', value: 2 }, { id: 'expression-new-group-d', value: -2 },
  ] },
  { id: 'perspective-problem', dimension: 'perspective', options: [
    { id: 'perspective-problem-a', value: -1 }, { id: 'perspective-problem-b', value: 1 },
    { id: 'perspective-problem-c', value: -2 }, { id: 'perspective-problem-d', value: 2 },
  ] },
  { id: 'affiliation-recharge', dimension: 'affiliation', options: [
    { id: 'affiliation-recharge-a', value: 2 }, { id: 'affiliation-recharge-b', value: -1 },
    { id: 'affiliation-recharge-c', value: 1 }, { id: 'affiliation-recharge-d', value: -2 },
  ] },
  { id: 'reasoning-learning', dimension: 'reasoning', options: [
    { id: 'reasoning-learning-a', value: -1 }, { id: 'reasoning-learning-b', value: -2 },
    { id: 'reasoning-learning-c', value: 2 }, { id: 'reasoning-learning-d', value: 1 },
  ] },
  { id: 'tempo-problem', dimension: 'tempo', options: [
    { id: 'tempo-problem-a', value: -2 }, { id: 'tempo-problem-b', value: 1 },
    { id: 'tempo-problem-c', value: -1 }, { id: 'tempo-problem-d', value: 2 },
  ] },
  { id: 'structure-journey', dimension: 'structure', options: [
    { id: 'structure-journey-a', value: 1 }, { id: 'structure-journey-b', value: 2 },
    { id: 'structure-journey-c', value: -2 }, { id: 'structure-journey-d', value: -1 },
  ] },
  { id: 'influence-conflict', dimension: 'influence', options: [
    { id: 'influence-conflict-a', value: -2 }, { id: 'influence-conflict-b', value: -1 },
    { id: 'influence-conflict-c', value: 2 }, { id: 'influence-conflict-d', value: 1 },
  ] },
  { id: 'exploration-experiment', dimension: 'exploration', options: [
    { id: 'exploration-experiment-a', value: 1 }, { id: 'exploration-experiment-b', value: -2 },
    { id: 'exploration-experiment-c', value: 2 }, { id: 'exploration-experiment-d', value: -1 },
  ] },
  { id: 'expression-excitement', dimension: 'expression', options: [
    { id: 'expression-excitement-a', value: -1 }, { id: 'expression-excitement-b', value: 2 },
    { id: 'expression-excitement-c', value: -2 }, { id: 'expression-excitement-d', value: 1 },
  ] },
  { id: 'perspective-explain', dimension: 'perspective', options: [
    { id: 'perspective-explain-a', value: 2 }, { id: 'perspective-explain-b', value: -2 },
    { id: 'perspective-explain-c', value: 1 }, { id: 'perspective-explain-d', value: -1 },
  ] },
  { id: 'affiliation-responsibility', dimension: 'affiliation', options: [
    { id: 'affiliation-responsibility-a', value: -1 }, { id: 'affiliation-responsibility-b', value: 1 },
    { id: 'affiliation-responsibility-c', value: -2 }, { id: 'affiliation-responsibility-d', value: 2 },
  ] },
  { id: 'reasoning-disagreement', dimension: 'reasoning', options: [
    { id: 'reasoning-disagreement-a', value: 1 }, { id: 'reasoning-disagreement-b', value: 2 },
    { id: 'reasoning-disagreement-c', value: -1 }, { id: 'reasoning-disagreement-d', value: -2 },
  ] },
  { id: 'tempo-opportunity', dimension: 'tempo', options: [
    { id: 'tempo-opportunity-a', value: 2 }, { id: 'tempo-opportunity-b', value: -1 },
    { id: 'tempo-opportunity-c', value: -2 }, { id: 'tempo-opportunity-d', value: 1 },
  ] },
  { id: 'structure-disruption', dimension: 'structure', options: [
    { id: 'structure-disruption-a', value: -2 }, { id: 'structure-disruption-b', value: 1 },
    { id: 'structure-disruption-c', value: 2 }, { id: 'structure-disruption-d', value: -1 },
  ] },
  { id: 'influence-vacuum', dimension: 'influence', options: [
    { id: 'influence-vacuum-a', value: 1 }, { id: 'influence-vacuum-b', value: -2 },
    { id: 'influence-vacuum-c', value: -1 }, { id: 'influence-vacuum-d', value: 2 },
  ] },
  { id: 'exploration-novelty', dimension: 'exploration', options: [
    { id: 'exploration-novelty-a', value: -1 }, { id: 'exploration-novelty-b', value: 2 },
    { id: 'exploration-novelty-c', value: 1 }, { id: 'exploration-novelty-d', value: -2 },
  ] },
  { id: 'expression-concern', dimension: 'expression', options: [
    { id: 'expression-concern-a', value: 2 }, { id: 'expression-concern-b', value: -2 },
    { id: 'expression-concern-c', value: -1 }, { id: 'expression-concern-d', value: 1 },
  ] },
  { id: 'perspective-future', dimension: 'perspective', options: [
    { id: 'perspective-future-a', value: -2 }, { id: 'perspective-future-b', value: -1 },
    { id: 'perspective-future-c', value: 2 }, { id: 'perspective-future-d', value: 1 },
  ] },
] as const satisfies readonly AssessmentQuestion[];

export type AssessmentQuestionId = (typeof assessmentQuestions)[number]['id'];
export type AssessmentOptionId = (typeof assessmentQuestions)[number]['options'][number]['id'];
export type AssessmentQuestionData = (typeof assessmentQuestions)[number];
