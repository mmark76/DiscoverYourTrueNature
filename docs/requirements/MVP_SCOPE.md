# MVP Scope — Sixteen-animal ranked assessment

## Goal

Provide the smallest complete public experience that lets the owner evaluate a private,
deterministic, animal-first self-discovery flow before adding accounts, payments, AI interpretation,
or app-store distribution.

## Included

- Bilingual Greek and English Home, assessment, result, 16-animal catalogue, How It Works, Settings,
  shared header, and shared footer.
- Exactly 25 completed questions per run: 20 fixed and five deterministic adaptive differentiators.
- Exactly five fixed questions for each internal E-I, S-N, T-F, and J-P dimension.
- Four behavioral statements per question, ranked with 4, 3, 2, and 1 exactly once.
- Explicit mouse, touch, keyboard, and screen-reader ranking controls.
- Deterministic rank collision handling: swap when both statements are ranked; otherwise move the
  chosen rank and clear its previous owner.
- At least four adaptive candidate questions per dimension.
- Adaptive allocation of 2, 2, and 1 to the three closest fixed-profile dimensions.
- Rank-by-intensity scoring with fixed phase weight 1 and adaptive phase weight 0.75.
- Equal-weight whole-profile distance to all 16 internal type corners.
- Deterministic exact-tie handling with retained balanced-dimension markers.
- One primary animal and one distinct second-closest secondary animal.
- Exactly 16 unique symbolic animals with one-to-one internal type mappings.
- Animal-first result content: descriptions, strengths, possible blind spots, behavioral tendencies,
  secondary description, and the relationship between both patterns.
- Assessment persistence schema 2 and safe migration from the incompatible legacy assessment.
- Existing local appearance/language persistence and consent-gated analytics architecture.
- Responsive Expo React Native foundation for web and Android-compatible surfaces.

## Public presentation constraints

The visible application presents animals and natural-language personality descriptions only. It does
not show:

- four-letter personality codes;
- personality classification titles;
- scores, percentages, pole totals, confidence, weights, or distances;
- complete type rankings, raw answers, or adaptive-selection rationale;
- MBTI branding or any claim that this is an official MBTI assessment.

These exclusions cover result screens, catalogue cards, Home, How It Works, page titles,
accessibility labels, Feedback drafts, URLs, query parameters, analytics, and shareable content.
Internal codes remain permitted in domain logic, scoring, persistence, migration, tests, and
developer documentation.

## Explicitly excluded

- OpenAI API or other remote interpretation.
- Google Play Billing.
- User accounts, identity, or cloud synchronization.
- Database or server-side assessment storage.
- Email collection or automatic email sending.
- Result-sharing payloads.
- Custom assessment analytics or any analytics payload containing assessment information.
- Psychological, clinical, employment, scientific-validation, or diagnostic claims.

## State and migration constraints

- A valid partial or completed assessment resumes after internal navigation and a supported web
  refresh or close/reopen cycle.
- Language and appearance changes preserve question position, rankings, adaptive IDs, and result.
- Restart clears only assessment answers, adaptive IDs, current position, and result.
- Loading schema/model data from the old 12-animal assessment starts a clean assessment session
  without clearing language, appearance, analytics consent, or unrelated preferences.
- Persisted assessment state excludes unnecessary totals, distances, debug records, and translated
  copy.

## Privacy constraints

All scoring remains local. Analytics receives no question IDs, option IDs, rankings, dimensions,
adaptive IDs, internal type codes, primary or secondary types, animals, results, or scoring values.
Feedback remains a language/build-only blank draft. Generic URLs and page titles do not change with
assessment results.

## Validation questions

The owner should assess:

1. Is ranking four statements understandable and usable?
2. Does deterministic swapping feel predictable?
3. Is the 25-question length appropriate?
4. Do any options feel repetitive, morally loaded, or obvious?
5. Does the primary animal description feel useful without overstating certainty?
6. Does the secondary animal and relationship explanation add value?
7. Are strengths and possible blind spots balanced across all 16 animals?
8. Is Greek wording natural and does it wrap cleanly with large text?
9. Is the entertainment and symbolic-metaphor boundary clear?

## Exit criterion

Future AI interpretation, accounts, payments, or native distribution should be considered only after
the ranked animal-first flow, persistence, accessibility, privacy, and bilingual content are judged
worth continuing.
