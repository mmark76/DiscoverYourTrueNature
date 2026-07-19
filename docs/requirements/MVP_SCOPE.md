# MVP Scope — Short and Long binary animal questionnaires

## Goal

Provide the smallest complete public experience that lets the owner evaluate a private,
deterministic, animal-first self-discovery flow before adding accounts, payments, AI interpretation,
or app-store distribution.

## Included

- Bilingual Greek and English Home, assessment, result, 16-animal catalogue, How It Works, Settings,
  shared header, and fixed two-row footer.
- A Home choice between the independent Short route (15 questions, about 3 minutes) and existing Long
  route (30 questions, about 6 minutes).
- Exactly two visible acceptable A/B tendencies and one required selection on every question.
- Short questions 1–12: exactly three questions in each internal area—sociability and social
  intelligence, emotional intelligence, creativity and imagination, and practicality/logic/
  analytical thinking—with each question measuring one area.
- Short primary animal calculated and locked after question 12.
- Short questions 13–15: three deterministic separator questions selected from an eight-question
  bank, drawn from three distinct areas and used only to select a distinct secondary.
- Short fixed/separator weights `1.0` and `1.5`, normalized through the canonical dimensions.
- The existing Long questionnaire remains exactly 30 questions.
- Long questions 1–20: everyday behavior, exactly 10 personal and 10 professional, with questions 6–10
  dedicated to hobbies, interests, and learning.
- Long has exactly five everyday questions for each internal E-I, S-N, T-F, and J-P dimension.
- Long questions 21–25: structured preferences, exactly three personal and two professional.
- Long questions 26–30: five deterministic follow-up questions selected from a stable 16-question bank.
- Long adaptive-bank coverage of four questions per dimension, each split two personal and two
  professional.
- Long selected-route quota of exactly two personal and three professional questions.
- Approximately half reverse-keyed A/B displays, with scoring determined by option metadata rather
  than letter.
- Long signed weighted scoring with explicit phase weights `1.0`, `1.25`, and `1.5` and
  dimension-specific normalization.
- Long primary animal calculated and locked after question 25.
- Long distinct secondary animal calculated after question 30 without changing the primary.
- Personal and professional descriptive profiles derived only from questions 1–25, with cautious
  result copy only above the documented threshold.
- Exactly 16 unique symbolic animals with the existing one-to-one internal type mappings.
- Animal-first result content: descriptions, strengths, possible blind spots, behavioral tendencies,
  secondary description, relationship, and optional context observation.
- Independent mode state with `assessmentMode: 'short' | 'long'` on sessions and results.
- Separate Short schema-1 and Long schema-3 persistence plus an independent active-mode preference;
  each route restores and restarts without overwriting the other.
- Compatibility upgrade for valid pre-mode Long schema-3 state and assessment-only reset of
  incompatible ranked/legacy Long state.
- Existing independent appearance/language persistence and consent-gated analytics architecture.
- Responsive Expo React Native foundation for web and Android-compatible surfaces.

The weights and context threshold are product-design rules for an entertainment experience. They are
not scientifically validated psychometric coefficients.

## Public presentation constraints

The visible application presents animals and natural-language descriptions only. It does not show:

- four-letter personality codes;
- personality classification titles;
- scores, percentages, pole totals, confidence, weights, thresholds, or distances;
- raw personal or professional profiles;
- candidate rankings, selected option IDs, or follow-up-selection rationale;
- public labels such as “psychometric questions,” “adaptive questions,” or “differentiators”;
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

- Valid partial or completed Short and Long sessions resume independently after internal navigation
  and supported refresh or close/reopen behavior.
- Language and appearance changes preserve both sessions' position, binary answers, selected route,
  locked primary, mode, and final result.
- Restart clears only the active questionnaire's answers, route, current position, locked primary,
  and final result. The other questionnaire remains byte-for-byte unchanged.
- Valid older Long schema-3 records without `assessmentMode` restore as `long` without data loss.
- Schema-2 ranked and schema-1 assessment data start a clean schema-3 session without clearing
  language, appearance, analytics consent, or unrelated preferences.
- Persisted assessment state excludes translated copy, derived scores, context profiles, distances,
  candidate lists, and debug records.

## Privacy constraints

All scoring remains local. Analytics receives no question IDs, option IDs, selected options,
dimensions, adaptive routes, context profiles, internal codes, locked primary, secondary animal,
results, confidence, distances, or model scores. Feedback remains a language/build-only blank draft.
Generic URLs and page titles do not change with assessment results.

## Validation questions

The owner should assess:

1. Is choosing one of two behavior descriptions understandable and quick?
2. Does changing A/B selection feel predictable across mouse, touch, keyboard, and screen reader?
3. Is the 15-question Short route useful at about 3 minutes, and is the 30-question Long route useful
   at about 6 minutes?
4. Are the four Short areas balanced, and do the Long personal, hobby/learning, professional, and
   direct-preference contexts still feel balanced?
5. Do any choices feel repetitive, morally loaded, obvious, or mismatched between Greek and English?
6. Does the Short primary stay fixed while the last three answers vary, and does the Long primary
   stay fixed while the last five answers vary?
7. Does the secondary animal and relationship explanation add value?
8. Is any personal-versus-work observation cautious and recognizably supported?
9. Are strengths and possible blind spots balanced across all 16 animals?
10. Does Greek wording wrap cleanly with zoom and Extra Large text?
11. Is the entertainment and symbolic-metaphor boundary clear?

## Exit criterion

Future AI interpretation, accounts, payments, or native distribution should be considered only after
the binary animal-first flow, persistence, accessibility, privacy, and bilingual content are judged
worth continuing.
