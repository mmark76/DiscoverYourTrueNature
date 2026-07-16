import { useAppearance } from '../settings/AppearanceProvider';
import { getTranslation } from './translations';

export function useTranslation() {
  const { settings } = useAppearance();

  return {
    content: getTranslation(settings.language),
    language: settings.language,
  };
}
