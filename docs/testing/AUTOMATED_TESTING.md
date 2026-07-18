# Automated Testing

This document defines the intended engineering checks for model
`16-personality-binary-v2-30q`. Passing them establishes structural and deterministic software
behavior only; it does not establish psychological, scientific, or psychometric validity.

## Required commands

Run from the repository root:

```bash
npm install
npm run typecheck
npm test
node scripts/analyzeAssessmentBalance.mjs
npx expo export --platform web
```

All commands must succeed before the work is reported as validated. Run outcomes belong in the pull
request verification notes rather than this evergreen contract.

## Question metadata invariants

Automated tests cover:

1. exactly 20 `everyday` questions and five `structured` questions before the adaptive phase;
2. exactly 30 answered questions in a complete session;
3. exactly two options for every fixed and adaptive question;
4. stable unique question and option IDs;
5. only current phase, context, dimension, pole, position, and reverse-key values;
6. weights exactly `1.0`, `1.25`, and `1.5` for their phases;
7. each option's pole belongs to its question's dimension;
8. A/B positions are unique within a question and align with `reverseKeyed`;
9. scoring metadata is absent from translated content;
10. no question metadata branches directly to an animal or personality result.

### Phase and context balance

Questions 1–20 must contain exactly five questions for each dimension. They must also contain 10
personal and 10 professional contexts, with the five hobby/interest/learning items occupying the
declared personal subset.

Questions 21–25 must contain exactly three personal and two professional contexts. The adaptive bank
must contain exactly 16 questions: four per dimension and, within every dimension, two personal and
two professional contexts.

The displayed first-pole/second-pole ordering is balanced so the reverse-keyed count differs from the
forward-keyed count by no more than one. Tests prove that option metadata, not A/B position,
determines contribution.

## Binary answer and session invariants

Tests exercise selection behavior independently from rendering:

- a valid answer is exactly one current `selectedOptionId` for the active question;
- selecting the other option replaces the previous selection;
- missing, multiple/array, unknown, cross-question, and malformed selections are invalid;
- an incomplete answer cannot advance;
- a valid answer advances once and cannot be replayed as a stale action;
- backward and forward movement preserve committed answers;
- all 25 base answers precede adaptive answers;
- question 25 creates the five-question route and locked primary atomically;
- exactly 30 valid answers complete a run;
- restart creates a clean assessment while leaving settings and consent untouched.

If a base answer is edited after adaptive progress, tests require dependent adaptive answers, route,
lock, and final result to be invalidated and regenerated from the revised base. Editing an adaptive
answer keeps the route and locked primary unchanged.

Source-level UI tests complement manual interaction by checking two explicit A/B cards, selected
accessibility state, non-color indicator, validation/disabled state, minimum touch targets, focus
movement, progress semantics, live announcements, and wrapping without horizontal-scroll-only
layouts. Obsolete rank guides, rank announcements, collision behavior, `RankingDraft`, and
`RankingOptionCard` must be absent from active source and public copy.

## Scoring invariants

Focused numeric fixtures verify:

- first-pole selections contribute `+weight` and second-pole selections contribute `-weight`;
- reverse-keyed display does not reverse the underlying pole;
- phase weights are `1.0`, `1.25`, and `1.5`;
- each contribution affects only the selected question's dimension;
- each dimension divides by its own total answered weight;
- normalization is symmetric, finite, and clamped to `[-1, 1]`;
- an exact zero remains balanced;
- raw totals from dimensions with different question counts are never compared;
- deterministic extreme and balanced fixtures produce expected profiles.

The weights are product-design constants, not psychometric coefficients.

## Primary, adaptive, and secondary invariants

### Locked primary

- no session primary exists before 25 valid base answers;
- the base profile uses questions 1–25 only;
- all 16 canonical candidates are considered;
- equal distances use fixed canonical order;
- the closest candidate is stored in `lockedPrimary` after question 25;
- every possible pattern of questions 26–30 leaves that lock unchanged.

### Adaptive selection

- at least the closest four non-primary candidates are considered;
- candidate-disagreement dimensions receive priority;
- base dimensions nearer zero receive greater priority within that evidence;
- exactly five unique stable question IDs are selected;
- the route contains exactly two personal and three professional contexts;
- stable metadata and ID ordering resolve ties;
- identical base answers produce an identical route;
- language, appearance, navigation, persistence, and locale do not change the route;
- deterministic fixtures and simulations exercise every dimension.

### Secondary

- no final result exists before 30 valid answers;
- the final profile includes all 30 weighted contributions;
- ranking excludes the locked primary;
- the secondary is always current, deterministic, and distinct;
- adaptive weight can influence the secondary but never the primary;
- exact profile and distance ties use fixed canonical order.

## Context-profile invariants

Personal and professional profiles use questions 1–25 only and normalize each context/dimension by
its own answered weight. Tests verify:

- adaptive answers cannot change a context profile or observation;
- the internal difference threshold is exactly `0.40`;
- no observation is returned immediately below the threshold;
- the documented observation is returned at and above the threshold;
- discrete direction metadata is deterministic and contains no numeric score;
- presentation translates the metadata into cautious prose and exposes no dimension/pole ID;
- balanced or small differences are not overinterpreted.

The threshold is an editorial product rule, not a confidence interval.

## Type, mapping, distance, and public-result invariants

Tests retain the following guarantees:

- exactly the 16 approved internal personality combinations exist;
- all 16 internal IDs map one-to-one to Raven, Octopus, Lion, Fox, Elephant, Deer, Dolphin, Otter,
  Beaver, Dog, Wolf, Penguin, Falcon, Swan, Cheetah, and Peacock;
- public animal data contains no internal profile or type code;
- canonical distance uses all four dimensions and deterministic type order;
- the public result receives animal data, descriptions, strengths, possible blind spots, tendencies,
  relationship copy, and optional localized context prose only;
- no code, title, score, percentage, confidence, weight, threshold, distance, raw profile, candidate
  list, answer, route, or selected option crosses the public boundary.

Internal codes in developer fixtures are permitted. They do not permit codes in visible application
text, accessibility labels, URLs, page titles, Feedback, or analytics.

## Localization

Greek and English dictionaries must have identical populated structures and complete entries for all
41 question prompts and 82 option statements (25 fixed plus 16 adaptive candidates), A/B labels,
selection instructions/errors, optional context labels, animals, result sections, relationship and
context copy, catalogue state, How It Works content, accessibility text, and disclaimers.

Tests also verify:

- Greek source questions match the authoritative product wording;
- English entries preserve the same metadata-driven pole direction;
- question and option IDs remain language-neutral;
- Home and How It Works describe 30 one-choice questions without rank copy;
- visible copy does not call the later phases psychometric, adaptive, or differentiators;
- switching language preserves answers, position, route, locked primary, and final result;
- the exact entertainment disclaimers remain unchanged.

## Persistence and migration

Storage tests use an in-memory adapter and cover:

- partial base, exactly-25, partial-adaptive, and completed schema-3 round trips under
  `animals-within.assessment.v3`;
- scalar selected options, current index, route, locked primary, final result, and close/tie markers;
- phase-boundary consistency at answer counts 0–24, 25, 26–29, and 30;
- malformed JSON, unavailable storage, invalid IDs/options, duplicate/out-of-order answers, illegal
  route quotas, and inconsistent locks/results failing cleanly;
- incompatible ranked key `animals-within.assessment.v2` and older key
  `animals-within.assessment.v1` resetting only assessment data;
- language and appearance changes preserving the exact assessment object;
- restart clearing only assessment state;
- a persisted-field allowlist excluding translations, scores, context profiles, weights, distances,
  candidates, debug data, analytics consent, and appearance preferences.

## Analytics and Feedback privacy

Tests retain fail-closed consent checks and verify that analytics modules do not import or accept
assessment state. GA4 payloads are limited to the generic initial page location and generic
**Animals Within** title. They contain no answers, selected options, question/option IDs, dimensions,
context profiles, adaptive routes, internal codes, animals, locked primary, final result, confidence,
distances, model scores, build information, or Feedback content.

The Feedback mail draft remains recipient, subject, language, build version, and an empty feedback
area. Its builder accepts no assessment or result fields. The visible word **Feedback** deliberately
remains English and highlighted in the header and footer.

## Engineering balance analysis

`node scripts/analyzeAssessmentBalance.mjs` fails when it detects:

- an invalid phase/context/dimension count or two-option structure;
- incomplete or duplicate internal type/animal coverage;
- an invalid adaptive bank or selected two-personal/three-professional quota;
- nondeterministic candidate discrimination or tie-breaking;
- a primary changed by adaptive answers or a primary/secondary collision;
- option-letter ordering bias;
- incorrect context-profile calculations;
- an animal structurally unreachable as primary or secondary where appropriate.

The report includes deterministic fixtures, seeded primary/secondary distributions, adaptive
dimension/context coverage, tie cases, option-order checks, and reachability. Its heading identifies
it as an engineering balance check, not scientific validation.

## Static cleanup checks

Before review, inspect the diff and run scoped searches for:

- `16-personality-ranking-v1-25q` outside historical ADR/migration references;
- obsolete active schema-2/key-v2 claims;
- 25-question and four-statement rank copy in active public surfaces;
- `RankingDraft`, rank assignments, rank announcements, rank collision services, and
  `RankingOptionCard` in active source;
- obsolete 2/2/1 dimension allocation and `0.75` adaptive weight;
- personality codes or classification titles in public output paths;
- public `adaptive`, `differentiator`, or `psychometric` labels;
- accidental secrets or assessment console logging.

`git diff --check` supplements the required commands with whitespace validation.
