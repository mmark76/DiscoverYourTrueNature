# Features

Product capabilities are organised by feature.

Current feature areas include:

- animal archetypes
- assessment
- results
- home and supporting information

Only features required by the current implementation should be created. Each feature owns its components, services, validation, types, and tests where applicable.

The canonical archetype module owns the twelve IDs, symbols, ordering, and normalized hidden profiles.
Assessment scoring and the animal catalog consume that source directly; they must not maintain
parallel animal lists. The assessment feature owns its 23-fixed-plus-2-adaptive session, scoring,
fixtures, and balance analysis. Localized question, catalog, and result copy remains in
`src/i18n/content/`.
