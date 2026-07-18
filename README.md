# Animals Within

**Animals Within** is a free bilingual Greek and English entertainment experience for exploring
personality through symbolic animals. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

The experience is animal-first. Four-letter personality codes are internal implementation
identifiers only, and personality classification titles are not shown in the application. The
product does not present itself as MBTI or as an official MBTI assessment.

## Current experience

Every completed assessment contains exactly 30 binary questions. Each question presents two large
alternatives, **A / Α** and **B / Β**, and requires exactly one selection:

- questions 1–20 cover everyday behavior: 10 personal-life questions, including five about hobbies,
  interests, and learning, followed by 10 professional-life questions;
- questions 21–25 are more direct structured preferences: three personal and two professional;
- questions 26–30 are five deterministic follow-up questions selected from a 16-question bank, with
  exactly two personal and three professional contexts;
- one primary symbolic animal is calculated and locked after question 25;
- one distinct secondary animal is calculated after question 30 without changing the primary.

The catalogue contains the existing 16 unique symbolic animals and is available without completing
the assessment. Results lead with the animals and natural-language descriptions, strengths, possible
blind spots, behavioral tendencies, and how the patterns relate. A cautious personal-versus-work
observation may appear only when the internal difference is large enough to support it.

All scoring runs locally. Scores, percentages, pole totals, confidence values, distances, internal
codes, candidate comparisons, and follow-up selection logic are not user-facing.

## Run locally

Use a Node.js LTS version compatible with Expo SDK 57.

```bash
npm install
npm run web
```

Run the automated engineering checks with:

```bash
npm run typecheck
npm test
node scripts/analyzeAssessmentBalance.mjs
```

Create a production-style web export with:

```bash
npx expo export --platform web
```

The balance script is an engineering check, not scientific or psychometric validation. See
[Automated Testing](docs/testing/AUTOMATED_TESTING.md) and the
[Manual Test Plan](docs/testing/MANUAL_TEST_PLAN.md) for the intended verification coverage.

## Language and localization

Greek (`el`) and English (`en`) cover the full experience. The supplied Greek questions are the
authoritative source; English copy preserves the same behavioral distinction and scoring direction
in natural language.

Language-neutral assessment data owns stable dimension, pole, phase, context, question, option,
personality, animal, and model identifiers plus scoring metadata. Typed dictionaries under
`src/i18n/content/` own visible copy only. They do not duplicate poles, weights, reverse-keying, or
selection rules.

Changing language does not restart an assessment, clear selections, change the current question,
change the five selected follow-up IDs, change the locked primary animal, or recalculate a completed
result differently. Animal names and descriptions are resolved in the selected language from stable
internal identifiers.

## Binary interaction

Each question shows exactly two answer cards with visible **A / Α** and **B / Β** labels. Selecting
one card deselects the other. A user may change the selection before continuing, but cannot continue
without one valid selection. Back and forward navigation preserve committed answers.

Selection is communicated through text, a non-color indicator, border treatment, and accessibility
state. The controls support mouse, touch, keyboard, and screen readers; touch targets remain large,
and Greek copy wraps without clipping at narrow widths, browser zoom, and Extra Large text.

The displayed letter is not a score. Approximately half the questions reverse which pole appears as
option A, and the option metadata—not the letter—determines the signed contribution.

## Assessment model

The model identifier is `16-personality-binary-v2-30q`. It retains the four internal dimensions and
the one-to-one mapping between 16 internal personality identifiers and the existing 16 animals.

Every answer contributes `+1` toward the dimension's first pole or `-1` toward its second pole,
multiplied by a phase weight:

- everyday: `1.0`;
- structured: `1.25`;
- follow-up: `1.5`.

Each dimension is normalized independently by the total answered weight available for that
dimension and clamped to `[-1, 1]`. These weights are deterministic product-design choices for this
entertainment experience; they are not scientifically validated psychometric coefficients.

After question 25, the base profile is compared with all 16 canonical corners. The nearest candidate
becomes the locked primary animal. The system then considers the nearest non-primary candidates and
selects five follow-up questions whose dimensions help distinguish them, while giving priority to
base dimensions near balance. Selection uses stable tie-breaks and enforces exactly two personal and
three professional contexts.

After question 30, the final profile includes the five weighted follow-up answers. The locked primary
does not change. All remaining candidates are ranked deterministically, and the nearest distinct one
becomes the secondary animal.

Separate personal and professional descriptive profiles are derived only from questions 1–25.
Follow-up answers are excluded because their selected measurement opportunities differ between
users. The result may express a context difference only above a documented internal threshold and
never exposes the underlying values.

The complete formula, mapping, tie rules, and privacy boundary are documented in the
[technical assessment model](docs/assessment/SIXTEEN_PERSONALITY_ANIMAL_MODEL.md).

## Persistence and migration

Assessment persistence uses key `animals-within.assessment.v3`, schema version 3, and the explicit
model version. It stores only the current position, binary answers, selected follow-up question IDs,
the locked primary result once available, the final result once available, and the minimum internal
metadata required to restore safely.

Ranking-based schema-2 data under `animals-within.assessment.v2` and older assessment data under
`animals-within.assessment.v1` are incompatible. They are discarded rather than approximated.
Migration resets assessment state only; language, appearance, analytics consent, and unrelated
preferences remain intact. Details are in
[Persistence and Migration](docs/assessment/PERSISTENCE_AND_MIGRATION.md).

## Appearance and responsive behavior

The header provides language and Settings controls. Supported appearance settings are:

- System, Light, or Dark appearance;
- Warm Ivory, Ocean, Amber, or Plum color themes;
- System Sans, Serif, or Highly Readable font families;
- Small, Normal, Large, or Extra Large text.

Documented defaults remain English, Light appearance, Amber colors, System Sans, and Large text.
Warm Ivory retains the internal persisted theme ID `forest` for settings compatibility.

The shared responsive page container aligns the header, main screens, and fixed footer. The two
answer cards wrap vertically when needed. The shell measures the footer, including bottom safe-area
insets, and reserves its rendered height below normal application screens.

## Feedback, build information, and analytics

Feedback opens a local email draft addressed to `markellos.markides@gmail.com`. The draft contains
only the selected interface language, current public build identifier, and a blank feedback area. It
does not include answers, selected options, follow-up routes, context profiles, internal personality
identifiers, animal results, or scoring data.

The public build identifier uses `version_YYYYMMDD_HHmm_abcdefg`, with the timestamp prepared in the
`Europe/Nicosia` timezone and the seven-character source revision supplied at build time.

The existing GA4 integration remains consent-gated. Before acceptance, the application does not load
the Google tag or send events. After acceptance, it sends only the existing initial page view with a
generic page location and the generic **Animals Within** document title. It does not send question or
option IDs, selected options, dimension values, personal or professional profiles, follow-up routes,
locked or final animal results, internal codes, confidence, distances, appearance preferences,
Feedback content, or build version. All assessment calculation remains local.

## Repository structure

- `src/features/assessment/` — binary metadata, session state, persistence, deterministic follow-up
  selection, scoring, context profiles, fixtures, and engineering analysis.
- `src/features/personalities/` — internal identifiers, canonical corners, and the one-to-one
  16-animal mapping.
- `src/features/animals/` — the public 16-animal catalogue.
- `src/features/results/` — animal-first primary, secondary, relationship, and optional context
  presentation.
- `src/features/home/` and `src/features/information/` — entry points and plain-language explanation.
- `src/features/analytics/` — persisted consent controls and the isolated GA4 bootstrap.
- `src/i18n/` — typed Greek and English dictionaries plus translation helpers.
- `src/settings/` — appearance provider, presets, and independent preference persistence.
- `src/shared/` — shared shell, components, accessibility helpers, and theme tokens.
- `docs/` — requirements, architecture, model, persistence, decisions, and test documentation.

## Entertainment disclaimer

Greek: **Ψυχαγωγική εμπειρία αυτογνωσίας. Τα ζώα χρησιμοποιούνται συμβολικά. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονικά σταθμισμένη αξιολόγηση.**

English: **An entertainment self-discovery experience. The animals are used symbolically. This is not a psychological diagnosis or a scientifically validated assessment.**
