# Twenty-five-question twelve-archetype model

Model version: `12-archetype-v2-25q`

This document is developer-facing. Hidden dimensions, profiles, weights, and matching details must
not be rendered in the assessment or result UI.

## Product boundary

Animals Within is an original entertainment and self-discovery experience. It is not a scientific
personality diagnosis, clinical assessment, validated psychometric instrument, mental-health test,
or employment-selection tool. The model borrows only broad, non-proprietary trait concepts; its
questions and answer options are newly written editorial content.

## Run structure

Every completed run has exactly 25 answers in this order:

1. 18 fixed everyday-behavior questions;
2. 5 fixed preference questions with reduced weight;
3. 2 distinct questions selected sequentially from a 10-question adaptive bank.

The UI shows only `Question n of 25` / `Ερώτηση n από 25`. It does not label the last two questions
as adaptive. Each question has exactly four single-select options. Scoring metadata lives in
`src/features/assessment/data/questions.ts`; English and Greek copy use those same IDs in the normal
typed localization dictionaries.

## Hidden dimensions

The five primary dimensions are openness, conscientiousness, extraversion, agreeableness, and
emotional stability. Emotional stability is used instead of the negative label neuroticism.

Six complementary editorial signals help distinguish profiles that are similar on the primary
dimensions:

- independence versus group orientation;
- initiative versus support orientation;
- novelty versus stability preference;
- directness versus diplomacy;
- flexibility versus structure;
- consistent-rule fairness versus contextual/modest accommodation.

All axes describe neutral differences in preference or behavior. A positive value is not inherently
better than a negative value. None of these labels is user-facing.

## Weights and normalization

Each option contains one sparse, language-neutral trait vector. The weight multipliers are:

| Weight class | Multiplier | Use |
| --- | ---: | --- |
| `normal` | 1.00 | 18 behavior questions |
| `lower` | 0.45 | 5 preference questions |
| `differentiator` | 0.60 | 2 selected adaptive questions |

For every answered question and dimension, the scorer adds `option value × weight` to the numerator.
It adds `largest absolute value offered by that question × weight` to the opportunity denominator.
The final dimension value is `clamp(numerator / opportunity, -1, 1)`, or zero when the dimension had
no opportunity. This per-dimension opportunity normalization supports sparse vectors and different
adaptive routes without hard-coded question counts. Two adaptive answers have only 1.2 units of
nominal question weight. More importantly for the per-dimension normalization actually used, even
the two adaptive-bank questions with the greatest possible capacity on one dimension contribute
less opportunity than the fixed questions: the fixed portion retains at least 60% of total
opportunity on every dimension. Tests also enumerate every legal pair of adaptive answers across
representative fixed profiles and bound their weighted normalized profile displacement. The final
questions therefore differentiate close results rather than replace the earlier pattern.

## Animal profiles and matching

The canonical catalog owns animal IDs, symbols, order, and normalized profiles. Values below use
this dimension order:

`O, C, E, A, S, independence, initiative, novelty, directness, flexibility, fairness`.

| Animal ID | Normalized internal profile |
| --- | --- |
| wolf | `[0.05, 0.60, -0.05, 0.20, 0.70, 0.55, 0.45, -0.20, 0.40, -0.25, 0.35]` |
| owl | `[0.65, 0.65, -0.65, 0.05, 0.50, 0.65, -0.25, 0.20, 0.10, -0.40, 0.60]` |
| eagle | `[0.65, 0.45, 0.35, -0.05, 0.75, 0.65, 0.90, 0.55, 0.65, 0.05, 0.25]` |
| dolphin | `[0.50, -0.05, 0.80, 0.85, 0.35, -0.65, 0.05, 0.55, -0.65, 0.70, 0.45]` |
| bear | `[-0.50, 0.65, -0.25, 0.55, 0.75, 0.15, 0.25, -0.75, 0.15, -0.55, 0.55]` |
| lion | `[0.25, 0.35, 0.85, 0.05, 0.70, 0.15, 0.95, 0.25, 0.75, -0.05, 0.10]` |
| fox | `[0.80, -0.25, 0.15, -0.05, 0.45, 0.65, 0.35, 0.85, 0.20, 0.90, 0.05]` |
| panther | `[0.25, 0.35, -0.75, -0.10, 0.85, 0.95, 0.55, 0.20, 0.40, 0.10, 0.20]` |
| elephant | `[-0.10, 0.90, 0.15, 0.85, 0.65, -0.55, -0.05, -0.70, -0.45, -0.70, 0.90]` |
| horse | `[0.65, -0.35, 0.65, 0.40, 0.55, 0.40, 0.35, 0.95, 0.05, 0.85, 0.25]` |
| turtle | `[-0.30, 0.80, -0.50, 0.35, 0.75, 0.25, -0.25, -0.60, -0.30, -0.55, 0.90]` |
| octopus | `[0.95, 0.05, -0.25, 0.10, 0.40, 0.70, 0.00, 0.80, -0.05, 0.95, 0.35]` |

Matching uses weighted normalized root-mean-square distance. Each primary dimension has weight 1.0;
independence, initiative, novelty, directness, and flexibility have weight 0.55; fairness has weight
0.45. The closest profile is primary and the second-closest distinct profile is secondary. No score,
distance, percentage, or ranking is exposed in the result UI.

The final tie-break is the canonical catalog order:

`wolf, owl, eagle, dolphin, bear, lion, fox, panther, elephant, horse, turtle, octopus`.

Sorting uses unrounded distance first and canonical index second. It does not depend on answer order,
language, object-property order, locale, randomness, or test environment.

## Adaptive selection

After fixed answer 23, the scorer normalizes the current profile and ranks all twelve animals. For
each unused adaptive-bank question, the selector measures the range of the leading three animal
profiles on that question's declared primary and secondary dimensions. It applies the same matching
weights, adds a small declared-primary emphasis, and selects the highest-spread question. Bank order
is the deterministic tie-break. After answer 24, the profile and leading candidates are recalculated;
the process repeats while excluding the first adaptive ID. There are no animal-specific branches and
no random selection.

## Reachability and balance checks

`node scripts/analyzeAssessmentBalance.mjs` checks:

- every animal's exact internal profile returns that animal as primary;
- bounded beam-search fixtures made entirely from real four-option questions produce complete
  25-answer runs with every animal as primary;
- deterministic fixtures made entirely from legal 25-answer runs make every animal reachable as
  secondary;
- selected adaptive IDs are distinct and multiple adaptive pairs appear across representative runs;
- seeded samples around every profile and 10,000 broad normalized profiles produce no unreachable
  primary or secondary animal.

These are engineering reachability and balance checks, not evidence of psychometric validity.

## Question audit

| Question ID | Category | Scenario/topic | Primary | Secondary | Weight |
| --- | --- | --- | --- | --- | --- |
| b01-new-group | behavior | entering-new-social-group | extraversion | independence, agreeableness | normal |
| b02-sudden-change | behavior | unexpected-change | emotionalStability | flexibility, conscientiousness | normal |
| b03-plan-day | behavior | planning-free-day | conscientiousness | flexibility, novelty | normal |
| b04-quick-choice | behavior | making-quick-decision | emotionalStability | initiative, conscientiousness, agreeableness | normal |
| b05-disagreement | behavior | handling-disagreement | agreeableness | directness, fairness | normal |
| b06-helping-someone | behavior | helping-another-person | agreeableness | initiative, independence | normal |
| b07-solo-task | behavior | working-alone | conscientiousness | independence, flexibility | normal |
| b08-shared-activity | behavior | working-in-team | extraversion | initiative, agreeableness, independence | normal |
| b09-pressure | behavior | responding-to-pressure | emotionalStability | conscientiousness, initiative | normal |
| b10-unfamiliar-start | behavior | starting-unfamiliar-thing | openness | novelty, initiative, conscientiousness | normal |
| b11-share-opinion | behavior | communicating-opinion | agreeableness | directness, extraversion | normal |
| b12-picture-details | behavior | noticing-picture-and-details | openness | conscientiousness, flexibility | normal |
| b13-unclaimed-task | behavior | taking-initiative | extraversion | initiative, independence, agreeableness | normal |
| b14-routine | behavior | maintaining-routine | conscientiousness | novelty, flexibility | normal |
| b15-disappointment | behavior | recovering-after-disappointment | emotionalStability | agreeableness, initiative, independence | normal |
| b16-new-place | behavior | exploring-new-place | openness | novelty, independence, conscientiousness | normal |
| b17-responsibility | behavior | managing-responsibility | conscientiousness | fairness, initiative, flexibility | normal |
| b18-plan-fails | behavior | adapting-when-plans-fail | openness | flexibility, emotionalStability, conscientiousness | normal |
| p01-free-time | preference | hobbies-and-free-time | extraversion | openness, independence | lower |
| p02-stories | preference | stories-and-fictional-worlds | openness | novelty, extraversion | lower |
| p03-music | preference | experiencing-music | openness | extraversion, novelty | lower |
| p04-outing | preference | outing-and-environment | openness | novelty, extraversion | lower |
| p05-learning-interest | preference | learning-and-personal-interests | conscientiousness | openness, flexibility, novelty | lower |
| a01-short-notice | adaptive | short-notice-invitation | extraversion | independence, flexibility | differentiator |
| a02-change-structure | adaptive | rebuilding-after-change | conscientiousness | flexibility, novelty | differentiator |
| a03-uncertain-route | adaptive | trying-unfamiliar-element | openness | novelty, emotionalStability, conscientiousness | differentiator |
| a04-tense-conversation | adaptive | responding-to-misunderstood-idea | agreeableness | directness, fairness | differentiator |
| a05-setback-reset | adaptive | minor-mistake-before-arrival | emotionalStability | flexibility, initiative | differentiator |
| a06-shared-decision | adaptive | naming-shared-creation | initiative | agreeableness, fairness | differentiator |
| a07-open-afternoon | adaptive | using-unexpected-time-gap | flexibility | conscientiousness, novelty | differentiator |
| a08-new-idea | adaptive | responding-to-new-idea | openness | initiative, directness, agreeableness, conscientiousness | differentiator |
| a09-recharge-evening | adaptive | recharging-after-social-days | extraversion | independence | differentiator |
| a10-promise-change | adaptive | changing-a-promise | conscientiousness | agreeableness, fairness, flexibility, independence | differentiator |

## State and privacy boundaries

The assessment session stores only language-neutral question/option IDs, the two selected adaptive
IDs, and the final primary/secondary IDs in memory. Restart replaces the entire session, while
appearance, language, and analytics consent remain in their existing providers. Language changes do
not recalculate the session. The analytics feature imports no assessment or archetype modules and
sends no answers, question IDs, traits, candidates, animal IDs, or inferred personality information.
