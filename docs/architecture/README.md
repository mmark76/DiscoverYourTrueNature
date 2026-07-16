# Architecture

Animals Within is an Expo React Native TypeScript application targeting web and Android-compatible
React Native surfaces. The product uses local deterministic assessment logic and has no assessment
backend dependency.

## System boundaries

| Layer | Responsibility |
| --- | --- |
| App composition | providers, safe-area root, screen routing, assessment initialization |
| Shared shell | responsive header, page container, footer, focus utilities, theme tokens |
| Settings | language and appearance state plus its independent persistence |
| Assessment domain | stable IDs, ranking validation, session transitions, adaptive selection, scoring, persistence |
| Personality-animal domain | 16 internal type corners and the one-to-one symbolic animal mapping |
| Localization | Greek and English user-facing strings keyed by language-neutral IDs |
| Presentation features | Home, ranked assessment, animal-first result, catalogue, How It Works, Settings |
| Analytics | independent consent state and isolated GA4 bootstrap |

Business rules remain in pure typed functions inside their feature. Screen components consume those
functions and presentation data; they do not reimplement scoring, adaptive selection, or migration.

## Assessment data separation

Language-neutral question metadata contains only:

- stable question, option, dimension, pole, and scenario IDs;
- fixed or adaptive phase;
- option intensity;
- deterministic ordering metadata.

Greek and English dictionaries contain the question prompts, option statements, ranking guide,
validation messages, animal descriptions, strengths, possible blind spots, behavioral tendencies,
relationship copy, actions, accessibility copy, and disclaimer. They do not contain poles,
intensities, phase weights, or distance metadata.

This separation lets a language change replace only rendered copy. It cannot alter answers,
adaptive question selection, internal results, or scoring.

## Assessment flow

The assessment state machine follows this sequence:

```text
restore or create schema 2 session
  -> collect 20 complete ranking permutations
  -> calculate fixed-only dimension balances
  -> deterministically select 5 adaptive IDs (2 + 2 + 1)
  -> collect 5 complete ranking permutations
  -> calculate final four-dimensional profile
  -> rank all 16 canonical corners
  -> retain primary, distinct secondary, and balanced dimensions
  -> project internal result into animal-only localized presentation
```

Every transition validates that the active question is current and that ranks 1, 2, 3, and 4 are
used exactly once. Invalid or stale actions cannot advance the session. Navigation to another
screen does not destroy the session.

## Pure scoring and selection services

The domain exposes separate pure operations for:

- assigning and swapping/moving ranks;
- validating complete rankings;
- accumulating pole contributions with fixed weight 1 and adaptive weight 0.75;
- normalizing each pole pair to a signed preference;
- ordering dimensions by closeness and stable dimension order;
- selecting unique adaptive questions by the 2/2/1 rule and stable ID order;
- calculating equal-weight normalized distance to all 16 type corners;
- retaining exact balanced-dimension markers;
- selecting the closest primary and next distinct secondary result.

Randomness, translated text, locale comparison, object-property iteration, and appearance settings do
not participate in these functions.

## Public presentation boundary

Four-letter personality codes are internal identifiers. The UI projection resolves an internal
result to:

- primary animal and personality description;
- strengths, possible blind spots, and behavioral tendencies;
- secondary animal and personality description;
- the relationship between the two animal patterns;
- animal-first catalogue indicators and actions.

The projection excludes internal codes, personality classification titles, scores, percentages,
confidence, pole totals, normalized values, weights, distances, and candidate rankings. UI
components, accessibility labels, URLs, document titles, Feedback, and any future sharing surface
consume only the public projection. The application does not brand or describe itself as MBTI or an
official MBTI assessment.

## Persistence boundaries

Assessment persistence uses `animals-within.assessment.v2`, schema version 2, and model version
`16-personality-ranking-v1-25q`. The adapter stores only the current position, completed rankings,
five selected adaptive IDs when applicable, final primary and secondary internal IDs, and balanced
dimension IDs needed to restore a result.

Restore validates the complete record. The incompatible legacy key `animals-within.assessment.v1`,
an old schema/model, malformed JSON, or inconsistent content results in a clean assessment session.
Migration discards only obsolete assessment data.

Language/appearance settings and analytics consent keep their existing separate stores. Assessment
restart and migration never clear those records. Storage failure is non-fatal and falls back to an
in-memory session. See [Persistence and Migration](../assessment/PERSISTENCE_AND_MIGRATION.md).

## Analytics and external integrations

Analytics modules remain isolated from the assessment and personality-animal domains. The existing
GA4 bridge activates only after explicit consent and sends only its generic initial page view. It has
no custom assessment events or payload path for rankings, questions, adaptive IDs, dimensions,
personality identifiers, animals, or results.

Feedback builds a local mail draft from language and public build version only. Assessment state is
not included in Feedback, cookies, URLs, page titles, console output in production, or remote
requests.

## Shared UI and accessibility

The shared shell owns the aligned responsive page container, header, footer, safe-area handling,
semantic palette, typography scaling, and keyboard focus policy. Feature screens do not duplicate
those layout rules.

Ranking controls use explicit pressable controls rather than drag-and-drop alone. The assessment
screen owns logical focus order, live question and completion announcements, progress without score
exposure, non-color selection indicators, minimum touch targets, and wrapping behavior for Greek,
Extra Large text, mobile widths, and increased browser zoom.

## Dependency direction

- presentation features may import domain services and localization;
- assessment services may import language-neutral domain data but not UI or translations;
- localization may import ID types but not scoring behavior;
- analytics may not import assessment or personality-result modules;
- settings and assessment persistence remain independent;
- shared components contain no feature-specific scoring rules.

This direction keeps the assessment testable without rendering and prevents internal values from
leaking into public or external-output surfaces.
