# Features

Product capabilities are organized by feature:

- `assessment` owns two independent binary modes: the Short 12-fixed-plus-3-separator session and the
  unchanged Long 25-base-plus-5-adaptive session. It also owns deterministic follow-up selection,
  local scoring, context profiles, separate persistence, migration, fixtures, and engineering
  analysis;
- `personalities` owns the 16 internal personality IDs, canonical corners, unique animal symbols, and
  one-to-one type-to-animal mapping;
- `animals` exposes the animal-first 16-entry catalogue used by presentation;
- `results` projects internal locked-primary/secondary IDs into animal-only localized result content;
- `home` and `information` explain and start the experience without exposing internal codes or
  technical phase labels;
- `analytics` owns consent and the isolated GA4 bootstrap.

Each feature owns its components, services, validation, and types. Shared shell, layout,
accessibility, and style utilities remain in `src/shared`.

## Domain and localization boundary

Assessment and personality-animal modules use stable language-neutral IDs and contain no translated
copy. Question metadata owns mode, phase, Short area or Long personal/professional context,
dimension, option pole, A/B position, weight, reverse-keying, and deterministic order. Greek and
English content under
`src/i18n/content` is keyed by those IDs and does not duplicate scoring or selection metadata.

Short maps its four internal areas one-to-one to the canonical dimensions, locks its primary after
12 fixed answers, and uses three deterministic separators only for a distinct secondary. Long keeps
its existing 30-question model and locks its primary after 25. Sessions and results carry
`assessmentMode: 'short' | 'long'`; presentation receives only localized animal data and permitted
mode provenance.

Four-letter personality codes are internal implementation identifiers. They may remain in domain
models, scoring, adaptive selection, distance calculations, persistence, migration, tests, and
technical documentation. Result and catalogue components render only animal names, natural-language
descriptions, strengths, possible blind spots, tendencies, relationship/context copy, actions, and
the entertainment disclaimer. Personality classification titles are not public labels.

## Dependency constraints

- UI components consume domain services; they do not calculate scores.
- Assessment services do not import translations or appearance state.
- Analytics does not import assessment, personality, animal-result, context-profile, or persistence
  state.
- Short and Long use separate storage records; restarting or restoring one does not mutate the other.
- Restart and migration do not mutate settings or analytics consent.
- No feature sends assessment information to a remote service.
