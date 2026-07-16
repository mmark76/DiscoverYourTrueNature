# Sixteen-personality animal assessment model

Model version: `16-personality-ranking-v1-25q`

Persisted assessment schema: `2`

Assessment storage key: `animals-within.assessment.v2`

This is developer-facing documentation. Four-letter personality codes, pole totals, normalized
values, weights, distances, adaptive priorities, and tie metadata are internal implementation
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

The model has exactly four language-neutral preference-dimension IDs in this order:

1. `energy`: `E` (Extraversion) and `I` (Introversion)
2. `information`: `S` (Sensing) and `N` (Intuition)
3. `decisions`: `T` (Thinking) and `F` (Feeling)
4. `structure`: `J` (Judging) and `P` (Perceiving)

The declared order is a deterministic tie-break. Dimension and pole IDs remain language-neutral;
their translated explanations belong to the localization layer.

The 16 internal type identifiers are fixed, in deterministic order:

`INTJ`, `INTP`, `ENTJ`, `ENTP`, `INFJ`, `INFP`, `ENFJ`, `ENFP`, `ISTJ`, `ISFJ`, `ESTJ`, `ESFJ`,
`ISTP`, `ISFP`, `ESTP`, `ESFP`.

These identifiers may be used in domain models, scoring, adaptive selection, distance calculations,
persistence, migration, automated tests, and developer documentation. They are never public labels.

## Run structure

Every completed run contains exactly 25 answered ranking questions:

1. 20 fixed questions;
2. five deterministic adaptive differentiators selected after all fixed questions are complete.

There are exactly five fixed questions for each dimension. Their scenario themes are:

| Dimension | Fixed themes |
| --- | --- |
| `energy` (E-I) | recovering after a demanding week; entering an unfamiliar group; processing a difficult problem; behavior at a social event; extended close work with people |
| `information` (S-N) | learning something new; observing a situation; carrying out a task; realism versus possibilities; immediate practicality versus future potential |
| `decisions` (T-F) | making a difficult decision; serious disagreement; responding to a serious mistake; objectivity versus compassion; corrective feedback |
| `structure` (J-P) | planning a trip; handling deadlines; preferred working environment; closing decisions versus keeping options open; responding to a changed plan |

The adaptive bank contains at least four candidates for each dimension. Adaptive scenarios must not
repeat a fixed scenario or mention animals, personality codes, dimensions, or scoring.

## Language-neutral question data

Question definitions contain only stable metadata:

- question and option IDs;
- dimension ID;
- fixed or adaptive phase;
- scenario category;
- one pole and one intensity for every option.

Every question has exactly four options in this composition:

| Option role | Pole | Intensity |
| --- | --- | ---: |
| strong first pole | the dimension's first pole | 2 |
| moderate first pole | the dimension's first pole | 1 |
| moderate second pole | the dimension's second pole | 1 |
| strong second pole | the dimension's second pole | 2 |

English and Greek question text is keyed by the same question and option IDs. Translation files do
not duplicate poles, intensities, phase weights, or adaptive-selection metadata.

## Ranking interaction and validation

Each option receives one of the ranks 4, 3, 2, or 1. A valid answer uses all four ranks exactly once.
The user cannot continue with a missing rank, duplicate rank, or value outside that set.

Rank collision behavior is deterministic:

- when the target option already has a rank and the chosen rank belongs to another option, the two
  options swap ranks;
- when the target option is unranked and the chosen rank belongs to another option, the rank moves to
  the target and the previous owner becomes unranked;
- choosing the target's existing rank leaves the answer unchanged.

The interaction uses explicit controls, not drag-and-drop alone. Visible numbers, text labels,
borders or indicators, `selected` accessibility state, assigned-rank announcements, and completion
or error announcements communicate state without relying on color.

## Pole accumulation

Each ranked option contributes only to its declared pole:

`weighted contribution = assigned rank × option intensity × phase weight`

Phase weights are fixed:

| Phase | Weight |
| --- | ---: |
| fixed | `1.00` |
| adaptive | `0.75` |

For example, a strong `E` option ranked 2 in a fixed question contributes
`2 × 2 × 1.00 = 4` to `E`. A moderate `I` option ranked 3 in an adaptive question contributes
`3 × 1 × 0.75 = 2.25` to `I`.

The scorer accumulates separate totals for `E`, `I`, `S`, `N`, `T`, `F`, `J`, and `P`. It never
persists or reports those values outside the assessment boundary.

For a dimension with first-pole total `A` and second-pole total `B`, its signed normalized preference
is:

`p = (A - B) / (A + B)`

The denominator is positive for any answered run. Positive values favor the first pole, negative
values favor the second pole, and zero is an exact balance. The closeness used for adaptive ordering
is `abs(p)`: the smaller the magnitude, the more balanced the dimension.

## Deterministic adaptive selection

After exactly 20 valid fixed answers:

1. calculate the four fixed-only signed preferences;
2. sort dimensions by ascending `abs(p)`;
3. break equal balances with the declared dimension order `energy`, `information`, `decisions`,
   `structure`;
4. allocate two adaptive questions to the first dimension, two to the second, one to the third, and
   none to the least balanced dimension;
5. select unused candidates within each dimension by stable adaptive question ID order.

This produces exactly five unique adaptive IDs with an allocation of 2, 2, and 1. No randomness,
language, appearance setting, object-property order, or locale participates. The same 20 fixed
ranking answers therefore always produce the same five-question sequence.

The 0.75 phase weight lets the final questions refine close dimensions without giving one adaptive
answer the same influence as a fixed answer of equal rank and intensity.

## Whole-profile distance and primary result

Each of the 16 internal types is a canonical four-dimensional corner. For each dimension, the
canonical value is `+1` when the type uses the first pole and `-1` when it uses the second pole.

Using the final signed preference vector `p` and a type corner `c`, the normalized root-mean-square
distance is:

`distance(p, c) = sqrt(((p.energy-c.energy)^2 + (p.information-c.information)^2 + (p.decisions-c.decisions)^2 + (p.structure-c.structure)^2) / 4)`

All four dimensions have equal distance weight. All 16 corners are evaluated from the complete
25-question profile. Sorting uses the unrounded distance, then the fixed internal type order. The
closest supported type is primary.

## Exact ties and secondary result

An exact final dimension tie remains `0` and is recorded in the internal balanced-dimension list. It
is not silently converted into either pole. A zero coordinate naturally gives equal support to the
adjacent corners on that dimension; whole-profile distances across all 16 types decide which complete
patterns are best supported. Equal whole-profile distances use the fixed internal type order, never
randomness.

The secondary result is the next closest distinct type in the same complete 16-corner ordering. It
is not produced by simply flipping the smallest raw dimension. It may differ from the primary by one
letter or, when supported by the complete profile, by two letters.

The public result may state that the profile sits close between two related patterns. It does not
show an `X` code, percentages, pole totals, confidence, distances, or the candidate ranking.

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
8. how the two animal patterns complement, soften, or differ from each other;
9. retake and catalogue actions;
10. the entertainment disclaimer.

Catalogue cards lead with the animal name and contain animal-first descriptive copy. When a stored
result exists, non-color labels may identify the user's primary and secondary animals. Neither result
nor catalogue renders the internal type code or a personality classification title.

The public presentation model contains no scores, percentages, confidence, pole totals, normalized
preferences, weights, distances, candidate ranking, raw answers, or adaptive-selection rationale.

## Persistence and migration boundary

Persisted schema 2 stores language-neutral assessment progress and verifies the model version before
restore. A legacy schema or a different model version invalidates only assessment answers, adaptive
IDs, and results. Appearance, language, analytics consent, and unrelated preferences are managed by
their existing separate stores and are not reset. See
[Persistence and Migration](PERSISTENCE_AND_MIGRATION.md).

## Analytics and external-output boundary

The analytics feature does not import assessment, ranking, or personality-result state. Analytics
must never receive question IDs, option IDs, ranks, dimensions, poles, adaptive IDs, internal type
codes, animal results, distances, or completion profiles. The generic page URL and document title do
not encode results. Feedback drafts contain only language, build version, and an empty feedback area.
There is no result-bearing share text or URL.

## Engineering analysis

`node scripts/analyzeAssessmentBalance.mjs` is expected to verify structural question invariants,
mapping uniqueness, deterministic 2/2/1 selection, scoring symmetry, complete type coverage,
representative reachability, primary-secondary distinctness, and exact-tie behavior. Its seeded
frequency report is an engineering balance check only and must not be described as scientific or
psychometric validation.
