# Infrastructure

External integrations and technical adapters belong here. Current product behavior keeps assessment
logic local and vendor-independent.

Infrastructure boundaries include:

- storage adapters used by independently versioned appearance, analytics-consent, and assessment
  records;
- consent-gated analytics transport;
- Expo and platform-specific integration points;
- future backend or AI adapters only after a separate approved product decision.

Domain rules, binary validation, adaptive selection, scoring, context-profile calculation,
personality-animal mapping, migration decisions, and public-result projection must not depend on
vendor-specific implementations. Assessment storage failures remain non-fatal and fall back to
in-memory state.

Analytics and Feedback adapters must not accept answers, selected option IDs, question or option IDs,
dimension values, context profiles, adaptive routes, locked primary data, internal personality codes,
animal results, confidence, distances, or scoring metadata.
