# ADR-0002: Adopt the Ranked Sixteen-Personality Animal Model

- **Status:** Superseded
- **Date:** 2026-07-16
- **Supersedes:** the 12-animal assessment model `12-archetype-v2-25q`
- **Superseded by:** [ADR-0003: Adopt the Thirty-Question Binary Animal Model](ADR-0003-binary-thirty-question-animal-model.md)

## Context

The previous prototype used 23 single-choice fixed questions, two adaptive questions, five broad
dimensions plus six supplementary signals, and distance matching against 12 animal profiles. That
model cannot support the requested four-statement ranking interaction, exact 16-pattern coverage,
five targeted differentiators, or persistence-compatible migration.

The public experience also needs a firm boundary between internal personality identifiers and the
animal-first presentation. Visible four-letter codes and familiar personality classification titles
would distract from the original symbolic-animal experience and could imply an official MBTI product.

## Decision

Adopt model `16-personality-ranking-v1-25q` with persisted assessment schema 2:

- four internal dimensions: E-I, S-N, T-F, and J-P;
- exactly 20 fixed questions, five per dimension;
- exactly five deterministic adaptive questions allocated 2, 2, and 1 to the three closest
  fixed-profile dimensions;
- four options per question representing strong first pole, moderate first pole, moderate second
  pole, and strong second pole;
- a complete ranking permutation using 4, 3, 2, and 1;
- rank collision behavior that swaps two ranked statements or moves a rank from its previous owner
  when the target is unranked;
- contribution `rank × intensity × phase weight`, with fixed weight 1 and adaptive weight 0.75;
- normalized four-dimensional whole-profile distance to all 16 canonical type corners;
- deterministic exact-tie handling that retains balanced dimensions;
- closest primary and next distinct secondary types;
- a fixed one-to-one mapping from the 16 internal types to 16 unique symbolic animals;
- local schema-validated persistence and assessment-only legacy migration.

Four-letter codes remain permitted in domain models, scoring, adaptive selection, distance
calculations, persistence, migration, automated tests, and developer documentation. The public UI,
accessibility text, URLs, document titles, Feedback, shareable content, and analytics do not display
or transmit those codes. Personality classification titles are not public labels. The application
does not present itself as MBTI or as an official MBTI assessment.

## Consequences

### Positive

- Every internal type has explicit, complete, and unique animal coverage.
- Ranking captures relative preference within a scenario and prevents four independent approvals.
- Deterministic adaptive selection concentrates five questions on close dimensions without
  randomness.
- The 0.75 adaptive weight refines rather than overwhelms the fixed profile.
- Whole-profile comparison makes the secondary result a true second-closest distinct pattern.
- Explicit schema/model checks give legacy data a safe reset boundary.
- Animal-first presentation avoids scores, codes, and technical classification labels.

### Costs

- The old questions, profiles, fixtures, balance script, localized content, and documentation cannot
  be reused as the active model.
- Ranking controls require more interaction and accessibility work than single-choice answers.
- All 16 animal records require balanced bilingual descriptions and relationship content.
- Persistence restoration must validate ranking permutations and deterministic adaptive routes.

## Rejected alternatives

- **Layer the new model over old vectors:** retains dead logic and ambiguous migration.
- **Random adaptive questions or tie-breaks:** makes identical answers produce different outcomes.
- **Choose secondary by flipping one letter:** ignores the complete four-dimensional profile.
- **Show codes or classification titles secondarily:** conflicts with the animal-first product
  boundary and risks implying a branded personality assessment.
- **Carry old answers forward:** single-choice answers cannot be transformed faithfully into ranked
  four-statement answers.

## Validation boundary

Automated invariants, deterministic fixtures, seeded simulations, and distribution reports are
engineering checks. They are not evidence of psychometric or scientific validity.
