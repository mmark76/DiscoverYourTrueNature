# Manual Test Plan — Animals Within Bilingual Dashboard

## Setup

1. Run `npm install`.
2. Run `npm run typecheck` and `npm test`.
3. Run `npm run web` and open the local Expo URL.
4. Clear the `animals-within.appearance.v1` browser preference before locale-default scenarios.

## Responsive dashboard

- Desktop (at least 1080 px): verify three feature-card columns and a readable header/footer.
- Tablet (680–1079 px): verify two feature-card columns and wrapped navigation.
- Mobile (below 680 px): verify one card per row, readable hero copy, and reachable navigation.
- Repeat at wide desktop, normal laptop, tablet, and mobile widths in both languages.
- At every size, verify no horizontal scrolling, clipped text, overlapping controls, or hidden
  Settings/language controls.
- Tab through active controls and verify visible focus/pressed behavior and meaningful labels.

## Navigation

- **Αρχική / Home** opens Home from every internal view.
- **Ανακάλυψη / Discover**, the hero action, and active discovery actions open the assessment.
- **Τα 12 Ζώα / The 12 Animals** opens the informational catalog.
- **Πώς Λειτουργεί / How It Works** opens the scoring and disclaimer explanation.
- Header and footer ecosystem links open `https://markellosecosystem.com`.
- Header and footer Feedback links open an email draft; Privacy, comparison, and sharing remain
  marked **Προσεχώς / Coming Soon** and are not actionable.

## Assessment state and result

1. Start the assessment and answer at least two questions.
2. Open Home through the header.
3. Choose **Ανακάλυψη** and verify the same unfinished question is restored.
4. Complete all ten questions and verify a primary and secondary archetype appear.
5. Open Home from the result and verify the dashboard remains available.
6. Complete another run and choose restart; verify question 1 opens with clean scores.

## Twelve-animal catalog

- Verify all twelve required animals and provisional trait descriptions are present.
- Verify Wolf, Owl, Eagle, Dolphin, and Bear show the localized available label.
- Verify the remaining seven show **Προσεχώς / Coming Soon**.
- Verify no coming-soon animal can be selected or produced by the assessment.

## Content and safety

- Verify How It Works identifies the questions as experimental and scoring as deterministic.
- Verify the home/footer language describes the experience as recreational.
- Verify the footer says it is not a psychological diagnosis or scientific assessment.
- Verify there is no invented feedback or privacy destination.

## Appearance settings

Test a selective matrix across desktop and mobile:

- Greek and English interface labels;
- System, Light, and Dark modes;
- Forest, Ocean, Amber, and Plum themes;
- System Sans, Serif, and Highly Readable fonts;
- Normal and Extra Large text sizes.

For each representative combination:

- verify the header wraps without clipped navigation or horizontal scrolling;
- verify hero, feature cards, assessment choices, results, animal descriptions, information screens,
  and footer remain readable;
- verify selected options show both the check indicator and selected styling;
- verify keyboard focus is clearly visible in every color theme;
- verify disabled and **Προσεχώς / Coming soon** states remain distinct;
- verify the ecosystem destination remains a text link.
- inspect meaningful navigation, progress, status, disabled-state, and action labels with a screen reader.
- verify the selected language control exposes its radio state and never uses a flag.

## Persistence and state preservation

1. Start the assessment and answer at least three questions.
2. Open Settings from the assessment header.
3. Change language, mode, theme, font, and text size, then return.
4. Verify the same question and accumulated progress remain.
5. Complete the assessment, change settings from the result, and verify the result remains unchanged.
6. Refresh and verify manually selected preferences are restored.
7. Select System mode and switch the operating-system appearance preference; verify the app follows it.
8. Choose Extra Large with Greek labels on mobile; verify controls wrap without clipping or overflow.
9. Select Reset, cancel the inline confirmation, and verify nothing changes.
10. Confirm Reset and verify locale language, System mode, Forest, System Sans, and Normal size return.
11. Simulate unavailable or invalid storage and verify the application still loads with safe defaults.

## Required bilingual scenarios

1. Start with Greek browser locale and no saved preferences.
2. Start with non-Greek browser locale and no saved preferences.
3. Change from Greek to English on Home.
4. Change from English to Greek inside Settings.
5. Switch language after answering at least three questions.
6. Verify the same question and progress remain.
7. Complete the assessment in one language.
8. Change language on the result screen.
9. Verify the same primary and secondary result remain.
10. Refresh and verify the manual language choice persists.
11. Inspect all twelve animal cards in both languages.
12. Test both languages with Extra Large text on mobile.
13. Verify no untranslated Greek text remains in English mode except:
    - the Greek language choice label “Ελληνικά”;
    - the unchanged product name “Animals Within”.
14. Verify no English content remains in Greek mode except accepted proper names or intentionally
    shared product terminology such as “Animals Within” and “Feedback”.

For scenarios 3–9, also verify that switching language does not navigate away from the current
screen. At each responsive width, test keyboard focus, localized accessibility labels, selected and
disabled states, complete answer-option wrapping, and the absence of horizontal overflow.

## Soft Sage Forest and fixed-footer review

Run and record all 22 scenarios below:

1. Forest Light on desktop.
2. Forest Dark on desktop.
3. Forest Light on mobile.
4. Forest Dark on mobile.
5. Greek interface.
6. English interface.
7. Normal text.
8. Extra Large text.
9. Browser zoom at both 125% and 200%.
10. Home screen with the fixed footer.
11. Assessment screen, including the final answer options.
12. Result screen actions.
13. Animals screen final cards.
14. How It Works final call to action.
15. Settings final controls.
16. Mobile safe area.
17. Keyboard navigation through footer links.
18. Feedback mailto from the header.
19. Feedback mailto from the footer.
20. Build version visible at the bottom-right.
21. Refresh after deployment and verify the version remains stable for that build.
22. Deploy a later commit and verify the version changes automatically.

For every applicable scenario, confirm the footer remains fixed and visually quiet, contains only
the two semantic rows, and never covers content or keyboard focus. Verify the measured content
offset responds to wrapping, language, Extra Large text, zoom, and safe-area changes. Confirm there
is no horizontal scrolling and that Privacy, Feedback, Ecosystem, and the build identifier share the
second semantic row at supported mobile widths.

Verify Forest uses soft cream/sage or charcoal-sage surfaces, readable subdued text, soft selected
states, and calm focus indicators. No orange button or ordinary accent-colored text should remain.
Primary actions must use the semantic primary fill and `onPrimary` text in Forest, Ocean, Amber, and
Plum; Coming Soon badges must remain muted and readable.

For both Feedback entry points, verify the email client opens a draft without sending it. Confirm the
recipient is `markellos.markides@gmail.com`, the subject is `Animals Within Feedback`, and the body
contains the selected localized language name, current build identifier, and a blank Feedback area.
Inspect the footer with a screen reader in both languages and verify this order: disclaimer, Privacy,
Feedback, Markellos Ecosystem, build version. Verify calm visible keyboard focus and usable touch
targets.

For exported/deployed builds, confirm the format is `version_YYYYMMDD_HHmm_abcdefg`, the timestamp
is UTC, and only seven commit characters are visible. For a local checkout, confirm Git HEAD is used;
without deployment or Git metadata, confirm `version_dev_local` appears.
