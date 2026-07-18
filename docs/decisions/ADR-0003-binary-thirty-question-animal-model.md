# ADR-0003: Adopt the Thirty-Question Binary Animal Model

- **Status:** Accepted
- **Date:** 2026-07-18
- **Supersedes:** [ADR-0002](ADR-0002-ranked-personality-animal-model.md), model `16-personality-ranking-v1-25q`

## Context

The ranked model requires a person to distribute four ranks across four statements on every screen.
Although deterministic, that interaction is comparatively demanding on touch, keyboard, screen
reader, zoomed, and large-text surfaces. The product now requires a simpler two-alternative choice
while retaining the existing four dimensions, 16 internal mappings, 16 symbolic animals, animal-first
presentation, local privacy boundary, bilingual copy, and deterministic behavior.

The redesign also separates the two result decisions. The first 25 broadly shared questions should
establish a primary animal. Five later questions should help distinguish nearby alternatives for the
secondary result without moving that primary.

## Decision

Adopt model `16-personality-binary-v2-30q` with persisted assessment schema 3:

- exactly 30 binary questions with visible A/B alternatives and one required selection;
- 20 everyday questions weighted `1.0`, split 10 personal and 10 professional, with five personal
  hobby/interest/learning questions;
- exactly five everyday questions per internal dimension;
- five structured questions weighted `1.25`, split three personal and two professional;
- a stable 16-question adaptive bank with four candidates per dimension and, within each dimension,
  two personal and two professional contexts;
- five adaptive questions weighted `1.5`, selected deterministically with exactly two personal and
  three professional contexts;
- signed option contributions normalized independently for each dimension;
- a primary result calculated from questions 1–25 and locked before adaptive answers;
- a secondary result calculated after question 30 from all contributions while excluding the locked
  primary;
- separate personal and professional descriptive profiles derived from questions 1–25 only;
- optional context wording only above the documented internal `0.40` threshold;
- the existing 16 canonical internal types and one-to-one symbolic-animal mapping;
- local schema-validated persistence and assessment-only migration from incompatible schema 2/1.

Approximately half the questions reverse which pole appears as option A. Option metadata, not the
letter, determines scoring. Greek source questions are authoritative, and English copy preserves the
same behavioral distinction and scoring direction.

The phase weights and context threshold are explicit product-design choices for an entertainment
experience. They are not scientifically validated psychometric coefficients, confidence measures,
or diagnostic cutoffs.

Four-letter codes remain permitted in domain models, scoring, adaptive selection, distance
calculations, persistence, migration, automated tests, and developer documentation. The public UI,
accessibility text, URLs, document titles, Feedback, shareable content, and analytics do not display
or transmit those codes. Personality classification titles are not public labels. The application
does not present itself as MBTI or as an official MBTI assessment.

## Consequences

### Positive

- One binary decision per screen is easier to explain and operate across input modes.
- Reverse-keyed display reduces habitual A selection without changing pole semantics.
- Shared base questions make the primary result independent of the adaptive route.
- Candidate-based adaptive selection concentrates the last five questions on distinctions relevant
  to the secondary result while maintaining fixed personal/professional quotas.
- Context profiles can support cautious personal-versus-work observations without comparing users who
  received different adaptive opportunities.
- Explicit schema/model checks provide a clean migration boundary.
- Animal-first presentation continues to avoid scores, codes, and technical classifications.

### Costs

- Schema-2 ranked answers, routes, and results cannot be migrated into binary answers.
- All fixed and adaptive question copy, fixtures, analysis, test expectations, and documentation must
  be replaced or updated.
- Binary questions capture less within-question nuance than a four-statement ranking.
- Locking the primary requires separate base and final result lifecycle validation.
- Candidate discrimination plus context quotas requires deterministic constrained selection.
- Personal/professional observations require conservative thresholding and careful bilingual prose.

## Rejected alternatives

- **Convert the highest prior rank into A/B:** old options and new alternatives are not equivalent, so
  conversion would create invented answers.
- **Let adaptive answers recalculate the primary:** conflicts with the explicit primary-lock product
  decision and makes the result less stable.
- **Choose follow-up questions randomly:** identical base answers could produce different routes and
  secondary results.
- **Use the displayed letter as the pole:** creates A-selection bias and prevents reverse-keyed items.
- **Include adaptive answers in context profiles:** selected opportunities differ between users and
  would make personal/work comparisons inconsistent.
- **Show codes, dimension values, or precision percentages:** conflicts with the animal-first boundary
  and risks implying a branded or scientifically validated assessment.

## Validation boundary

Automated invariants, deterministic fixtures, seeded simulations, reachability checks, option-order
analysis, and distribution reports are engineering checks. They are not evidence of psychological,
scientific, or psychometric validity.
