# Animals Within

**Animals Within** is a free bilingual Greek and English entertainment experience for exploring
personality through symbolic animals. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

The experience is animal-first. Four-letter personality codes are internal implementation
identifiers only, and personality classification titles are not shown in the application. The
product does not present itself as MBTI or as an official MBTI assessment.

## Current experience

Home offers two independent binary questionnaires. Each question presents two large alternatives,
**A / Α** and **B / Β**, and requires exactly one selection:

- **Short questionnaire:** 15 questions, about 3 minutes. Questions 1–12 contain exactly three
  questions in each of four internal areas. They lock the primary animal. Questions 13–15 are three
  deterministic separator questions that select a distinct secondary without changing the primary.
- **Long questionnaire:** the existing 30-question experience, about 6 minutes. Questions 1–20 cover
  everyday behavior, questions 21–25 use more direct preferences, and questions 26–30 are five
  deterministic follow-ups. The primary locks after question 25 and the distinct secondary is
  calculated after question 30.

Short and Long progress coexist locally. Starting, continuing, refreshing, or restarting one does
not overwrite the other.

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

Greek (`el`) and English (`en`) cover both questionnaires and the full experience. Short Greek uses
simple lower-secondary-school wording. English copy preserves each behavioral distinction and
metadata-owned scoring direction in natural language.

Language-neutral assessment data owns stable mode, Short-area, dimension, pole, phase, context,
question, option, personality, animal, and model identifiers plus scoring metadata. Typed
dictionaries under
`src/i18n/content/` own visible copy only. They do not duplicate poles, weights, reverse-keying, or
selection rules.

Changing language does not restart either questionnaire, clear selections, change a current
question, change a deterministic follow-up route, change a locked primary animal, or recalculate a
completed result differently. Animal names and descriptions are resolved in the selected language
from stable internal identifiers.

## Binary interaction

Each question shows exactly two answer cards with visible **A / Α** and **B / Β** labels. Selecting
one card deselects the other. A user may change the selection before continuing, but cannot continue
without one valid selection. Back and forward navigation preserve committed answers.

Selection is communicated through text, a non-color indicator, border treatment, and accessibility
state. The controls support mouse, touch, keyboard, and screen readers; touch targets remain large,
and Greek copy wraps without clipping at narrow widths, browser zoom, and Extra Large text.

The displayed letter is not a score. Approximately half the questions reverse which pole appears as
option A, and the option metadata—not the letter—determines the signed contribution.

## Questionnaire models

Both modes retain the four canonical internal dimensions and the one-to-one mapping between 16
internal personality identifiers and the existing 16 animals. The result records whether it came
from `assessmentMode: 'short' | 'long'`, but public results stay animal-only.

### Short questionnaire

The Short model identifier is `animals-within-short-binary-v1-15q`:

- 12 fixed questions, weighted `1.0`, with exactly three in each internal area;
- sociability and social intelligence maps internally to `energy`;
- emotional intelligence maps internally to `decisions`;
- creativity and imagination maps internally to `information`;
- practicality, logic, and analytical thinking maps internally to `structure`;
- the primary is calculated and locked from questions 1–12;
- three questions, weighted `1.5`, are selected deterministically from an eight-question separator
  bank using nearby-candidate disagreement and fixed tie-breaks;
- the final secondary uses all 15 answers, excludes the locked primary, and is always distinct.

The three separator questions come from three different areas. They can influence only the
secondary. Each fixed or separator question measures one area and offers two acceptable tendencies
within it.

### Long questionnaire

The existing Long model identifier remains `16-personality-binary-v2-30q` and its 30-question
structure is unchanged.

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

The two questionnaire records and the active chooser mode use separate keys:

- Long: `animals-within.assessment.v3`, schema 3;
- Short: `animals-within.assessment.short.v1`, schema 1;
- active mode: `animals-within.assessment.active-mode`.

Each questionnaire stores only its current position, binary answers, selected follow-up question
IDs, locked primary once available, final result once available, `assessmentMode`, and the minimum
internal metadata required to restore safely. Restart resets only the active mode's record.

Existing valid Long schema-3 records that predate `assessmentMode` upgrade in place to mode `long`
without losing progress. The Long key, 30-question model, and result calculation are otherwise
unchanged.

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

- `src/features/assessment/` — independent Short and Long binary metadata, session state,
  persistence, deterministic follow-up selection, scoring, context profiles, fixtures, and
  engineering analysis.
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
