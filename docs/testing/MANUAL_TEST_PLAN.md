# Manual Test Plan — Animals Within Ranked Assessment

This plan verifies the bilingual animal-first experience for model
`16-personality-ranking-v1-25q`. Manual observations are product and engineering checks, not
scientific validation.

## Setup

1. Run `npm install`.
2. Run `npm run typecheck`.
3. Run `npm test`.
4. Run `node scripts/analyzeAssessmentBalance.mjs`.
5. Run `npm run web` and open the local Expo URL.
6. For a production-style check, run `npx expo export --platform web` and serve the exported build.
7. Open browser Developer Tools with Console, Application/Storage, Accessibility, and Network panels
   available.

For a clean first-visit scenario, clear:

- `animals-within.assessment.v2`;
- legacy `animals-within.assessment.v1`;
- `animals-within.appearance.v1`;
- `animals-within.analytics-consent.v1`;
- first-party cookies beginning with `_ga`.

Do not clear unrelated browser storage when testing assessment restart or legacy migration.

## Home and navigation

Verify in English and Greek:

- the public title is **Animals Within** and the ecosystem link is **Markellos Ecosystem**;
- Home describes exactly 25 ranked questions, 20 fixed questions, five adaptive differentiators,
  four statements ranked 4 through 1, four internal dimensions, 16 patterns, 16 symbolic animals,
  primary and secondary animals, local deterministic scoring, and entertainment purpose;
- Home remains concise and does not expose formulas, percentages, codes, or classification titles;
- Discover opens a new or resumable assessment;
- The 16 Animals opens the catalogue without requiring assessment completion;
- How It Works opens the plain-language explanation;
- Settings, Feedback, Analytics choices, and ecosystem links remain active;
- every internal screen can return to Home without losing an unfinished assessment.

Confirm the URL and browser document title remain generic while navigating. They must not contain
question IDs, option IDs, ranks, adaptive IDs, animal results, or internal personality identifiers.

## Starting a new assessment

1. Clear only `animals-within.assessment.v2` and reload.
2. Start discovery.
3. Verify progress announces **Question 1 of 25** / **Ερώτηση 1 από 25** without scoring detail.
4. Verify the question prompt and four distinct behavioral statements are visible.
5. Verify the ranking guide shows all four meanings:
   - 4 — Describes me most;
   - 3 — Describes me quite well;
   - 2 — Describes me somewhat;
   - 1 — Describes me least;
   - and the natural Greek equivalents.
6. Confirm no question or answer names an animal, a four-letter code, a dimension, or a scoring rule.

## Ranking controls and collision policy

Repeat these checks with mouse, touch emulation, and keyboard:

1. Assign rank 4 to the first statement and verify visible number, label, border/indicator, and
   selected accessibility state.
2. Assign ranks 3 and 2 to two other statements, leaving the fourth unranked.
3. Attempt to continue. Verify advancement is blocked and a clear visible and announced incomplete
   message explains that 1, 2, 3, and 4 must each be used once.
4. Assign rank 1 to the fourth statement. Verify the question is announced as complete and Continue
   becomes available.
5. Before continuing, choose rank 4 on the statement currently holding rank 3. Verify those two
   statements swap ranks: the previous rank-4 statement now has 3 and the target has 4.
6. Clear or begin with an unranked target, then choose a rank already held elsewhere. Verify the rank
   moves to the target and its previous owner becomes unranked.
7. Choose the rank already assigned to the same statement. Verify state remains unchanged.
8. Verify selected state never depends on color alone and no duplicate rank remains after a swap.
9. Complete the exact 1-through-4 permutation and continue. Verify progress advances only once.

Confirm drag-and-drop is not required and all rank targets remain at least 44 by 44 logical pixels.

## Backward, forward, and internal navigation

1. Complete at least three questions with recognizable ranking patterns.
2. Move back one question and confirm all four rankings are preserved.
3. Move forward and confirm the next question's rankings remain preserved.
4. Edit a previous ranking, continue again, and verify the updated answer is retained.
5. Open Home, Catalogue, How It Works, and Settings at different points, then return through Discover.
6. Verify the same current position, completed rankings, and forward/back history remain.
7. Switch language and appearance while away from the assessment, then resume and verify no
   assessment state changed.

## Fixed-to-adaptive transition

1. Complete questions 1 through 19 and verify no adaptive IDs exist in the persisted record.
2. Complete question 20.
3. Inspect `animals-within.assessment.v2` and verify exactly five unique adaptive question IDs are
   selected for the current route.
4. Verify progress moves to question 21 of 25 without a scoring report or internal dimension label.
5. Complete questions 21 through 25 and verify none repeats another selected adaptive question.
6. Repeat the same 20 fixed ranking answers in a clean session and verify the same five adaptive IDs
   appear in the same order.
7. Change language and appearance after question 20 and again after question 23. Verify the selected
   adaptive sequence and eventual result do not change.
8. After answering at least three adaptive questions, navigate back to any fixed question and change
   its ranking. Verify all dependent adaptive answers are cleared, the five-question route is
   recalculated, and continuing resumes from the first adaptive question without losing fixed
   answers. Refresh at that point and verify the recalculated state restores instead of resetting.

The developer storage panel may show stable internal IDs. The visible application and accessibility
tree must not expose them.

## Completion and result

After question 25, verify the result hierarchy is:

1. primary animal name and symbol;
2. strong identifying sentence and natural-language primary description;
3. typical strengths;
4. possible blind spots;
5. interaction tendency;
6. information-processing tendency;
7. decision tendency;
8. organization/adaptation tendency;
9. secondary animal and concise description;
10. explanation of how the secondary pattern complements, softens, or differs from the primary;
11. retake and catalogue actions;
12. entertainment disclaimer.

Verify the secondary animal is distinct and is not described as inferior or less valid. If the
fixture is balanced, verify the result can explain that the profile sits close between related
patterns without showing technical tie data.

The visible result and accessibility tree must not contain:

- any four-letter personality code;
- personality classification titles such as Architect, Advocate, Commander, or equivalents;
- MBTI, Myers-Briggs, or language implying an official MBTI assessment;
- scores, percentages, pole totals, progress bars for dimensions, confidence, compatibility values,
  weights, distances, formulas, or rankings of all 16 patterns;
- raw answers, question IDs, adaptive rationale, debug values, or share text.

Switch between Greek and English on a completed result. Verify the same two animals remain while all
descriptions, headings, tendencies, relationship copy, actions, accessibility text, and disclaimer
change language naturally. Change appearance and verify the result remains identical.

Refresh the completed result and, where supported, close and reopen the application. Verify the same
result restores without briefly rendering a code or technical value.

## Sixteen-animal catalogue

Verify the catalogue is available before assessment completion and contains exactly these unique
animals in both languages:

1. Raven / Κοράκι
2. Octopus / Χταπόδι
3. Lion / Λιοντάρι
4. Fox / Αλεπού
5. Elephant / Ελέφαντας
6. Deer / Ελάφι
7. Dolphin / Δελφίνι
8. Otter / Βίδρα
9. Beaver / Κάστορας
10. Dog / Σκύλος
11. Wolf / Λύκος
12. Penguin / Πιγκουίνος
13. Falcon / Γεράκι
14. Swan / Κύκνος
15. Cheetah / Τσίτα
16. Peacock / Παγώνι

For every card, verify the animal name leads, descriptive copy is balanced, and no code,
classification title, score, or percentage appears visually or in its accessibility label.

After completing an assessment, revisit the catalogue. Verify separate text/icon indicators identify
the primary and secondary animals without relying only on color. Confirm there is exactly one of each
and all cards remain responsive and keyboard-readable.

## How It Works and disclaimer

Verify How It Works explains in plain language:

- every question has four statements;
- all four statements are ranked;
- 4 means most like the user and 1 means least like the user;
- the first 20 questions establish the broad pattern;
- the final five focus on the closest or most balanced areas;
- the application returns primary and secondary symbolic animals;
- calculation runs locally and percentages are not shown;
- animals are metaphors;
- this is not scientific or clinical assessment.

It must not reveal formulas, weights, pole totals, internal codes, classification titles, or distance
tables, and it must not call the product MBTI or official MBTI.

Verify the exact disclaimers appear where required:

English:

> An entertainment self-discovery experience. The animals are used symbolically. This is not a psychological diagnosis or a scientifically validated assessment.

Greek:

> Ψυχαγωγική εμπειρία αυτογνωσίας. Τα ζώα χρησιμοποιούνται συμβολικά. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονικά σταθμισμένη αξιολόγηση.

## Persistence and refresh

### Partial assessment

1. Complete at least seven questions and partially rank the next if partial in-question state is
   supported by the session contract.
2. Note the current position and completed ranking assignments.
3. Refresh the web application.
4. Verify the same valid persisted position and completed rankings restore.
5. Navigate away and back, then close and reopen where supported. Verify the session remains.

### Appearance and language isolation

1. During an unfinished assessment, switch language, mode, theme, font, and text size.
2. Verify question position, rankings, adaptive IDs, and any completed result remain unchanged.
3. Reload and verify both appearance preferences and assessment state restore independently.

### Completed result

1. Complete question 25 and record both animals.
2. Refresh and reopen where supported.
3. Verify the same primary, secondary, and balanced message restore in the selected language.
4. Confirm no unnecessary totals, distances, or complete type ranking are stored.

### Unavailable or corrupt storage

1. Simulate blocked storage and verify the application remains usable in memory.
2. Store malformed JSON under `animals-within.assessment.v2` and reload.
3. Verify a clean assessment starts without crashing.
4. Confirm appearance and analytics-consent records remain unchanged.

## Legacy-state migration

1. Clear only the current assessment key.
2. Place a representative old `12-archetype-v2-25q` record under
   `animals-within.assessment.v1` with old answers, two adaptive IDs, and an old result.
3. Preserve non-default language, appearance, and analytics-consent values in their separate stores.
4. Reload.
5. Verify the old assessment answers, adaptive IDs, and result are discarded.
6. Verify a clean schema 2/model `16-personality-ranking-v1-25q` assessment is initialized.
7. Verify language, mode, theme, font, text size, analytics consent, and unrelated storage are
   unchanged.
8. Confirm the implementation inspects only the known legacy assessment key and does not broadly
   clear local storage.

Repeat with an unknown schema version, wrong model version, invalid question/option ID, duplicate
rank, illegal adaptive ID, and result inconsistent with the answers. Each must fail safely to a clean
assessment while preserving unrelated preferences.

## Restart behavior

1. Set a non-default language and appearance and make an analytics choice.
2. Complete an assessment.
3. Choose Take it again / Κάνε το ξανά.
4. Verify question 1 opens with no answers, adaptive IDs, previous result, or balanced metadata.
5. Verify language, appearance, analytics consent, and unrelated preferences remain unchanged.
6. Refresh and verify the clean restarted assessment is what persists.

## Keyboard-only completion

Using no pointer:

1. Start from Home and enter the assessment.
2. Tab through ranking controls in a logical option-and-rank order.
3. Assign all four ranks, trigger a swap, correct an incomplete answer, and continue.
4. Navigate backward and forward without losing focus context.
5. Complete a representative run through question 25.
6. Use the result actions and open the catalogue.

Verify focus is always visible, never trapped, and moves to or announces each new question. Confirm
disabled Continue cannot be activated and no focusable control is covered by the fixed footer.

## Screen-reader verification

In English and Greek, inspect or operate with a screen reader:

- question heading and **Question n of 25** progress;
- the four-statement group label;
- every rank's number and meaning;
- assigned rank and selected state;
- the announcement after a swap or move;
- incomplete-ranking error and all-ranks-complete status;
- Back and Continue purpose and state;
- primary/secondary animal result hierarchy and relationship text;
- catalogue primary/secondary indicators;
- disclaimer, Settings, Feedback, Analytics choices, ecosystem, and build version.

No accessibility label or hint may contain an internal personality code, classification title,
score, percentage, distance, hidden dimension result, or adaptive ID.

## Responsive, zoom, language, and appearance matrix

Exercise representative combinations across:

| Surface | Suggested width |
| --- | ---: |
| narrow mobile | 390 px |
| wide mobile | 600 px |
| tablet | 768 px |
| laptop | 1280 px |
| desktop | 1440 px |

At minimum combine:

- English and Greek;
- Normal and Extra Large text;
- Light and Dark mode;
- Warm Ivory plus representative Ocean, Amber, and Plum checks;
- 100%, 125%, and 200% browser zoom where applicable.

On Home, every assessment question, result, catalogue, How It Works, Settings, analytics controls,
header, and footer, verify:

- no horizontal page scrolling;
- no clipped Greek or English text;
- no overlapping header groups or footer content;
- ranking controls wrap and remain usable without forcing four cards into one row;
- visible focus and non-color selected states remain distinct;
- the shared page edges align across header, main content, and footer;
- content and focused controls are not covered by the fixed footer;
- safe-area insets remain correct;
- all 16 catalogue cards retain consistent readable layouts.

## Analytics consent and network privacy

The configured public GA4 Measurement ID is `G-QBR3YHHMWS`. In Developer Tools, preserve the Network
log and filter for `googletagmanager`, `google-analytics`, `gtag/js`, and `collect`.

### Unknown and rejected

1. Clear analytics consent and `_ga` cookies, then reload.
2. Before choosing, verify the consent banner is visible and no Google tag, `collect` request, or
   `_ga` cookie exists.
3. Reject analytics and verify the zero-request state remains.
4. Reload and verify stored rejection keeps the tag unloaded.

### Accepted

1. Reopen Analytics choices and accept.
2. Verify the exact Google tag loads once and one explicit initial `page_view` is sent.
3. Inspect the payload. It may contain only the generic current page location and generic
   **Animals Within** page title.
4. Complete and restart an assessment, switch language/appearance, visit every screen, and restore a
   result. Verify there are no custom assessment or screen events and no payload containing answers,
   question/option IDs, ranks, dimensions, adaptive IDs, internal codes, animal names/results,
   primary/secondary types, confidence, distances, preferences, Feedback, or build version.

### Revoke and reaccept

1. Reject after acceptance.
2. Verify further dispatch stops, the GA disable flag is enabled, and only `_ga`-prefixed cookies are
   expired.
3. Confirm assessment, appearance, and unrelated storage remain.
4. Reload and verify rejection prevents tag loading.
5. Accept again and verify initialization occurs once without duplicated script, configuration, or
   initial page view.

## Feedback, URLs, page titles, and sharing

From header and footer, verify Feedback opens but never sends an email automatically. The draft must
contain only:

- recipient `markellos.markides@gmail.com`;
- subject `Animals Within Feedback`;
- selected localized language name;
- current public build identifier;
- a blank Feedback area.

Complete results for several animals and open Feedback each time. Confirm the draft never contains an
animal, code, classification title, answer, rank, adaptive ID, score, or result.

Inspect browser URL, query parameters, hash, document title, and any available share control on Home,
assessment, result, and catalogue. No assessment or personality result may be encoded. If no sharing
feature exists, confirm no share prompt or generated result text is present.

## Header, footer, themes, and build information

Verify the responsive header retains complete grouped navigation, Feedback/Ecosystem links, language
selection, and Settings without clipping. The Animals Within brand has no decorative dot.

Verify the footer remains fixed, measured, safe-area aware, and visually quiet. It must not cover
content or focus, and its centered copyright/link content must not be shifted by the secondary build
version. Check Feedback, Analytics choices, Markellos Ecosystem, and build version in accessibility
order.

For exported builds, confirm the public version format is `version_YYYYMMDD_HHmm_abcdefg`, uses
Cyprus local time through `Europe/Nicosia`, and exposes only seven source-revision characters. For a
development environment without deployment or Git metadata, confirm `version_dev_local` appears.

## Completion record

Record the tested build identifier, browser/device, viewport or device class, language, text size,
appearance mode, zoom, storage scenario, analytics decision, and observed result for each
representative run. Record failures as reproducible product issues. Do not describe result frequency
or manual impressions as scientific validation.
