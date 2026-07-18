import { ScrollView, StyleSheet } from 'react-native';

import { useAppearance } from '../../../settings/AppearanceProvider';
import { PageContent } from '../../../shared/components/PageContent';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentMode } from '../types';
import { AssessmentModeChooser } from './AssessmentModeChooser';

interface QuestionnaireSelectionScreenProps {
  onSelectMode: (mode: AssessmentMode) => void;
}

export function QuestionnaireSelectionScreen({ onSelectMode }: QuestionnaireSelectionScreenProps) {
  const { colors } = useAppearance();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={[styles.scrollView, { backgroundColor: colors.background }]}
    >
      <PageContent style={styles.page}>
        <AssessmentModeChooser onSelectMode={onSelectMode} />
      </PageContent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  page: { flexGrow: 1, paddingVertical: theme.spacing.xl },
});
