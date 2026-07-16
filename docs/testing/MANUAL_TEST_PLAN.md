# Manual Test Plan — Animals Within Bilingual Dashboard

## Setup

1. Run `npm install`.
2. Run `npm run typecheck` and `npm test`.
3. Run `npm run web` and open the local Expo URL.
4. Clear the `animals-within.appearance.v1` browser preference before new-user default scenarios.
5. Clear the `animals-within.analytics-consent.v1` preference and `_ga`-prefixed cookies before
   first-visit analytics scenarios.

## Responsive dashboard

- Desktop (at least 1080 px): verify three feature-card columns and a readable header/footer.
- Tablet (680–1079 px): verify two cards share the first row and the third forms a balanced full-width row.
- Mobile (below 680 px): verify one card per row, readable hero copy, and reachable navigation.
- Repeat at wide desktop, normal laptop, tablet, and mobile widths in both languages.
- At every size, verify no horizontal scrolling, clipped text, overlapping controls, or hidden
  Settings/language controls.
- Tab through active controls and verify visible focus/pressed behavior and meaningful labels.

## Navigation

- **Αρχική / Home** opens Home from every internal view.
- **Ανακάλυψη / Discover**, the hero action, and active discovery actions open the assessment.
- **Τα 12 Ζώα / The 12 Animals** opens the twelve-archetype catalog.
- **Πώς Λειτουργεί / How It Works** opens the scoring and disclaimer explanation.
- Header and footer ecosystem links open `https://markellosecosystem.com`.
- Verify Home contains only the active Discover, 12 Animals, and How It Works cards.
- Header and footer Feedback links open an email draft.

## Assessment state and result

1. Start the assessment and answer at least two questions.
2. Open Home through the header.
3. Choose **Ανακάλυψη** and verify the same unfinished question is restored.
4. Complete all 25 questions and verify only a primary animal, secondary animal, and restart action
   appear in the result content.
5. Open Home from the result and verify the dashboard remains available.
6. Complete another run and choose **Take it again / Κάνε το ξανά**; verify question 1 opens with
   no answers, adaptive choices, or previous result while language, appearance, and analytics consent
   remain unchanged.

## Twelve-animal catalog

- Verify all twelve required animals and provisional trait descriptions are present.
- Verify every card uses a consistent presentation with its canonical animal symbol.
- Verify no availability or status badge separates the twelve animals.
- Verify every animal can appear as a primary and a secondary assessment result.

## Content and safety

- Verify How It Works describes 25 quick local choices, deterministic comparison with twelve
  profiles, and the entertainment-only purpose without revealing which questions are adaptive.
- Verify How It Works describes the experience as recreational and non-diagnostic without adding a
  long disclaimer to the result.
- Verify the footer copyright uses the current year without changing between Greek and English.
- Verify there is no Privacy placeholder or invented Privacy destination.

## Analytics consent and GA4 bootstrap

Use browser Developer Tools with **Preserve log** enabled. Filter the Network panel for
`googletagmanager`, `google-analytics`, `gtag/js`, and `collect`. The configured Measurement ID is
`G-QBR3YHHMWS`.

### Unknown and reject flows

1. Clear `animals-within.analytics-consent.v1`, all `_ga`-prefixed cookies for the application
   domain, and the Network log, then reload.
2. Before making a choice, confirm the consent banner is visible and there is no request to
   `googletagmanager.com` or `google-analytics.com`, no `gtag/js` resource, no `collect` request, and
   no `_ga` cookie.
3. Choose **Reject analytics / Απόρριψη analytics** and confirm the same zero-request and
   zero-cookie state remains.
4. Reload and confirm the stored rejection keeps the banner hidden and the Google tag unloaded.

### Accept flow

1. Reopen **Analytics choices / Επιλογές analytics** from the footer and choose Accept.
2. Confirm one request loads
   `https://www.googletagmanager.com/gtag/js?id=G-QBR3YHHMWS` without requiring a reload.
3. Confirm exactly one explicit initial `page_view` reaches GA4 and that automatic page-view
   duplication is absent.
4. Inspect the request payload and confirm it contains only the current page location and document
   title from the application. Confirm it contains no answers, question or option IDs, trait values,
   adaptive candidates, animal IDs or names, rankings, email or Feedback content, language/theme
   preferences, or build version.
5. Navigate among Home, assessment, catalog, information, Settings, and result screens. Confirm no
   additional SPA page views, screen views, or custom application analytics events are sent; those
   features are not implemented yet.

### Revoke and reaccept flows

1. After the accepted flow, reopen Analytics choices and choose Reject.
2. Confirm no further application analytics dispatch occurs, the GA disable flag for
   `G-QBR3YHHMWS` is enabled, and only cookies beginning with `_ga` are removed. Confirm unrelated
   cookies and local-storage preferences remain.
3. Reload and confirm the stored rejection prevents the Google tag from loading.
4. Accept again and confirm GA4 can initialize without a reload and does not duplicate its script,
   configuration, or initial page view within the current page lifetime.

## Appearance settings

Test a selective matrix across desktop and mobile:

- Greek and English interface labels;
- System, Light, and Dark modes;
- Warm Ivory, Ocean, Amber, and Plum themes;
- System Sans, Serif, and Highly Readable fonts;
- Normal and Extra Large text sizes.

For each representative combination:

- verify the header wraps without clipped navigation or horizontal scrolling;
- verify hero, feature cards, assessment choices, results, animal descriptions, information screens,
  and footer remain readable;
- verify every question offers exactly one selectable answer and advances once selected;
- verify keyboard focus is clearly visible in every color theme;
- verify catalog cards do not resemble unavailable or disabled controls;
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
10. Confirm Reset and verify English, Light mode, Amber, System Sans, and Large size return.
11. Simulate unavailable or invalid storage and verify the application still loads with safe defaults.

## Required bilingual scenarios

1. Start with Greek browser locale and no saved preferences; verify English remains the default.
2. Start with non-Greek browser locale and no saved preferences; verify English remains the default.
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

## Twenty-five-question and result review

- Review the 23 fixed questions and all 10 adaptive-bank questions in English and Greek. Confirm a
  completed run contains exactly 25 answers: the 23 fixed questions followed by two distinct
  adaptive-bank questions.
- Confirm each question has four options, no animal is named, and no answer is framed as the best choice.
- Open Settings at question 12, switch language and appearance, return, and verify question 12 remains.
- Switch language after question 23 and after question 24; verify answers, current position, selected
  adaptive IDs, and eventual result do not change.
- Complete representative legal 25-answer fixtures for all twelve primary and all twelve secondary
  animals.
- Verify the result body shows only the primary label/name, secondary label/name, and restart action.
  Confirm there are no percentages, confidence, ranking, analysis, strengths, weaknesses, charts,
  trait labels, recommendations, share prompts, or extra result cards.
- Confirm restart clears all 25 answers, both adaptive IDs, and the result.
- Confirm the fixed footer covers no question, option, result text, or focused control.

Run the visual matrix at approximately 1440 px desktop, 1280 px laptop, 768 px tablet, and 390 px
mobile in English and Greek, Small and Extra Large text, Light and Dark modes, and 200% browser zoom.
For representative combinations, verify the progress counter moves from 1 through 25, questions feel
quick and non-repetitive, options remain neutral and wrap fully, focus order is logical, the question
change is announced, and no horizontal scrolling or footer overlap appears.

## Warm Ivory and fixed-footer review

Run and record all 22 scenarios below:

1. Warm Ivory Light on desktop.
2. Warm Ivory Dark on desktop.
3. Warm Ivory Light on mobile.
4. Warm Ivory Dark on mobile.
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
is no horizontal scrolling and that Feedback, Ecosystem, and the build identifier share the
second semantic row at supported mobile widths.

Verify Warm Ivory uses sand backgrounds, near-white cream cards, warm-brown headings, ink-blue body
text, blue-grey borders, pale amber selected states, and calm focus indicators. Primary actions must
use a controlled burnt-orange semantic `primary` fill with `onPrimary` text in Warm Ivory, Ocean,
Amber, and Plum; secondary actions must remain quieter and catalog cards consistent and readable.
Confirm no sage or grey-green identity remains. Check that the visible theme labels are **Warm Ivory**
and **Ζεστό Κρεμ**, while an existing stored `forest` preference still selects this theme.

Review Home, assessment, result, 12 Animals, How It Works, and Settings at desktop and mobile widths,
in Light and Dark mode, in Greek and English, with Normal and Extra Large text. Repeat at 125% and
200% browser zoom. Confirm cards remain distinct, enabled actions do not resemble disabled controls,
no content is covered by the footer, and no horizontal scrolling appears.

For the Header and Footer Feedback entry points, verify the email client opens a draft without sending it. Confirm the
recipient is `markellos.markides@gmail.com`, the subject is `Animals Within Feedback`, and the body
contains the selected localized language name, current build identifier, and a blank Feedback area.
Inspect the footer with a screen reader in both languages and verify this order: copyright,
Feedback, Analytics choices, Markellos Ecosystem, build version. Verify calm visible keyboard focus and usable touch
targets.

For exported/deployed builds, confirm the format is `version_YYYYMMDD_HHmm_abcdefg`, the timestamp
uses Cyprus local time from the IANA `Europe/Nicosia` timezone, and only seven commit characters are
visible. Check a winter build against UTC+2 and a summer build against UTC+3 to confirm daylight-saving
time is applied without using the browser or device timezone. For a local checkout, confirm Git HEAD is used;
without deployment or Git metadata, confirm `version_dev_local` appears.
