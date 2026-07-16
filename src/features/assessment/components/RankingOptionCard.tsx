import { StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import type { AssessmentRankCopy } from '../../../i18n/translationTypes';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { FocusablePressable } from '../../../shared/components/FocusablePressable';
import { theme } from '../../../shared/styles/theme';
import type { AssessmentRank } from '../types';

export const assessmentRankOrder = [4, 3, 2, 1] as const satisfies readonly AssessmentRank[];

interface RankingOptionCardProps {
  assignedRank?: AssessmentRank;
  label: string;
  rankControlHint: string;
  rankControlLabel: string;
  rankLabels: AssessmentRankCopy;
  rankingGroupLabel: string;
  onAssignRank: (rank: AssessmentRank) => void;
}

export function RankingOptionCard({
  assignedRank,
  label,
  rankControlHint,
  rankControlLabel,
  rankLabels,
  rankingGroupLabel,
  onAssignRank,
}: RankingOptionCardProps) {
  const { colors } = useAppearance();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText style={styles.statement}>{label}</AppText>
      <View
        accessibilityLabel={formatTranslation(rankingGroupLabel, { statement: label })}
        role="radiogroup"
        style={styles.rankControls}
      >
        {assessmentRankOrder.map((rank) => {
          const selected = rank === assignedRank;
          const accessibilityLabel = formatTranslation(rankControlLabel, {
            rank,
            meaning: rankLabels[rank],
            statement: label,
          });

          return (
            <FocusablePressable
              key={rank}
              accessibilityHint={rankControlHint}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onAssignRank(rank)}
              style={({ pressed }) => [
                styles.rankButton,
                selected && styles.rankButtonSelected,
                pressed && styles.rankButtonPressed,
              ]}
            >
              <AppText style={[styles.rankNumber, selected && styles.rankNumberSelected]}>
                {rank}
              </AppText>
              {selected && (
                <AppText accessibilityElementsHidden style={styles.selectedMark}>✓</AppText>
              )}
            </FocusablePressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.md,
      minWidth: 0,
      padding: theme.spacing.md,
      width: '100%',
    },
    statement: { color: colors.text, fontSize: 17, lineHeight: 25 },
    rankControls: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      minWidth: 0,
      width: '100%',
    },
    rankButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexBasis: 58,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 52,
      minWidth: 52,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      position: 'relative',
    },
    rankButtonSelected: {
      backgroundColor: colors.selection,
      borderColor: colors.primary,
      borderWidth: 3,
    },
    rankButtonPressed: { opacity: 0.72 },
    rankNumber: { color: colors.text, fontSize: 19, fontWeight: '800', lineHeight: 24 },
    rankNumberSelected: { color: colors.heading },
    selectedMark: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '900',
      position: 'absolute',
      right: 6,
      top: 4,
    },
  });
}
