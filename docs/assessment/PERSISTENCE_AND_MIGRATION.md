# Assessment persistence and migration

Assessment model: `16-personality-ranking-v1-25q`

Persisted assessment schema: `2`

Current storage key: `animals-within.assessment.v2`

Legacy storage key: `animals-within.assessment.v1`

This document covers assessment state only. Language and appearance settings, analytics consent,
and other preferences remain in their existing independent persistence boundaries.

## Goals

Where the platform provides the existing storage adapter, an assessment can survive:

- movement between Home, assessment, catalogue, How It Works, and Settings;
- Greek/English changes;
- appearance changes;
- a web refresh;
- closing and later reopening the application.

Restoration must be deterministic. Persisted state must not contain public presentation strings,
translated copy, unnecessary debug values, or analytics data.

## Schema 2 record

The schema 2 record contains only the state needed to resume or present a completed result:

```ts
interface PersistedAssessmentV2 {
  schemaVersion: 2;
  modelVersion: '16-personality-ranking-v1-25q';
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    rankings: Array<{
      optionId: string;
      rank: 1 | 2 | 3 | 4;
    }>;
  }>;
  adaptiveQuestionIds: string[];
  result: null | {
    primaryTypeId: string;
    secondaryTypeId: string;
    balancedDimensionIds: string[];
  };
}
```

The concrete domain types narrow the string fields to the stable language-neutral ID unions. Each
completed answer has exactly four known option IDs and the rank permutation 1, 2, 3, 4. Adaptive IDs
are absent before the fixed phase is complete and contain exactly five unique, valid IDs after
selection.

The record deliberately excludes:

- translated question, option, animal, or result copy;
- pole totals and normalized preference values;
- balance magnitudes, weights, confidence, or distances;
- the ranked list of all 16 internal types;
- analytics consent, language, appearance, or build information;
- timestamps, device identifiers, or remote-account data.

Primary and secondary type IDs are internal persistence identifiers. They are converted to
animal-first localized presentation only at the UI boundary and never displayed as codes.

## Restore validation

Restore is accepted only when all of the following are valid:

1. the value is a plain parseable record;
2. `schemaVersion` is exactly `2`;
3. `modelVersion` is exactly `16-personality-ranking-v1-25q`;
4. question and option IDs belong to the current model;
5. every completed ranking is the exact 1-through-4 permutation;
6. answer order is a legal prefix of the current 20-fixed-plus-5-adaptive route;
7. the current index is consistent with the completed answers;
8. adaptive IDs are unique, current, and match the deterministic selection for the fixed answers;
9. a result is present only after exactly 25 valid answers;
10. primary and secondary IDs are current, distinct, and consistent with recalculation;
11. balanced-dimension IDs are current and consistent with the final calculation.

Malformed, partial, stale, or internally inconsistent records fail closed to a clean assessment
session. Storage or JSON errors must not prevent the application from loading; the application
continues with in-memory state when persistence is unavailable.

## Legacy migration

The previous 12-animal assessment schema and model `12-archetype-v2-25q` are incompatible with ranked
answers and the new 16-pattern model. They are not translated or approximated.

When the legacy `animals-within.assessment.v1` key, an old schema, an old model version, or another
obsolete assessment record is detected:

1. discard obsolete assessment answers;
2. discard obsolete adaptive question selections;
3. discard obsolete primary and secondary results;
4. initialize and persist a clean schema 2 assessment session when storage is available.

The implementation may remove or ignore the known legacy assessment key after inspection. It must
not scan, clear, or rewrite unrelated storage keys.

Migration must not clear or rewrite:

- selected language;
- appearance mode, color theme, font family, or text size;
- analytics consent;
- unrelated application or browser preferences.

This is an assessment reset, not a global application reset.

## Lifecycle behavior

### Start or resume

The application restores schema 2 once when assessment state is initialized. A valid unfinished
session resumes at its stored position. A valid completed session restores the same primary and
secondary internal IDs and resolves their animal-first copy in the currently selected language.

### Save

Persist after a valid ranking is committed, after navigation changes the current assessment
position, after the deterministic adaptive IDs are selected, and after the final result is
calculated. Persist the complete current schema record atomically rather than maintaining separate
answer and result fragments.

### Language and appearance changes

Language and appearance providers must not create, clear, reorder, or recalculate assessment data.
Changing either setting keeps the same assessment object, ranking assignments, adaptive IDs,
current index, and completed result.

### Editing the fixed phase after adaptive progress

The five adaptive questions depend on the complete set of fixed rankings. If a user goes back and
changes any fixed answer after entering the adaptive phase, the application deterministically
selects the route again and clears all previously answered adaptive questions and any result. This
prevents answers from a former or reordered route becoming a non-contiguous persisted history. The
twenty fixed answers remain intact, the recalculated adaptive IDs are persisted, and the session can
round-trip safely before the user continues the new adaptive phase.

### Restart

Restart creates the clean schema 2 assessment state:

- question index zero;
- no answers;
- no adaptive question IDs;
- no result.

It persists that assessment-only reset and does not touch language, appearance, analytics consent,
or unrelated preferences.

## Privacy boundary

Assessment persistence is local. It is not copied into analytics events, URLs, query parameters,
document titles, feedback drafts, cookies, shareable content, console logging in production, or
remote requests. The internal four-letter identifiers in a local schema record are implementation
data, not user-facing classification labels.

## Required automated cases

Automated coverage should include:

- valid partial and completed schema 2 round trips;
- current position, rankings, adaptive IDs, result IDs, and balanced markers;
- malformed JSON and unavailable storage;
- unknown schema and model versions;
- the legacy 12-animal record migration;
- invalid IDs, ranking permutations, routes, and inconsistent results;
- fixed-answer edits after adaptive progress clearing dependent answers and round-tripping safely;
- language and appearance changes preserving the same assessment state;
- restart affecting only assessment state;
- an allowlist assertion preventing debug totals or distances from entering persisted JSON.

Manual refresh, close/resume, language, appearance, completed-result, and migration scenarios are in
the [Manual Test Plan](../testing/MANUAL_TEST_PLAN.md).
