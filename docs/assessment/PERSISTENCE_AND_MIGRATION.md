# Assessment persistence and migration

Assessment model: `16-personality-binary-v2-30q`

Persisted assessment schema: `3`

Current storage key: `animals-within.assessment.v3`

Incompatible assessment keys: `animals-within.assessment.v2`, `animals-within.assessment.v1`

This document covers assessment state only. Language and appearance settings, analytics consent,
and unrelated preferences remain in their existing independent persistence boundaries.

## Goals

Where the platform provides the storage adapter, an assessment can survive:

- movement between Home, assessment, catalogue, How It Works, result, and Settings;
- Greek/English changes;
- appearance changes;
- a web refresh;
- closing and later reopening the application.

Restoration is deterministic. Persisted state contains no translated copy, derived scores, context
profiles, candidate lists, debug values, timestamps, device identifiers, or analytics data.

## Schema 3 record

The current record mirrors the minimal language-neutral session shape:

```ts
interface PersistedAssessmentV3 {
  schemaVersion: 3;
  modelVersion: '16-personality-binary-v2-30q';
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
  adaptiveQuestionIds: string[];
  lockedPrimary: null | {
    primaryTypeId: string;
    balancedDimensionIds: string[];
    hasCloseMatch: boolean;
  };
  result: null | {
    primaryTypeId: string;
    secondaryTypeId: string;
    balancedDimensionIds: string[];
    hasCloseMatch: boolean;
  };
}
```

Concrete domain types narrow string fields to stable ID unions. Each answer has one known question ID
and exactly one option ID belonging to that question. The record does not store A/B as a score; the
selected option's pole and phase weight are derived from current question metadata.

The record deliberately excludes:

- translated question, option, animal, context, or result copy;
- phase weights, pole totals, normalized profiles, and context subprofiles;
- candidate distances, complete candidate rankings, confidence, or percentages;
- follow-up selection priorities or explanations;
- analytics consent, language, appearance, Feedback, or build information;
- timestamps, device identifiers, remote-account data, or production logs.

Internal primary and secondary type IDs are restoration identifiers. UI code projects them to public
animal data and never displays the codes.

## Phase invariants

The stored fields have strict lifecycle relationships:

| Answer count | Adaptive IDs | Locked primary | Final result |
| ---: | --- | --- | --- |
| 0–24 | empty | `null` | `null` |
| 25 | exactly five valid IDs | required | `null` |
| 26–29 | same five IDs | unchanged and required | `null` |
| 30 | same five IDs | unchanged and required | required |

The five IDs must be the deterministic route produced from the first 25 answers, ordered exactly as
the current selector returns them, with no duplicates and exactly two personal plus three
professional contexts.

The locked primary must equal the deterministic base result from questions 1–25. Adaptive answers do
not participate in that validation. At completion, `result.primaryTypeId` must equal
`lockedPrimary.primaryTypeId`; the secondary must be a current different type and must agree with the
final calculation over all 30 answers while excluding the lock.

## Restore validation

Restore is accepted only when all of the following are valid:

1. the value is a plain parseable record with only the current allowlisted shape;
2. `schemaVersion` is exactly `3`;
3. `modelVersion` is exactly `16-personality-binary-v2-30q`;
4. answers are a contiguous legal prefix of questions 1–25 plus the stored follow-up route;
5. question IDs are unique, stable, current, and in route order;
6. every `selectedOptionId` is a single current option belonging to its question;
7. no answer contains a missing selection, array/multiple selection, or option from another question;
8. `currentQuestionIndex` is consistent with committed answers and legal navigation;
9. adaptive IDs obey their answer-count phase boundary, are current and unique, match deterministic
   selection, and satisfy the exact two-personal/three-professional quota;
10. `lockedPrimary` obeys its phase boundary and is consistent with the base calculation;
11. `result` obeys its phase boundary, preserves the lock, has a distinct secondary, and is consistent
    with final recalculation;
12. balanced IDs and `hasCloseMatch` are current and consistent with their respective calculations.

Malformed, partial, stale, or internally inconsistent records fail closed to a clean assessment
session. Storage or JSON errors do not prevent the application from loading; the application
continues with in-memory state when persistence is unavailable.

## Incompatible ranking migration

The schema-2 model `16-personality-ranking-v1-25q` stored four rank assignments for each question and
selected a different follow-up route. Its answers, route, primary, secondary, and tie metadata cannot
be translated faithfully into one binary choice per question. The earlier schema-1/12-animal model is
also incompatible.

When either old assessment key, an old schema/model under the current key, or another obsolete
assessment record is detected:

1. do not translate or approximate old answers;
2. discard old assessment answers;
3. discard old follow-up routes;
4. discard old primary, secondary, balance, and result metadata;
5. initialize a clean schema-3 session;
6. remove or ignore only the known obsolete assessment key.

Migration must not scan, clear, or rewrite unrelated storage. It must preserve byte-for-byte:

- selected language;
- appearance mode, color theme, font family, and text size;
- analytics consent;
- unrelated application and browser preferences.

This is an assessment reset, not a global application reset.

## Lifecycle behavior

### Start or resume

The application restores schema 3 once during assessment initialization. A valid unfinished session
resumes at its stored question. A valid completed session restores the same locked primary, distinct
secondary, balance/close markers, and animal-first result in the currently selected language.

### Save

Persist the complete record atomically:

- after a valid binary answer is committed;
- after navigation changes the current position;
- after question 25 locks the primary and selects the five follow-up IDs;
- after question 30 produces the final result;
- after an assessment restart.

Do not maintain independent answer, route, primary, or result fragments that can drift apart.

### Language and appearance changes

Language and appearance providers do not create, clear, reorder, or recalculate assessment data.
Changing either setting keeps the same answer objects, current index, adaptive IDs, locked primary,
and final result. Only localized presentation changes.

### Editing a base answer after follow-up progress

The follow-up route and locked primary both depend on the complete first 25 answers. If a user edits
any question from 1–25 after entering questions 26–30:

1. keep the revised valid base answers;
2. clear all committed follow-up answers;
3. invalidate the old follow-up route, locked primary, and final result;
4. recalculate the base profile, primary, and route from the revised complete base;
5. persist the revised lock and route before follow-up resumes.

The revised primary is then locked again. Answering or editing questions 26–30 never changes it.

### Editing a follow-up answer

Back navigation within questions 26–30 preserves the same route and locked primary. Changing a
follow-up selection replaces that question's previous choice without changing the route, lock, or
other committed answers. The result is created only when the complete valid route is submitted.

### Restart

Restart creates the clean schema-3 state:

- question index zero;
- no answers;
- no adaptive question IDs;
- `lockedPrimary: null`;
- `result: null`.

It persists that assessment-only reset and does not touch language, appearance, analytics consent,
or unrelated preferences.

## Privacy boundary

Assessment persistence is local. It is not copied into analytics events, URLs, query parameters,
document titles, feedback drafts, cookies, shareable content, console logging in production, or
remote requests. Internal four-letter identifiers in a valid local record are implementation data,
not user-facing classification labels.

## Required automated cases

Automated storage coverage includes:

- valid partial base, exactly-25, partial-follow-up, and completed schema-3 round trips;
- current index, scalar selected options, adaptive route, locked primary, final result, and close/tie
  metadata;
- malformed JSON and unavailable or throwing storage;
- unknown schema/model versions under the v3 key;
- incompatible schema-2 ranked and schema-1 assessment keys;
- invalid question/option IDs, duplicate or out-of-order answers, missing or multiple selections,
  illegal routes/quotas, and premature or inconsistent lock/results;
- base-answer edits clearing and regenerating dependent state safely;
- adaptive-answer edits preserving the route and lock;
- language and appearance changes preserving the exact assessment object;
- restart affecting only assessment state;
- an allowlist assertion preventing copy, scores, context profiles, distances, and debug data from
  entering persisted JSON.

Manual refresh, close/resume, language, appearance, completion, editing, and migration scenarios are
in the [Manual Test Plan](../testing/MANUAL_TEST_PLAN.md).
