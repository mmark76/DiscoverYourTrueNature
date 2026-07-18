# Manual Test Plan — Animals Within Binary Assessment

This plan validates the public behavior of model `16-personality-binary-v2-30q` and schema 3. Manual
observations are product and engineering checks, not scientific or psychometric validation.

## Setup

Use a current production-style web build and, where available, an Android-compatible Expo build.
Record browser/device, viewport, language, appearance, text size, zoom, model version, and build ID.

Know the independent local keys:

- `animals-within.assessment.v3` — current binary assessment;
- `animals-within.assessment.v2` — incompatible ranked assessment;
- `animals-within.assessment.v1` — older incompatible assessment;
- appearance/language key;
- analytics-consent key.

When inspecting storage or network traffic, do not copy real user answers into issue trackers, logs,
screenshots, or remote tools. Internal IDs may be inspected only for this engineering verification.

Exercise at minimum:

- desktop: 1440 and 1280 CSS pixels;
- tablet: 768 CSS pixels;
- mobile: 390 CSS pixels;
- 100%, 125%, and 200% browser zoom where supported;
- Normal and Extra Large application text;
- English and Greek;
- keyboard-only and a screen reader available to the tester.

## Home and navigation

1. Open Home in English and Greek.
2. Verify it describes 30 questions with one choice between two alternatives, the 16 symbolic
   animals, primary/secondary results, local calculation, and entertainment purpose.
3. Verify Home does not describe four statements, ranks 4/3/2/1, swapping, or moving ranks.
4. Verify public copy does not label later questions “psychometric,” “adaptive,” or “differentiators.”
5. Confirm Home offers exactly the active assessment, 16-animal catalogue, and How It Works entries.
6. Open each destination and return through the shared header without losing assessment state.
7. Verify the generic URL and document title never contain an answer, internal code, or animal result.

## Starting a clean assessment

1. Clear only `animals-within.assessment.v3` and reload.
2. Start the assessment.
3. Verify progress announces **Question 1 of 30** / **Ερώτηση 1 από 30**.
4. Verify the screen shows one question, exactly two large answer cards, and visible **A / B** or
   **Α / Β** labels.
5. If the context label is visible, verify it says Personal life / Professional life naturally and
   does not expose internal phase, dimension, pole, weight, or question ID.
6. Verify the instruction asks for the option that more closely describes usual behavior.
7. Confirm no question or answer names an animal, personality code, classification title, dimension,
   score, or selection rule.

## Binary selection behavior

1. With no answer selected, activate Continue. Verify it does not advance and an accessible concise
   error explains that one answer is required.
2. Select A. Verify A has a check/marker and border or other non-color indicator, and B is unselected.
3. Select B. Verify B becomes selected and A becomes unselected; both are never selected together.
4. Select A again and verify the committed choice changes predictably.
5. Verify the selected state remains identifiable in light/dark modes and all four color themes.
6. Verify each card has a large touch target and that the whole intended card is operable.
7. Continue and return with Back. Verify the selected option remains committed.
8. Confirm no rank guide, rank number, collision message, drag-and-drop instruction, or completion
   permutation appears.

## Question structure and context sequence

Complete a representative run while recording only context labels and question numbers:

1. Questions 1–10 must be personal-life scenarios.
2. Questions 6–10 must cover hobbies, interests, stories/creative work, learning, or practice.
3. Questions 11–20 must be professional-life scenarios.
4. Questions 21–23 must be personal and questions 24–25 professional.
5. Questions 21–25 may sound more direct, but no public “psychometric” or internal `structured` label
   may appear.
6. Questions 26–30 must contain exactly two personal and three professional contexts, in the stable
   selected order, without a public “adaptive” or “differentiator” label.

For a source-assisted review, verify questions 1–20 contain five questions for each internal
dimension and the adaptive bank contains four per dimension, split two personal/two professional.

## A/B order and bilingual alignment

Use a developer/source-assisted checklist for several forward-keyed and reverse-keyed questions:

1. Confirm approximately half display the opposite pole as option A.
2. Confirm selecting a displayed letter is resolved through its option ID/pole metadata, not a fixed
   assumption that A is positive or B negative.
3. Change language on each sampled question and verify A/B order, current selection, and behavioral
   distinction remain aligned.
4. Verify the authoritative Greek wording and natural English wording describe the same distinction
   without literal mistranslation or moral ranking.

## Backward, forward, and internal navigation

1. Complete at least three questions with recognizable selections.
2. Move back and verify each committed A/B choice.
3. Move forward and verify later committed choices remain.
4. Edit an earlier answer and confirm later non-dependent base answers remain valid.
5. Open Catalogue, How It Works, Settings, and Home, then resume.
6. Verify position, answers, route, and any locked/final result are unchanged.
7. Refresh the browser and verify the same valid state restores.

## Phase transitions and primary lock

### Questions 20 to 21

1. Complete question 20.
2. Verify progress moves to question 21 of 30 without showing a score or result.
3. Verify no adaptive IDs or locked primary are stored yet.

### Questions 25 to 26

1. Complete question 25.
2. Inspect `animals-within.assessment.v3` in a developer context.
3. Verify exactly five unique adaptive IDs are stored, with exactly two personal and three
   professional contexts.
4. Verify `lockedPrimary` exists and `result` remains `null`.
5. Verify the UI moves directly to question 26 without revealing the primary early, a score,
   candidate ranking, dimension label, or selection rationale.
6. Repeat the same first 25 answers in a clean session and verify the same lock and ordered route.
7. Change language, appearance, and screen destination; verify the lock and route do not change.

### Primary cannot change during questions 26–30

1. Record the internal locked-primary ID after question 25.
2. Complete questions 26–30 with one set of selections.
3. Repeat the identical base 25 with an intentionally opposite set of final-five selections.
4. Verify the primary is identical in both runs even if the secondary changes.
5. Confirm no public copy reveals the lock timing or adaptive logic.

## Editing after adaptive progress

### Edit a base answer

1. Answer at least three questions in the final phase.
2. Navigate back to a question from 1–25 and change its selection.
3. Verify dependent adaptive answers and any final result are cleared.
4. Verify the revised first 25 answers remain, a revised primary is calculated and locked from those
   answers, and a deterministic five-question route is stored.
5. Verify continuation resumes on the revised route without stale adaptive answers.
6. Refresh before continuing and verify the revised state round-trips.

### Edit an adaptive answer

1. Complete all 30 questions, then go back within questions 26–30 and change a selection if the UI
   permits result review/back navigation.
2. Verify the route and locked primary remain unchanged.
3. Verify dependent final state is recalculated only after a complete valid route.

## Completion and result

After question 30, verify the result hierarchy:

1. primary animal name and symbol;
2. identifying sentence and primary description;
3. strengths;
4. possible blind spots;
5. interaction tendency;
6. information-processing tendency;
7. decision tendency;
8. organization/adaptation tendency;
9. animal metaphor;
10. secondary animal name, symbol, and description;
11. explanation of how the two patterns relate;
12. optional cautious personal-versus-professional observation when supported;
13. catalogue and retake actions;
14. the exact entertainment disclaimer.

Verify the secondary is distinct and not framed as inferior. If a close-pattern message appears, it
must be cautious and must not imply a confidence percentage.

The result must not show:

- a four-letter personality code;
- a classification title such as Architect, Advocate, or Commander;
- MBTI, Myers-Briggs, or official-assessment wording;
- raw dimension totals, weights, thresholds, confidence, distances, or candidate rankings;
- selected options, question IDs, context-profile values, adaptive IDs, or debug data;
- result-bearing share text or URL.

## Personal-versus-professional observation

Use deterministic test fixtures or developer controls rather than interpreting a real person's
answers:

1. Verify adaptive answers do not change the observation.
2. Verify a difference below the internal `0.40` threshold produces no claim.
3. Verify a qualifying difference produces cautious natural language about personal life versus
   work, without naming a dimension or pole.
4. Verify English and Greek observations preserve the same direction and remain grammatically
   natural.
5. Verify the result does not show a score, threshold, graph, percentage, or diagnostic conclusion.

The threshold is a product/editorial rule, not a scientific cutoff.

## Sixteen-animal catalogue

1. Open the catalogue without taking the assessment and verify exactly 16 animals.
2. Verify each card leads with animal name/symbol and contains animal-first description.
3. Verify no card displays a type code or classification title.
4. After completion, verify exactly one primary and one secondary indicator using symbol/text plus
   color, never color alone.
5. In Extra Large text, verify cards become one per row and no content clips.

## How It Works and disclaimer

Verify both languages explain:

- 30 questions with exactly one of two alternatives;
- 20 everyday, five more direct, and five final focused questions without public technical labels;
- primary after the shared first 25 and secondary after all 30 in plain language;
- local calculation and symbolic animal results;
- no displayed scores or percentages;
- the exact entertainment disclaimer.

No text may present the experience as psychometric, scientifically validated, MBTI, or official.

## Persistence and refresh

### Partial base session

1. Complete at least seven questions and note the position/selections.
2. Refresh or close/reopen.
3. Verify the same valid position and selected option IDs restore.
4. Verify no route, lock, or result exists before question 25.

### Exactly 25 answers

1. Complete question 25 and refresh.
2. Verify the five IDs and locked primary restore exactly and final result is absent.
3. Change language and verify the same question 26, route, and lock.

### Partial adaptive session

1. Complete 27 or 28 questions and refresh.
2. Verify all answers, the same route, and the locked primary restore.
3. Verify no premature final result exists.

### Completed result

1. Complete question 30 and record both public animals.
2. Refresh and change language.
3. Verify the same primary/secondary IDs project to localized animal copy without recalculation drift.
4. Confirm storage has no derived scores, context profiles, distances, candidate lists, or copy.

### Unavailable or corrupt storage

1. Block storage or simulate adapter failure and verify the application remains usable in memory.
2. Store malformed JSON under the v3 key and reload.
3. Verify a clean assessment starts and unrelated settings/consent remain.
4. Repeat with wrong schema/model, out-of-order/duplicate answers, missing/array/unknown/cross-question
   option ID, illegal route/quota, premature lock/result, and inconsistent secondary.
5. Every invalid record must fail closed without a crash.

## Migration from incompatible assessment state

### Ranked schema 2

1. Store a representative `16-personality-ranking-v1-25q` record under
   `animals-within.assessment.v2` with ranked answers, adaptive IDs, and a result.
2. Store known language, appearance, analytics consent, and unrelated preference values.
3. Load the application.
4. Verify no ranked answer, route, primary, secondary, or balance marker is converted.
5. Verify a clean schema-3 binary session starts.
6. Verify all independent settings, consent, and unrelated values are byte-for-byte unchanged.

### Older schema 1

Repeat with a representative schema-1/12-animal record. Only that assessment state may be removed or
ignored. The implementation must not scan or clear unrelated keys.

## Restart behavior

1. Create a partial or completed v3 assessment.
2. Record language, appearance, consent, and one unrelated preference.
3. Activate Retake/Restart.
4. Verify question 1 opens with no answers, adaptive IDs, lock, result, or context metadata.
5. Verify language, appearance, consent, and unrelated preference remain unchanged.

## Keyboard-only completion

1. Start at question 1 without using a pointer.
2. Tab in logical order through A, B, Back, and Continue.
3. Verify focus is visibly indicated and never clipped.
4. Select A, switch to B, trigger an incomplete error on another question, and continue.
5. Verify selected state, error focus/announcement, and question-heading focus after navigation.
6. Complete a representative run through question 30.
7. Verify catalogue/result actions and consent controls remain keyboard accessible.

## Screen-reader verification

For English and Greek, verify announcements include:

- question heading and **Question n of 30** progress;
- optional personal/professional context label;
- question text;
- A/Α and B/Β plus full alternative text;
- exactly one selected/checked state;
- selection change and incomplete-answer error;
- Back, Continue, and final See my animals action;
- primary/secondary animal result hierarchy and relationship text;
- optional context observation without dimension identifiers;
- catalogue primary/secondary indicators;
- disclaimer, Feedback, analytics choices, and build-version labels.

No accessibility label or hint may contain a personality code, classification title, selected option
ID, raw context profile, score, percentage, distance, hidden dimension, or adaptive ID.

## Responsive, zoom, language, and appearance matrix

At each required width/zoom/text-size combination, verify:

- no horizontal page scroll is required for core content;
- A/B cards stack or wrap without clipping and never depend on a single forced row;
- Greek words and sentences wrap naturally;
- long context/result copy remains readable;
- selected markers, borders, and focus outlines remain visible;
- Back/Continue controls remain reachable;
- the fixed footer does not cover screen content;
- header/footer groups wrap as complete groups;
- catalogue/result layouts remain usable.

## Analytics consent and network privacy

### Unknown and rejected

1. Start with unknown consent and verify the banner appears in normal flow.
2. Inspect network/script state: no Google tag and no analytics request may occur.
3. Reject and reload; verify rejection persists.

### Accepted

1. Accept consent.
2. Verify the Google tag initializes once and emits only the generic initial page view.
3. Confirm payloads contain none of: question/option ID, selected option, dimension, context profile,
   adaptive route, internal code, animal/result, locked primary, confidence, distance, model score,
   appearance, Feedback, or build version.

### Revoke and reaccept

1. Open Analytics choices from the footer.
2. Revoke and verify collection stops and only the integration's own `_ga` cookies are cleared.
3. Reaccept without reload and verify no duplicate initialization/page view.

## Feedback, URLs, page titles, and sharing

1. Open **Feedback** from header and footer. The word deliberately remains English and visually
   highlighted.
2. Verify the draft recipient/subject and that the body contains only language, build version, and an
   empty Feedback area.
3. Confirm it contains no answer, selected option, route, context profile, animal, code, score, or
   result.
4. Inspect URLs and document title across Home, assessment, result, and catalogue. No assessment or
   personality result may be encoded.
5. Confirm there is no result-bearing share action or payload.

## Header, footer, themes, and build information

1. Verify the header retains navigation, an English highlighted **Feedback** link, Markellos
   Ecosystem link, language control, and Settings as complete groups.
2. Verify the footer has exactly two semantic rows: centered copyright, then the link/navigation row
   with Feedback, analytics choices, ecosystem, and a secondary build version.
3. Verify the footer is fixed, measured, safe-area aware, and never covers content.
4. Verify the build ID format and accessibility label without exposing it to analytics.
5. Repeat in System/Light/Dark, Warm Ivory/Ocean/Amber/Plum, all fonts, and all text sizes.

## Completion record

Record:

- tested build/revision and model/schema identifiers;
- browsers/devices, widths, zoom, language, appearance, and text sizes;
- automated command results;
- any deviations with reproducible steps and screenshots that contain no real assessment data;
- explicit confirmation that results are animal-first, local, and entertainment-only.
