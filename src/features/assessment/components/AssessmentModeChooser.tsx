import { StyleSheet, View } from 'react-native';

import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentMode } from '../types';

interface AssessmentModeChooserProps {
  onSelectMode: (mode: AssessmentMode) => void;
}

export function AssessmentModeChooser({ onSelectMode }: AssessmentModeChooserProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.questionnaires;
  const styles = createStyles(colors);

  return (
    <View style={styles.chooser}>
      <View style={styles.heading}>
        <AppText style={styles.eyebrow}>{copy.eyebrow}</AppText>
        <AppText accessibilityRole="header" style={styles.title}>{copy.title}</AppText>
        <AppText style={styles.description}>{copy.description}</AppText>
      </View>

      <View accessibilityLabel={copy.groupLabel} role="group" style={styles.cards}>
        <ModeCard
          action={copy.shortAction}
          description={copy.shortDescription}
          hint={copy.shortHint}
          meta={copy.shortMeta}
          onPress={() => onSelectMode('short')}
          styles={styles}
          title={copy.shortTitle}
        />
        <ModeCard
          action={copy.longAction}
          description={copy.longDescription}
          hint={copy.longHint}
          meta={copy.longMeta}
          onPress={() => onSelectMode('long')}
          styles={styles}
          title={copy.longTitle}
        />
      </View>

      <AppText style={styles.persistenceNote}>{copy.persistenceNote}</AppText>
    </View>
  );
}

interface ModeCardProps {
  action: string;
  description: string;
  hint: string;
  meta: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  title: string;
}

function ModeCard({ action, description, hint, meta, onPress, styles, title }: ModeCardProps) {
  return (
    <FocusablePressable
      accessibilityHint={hint}
      accessibilityLabel={`${title}. ${meta}. ${description}. ${action}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardCopy}>
        <AppText accessibilityRole="header" style={styles.cardTitle}>{title}</AppText>
        <AppText style={styles.meta}>{meta}</AppText>
        <AppText style={styles.cardDescription}>{description}</AppText>
      </View>
      <View accessibilityElementsHidden style={styles.actionRow}>
        <AppText style={styles.action}>{action}</AppText>
        <AppText style={styles.arrow}>→</AppText>
      </View>
    </FocusablePressable>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    chooser: { gap: theme.spacing.md, minWidth: 0, width: '100%' },
    heading: { gap: theme.spacing.xs, minWidth: 0 },
    eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    title: { color: colors.heading, fontSize: 26, fontWeight: '900', lineHeight: 34 },
    description: { color: colors.text, fontSize: 15, lineHeight: 23, maxWidth: 720 },
    cards: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, minWidth: 0 },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      flexBasis: 280,
      flexGrow: 1,
      flexShrink: 1,
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      minHeight: 190,
      minWidth: 0,
      padding: theme.spacing.lg,
    },
    cardPressed: { backgroundColor: colors.selection, borderColor: colors.primary },
    cardCopy: { gap: theme.spacing.sm, minWidth: 0 },
    cardTitle: { color: colors.heading, fontSize: 23, fontWeight: '900', lineHeight: 30 },
    meta: { color: colors.primary, fontSize: 15, fontWeight: '900', lineHeight: 22 },
    cardDescription: { color: colors.text, fontSize: 15, lineHeight: 23 },
    actionRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    action: { color: colors.accent, fontSize: 15, fontWeight: '900', lineHeight: 22 },
    arrow: { color: colors.accent, fontSize: 19, fontWeight: '900', lineHeight: 22 },
    persistenceNote: { color: colors.mutedText, fontSize: 13, lineHeight: 20 },
  });
}
