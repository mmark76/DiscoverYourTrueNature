# Manual Test Plan — Prototype 0.1

## Setup

1. Install a current Node.js LTS version compatible with Expo SDK 57.
2. Run `npm install`.
3. Run `npm run web`.
4. Open the local address shown by Expo.

## Core flow

- The welcome screen appears without errors.
- The start button opens question 1.
- Exactly one question is shown at a time.
- The progress indicator advances after each answer.
- Ten answers lead to a result.
- A primary and a secondary archetype are displayed.
- Restart returns to question 1 with a clean score.

## Content review

For each question, record:

- whether the wording is clear,
- whether at least one option feels natural,
- whether an important response is missing,
- whether the answer makes the target animal too obvious,
- whether the question feels repetitive.

## Result review

Complete the test at least five times:

1. Answer naturally.
2. Deliberately favour analytical choices.
3. Deliberately favour leadership choices.
4. Deliberately favour social choices.
5. Deliberately favour stability choices.

Expected broad outcomes:

- analytical choices should favour Owl,
- leadership choices should favour Eagle,
- social choices should favour Dolphin,
- stability choices should favour Bear,
- independence and trusted-team choices should favour Wolf.

## Validation notes to capture

- Actual result.
- Expected result.
- Questions that influenced the result incorrectly.
- Text that felt accurate.
- Text that felt generic or exaggerated.
- Whether the experience remained enjoyable through question 10.
