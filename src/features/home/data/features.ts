import type { NavigableScreen } from '../../../app/navigation';

export interface HomeFeature {
  id: string;
  action?: {
    screen: NavigableScreen;
  };
}

export const homeFeatures = [
  {
    id: 'discovery',
    action: { screen: 'assessment' },
  },
  {
    id: 'animals',
    action: { screen: 'animals' },
  },
  {
    id: 'how-it-works',
    action: { screen: 'how-it-works' },
  },
  { id: 'compare', action: undefined },
  { id: 'share', action: undefined },
  { id: 'feedback', action: undefined },
] as const satisfies readonly HomeFeature[];

export type HomeFeatureId = (typeof homeFeatures)[number]['id'];
export type HomeFeatureData = (typeof homeFeatures)[number];
