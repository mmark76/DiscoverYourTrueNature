# Automated Testing

This document defines the intended engineering checks for model
`16-personality-ranking-v1-25q`. Passing these checks establishes structural and deterministic
software behavior only; it does not establish psychological or scientific validity.

## Required commands

Run from the repository root:

```bash
npm install
npm run typecheck
npm test
node scripts/analyzeAssessmentBalance.mjs
npx expo export --platform web
```

These commands must complete successfully before the work is reported as validated. This document
does not record a run result; command outcomes belong in the pull-request verification notes.

## Question metadata invariants

Automated tests cover:

1. exactly 20 fixed questions;
2. exactly five fixed questions for `energy` (E-I), `information` (S-N), `decisions` (T-F), and
   `structure` (J-P);
3. exactly four options for every fixed question;
4. exactly four options for every adaptive candidate;
5. at least four adaptive candidates for each dimension;
6. stable, unique question and option IDs;
7. exactly one declared pole per option;
8. intensity restricted to 1 or 2;
9. each question's exact strong-first, moderate-first, moderate-second, strong-second composition;
10. scoring metadata absent from translated content;
11. assessment questions containing no animal names, internal codes, moral ranking, clinical wording,
   or animal-specific result branches.

## Ranking and session invariants

Tests exercise ranking behavior independently from rendering:

- a complete answer is the exact rank permutation 1, 2, 3, 4;
- duplicate, missing, unknown, and out-of-range rankings are invalid;
- choosing an occupied rank swaps it when both options were ranked;
- choosing an occupied rank for an unranked option moves it and clears the previous owner;
- selecting the same rank for the same option is stable;
- incomplete rankings cannot advance;
- a complete ranking advances once and cannot be replayed as a stale action;
- moving backward and forward preserves rankings and selected adaptive IDs;
- editing a fixed answer after adaptive progress deterministically recalculates the route, clears
  all dependent adaptive answers/results, and remains persistence-safe;
- exactly 25 valid answers complete a run;
- restart creates a clean assessment while leaving settings and consent untouched.

Source-level UI tests complement manual interaction by checking explicit rank controls, visible
numbers and guide labels, non-color selected indicators, disabled/validation state, minimum touch
targets, focus behavior, progress semantics, live announcements, and wrapping without horizontal
scroll containers.

## Scoring and adaptive invariants

Focused numeric fixtures verify:

- contribution equals `rank × intensity × phase weight`;
- fixed phase weight is 1 and adaptive phase weight is 0.75;
- contributions accumulate only into the option's declared pole;
- all eight pole totals accumulate correctly;
- signed preferences use `(first - second) / (first + second)`;
- exact zero remains a balanced dimension;
- fixed-only balance ordering is deterministic;
- equal balances use `energy`, `information`, `decisions`, `structure` order;
- adaptive allocation is exactly 2, 2, and 1, with none for the fourth dimension;
- exactly five unique adaptive IDs are selected from the correct dimension banks;
- candidate ties use stable adaptive ID order;
- identical fixed rankings produce the same adaptive sequence;
- adaptive weight refines close dimensions without an equal rank/intensity having fixed-question
  weight.

## Type, mapping, distance, and tie invariants

Tests verify:

- exactly the 16 approved internal personality combinations exist;
- all 16 internal IDs map to exactly one animal;
- all 16 animals are unique and map back to exactly one internal ID;
- the exact Raven, Octopus, Lion, Fox, Elephant, Deer, Dolphin, Otter, Beaver, Dog, Wolf, Penguin,
  Falcon, Swan, Cheetah, and Peacock mapping is retained;
- all four dimensions contribute equally to normalized 16-corner distance;
- primary calculation evaluates all 16 candidates and is deterministic;
- secondary calculation uses the same complete 16-candidate ordering and is distinct from primary;
- exact dimension ties retain balanced markers and are not converted randomly;
- equal whole-profile distances use fixed internal type order;
- object-property order, language, locale, appearance, and repeated runs do not change results.

Representative legal 25-question fixtures include:

- a clear internal `INTJ` result whose public animal is Raven;
- a clear internal `ENFP` result whose public animal is Otter;
- a clear internal `ISTJ` result whose public animal is Beaver;
- a close primary-secondary pair;
- a balanced-dimension case;
- an exact-tie case;
- deterministic adaptive selection from identical fixed rankings.

Internal codes in these fixtures are developer-only identifiers and do not permit them in public
presentation.

## Localization and public-output privacy

Greek and English dictionaries must have identical populated structures and complete entries for
all questions, options, ranking labels, validation/error text, animals, result sections, relationship
copy, catalogue state, How It Works content, accessibility text, and disclaimers.

Public-output tests collect translation string values and presentation projections, then verify:

- no standalone internal code from `INTJ` through `ESFP` occurs;
- no personality classification title such as Architect, Advocate, Commander, or its Greek
  equivalent occurs as a visible label;
- no MBTI, Myers-Briggs, or official-MBTI wording occurs;
- public result objects contain animal descriptions, strengths, possible blind spots, tendencies,
  secondary description, and relationship copy, but no score, percentage, confidence, pole total,
  normalized value, weight, distance, or candidate ranking;
- result and catalogue accessibility labels derive from animal-first copy only;
- Home, How It Works, page titles, routes, URLs, query parameters, Feedback, and any share surface do
  not use internal codes or classification titles.

The scan targets public strings and public presentation objects, not the whole repository. Internal
codes are intentionally valid in domain data, scoring, persistence, migration, tests, and technical
documentation.

## Persistence and migration

Storage tests use an in-memory adapter and cover:

- partial and completed schema 2 round trips under `animals-within.assessment.v2`;
- current question index, four-rank answers, five adaptive IDs, primary/secondary IDs, and balanced
  markers;
- malformed JSON, unavailable storage, invalid IDs, invalid rankings, illegal routes, and
  inconsistent results failing to a clean session;
- legacy key `animals-within.assessment.v1`, old model ID, and unknown schema versions resetting only
  assessment data;
- language and appearance changes preserving the exact assessment state;
- restart clearing only assessment state;
- completed results restoring identically before localization;
- a persisted-field allowlist excluding translated strings, totals, normalized values, distances,
  rankings of all 16 types, debug data, analytics consent, and appearance preferences.

## Analytics and Feedback privacy

Tests retain the fail-closed consent checks and verify that analytics modules do not import or accept
assessment state. GA4 payloads are limited to the generic initial page location and generic
**Animals Within** page title. They contain no answers, ranks, question/option IDs, dimensions,
adaptive IDs, codes, animals, results, confidence, distances, or build/Feedback content.

The exact Feedback mail draft remains recipient, subject, language, build version, and an empty
feedback area. Its builder accepts no assessment or result fields.

## Engineering balance analysis

`node scripts/analyzeAssessmentBalance.mjs` should fail when it detects:

- an invalid fixed/adaptive count or option composition;
- incomplete per-dimension coverage;
- duplicate animals or incomplete internal type coverage;
- nondeterministic or incorrect 2/2/1 adaptive selection;
- duplicate adaptive questions in a run;
- a primary and secondary collision;
- broken exact-tie behavior;
- a type that is unreachable under the representative legal ranked fixtures and seeded simulations.

The report includes scoring symmetry, seeded primary/secondary frequency distributions, adaptive
route counts, balanced/tie cases, and reachability. Its heading and documentation identify it as an
engineering balance check, not scientific validation. Distribution thresholds should detect obvious
implementation defects without claiming a psychologically ideal population distribution.

## Static cleanup checks

Before review, inspect the diff and run scoped searches for:

- the old model ID `12-archetype-v2-25q` outside migration documentation/tests;
- obsolete 23-fixed-plus-2-adaptive wording;
- old five-primary/six-supplementary dimension logic;
- old 12-animal fixtures and animal names that are not part of the new mapping;
- obsolete single-choice controls, translations, and tests;
- personality codes or classification titles in public copy and UI output paths;
- accidental secrets or assessment console logging.

`git diff --check` supplements the required commands with whitespace validation.
