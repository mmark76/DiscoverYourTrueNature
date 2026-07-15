import type { NavigableScreen } from '../../../app/navigation';

export interface HomeFeature {
  id: string;
  action?:
    | { type: 'navigate'; screen: NavigableScreen }
    | { type: 'feedback' };
}

export const homeFeatures = [
  {
    id: 'discovery',
    action: { type: 'navigate', screen: 'assessment' },
  },
  {
    id: 'animals',
    action: { type: 'navigate', screen: 'animals' },
  },
  {
    id: 'how-it-works',
    action: { type: 'navigate', screen: 'how-it-works' },
  },
  { id: 'compare', action: undefined },
  { id: 'share', action: undefined },
  { id: 'feedback', action: { type: 'feedback' } },
] as const satisfies readonly HomeFeature[];

export type HomeFeatureId = (typeof homeFeatures)[number]['id'];
export type HomeFeatureData = (typeof homeFeatures)[number];
