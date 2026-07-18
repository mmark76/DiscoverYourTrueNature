export type AppScreen =
  | 'home'
  | 'questionnaires'
  | 'assessment'
  | 'result'
  | 'animals'
  | 'how-it-works'
  | 'settings';

export type NavigableScreen = 'home' | 'questionnaires' | 'animals' | 'how-it-works';

export function shouldShowAppChrome(_screen: AppScreen) {
  return true;
}
