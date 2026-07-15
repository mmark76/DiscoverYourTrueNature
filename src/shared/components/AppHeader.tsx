import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppScreen, NavigableScreen } from '../../app/navigation';
import { FocusablePressable } from './FocusablePressable';
import { PageContent } from './PageContent';
import { theme } from '../styles/theme';

interface AppHeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: NavigableScreen) => void;
}

const ecosystemUrl = 'https://markellosecosystem.com';

const navigationItems: ReadonlyArray<{ label: string; screen: NavigableScreen }> = [
  { label: 'Αρχική', screen: 'home' },
  { label: 'Ανακάλυψη', screen: 'assessment' },
  { label: 'Τα 12 Ζώα', screen: 'animals' },
  { label: 'Πώς Λειτουργεί', screen: 'how-it-works' },
];

export function AppHeader({ currentScreen, onNavigate }: AppHeaderProps) {
  const { width } = useWindowDimensions();
  const compact = width < 920;

  return (
    <View style={styles.header}>
      <PageContent style={[styles.headerInner, compact && styles.headerInnerCompact]}>
        <FocusablePressable
          accessibilityLabel="Animals Within, Αρχική"
          accessibilityRole="button"
          onPress={() => onNavigate('home')}
          style={({ pressed }) => [styles.brandButton, pressed && styles.pressed]}
        >
          <View style={styles.brandMark} />
          <Text style={styles.brand}>Animals Within</Text>
        </FocusablePressable>

        <View
          accessibilityLabel="Κύρια πλοήγηση"
          style={[styles.navigation, compact && styles.navigationCompact]}
        >
          {navigationItems.map((item) => {
            const selected = currentScreen === item.screen;
            return (
              <FocusablePressable
                key={item.screen}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onNavigate(item.screen)}
                style={({ pressed }) => [
                  styles.navButton,
                  selected && styles.navButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {item.label}
                </Text>
              </FocusablePressable>
            );
          })}

          <View accessibilityState={{ disabled: true }} style={styles.feedbackPlaceholder}>
            <Text style={styles.feedbackLabel}>Feedback</Text>
            <Text style={styles.soonLabel}>Προσεχώς</Text>
          </View>

          <FocusablePressable
            accessibilityLabel="Επιστροφή στο Markellos Ecosystem"
            accessibilityRole="link"
            onPress={() => Linking.openURL(ecosystemUrl)}
            style={({ pressed }) => [styles.ecosystemButton, pressed && styles.pressed]}
          >
            <Text style={styles.ecosystemLabel}>Επιστροφή στο Markellos Ecosystem</Text>
          </FocusablePressable>
        </View>
      </PageContent>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surfaceMuted,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  headerInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  headerInnerCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  brandButton: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingVertical: 4,
  },
  brandMark: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  brand: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  navigation: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'flex-end',
  },
  navigationCompact: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  navButton: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  navButtonSelected: {
    backgroundColor: '#E2EAE5',
  },
  navLabel: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  navLabelSelected: {
    color: theme.colors.primary,
  },
  feedbackPlaceholder: {
    alignItems: 'center',
    opacity: 0.65,
    paddingHorizontal: theme.spacing.sm,
  },
  feedbackLabel: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  soonLabel: {
    color: theme.colors.accent,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ecosystemButton: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginLeft: 'auto',
    maxWidth: '100%',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  ecosystemLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.65,
  },
});
