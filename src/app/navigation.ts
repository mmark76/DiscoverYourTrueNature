export type AppScreen = 'home' | 'assessment' | 'result' | 'animals' | 'how-it-works' | 'settings';

export type NavigableScreen = 'home' | 'assessment' | 'animals' | 'how-it-works';

export function shouldShowAppChrome(_screen: AppScreen) {
  return true;
}
