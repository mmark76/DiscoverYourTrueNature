import { StyleSheet, View } from 'react-native';

import { formatTranslation } from '../../../i18n/translations';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppearance } from '../../../settings/AppearanceProvider';
import type { SemanticColors } from '../../../settings/appearanceTypes';
import { AppText } from '../../../shared/components/AppText';
import { theme } from '../../../shared/styles/theme';
import type { ArchetypeMatch } from '../../assessment/types';

interface ResultRankingProps {
  matches: readonly ArchetypeMatch[];
}

export function ResultRanking({ matches }: ResultRankingProps) {
  const { colors } = useAppearance();
  const { content } = useTranslation();
  const copy = content.results;
  const styles = createStyles(colors);

  return (
    <View accessibilityLabel={copy.rankingAccessibility} style={styles.ranking}>
      <AppText accessibilityRole="header" style={styles.title}>{copy.fullProfile}</AppText>
      {matches.map((match, index) => {
        const name = copy.archetypes[match.archetype.id].name;
        const accessibilityLabel = formatTranslation(copy.matchStrengthAccessibility, {
          name,
          score: match.score,
        });

        return (
          <View key={match.archetype.id} style={styles.row}>
            <View style={styles.labelRow}>
              <AppText style={styles.rank}>{index + 1}</AppText>
              <AppText accessibilityElementsHidden style={styles.symbol}>{match.archetype.symbol}</AppText>
              <AppText style={styles.name}>{name}</AppText>
              <AppText style={styles.score}>{match.score}%</AppText>
            </View>
            <View
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="progressbar"
              accessibilityValue={{ max: 100, min: 0, now: match.score }}
              style={styles.track}
            >
              <View style={[styles.fill, { width: `${match.score}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function createStyles(colors: SemanticColors) {
  return StyleSheet.create({
    ranking: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: theme.radius.md, borderWidth: 1, gap: theme.spacing.sm, padding: theme.spacing.md },
    title: { color: colors.heading, fontSize: 21, fontWeight: '800', marginBottom: theme.spacing.xs },
    row: { gap: 5 },
    labelRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs, minWidth: 0 },
    rank: { color: colors.mutedText, fontSize: 12, fontWeight: '700', width: 20 },
    symbol: { fontSize: 18 },
    name: { color: colors.text, flex: 1, fontSize: 14, fontWeight: '700' },
    score: { color: colors.primary, fontSize: 13, fontWeight: '800' },
    track: { backgroundColor: colors.progressTrack, borderRadius: 999, height: 6, marginLeft: 28, overflow: 'hidden' },
    fill: { backgroundColor: colors.primary, height: '100%' },
  });
}
