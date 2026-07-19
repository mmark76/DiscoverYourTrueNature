# Architecture

Animals Within is an Expo React Native TypeScript application targeting web and Android-compatible
React Native surfaces. Assessment logic is local, deterministic, and independent of a backend.

## System boundaries

| Layer | Responsibility |
| --- | --- |
| App composition | providers, safe-area root, screen routing, assessment initialization |
| Shared shell | responsive header, page container, fixed footer, focus utilities, theme tokens |
| Settings | language and appearance state plus independent persistence |
| Assessment domain | independent Short/Long binary validation, session transitions, deterministic follow-up selection, scoring, context profiles, persistence |
| Personality-animal domain | 16 internal canonical corners and one-to-one symbolic animal mapping |
| Localization | Greek and English visible strings keyed by language-neutral IDs |
| Presentation features | Home, binary assessment, animal-first result, catalogue, How It Works, Settings |
| Analytics | independent consent state and isolated GA4 bootstrap |

Business rules remain in small pure typed functions inside their feature. Screens consume those
functions and public presentation data; they do not reimplement scoring, selection, or migration.

## Assessment data separation

Language-neutral question metadata contains:

- stable mode, question, option, area/dimension, pole, phase, context, and scenario IDs;
- one pole and one A/B position per option;
- phase weight and reverse-key metadata;
- deterministic source and adaptive-selection order.

Greek and English dictionaries contain prompts, two option statements, A/B labels, selection and
validation messages, optional public context labels, animal descriptions, strengths, possible blind
spots, behavioral tendencies, relationship/context copy, actions, accessibility copy, and disclaimer.
They do not contain poles, weights, reverse-key flags, profiles, distances, or selection priorities.

This separation lets a language change replace rendered copy only. It cannot alter either mode's
selected option IDs, current position, deterministic route, locked primary, final result, or score
calculation.

## Assessment flow

The chooser selects one of two independent state machines:

```text
restore Short schema 1 and Long schema 3 independently
  -> restore active mode, or infer a resumable mode, or show chooser
  -> Short
       -> collect 12 fixed binary answers (3 per internal area)
       -> lock primary and select 3 deterministic separator IDs
       -> collect questions 13–15
       -> retain locked primary and select a distinct secondary
  -> Long
       -> collect 20 everyday + 5 structured binary answers
       -> lock primary and select 5 deterministic follow-up IDs
       -> collect questions 26–30 (2 personal + 3 professional)
       -> retain locked primary and select a distinct secondary
       -> derive optional context observation from questions 1–25 only
  -> record assessmentMode on the internal result
  -> project either result into animal-only localized presentation
```

Every answer transition validates the active question and exactly one option belonging to it. Invalid,
stale, or replayed actions cannot advance. Navigation to another screen does not destroy either
session.

The Short area bridge is internal and one-to-one: sociability maps to `energy`, emotional
intelligence to `decisions`, creativity to `information`, and practicality to `structure`. Its fixed
questions have weight `1.0`; separators have weight `1.5`. The Long weights and 30-question state
machine remain `1.0`, `1.25`, and `1.5` as accepted in ADR-0003.

## Pure scoring and selection services

The assessment domain exposes separate pure operations for:

- creating and validating a single-option answer;
- replacing a selected option without retaining both choices;
- accumulating signed contributions with weights `1.0`, `1.25`, and `1.5`;
- normalizing each dimension by its own answered weight and clamping to `[-1, 1]`;
- ranking all 16 canonical corners with canonical-order tie-breaks;
- locking the Short primary from questions 1–12 and selecting three unique separators from three
  areas;
- selecting the Short secondary from all 15 answers while excluding the locked primary;
- locking the primary from questions 1–25;
- selecting five unique adaptive questions from disagreements among nearby non-primary candidates;
- enforcing exactly two personal and three professional adaptive contexts;
- selecting a final secondary while excluding the locked primary;
- deriving score-free personal-versus-professional observation metadata from questions 1–25.

Randomness, translated text, locale comparison, appearance state, and object-property iteration do
not participate in these functions. Short separator selection ranks the four closest non-primary
candidates by area disagreement, proximity to base balance, and stable area order. The phase weights
and Long context threshold are explicit product-design constants, not psychometric coefficients.

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

Assessment persistence has three independent records:

| Purpose | Storage key | Schema/model |
| --- | --- | --- |
| Long session | `animals-within.assessment.v3` | schema 3 / `16-personality-binary-v2-30q` |
| Short session | `animals-within.assessment.short.v1` | schema 1 / `animals-within-short-binary-v1-15q` |
| Active chooser mode | `animals-within.assessment.active-mode` | scalar `short` or `long` |

Both session records include `assessmentMode`, current position, scalar binary answers, the selected
route when applicable, locked primary, and final distinct result. A completed result also records its
mode. Starting, saving, restoring, corrupting, or restarting one session does not mutate the other.

A valid older Long schema-3 record without mode fields is normalized to mode `long` without data
loss. The adapter otherwise retains ADR-0003's Long validation and migration behavior.

Restore validates the complete record and phase relationships. Incompatible ranking data under
`animals-within.assessment.v2`, older data under `animals-within.assessment.v1`, malformed JSON, an
unknown schema/model, or inconsistent content yields a clean assessment session. Migration discards
only assessment data.

Language/appearance settings and analytics consent retain their separate stores. Questionnaire
restart and Long migration never clear those records. Storage failure is non-fatal and falls back to
an in-memory session. See [Persistence and Migration](../assessment/PERSISTENCE_AND_MIGRATION.md).

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

Both modes use the same two explicit pressable answer cards. The screen owns logical focus order,
mode-correct progress totals, live question/selection/error announcements, progress without score
exposure, visible A/B labels, non-color selected indicators, minimum touch targets, and wrapping for
Greek, Extra Large text, mobile widths, and increased browser zoom. The Home/chooser provides
localized 15-question/about-3-minute and 30-question/about-6-minute choices.

## Dependency direction

- presentation features may import domain services and localization;
- assessment services may import language-neutral domain data but not UI or translations;
- localization may import ID types but not scoring behavior;
- analytics may not import assessment or personality-result modules;
- settings and assessment persistence remain independent;
- shared components contain no feature-specific scoring rules.

This direction keeps the assessment testable without rendering and prevents internal values from
leaking into public or external-output surfaces.
