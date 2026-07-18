import type { NavigableScreen } from '../../../app/navigation';

export interface HomeFeature {
  id: string;
  screen: NavigableScreen;
}

export const homeFeatures = [
  {
    id: 'discovery',
    screen: 'questionnaires',
  },
  {
    id: 'animals',
    screen: 'animals',
  },
  {
    id: 'how-it-works',
    screen: 'how-it-works',
  },
] as const satisfies readonly HomeFeature[];

export type HomeFeatureId = (typeof homeFeatures)[number]['id'];
export type HomeFeatureData = (typeof homeFeatures)[number];
