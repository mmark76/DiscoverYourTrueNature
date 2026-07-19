# ADR-0004: Add an Independent Short Questionnaire

- **Status:** Accepted
- **Date:** 2026-07-18
- **Related:** [ADR-0003](ADR-0003-binary-thirty-question-animal-model.md)

## Context

The existing Long questionnaire provides a detailed 30-question animal assessment, but some people
want a quicker entry point. A shorter route must not replace, shorten, migrate, or otherwise change
the accepted Long model. Both routes must remain deterministic, local, bilingual, accessible, and
animal-first.

The product also needs to preserve progress in both routes. Choosing or restarting one questionnaire
must not overwrite the other questionnaire's answers, position, locked primary, selected follow-up
route, or completed result.

## Decision

Add a separate Short questionnaire with mode `short`, model
`animals-within-short-binary-v1-15q`, persisted schema 1, and storage key
`animals-within.assessment.short.v1`. Keep the existing 30-question model as mode `long`, model
`16-personality-binary-v2-30q`, persisted schema 3, and storage key
`animals-within.assessment.v3`.

The active chooser selection is stored separately under
`animals-within.assessment.active-mode`. It is navigation state, not an assessment record. The two
questionnaire sessions are always restored and persisted independently.

The Short questionnaire contains:

- 12 fixed binary questions weighted `1.0`;
- exactly three fixed questions in each internal area: sociability and social intelligence,
  emotional intelligence, creativity and imagination, and practicality/logic/analytical thinking,
  interleaved by repeating that four-area order three times;
- an internal one-to-one bridge from those areas to the canonical `energy`, `decisions`,
  `information`, and `structure` dimensions respectively;
- a primary animal calculated and locked from questions 1–12;
- an eight-question separator bank, two candidates per area;
- three separator questions weighted `1.5`, selected deterministically from three distinct areas;
- a final secondary calculated from all 15 answers while excluding the locked primary.

Separator selection considers the four closest non-primary candidates, prioritizes areas where
those candidates disagree, then areas nearer balance, then stable area order. Stable metadata picks
one of the two bank variants. Questions 13–15 cannot change the primary.

Both Short and Long answers remain scalar `{ questionId, selectedOptionId }` records. Each visible
question offers two acceptable tendencies within one area or dimension. Approximately half of each
question set reverses pole order, so A/B letters never carry a score.

Every completed result records `assessmentMode: 'short' | 'long'` internally. Both modes project
through the same animal-only public result boundary. Short does not create a personal-versus-work
observation; that observation remains a Long-only output derived from the Long base questions.

Pre-mode schema-3 Long records remain compatible: restore adds `assessmentMode: 'long'` to the
session and completed result after validating the existing record. Ranking schema 2 and older schema
1 Long records retain ADR-0003's assessment-only reset behavior.

## Consequences

### Positive

- People can choose a roughly three-minute or six-minute route without losing either session.
- The accepted 30-question Long model and its migration boundary remain intact.
- A shared binary UI and result projection retain keyboard, screen-reader, responsive, and privacy
  guarantees.
- Mode-specific model and storage identifiers prevent accidental cross-restoration.
- Deterministic separator selection gives the Short secondary targeted evidence while preserving the
  fixed primary.

### Costs

- The application owns two session services, two schema validators, and three coordinated storage
  keys.
- Greek and English require complete Short prompts, alternatives, chooser copy, progress, and result
  provenance labels.
- Back navigation into the fixed Short phase must invalidate and recompute dependent separator state
  safely when an answer changes.
- Validation must prove both coexistence and non-regression of the 30-question Long route.

## Rejected alternatives

- **Truncate the Long questionnaire to 15 questions:** would change the accepted Long model and make
  existing Long progress incompatible.
- **Store both modes in one assessment object:** increases the risk that restart, corruption, or a
  model change in one route destroys the other route.
- **Let questions 13–15 recalculate the primary:** conflicts with the required Short primary lock.
- **Choose separator questions randomly:** identical fixed answers could restore or complete with a
  different route.
- **Expose areas, dimensions, codes, or scores in results:** violates the animal-only public
  presentation boundary.

## Validation boundary

Structural tests, deterministic fixtures, storage round trips, copy completeness, and export checks
are engineering validation. They do not establish scientific, psychological, or psychometric
validity.
