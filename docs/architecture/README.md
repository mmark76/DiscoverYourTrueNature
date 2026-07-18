# Architecture

Animals Within is an Expo React Native TypeScript application targeting web and Android-compatible
React Native surfaces. Assessment logic is local, deterministic, and independent of a backend.

## System boundaries

| Layer | Responsibility |
| --- | --- |
| App composition | providers, safe-area root, screen routing, assessment initialization |
| Shared shell | responsive header, page container, fixed footer, focus utilities, theme tokens |
| Settings | language and appearance state plus independent persistence |
| Assessment domain | binary validation, session transitions, adaptive selection, scoring, context profiles, persistence |
| Personality-animal domain | 16 internal canonical corners and one-to-one symbolic animal mapping |
| Localization | Greek and English visible strings keyed by language-neutral IDs |
| Presentation features | Home, binary assessment, animal-first result, catalogue, How It Works, Settings |
| Analytics | independent consent state and isolated GA4 bootstrap |

Business rules remain in small pure typed functions inside their feature. Screens consume those
functions and public presentation data; they do not reimplement scoring, selection, or migration.

## Assessment data separation

Language-neutral question metadata contains:

- stable question, option, dimension, pole, phase, context, and scenario IDs;
- one pole and one A/B position per option;
- phase weight and reverse-key metadata;
- deterministic source and adaptive-selection order.

Greek and English dictionaries contain prompts, two option statements, A/B labels, selection and
validation messages, optional public context labels, animal descriptions, strengths, possible blind
spots, behavioral tendencies, relationship/context copy, actions, accessibility copy, and disclaimer.
They do not contain poles, weights, reverse-key flags, profiles, distances, or selection priorities.

This separation lets a language change replace rendered copy only. It cannot alter selected option
IDs, current position, adaptive route, locked primary, final result, or score calculation.

## Assessment flow

The state machine follows this sequence:

```text
restore or create schema 3 session
  -> collect 20 everyday binary answers
  -> collect 5 structured binary answers
  -> calculate the questions-1-to-25 base profile
  -> lock the primary animal
  -> rank nearby non-primary candidates
  -> deterministically select 5 adaptive IDs (2 personal + 3 professional)
  -> collect 5 adaptive binary answers
  -> calculate the all-30 final profile
  -> retain the locked primary and select a distinct secondary
  -> derive optional context observation from questions 1–25 only
  -> project internal results into animal-only localized presentation
```

Every answer transition validates the active question and exactly one option belonging to it. Invalid,
stale, or replayed actions cannot advance. Navigation to another screen does not destroy the session.

## Pure scoring and selection services

The assessment domain exposes separate pure operations for:

- creating and validating a single-option answer;
- replacing a selected option without retaining both choices;
- accumulating signed contributions with weights `1.0`, `1.25`, and `1.5`;
- normalizing each dimension by its own answered weight and clamping to `[-1, 1]`;
- ranking all 16 canonical corners with canonical-order tie-breaks;
- locking the primary from questions 1–25;
- selecting five unique adaptive questions from disagreements among nearby non-primary candidates;
- enforcing exactly two personal and three professional adaptive contexts;
- selecting a final secondary while excluding the locked primary;
- deriving score-free personal-versus-professional observation metadata from questions 1–25.

Randomness, translated text, locale comparison, appearance state, and object-property iteration do
not participate in these functions. The phase weights and context threshold are explicit
product-design constants, not psychometric coefficients.

## Public presentation boundary

Four-letter personality codes are internal identifiers. The UI projection resolves internal state
to:

- primary animal and personality description;
- strengths, possible blind spots, and behavioral tendencies;
- secondary animal and personality description;
- the relationship between the animal patterns;
- optional cautious personal-versus-professional prose;
- animal-first catalogue indicators and actions.

The projection excludes internal codes, classification titles, scores, percentages, confidence,
pole totals, normalized values, weights, distances, candidate rankings, selected option IDs,
follow-up selection rationale, and raw context profiles. UI components, accessibility labels, URLs,
document titles, Feedback, and future sharing surfaces consume public animal data only. The
application does not brand or describe itself as MBTI or an official MBTI assessment.

## Persistence boundaries

Assessment persistence uses `animals-within.assessment.v3`, schema version 3, and model version
`16-personality-binary-v2-30q`. The adapter stores the current position, binary answers, five selected
adaptive IDs when applicable, the locked primary after question 25, and the final distinct result
after question 30.

Restore validates the complete record and phase relationships. Incompatible ranking data under
`animals-within.assessment.v2`, older data under `animals-within.assessment.v1`, malformed JSON, an
unknown schema/model, or inconsistent content yields a clean assessment session. Migration discards
only assessment data.

Language/appearance settings and analytics consent retain their separate stores. Assessment restart
and migration never clear those records. Storage failure is non-fatal and falls back to an in-memory
session. See [Persistence and Migration](../assessment/PERSISTENCE_AND_MIGRATION.md).

## Analytics and external integrations

Analytics modules remain isolated from assessment and personality-animal domains. The existing GA4
bridge activates only after explicit consent and sends only its generic initial page view. It has no
custom assessment events or payload path for answers, selected options, dimensions, context profiles,
adaptive routes, personality identifiers, animals, locked primary, or final results.

Feedback builds a local mail draft from interface language and public build version only. Assessment
state is not included in Feedback, cookies, URLs, page titles, production console output, shareable
content, or remote requests.

## Shared UI and accessibility

The shared shell owns the aligned responsive page container, header, two-row fixed footer, safe-area
handling, semantic palette, typography scaling, and keyboard focus policy. Feature screens do not
duplicate those rules.

The assessment uses two explicit pressable answer cards. The screen owns logical focus order, live
question/selection/error announcements, progress without score exposure, visible A/B labels,
non-color selected indicators, minimum touch targets, and wrapping for Greek, Extra Large text,
mobile widths, and increased browser zoom.

## Dependency direction

- presentation features may import domain services and localization;
- assessment services may import language-neutral domain data but not UI or translations;
- localization may import ID types but not scoring behavior;
- analytics may not import assessment or personality-result modules;
- settings and assessment persistence remain independent;
- shared components contain no feature-specific scoring rules.

This direction keeps the assessment testable without rendering and prevents internal values from
leaking into public or external-output surfaces.
