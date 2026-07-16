# Animals Within

**Animals Within** is a free bilingual (Greek and English) entertainment prototype for exploring
provisional animal archetypes. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

## Current experience

The responsive home dashboard provides:

- a clear path into the 24-question assessment;
- deterministic local scoring across eight editorial dimensions and twelve archetypes;
- primary, secondary, and complete twelve-match result presentation;
- a consistent catalog of all 12 provisional animals;
- a transparent explanation of how the prototype works;
- desktop, tablet, and mobile layouts;
- persistent appearance controls available from every screen;
- a compact fixed footer with an active email Feedback action and build identifier;
- complete Greek and English content, including questions, results, the animal catalog,
  accessibility labels, and disclaimers.

The Home dashboard presents only its three working destinations: the assessment, the 12-animal
catalog, and How It Works. Every catalog animal participates in the assessment model.

## Run locally

Use a Node.js LTS version compatible with Expo SDK 57.

```bash
npm install
npm run web
```

Run the automated checks with:

```bash
npm run typecheck
npm test
node scripts/analyzeAssessmentBalance.mjs
```

Create a production-style web export with:

```bash
npx expo export --platform web
```

## Language and localization

Greek (`el`) and English (`en`) are supported throughout the complete user experience. The product
name **Animals Within**, the proper name **Markellos Ecosystem**, and the shared product term
**Feedback** remain intentionally unchanged where appropriate.

Language uses the same persisted preference record as the appearance settings, with no second
language store. With no saved preference, the interface starts in English. A manual choice in the
header or Settings is applied immediately and restored after refresh. Invalid or unavailable storage
falls back safely without preventing the app from loading.

The typed dictionaries in `src/i18n/content/` cover the header, Home, all 24 questions and 96 answer
options, results, all twelve animal records, How It Works, Settings, the footer, and meaningful
accessibility text. Language-neutral domain data retains question, option, animal, and archetype IDs
plus scoring metadata. Dictionary completeness and scoring fixtures are enforced by automated tests.

Changing language does not navigate away, restart the assessment, change the current question,
clear accumulated scores, or recalculate a completed primary/secondary result. The visible result
copy is resolved from stable archetype IDs in the newly selected language.

## Assessment model

Model `12-archetype-v1` measures eight editorial dimensions with three questions each. Every answer
contributes one value (`-2`, `-1`, `+1`, or `+2`) to one dimension. The local deterministic scorer
normalizes the resulting profile, compares it with twelve provisional vectors, and ranks exact match
scores before rounding display percentages. The percentages are independent alignment values, not
shares of a total. See [the technical model document](docs/assessment/TWELVE_ARCHETYPE_MODEL.md).

## Assessment navigation

Opening Home during an unfinished assessment preserves the current question and accumulated
scores. Choosing **Ανακάλυψη / Discover** or a discovery call to action resumes that assessment. Restarting
from a completed result intentionally begins again from question 1 with clean scores.

## Appearance settings

The header includes a language selector and a **Ρυθμίσεις / Settings** control. Language and appearance changes
are applied immediately without restarting an unfinished assessment, clearing accumulated scores,
changing the current question, or replacing an existing result.

Supported settings:

- appearance mode: System, Light, or Dark;
- color theme: Warm Ivory, Ocean, Amber, or Plum, each with light and dark semantic palettes;
- font family: System Sans, Serif, or Highly Readable system fonts;
- text size: Small, Normal, Large, or Extra Large;
- Greek and English content across every screen.

The defaults are English, Light appearance, Amber colors, System Sans, and Large text size.
Warm Ivory retains the internal ID `forest` so existing persisted preferences remain valid.
Settings use one guarded storage abstraction and are restored after refresh when storage
is available. Missing, invalid, or inaccessible stored values safely fall back to defaults.

Reset requires an in-application confirmation and restores all documented defaults. It does not
reset assessment progress or results.

All rendered text uses the shared typography scale, all color presets provide the same semantic
tokens, selected choices include a non-color indicator, and interactive controls retain visible
keyboard focus. Layouts wrap for touch, large Greek labels, and Extra Large text without relying on
remote fonts. Bilingual manual testing covers wide desktop, laptop, tablet, and mobile widths with
Normal and Extra Large text, including keyboard and screen-reader labels.

### Warm Ivory theme

The default theme is displayed as **Warm Ivory** in English and **Ζεστό Κρεμ** in Greek while keeping
the persisted internal identifier `forest`. Light mode combines warm ivory and cream surfaces with
ink-blue body text, warm-brown headings, blue-grey borders, and controlled burnt-orange actions.
Dark mode uses espresso and charcoal surfaces with cream headings and amber actions rather than a
green identity.

Every appearance preset defines the centralized `heading` token. Page titles, card titles, and
important section headings use `heading`; paragraph copy uses `text`, and secondary copy uses
`mutedText`. Ocean, Amber, and Plum initially map `heading` to their existing text color.

Warm Ivory Light uses `#F3EBDD` background, `#FFFCF5` surface, `#26364A` text, `#4A210E`
heading, `#AD5200` primary, `#CBD5DF` border, and `#FFF0D2` selection. Warm Ivory Dark uses
`#1E1915` background, `#30271F` surface, `#DCE2EA` text, `#F3D4B8` heading, `#E89A3D`
primary, `#51463B` border, and `#493621` selection. The Light primary and muted roles are slightly
darker than the visual reference so normal button, link, and secondary text retain readable contrast.

The complete Warm Ivory semantic palettes are:

```text
Light: background #F3EBDD; backgroundMuted #EEE4D3; surface #FFFCF5; surfaceMuted #F8F2E7;
text #26364A; heading #4A210E; mutedText #5D6879; primary #AD5200; primaryPressed #873409;
onPrimary #FFFFFF; accent #A9430D; accentPressed #873409; onAccent #FFFFFF; accentMuted #FFF1D6;
border #CBD5DF; borderStrong #AEBBC8; focus #C86400; disabled #DDD8CF; disabledText #68717C;
success #55705E; successSurface #E8EFE9; warning #9A5A16; warningSurface #FFF0D8;
selection #FFF0D2; progressTrack #E5DED1; footerBackground #FFFCF5; footerText #53657C;
footerMuted #687589; heroMuted #F5E6CD; heroDecoration #E8C18C; heroDecorationStrong #C97924.

Dark: background #1E1915; backgroundMuted #27201A; surface #30271F; surfaceMuted #392E25;
text #DCE2EA; heading #F3D4B8; mutedText #AAB3C0; primary #E89A3D; primaryPressed #F0AE58;
onPrimary #2D1807; accent #D9852D; accentPressed #E79B45; onAccent #2D1807; accentMuted #493421;
border #51463B; borderStrong #746658; focus #F0AE58; disabled #3E3832; disabledText #9D968E;
success #9AB5A0; successSurface #2D3930; warning #E4A55C; warningSurface #493421;
selection #493621; progressTrack #463D34; footerBackground #18130F; footerText #D7DEE7;
footerMuted #9EA8B5; heroMuted #4A321F; heroDecoration #8C5A2D; heroDecorationStrong #E8B779.
```

Primary actions use the burnt-orange `primary` fill with `onPrimary` text and `primaryPressed` when
pressed. Secondary actions remain cream or transparent with blue-grey borders. Warning and destructive
actions retain their own semantic roles. Active navigation and selected controls use the pale amber
selection surface with an orange border; catalog cards use one consistent active-archetype treatment.

## Fixed footer, build information, and Feedback

The application shell owns one footer for every screen. It measures the rendered footer (including
its bottom safe-area inset) and reserves exactly that live height beneath the active screen. The
offset therefore updates when language, text scale, viewport width, zoom, or wrapping changes,
without feature screens carrying hard-coded footer margins.

The footer has exactly two semantic rows: a localized compact entertainment disclaimer, then
Feedback, Markellos Ecosystem, and the build identifier. It remains fixed to the
viewport, aligned to the same shared page-width container as the header and main content. Warm Ivory
uses a quiet cream footer, blue-grey top border and text, restrained burnt-orange links, and a muted
version string without changing the measured-height or safe-area architecture.

Build configuration prepares this public identifier during Expo configuration/export:

`version_YYYYMMDD_HHmm_abcdefg`

The timestamp is generated in Cyprus local time using the IANA `Europe/Nicosia` timezone, so winter
UTC+2 and summer UTC+3 daylight-saving changes are applied automatically without using the browser
or device timezone. Commit lookup prefers Cloudflare Pages `CF_PAGES_COMMIT_SHA`, supports common
CI commit variables, falls back to the local Git HEAD, and exposes only the first seven SHA
characters. When neither deployment nor Git metadata is available, it uses `version_dev_local`.
Runtime footer code only renders the already-prepared value.

Feedback in the header and footer opens the user's email client with a draft addressed to
`markellos.markides@gmail.com`. The centralized mailto builder URL-encodes the subject, selected
interface language, current build identifier, line breaks, and a blank Feedback area; it never sends
mail automatically and requires no backend.

## Repository structure

- `src/features/home/` — dashboard content and feature cards.
- `src/features/archetypes/` — canonical IDs, symbols, ordering, dimensions, and vectors.
- `src/features/animals/` — the provisional 12-animal catalog.
- `src/features/assessment/` — questions, fixtures, dimension scoring, and balance analysis.
- `src/features/information/` — the How It Works explanation.
- `src/features/results/` — primary, secondary, and complete ranked result presentation.
- `src/i18n/` — typed Greek and English dictionaries plus the translation hook.
- `src/config/` — prepared build information and centralized Feedback mailto construction.
- `src/shared/` — shared shell components and earthy theme tokens.
- `src/settings/` — appearance provider, presets, persistence, and Settings screen.
- `docs/` — requirements, architecture, decisions, development, and testing documentation.

## Entertainment disclaimer

Greek: **Ψυχαγωγική εμπειρία αυτογνωσίας. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονική
αξιολόγηση.**

English: **An entertainment self-discovery experience. It is not a psychological diagnosis or a
scientifically validated assessment.**
