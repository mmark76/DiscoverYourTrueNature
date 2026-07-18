# Assessment persistence and migration

Long model/schema: `16-personality-binary-v2-30q` / `3`

Short model/schema: `animals-within-short-binary-v1-15q` / `1`

Long storage key: `animals-within.assessment.v3`

Short storage key: `animals-within.assessment.short.v1`

Active-mode key: `animals-within.assessment.active-mode`

Incompatible assessment keys: `animals-within.assessment.v2`, `animals-within.assessment.v1`

This document covers questionnaire state only. Language and appearance settings, analytics consent,
and unrelated preferences remain in their existing independent persistence boundaries. Short and
Long are also independent from each other.

## Goals

Where the platform provides the storage adapter, both questionnaires can survive independently:

- movement between Home, assessment, catalogue, How It Works, result, and Settings;
- Greek/English changes;
- appearance changes;
- a web refresh;
- closing and later reopening the application.

Restoration is deterministic. Persisted state contains no translated copy, derived scores, context
profiles, candidate lists, debug values, timestamps, device identifiers, or analytics data.

## Long schema 3 record

The current record mirrors the minimal language-neutral session shape:

```ts
interface PersistedAssessmentV3 {
  schemaVersion: 3;
  modelVersion: '16-personality-binary-v2-30q';
  assessmentMode: 'long';
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
    assessmentMode: 'long';
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

## Short schema 1 record

Short uses an independent, similarly minimal record:

```ts
interface PersistedShortAssessmentV1 {
  schemaVersion: 1;
  modelVersion: 'animals-within-short-binary-v1-15q';
  assessmentMode: 'short';
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
  separatorQuestionIds: string[];
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
    assessmentMode: 'short';
  };
}
```

The Short validator derives question poles and weights from current metadata, recalculates the
question-12 lock, regenerates the deterministic three-ID separator route, and recalculates any final
result before accepting a record. A Short record is never read from or written to the Long key.

The active-mode key stores only the scalar string `short` or `long`. It identifies which session to
show; it is not part of either questionnaire and contains no answers or result. An unknown scalar is
removed and treated as no selected mode.

## Long phase invariants

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

## Short phase invariants

| Answer count | Separator IDs | Locked primary | Final result |
| ---: | --- | --- | --- |
| 0–11 | empty | `null` | `null` |
| 12 | exactly three valid IDs | required | `null` |
| 13–14 | same three IDs | unchanged and required | `null` |
| 15 before final Continue | same three IDs | unchanged and required | `null` |
| 15 completed | same three IDs | unchanged and required | required |

The three IDs must be the selector's deterministic ordered route from the first 12 answers. They are
unique and come from three distinct Short areas. The lock must equal the result calculated from the
12 fixed answers. The completed result must preserve that primary, select a distinct secondary from
all 15 answers, and carry `assessmentMode: 'short'`.

## Strict restore validation

Long restore is accepted only when all of the following are valid:

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

Short applies the same exact-key, scalar-answer, contiguous-prefix, current-index, lock/result, and
fail-closed checks with its own schema/model/mode. In addition, the validator requires:

- exactly the 12 fixed questions before any separator;
- no route or lock at answer counts 0–11;
- the exact deterministic three-ID route and lock once answer 12 exists;
- separator answers in that route's order only;
- a result only after all 15 answers, with the stored mode `short`, unchanged primary, and distinct
  recalculated secondary.

Neither validator accepts the other mode's model, mode value, question IDs, route, result, or key.

Malformed, partial, stale, or internally inconsistent records fail closed to a clean assessment
session. Storage or JSON errors do not prevent the application from loading; the application
continues with in-memory state when persistence is unavailable.

## Long compatibility and incompatible ranking migration

Schema 3 predates the explicit `assessmentMode` field. A valid pre-mode Long record under
`animals-within.assessment.v3` is accepted only when it has the complete prior allowlisted shape and
passes all existing Long calculations. Restore returns the same state with
`assessmentMode: 'long'` added to the session and completed result. A payload with the mode missing
from only one of those locations, an unexpected mode, or any other mixed shape is rejected.

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

Long migration never deletes or rewrites the Short key or active-mode key. Short schema 1 is a new,
independent namespace and does not import or approximate any legacy Long record.

## Lifecycle behavior

### Start or resume

The application restores Long schema 3, Short schema 1, and the active mode independently during
initialization. A valid unfinished session resumes at its stored question. A valid completed session
restores the same locked primary, distinct secondary, balance/close markers, mode, and animal-first
result in the currently selected language.

The saved active mode chooses which valid session is initially shown. If no valid mode exists, the
application may infer a resumable mode from existing progress and otherwise shows the chooser. Mode
selection changes navigation only; it does not initialize over or clear either record.

### Save

Persist each complete session record atomically and only to its own key:

- after a valid binary answer is committed;
- after navigation changes the current position;
- after Short question 12 or Long question 25 locks the primary and selects its route;
- after Short question 15 or Long question 30 produces the final result;
- after that questionnaire is restarted.

Do not maintain independent answer, route, primary, or result fragments that can drift apart.
Persist a new active-mode scalar when the person selects Short or Long.

### Language and appearance changes

Language and appearance providers do not create, clear, reorder, or recalculate questionnaire data.
Changing either setting keeps both sessions' answer objects, current index, selected route, locked
primary, mode, and final result. Only localized presentation changes.

### Switching questionnaire mode

Switching from Short to Long or Long to Short persists the scalar active mode and opens the selected
session at its own stored position or result. It does not copy answers, restart a session, or reuse a
route, lock, or result across modes.

### Editing a Short fixed answer after separator progress

If Back navigation reaches questions 1–12 and a fixed selection changes, the Short session keeps the
revised valid fixed prefix, removes separator answers, invalidates its old route, lock, and result,
then regenerates the lock and three-ID route from the complete revised 12 answers. The Long session
is untouched.

Editing a Short separator selection replaces only that answer and preserves the Short route and
locked primary.

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

Restart creates a clean state for the active questionnaire only:

- question index zero;
- no answers;
- no separator/adaptive question IDs;
- `lockedPrimary: null`;
- `result: null`.

It persists only that mode's reset. The other questionnaire and its completed or partial result stay
unchanged. Restart also does not touch language, appearance, analytics consent, or unrelated
preferences.

## Privacy boundary

Assessment persistence is local. It is not copied into analytics events, URLs, query parameters,
document titles, feedback drafts, cookies, shareable content, console logging in production, or
remote requests. Internal four-letter identifiers in a valid local record are implementation data,
not user-facing classification labels.

## Required automated cases

Automated storage coverage includes:

- valid Long partial base, exactly-25, partial-follow-up, and completed schema-3 round trips;
- valid Short partial fixed, exactly-12, partial-separator, 15th-selection-before-Continue, and
  completed schema-1 round trips;
- current index, scalar selected options, selected route, locked primary, final result, and close/tie
  metadata;
- separate Short/Long records coexisting, restoring, and restarting independently;
- the scalar active-mode key accepting only `short` and `long`;
- valid pre-mode Long schema-3 progress and result upgrading without data loss;
- malformed JSON and unavailable or throwing storage;
- unknown schema/model/mode versions under either questionnaire key;
- incompatible schema-2 ranked and schema-1 assessment keys;
- invalid question/option IDs, duplicate or out-of-order answers, missing or multiple selections,
  illegal routes/quotas, and premature or inconsistent lock/results;
- base-answer edits clearing and regenerating dependent state safely;
- adaptive-answer edits preserving the route and lock;
- language and appearance changes preserving the exact assessment object;
- restart affecting only the selected questionnaire state;
- an allowlist assertion preventing copy, scores, context profiles, distances, and debug data from
  entering persisted JSON.

Manual refresh, close/resume, language, appearance, completion, editing, and migration scenarios are
in the [Manual Test Plan](../testing/MANUAL_TEST_PLAN.md).
