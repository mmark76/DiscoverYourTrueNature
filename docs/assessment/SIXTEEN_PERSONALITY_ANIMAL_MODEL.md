# Sixteen-personality animal assessment model

Model version: `16-personality-binary-v2-30q`

Persisted assessment schema: `3`

Assessment storage key: `animals-within.assessment.v3`

This is developer-facing documentation. Four-letter personality codes, dimension values, weights,
candidate comparisons, distances, follow-up priorities, and tie metadata are internal implementation
details. They must not be rendered in application copy, accessibility labels, URLs, page titles,
feedback drafts, shareable content, analytics, cookies, or remote requests.

## Product boundary

Animals Within is an original entertainment and self-discovery experience. Its four internal
preference dimensions and 16 stable implementation identifiers do not make it an MBTI product. The
application does not present itself as MBTI, does not claim to be an official MBTI assessment, and
does not use classification titles such as “Architect,” “Advocate,” or “Commander” in the visible
experience.

Animal associations are symbolic editorial metaphors. They are not biological claims, psychological
diagnoses, scientific validation, or statements that every person with a pattern behaves alike.

Required English disclaimer:

> An entertainment self-discovery experience. The animals are used symbolically. This is not a psychological diagnosis or a scientifically validated assessment.

Required Greek disclaimer:

> Ψυχαγωγική εμπειρία αυτογνωσίας. Τα ζώα χρησιμοποιούνται συμβολικά. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονικά σταθμισμένη αξιολόγηση.

## Stable internal dimensions

The model has exactly four language-neutral preference-dimension IDs in deterministic order:

1. `energy`: `E` and `I`;
2. `information`: `S` and `N`;
3. `decisions`: `T` and `F`;
4. `structure`: `J` and `P`.

The declared dimension order is a stable tie-break. The 16 internal type identifiers are also fixed
in deterministic order:

`INTJ`, `INTP`, `ENTJ`, `ENTP`, `INFJ`, `INFP`, `ENFJ`, `ENFP`, `ISTJ`, `ISFJ`, `ESTJ`, `ESFJ`,
`ISTP`, `ISFP`, `ESTP`, `ESFP`.

These identifiers may be used in domain models, scoring, follow-up selection, distance calculations,
persistence, migration, automated tests, and developer documentation. They are never public labels.

## Thirty-question run structure

Every completed run contains exactly 30 binary answers:

| Questions | Internal phase | Context distribution | Weight |
| --- | --- | --- | ---: |
| 1–20 | `everyday` | 10 personal, then 10 professional | `1.00` |
| 21–25 | `structured` | 3 personal, then 2 professional | `1.25` |
| 26–30 | `adaptive` | exactly 2 personal and 3 professional | `1.50` |

Within questions 1–20, questions 6–10 are the five personal questions about hobbies, interests, and
learning. The first 20 questions are balanced exactly across dimensions: five `energy`, five
`information`, five `decisions`, and five `structure`.

The five structured questions have a more direct preference format. Neither `structured` nor
`adaptive` is a required public phase label. The user-facing experience must not call questions
“psychometric,” “adaptive,” or “differentiators.”

The three phase weights are centralized configurable constants. They are product-design weights for
a deterministic entertainment experience, not scientifically validated psychometric coefficients.

## Language-neutral question data

Each question definition owns stable metadata:

- question ID and two option IDs;
- `everyday`, `structured`, or `adaptive` phase;
- `personal` or `professional` context;
- dimension ID;
- the pole represented by each option;
- phase weight, resolved from the phase constant;
- whether the displayed A/B order is reverse-keyed;
- deterministic source and selection order.

Every visible question contains exactly two alternatives. Option A is not inherently the first pole
and option B is not inherently the second pole. Approximately half the questions display the poles
in reverse order to reduce habitual letter selection. The option's declared pole determines scoring.

English and Greek question text is keyed by the same question and option IDs. Translation files
contain visible copy only and do not duplicate phase, context, pole, weight, reverse-key, candidate,
or distance metadata. The supplied Greek wording is authoritative; English preserves its behavioral
distinction and scoring direction naturally rather than mechanically.

## Binary interaction and answer validation

A persisted or committed answer contains only:

```ts
{
  questionId: AssessmentQuestionId;
  selectedOptionId: AssessmentOptionId;
}
```

A valid answer selects exactly one of the active question's two option IDs. Choosing the other option
replaces the previous selection. Missing selections, arrays or multiple selections, unknown IDs,
options belonging to a different question, stale question actions, and replayed actions cannot
advance the session.

The visible A/B label, selected marker, border, and accessibility checked/selected state communicate
selection without relying on color. Back and forward navigation preserve committed answers.

## Signed weighted scoring

Each selected option contributes to one dimension:

```text
first-pole option  = +1 × phase weight
second-pole option = -1 × phase weight
```

The weights are:

| Phase | Weight |
| --- | ---: |
| `everyday` | `1.00` |
| `structured` | `1.25` |
| `adaptive` | `1.50` |

For each dimension, normalization is independent:

```text
dimension score = signed weighted sum / total answered weight for that dimension
```

The denominator includes only valid answered questions for that dimension in the requested profile.
The result is clamped to `[-1, 1]`. Positive values favor the first pole, negative values favor the
second pole, and zero is an exact balance. Raw totals from dimensions with different question counts
are never compared.

## Base profile and locked primary animal

Immediately after question 25 is committed:

1. calculate the four-dimensional base profile from questions 1–25 only;
2. compare it with all 16 canonical personality corners using normalized deterministic distance;
3. break equal distances with the fixed canonical type order;
4. retain the nearest candidate as `lockedPrimary.primaryTypeId`;
5. retain only the internal close/balanced metadata required for cautious result wording;
6. select and persist the five follow-up question IDs.

No primary result exists before all 25 valid base answers exist. Questions 26–30 never recalculate or
replace the locked primary.

If the product permits editing questions 1–25 after entering the follow-up phase, that edit invalidates
the dependent follow-up answers, route, locked primary, and final result. Once the revised base 25 is
complete, the primary and route are recalculated from that revised base and locked again. This does
not permit follow-up answers themselves to alter the primary.

## Deterministic follow-up selection

The adaptive bank contains exactly 16 stable binary questions:

- four questions per dimension;
- within each dimension, two personal and two professional contexts.

Selection begins with the base profile and locked primary:

1. rank every non-primary canonical candidate by base-profile distance;
2. consider at least the closest four non-primary candidates;
3. prioritize dimensions on which those candidates disagree;
4. within that evidence, give greater priority to base dimensions whose score is closer to zero;
5. choose unused questions with stable metadata and ID tie-breaks;
6. enforce exactly five IDs, exactly two personal and three professional contexts, and no duplicate;
7. persist the ordered IDs so language, navigation, reload, and appearance cannot select a new route.

The selector is deterministic. Randomness, translated text, locale sorting, appearance state, or
object-property iteration order do not participate.

## Final profile and secondary animal

After question 30:

1. keep `lockedPrimary.primaryTypeId` unchanged;
2. calculate the final four-dimensional profile from all 30 weighted answers;
3. rank all canonical candidates except the locked primary;
4. choose the nearest remaining candidate as the secondary;
5. break ties with canonical type order.

The secondary is therefore always distinct from the primary. The higher `1.50` follow-up weight gives
the final answers more influence on the secondary comparison, but it does not grant them any path to
change the primary.

An exact dimension tie remains zero. The public result may use cautious close-pattern language, but
does not show an `X` code, percentage, confidence value, distance, or candidate ranking.

## Personal and professional descriptive profiles

Two context profiles are derived from questions 1–25 only:

- personal: the 13 personal base questions;
- professional: the 12 professional base questions.

Each context and dimension is normalized by its own answered weight. The five selected follow-up
answers are excluded because different users receive different follow-up measurement opportunities.

The current internal observation threshold is `0.40`. A context observation is produced only when
the difference is at least that threshold and the available directions support a cautious discrete
description. The internal observation identifies the dimension, each context's `first`, `second`, or
`balanced` direction, and whether the tendency is `personal-stronger`, `professional-stronger`, or
`context-dependent`. It exposes no numeric score to presentation.

The threshold is a conservative editorial product rule, not a confidence interval or scientific
cutoff. Small differences produce no context claim.

## Fixed personality-to-animal mapping

Every internal type maps to exactly one unique symbolic animal:

| Internal type | English animal | Greek animal |
| --- | --- | --- |
| `INTJ` | Raven | Κοράκι |
| `INTP` | Octopus | Χταπόδι |
| `ENTJ` | Lion | Λιοντάρι |
| `ENTP` | Fox | Αλεπού |
| `INFJ` | Elephant | Ελέφαντας |
| `INFP` | Deer | Ελάφι |
| `ENFJ` | Dolphin | Δελφίνι |
| `ENFP` | Otter | Βίδρα |
| `ISTJ` | Beaver | Κάστορας |
| `ISFJ` | Dog | Σκύλος |
| `ESTJ` | Wolf | Λύκος |
| `ESFJ` | Penguin | Πιγκουίνος |
| `ISTP` | Falcon | Γεράκι |
| `ISFP` | Swan | Κύκνος |
| `ESTP` | Cheetah | Τσίτα |
| `ESFP` | Peacock | Παγώνι |

## Public presentation contract

The result screen presents only:

1. primary animal name and symbol;
2. identifying sentence and primary personality description;
3. typical strengths;
4. possible blind spots;
5. interaction, information-processing, decision, and organization/adaptation tendencies;
6. secondary animal name and symbol;
7. secondary personality description;
8. how the two animal patterns complement, soften, or differ;
9. an optional cautious personal-versus-professional observation;
10. retake and catalogue actions;
11. the entertainment disclaimer.

Neither result nor catalogue renders an internal type code or personality classification title. The
public presentation model contains no scores, percentages, confidence, pole totals, normalized
preferences, weights, distances, candidate rankings, raw answers, selected option IDs, or follow-up
selection rationale.

## Persistence and migration boundary

Persisted schema 3 verifies model version `16-personality-binary-v2-30q` before restore. A ranking
schema-2 record, schema-1 record, unknown schema, or different model version invalidates assessment
answers, routes, and results only. Appearance, language, analytics consent, and unrelated preferences
remain in their independent stores. See
[Persistence and Migration](PERSISTENCE_AND_MIGRATION.md).

## Analytics and external-output boundary

Analytics does not import assessment or personality-result state. Analytics must never receive
question IDs, option IDs, selected options, dimensions, poles, context profiles, follow-up routes,
internal type codes, locked or final animal results, confidence, distances, or model scores. The
generic page URL and document title do not encode results. Feedback drafts contain only language,
build version, and an empty feedback area. There is no result-bearing share text or URL.

## Engineering analysis

`node scripts/analyzeAssessmentBalance.mjs` verifies structural metadata, signed scoring symmetry,
deterministic candidate-based follow-up selection, exact context quotas, primary locking,
primary-secondary distinctness, tie handling, context-profile calculation, option-letter order bias,
and primary/secondary reachability for all 16 animals under deterministic fixtures and seeded
simulations.

Its distributions and thresholds are engineering defect checks only. They are not evidence of
scientific, psychological, or psychometric validity.
