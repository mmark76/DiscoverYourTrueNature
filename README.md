# Animals Within

**Animals Within** is a free bilingual Greek and English entertainment experience for exploring
personality through symbolic animals. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

The experience is animal-first. Four-letter personality codes are internal implementation
identifiers only, and personality classification titles are not shown in the application. The
product does not present itself as MBTI or as an official MBTI assessment.

## Current experience

Every completed assessment run contains exactly 25 ranked questions:

- 20 fixed questions, with five questions for each internal E-I, S-N, T-F, and J-P dimension;
- five deterministic adaptive differentiators allocated 2, 2, and 1 to the three closest dimensions;
- four behavioral statements per question, ranked with 4, 3, 2, and 1 exactly once;
- one primary symbolic animal and one distinct secondary symbolic animal;
- a natural-language explanation of the primary pattern, strengths, possible blind spots,
  behavioral tendencies, the secondary pattern, and how the two patterns relate.

The catalogue contains 16 unique symbolic animals and is available without completing the
assessment. All scoring runs locally. Scores, percentages, pole totals, confidence values,
distances, internal codes, and adaptive calculations are not user-facing.

The responsive application preserves its existing Greek/English language controls, appearance
settings, shared shell, Feedback link, analytics consent controls, and fixed footer.

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

The balance script is an engineering check, not scientific validation. See
[Automated Testing](docs/testing/AUTOMATED_TESTING.md) and the
[Manual Test Plan](docs/testing/MANUAL_TEST_PLAN.md) for the intended verification coverage.

## Language and localization

Greek (`el`) and English (`en`) cover the full user experience. The product name **Animals Within**,
the proper name **Markellos Ecosystem**, and the shared product term **Feedback** remain unchanged
where appropriate.

Language-neutral assessment data owns stable dimension, pole, question, option, personality, animal,
and model identifiers plus scoring metadata. Typed dictionaries in `src/i18n/content/` own only the
corresponding Greek and English user-facing content. Scoring metadata is not duplicated in the
dictionaries.

Changing language does not restart an assessment, clear rankings, change selected adaptive
questions, or recalculate a completed result. Animal names and descriptions are resolved in the
newly selected language from stable internal identifiers. Four-letter codes and personality titles
are excluded from visible copy and accessibility text in both languages.

## Ranking interaction

Each answer card provides explicit controls for assigning one of four ranks:

- **4 — Describes me most**
- **3 — Describes me quite well**
- **2 — Describes me somewhat**
- **1 — Describes me least**

Each value must be used exactly once before the user can continue. Selecting a rank already held by
another statement behaves deterministically: if the selected statement already has a rank, the two
statements swap ranks; if it has no rank yet, the rank moves to it and the previous statement becomes
unranked. This interaction works without drag-and-drop and is designed for mouse, touch, keyboard,
and screen readers. Numbers, labels, borders, and accessibility state communicate selection without
depending on color alone.

## Assessment model

The model identifier is `16-personality-ranking-v1-25q`. Internally, an option contributes:

`assigned rank × option intensity × question phase weight`

Strong-pole options have intensity 2 and moderate-pole options intensity 1. Fixed questions have
phase weight 1; adaptive questions have controlled phase weight 0.75. After the 20 fixed questions,
the four normalized dimension balances are ordered deterministically. The adaptive allocation is two
questions for the closest dimension, two for the next closest, and one for the third closest, with
declared dimension order and stable question ID as tie-breakers.

The final signed four-dimensional profile is compared with all 16 canonical type corners. The closest
supported internal type supplies the primary animal; the next distinct closest type supplies the
secondary animal. Exact dimension ties remain marked as balanced and are resolved through the same
whole-profile comparison, never randomness. Internal type identifiers do not cross into the public
presentation.

The complete formula, mapping, deterministic tie rules, and privacy boundary are documented in the
[technical assessment model](docs/assessment/SIXTEEN_PERSONALITY_ANIMAL_MODEL.md).

## Persistence and migration

Assessment persistence uses key `animals-within.assessment.v2`, schema version 2, and the explicit
assessment model version. It stores the current position, completed ranking assignments, selected
adaptive question IDs, primary and secondary internal result IDs, and only the internal metadata
required to restore a balanced result.

Legacy 12-animal data under `animals-within.assessment.v1` is incompatible. Restore logic discards
only old answers, adaptive selections, and results, then starts a clean assessment session.
Language, appearance, analytics consent, and unrelated preferences remain intact. Restarting follows
the same assessment-only boundary. Details are in
[Persistence and Migration](docs/assessment/PERSISTENCE_AND_MIGRATION.md).

## Appearance and responsive behavior

The header provides language and Settings controls. Supported appearance settings are:

- System, Light, or Dark appearance;
- Warm Ivory, Ocean, Amber, or Plum color themes;
- System Sans, Serif, or Highly Readable font families;
- Small, Normal, Large, or Extra Large text.

Documented defaults remain English, Light appearance, Amber colors, System Sans, and Large text.
Warm Ivory retains the internal persisted theme ID `forest` for settings compatibility. Every theme
uses the same semantic color roles rather than feature-level hard-coded palette values.

The shared responsive page container aligns the header, main screens, and footer. Ranking controls
wrap rather than forcing four answer cards into one horizontal row. Keyboard focus remains visible,
touch targets remain large, and Greek copy is expected to wrap without clipping at mobile widths,
increased zoom, and Extra Large text.

The application shell measures the fixed footer, including bottom safe-area insets, and reserves its
live rendered height below every screen that shows normal chrome. Language, text scale, viewport,
zoom, and wrapping changes therefore do not require hard-coded screen padding.

## Feedback, build information, and analytics

Feedback opens a local email draft addressed to `markellos.markides@gmail.com`. The draft contains
only the selected interface language, current public build identifier, and a blank feedback area. It
does not include answers, rankings, internal personality identifiers, animal results, or scoring
data.

The public build identifier uses `version_YYYYMMDD_HHmm_abcdefg`, with the timestamp prepared in the
`Europe/Nicosia` timezone and the seven-character source revision supplied at build time.

The existing GA4 integration remains consent-gated. Before acceptance, the application does not load
the Google tag or send events. After acceptance, it sends only the existing initial page view with a
generic page location and the generic **Animals Within** document title. It does not send question or
option IDs, rankings, dimension values, adaptive IDs, personality codes, animal results, primary or
secondary types, confidence, distances, appearance preferences, Feedback content, or build version.
All assessment calculation remains local.

## Repository structure

- `src/features/assessment/` — ranking metadata, session state, persistence, deterministic adaptive
  selection, scoring, fixtures, and engineering analysis.
- `src/features/personalities/` — internal personality identifiers, canonical corners, and the
  one-to-one 16-animal mapping.
- `src/features/animals/` — the public 16-animal catalogue.
- `src/features/results/` — animal-first primary, secondary, and relationship presentation.
- `src/features/home/` and `src/features/information/` — entry points and plain-language explanation.
- `src/features/analytics/` — persisted consent controls and the isolated GA4 bootstrap.
- `src/i18n/` — typed Greek and English dictionaries plus translation helpers.
- `src/settings/` — appearance provider, presets, and preference persistence.
- `src/shared/` — shared responsive shell, components, accessibility helpers, and theme tokens.
- `docs/` — requirements, architecture, model, persistence, decisions, and test documentation.

## Entertainment disclaimer

Greek: **Ψυχαγωγική εμπειρία αυτογνωσίας. Τα ζώα χρησιμοποιούνται συμβολικά. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονικά σταθμισμένη αξιολόγηση.**

English: **An entertainment self-discovery experience. The animals are used symbolically. This is not a psychological diagnosis or a scientifically validated assessment.**
