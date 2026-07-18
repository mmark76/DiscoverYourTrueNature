import type { AssessmentMode } from '../types.ts';
import type { AssessmentStorageAdapter } from './assessmentStorage.ts';

export const assessmentModeStorageKey = 'animals-within.assessment.active-mode';

export function restoreAssessmentMode(
  storage: AssessmentStorageAdapter | null,
): AssessmentMode | null {
  if (!storage) return null;
  try {
    const storedMode = storage.getItem(assessmentModeStorageKey);
    if (storedMode === null || storedMode === 'short' || storedMode === 'long') {
      return storedMode;
    }
    storage.removeItem?.(assessmentModeStorageKey);
  } catch {
    // Mode persistence is optional; callers can show the questionnaire chooser.
  }
  return null;
}

export function persistAssessmentMode(
  storage: AssessmentStorageAdapter | null,
  mode: AssessmentMode,
): void {
  try {
    storage?.setItem(assessmentModeStorageKey, mode);
  } catch {
    // Mode persistence is optional; the active in-memory session remains usable.
  }
}
