# Features

Product capabilities are organized by feature:

- `assessment` owns ranking validation, the 20-fixed-plus-5-adaptive session, deterministic adaptive
  selection, local scoring, persistence, migration, fixtures, and engineering balance analysis;
- `personalities` owns the 16 internal personality IDs, canonical corners, unique animal symbols, and
  one-to-one type-to-animal mapping;
- `animals` exposes the animal-first 16-entry catalogue data used by presentation;
- `results` projects internal primary/secondary IDs into animal-only localized result content;
- `home` and `information` explain and start the experience without exposing internal codes;
- `analytics` owns consent and the isolated GA4 bootstrap.

Each feature owns its components, services, validation, and types. Shared shell, layout,
accessibility, and style utilities remain in `src/shared`.

## Domain and localization boundary

Assessment and personality-animal modules use stable language-neutral IDs and contain no translated
copy. Greek and English content is keyed by those IDs under `src/i18n/content`. Translations do not
duplicate poles, intensities, phase weights, or adaptive metadata.

Four-letter personality codes are internal implementation identifiers. They may remain in domain
models, scoring, adaptive selection, distance calculations, persistence, migration, tests, and
technical documentation. Result and catalogue components render only animal names, natural-language
descriptions, strengths, possible blind spots, tendencies, relationship copy, actions, and the
entertainment disclaimer. Personality classification titles are not public labels.

## Dependency constraints

- UI components consume domain services; they do not calculate scores.
- Assessment services do not import translations or appearance state.
- Analytics does not import assessment, ranking, personality, animal-result, or persistence state.
- Restart and migration do not mutate settings or analytics consent.
- No feature sends assessment information to a remote service.
