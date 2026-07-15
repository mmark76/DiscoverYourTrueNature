# Animals Within

**Animals Within** is a free bilingual (Greek and English) entertainment prototype for exploring
provisional animal archetypes. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

## Current experience

The responsive home dashboard provides:

- a clear path into the existing ten-question assessment;
- deterministic local scoring across five active archetypes;
- primary and secondary result presentation;
- an informational catalog of all 12 provisional animals;
- a transparent explanation of how the prototype works;
- desktop, tablet, and mobile layouts;
- persistent appearance controls available from every screen;
- a compact fixed footer with an active email Feedback action and build identifier.
- complete Greek and English content, including questions, results, the animal catalog,
  accessibility labels, and disclaimers.

Comparison, result sharing, privacy content, and seven additional assessment outcomes
are clearly marked **Προσεχώς / Coming Soon**. They are not active features and the seven future animals do not
participate in scoring.

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
language store. With no valid manual preference, a browser/device locale beginning with `el` selects
Greek; every other locale selects English. A manual choice in the header or Settings is applied
immediately and restored after refresh. Invalid or unavailable storage falls back safely without
preventing the app from loading.

The typed dictionaries in `src/i18n/content/` cover the header, Home, all ten questions and answer
options, results, all twelve animal records, How It Works, Settings, the footer, and meaningful
accessibility text. Language-neutral domain data retains question, option, animal, and archetype IDs
plus scoring metadata. Dictionary completeness and scoring fixtures are enforced by automated tests.

Changing language does not navigate away, restart the assessment, change the current question,
clear accumulated scores, or recalculate a completed primary/secondary result. The visible result
copy is resolved from stable archetype IDs in the newly selected language.

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
- color theme: Forest, Ocean, Amber, or Plum, each with light and dark semantic palettes;
- font family: System Sans, Serif, or Highly Readable system fonts;
- text size: Small, Normal, Large, or Extra Large;
- Greek and English content across every screen.

The defaults are device-locale language, System appearance, Forest colors, System Sans, and Normal
text size. Settings use one guarded storage abstraction and are restored after refresh when storage
is available. Missing, invalid, or inaccessible stored values safely fall back to defaults.

Reset requires an in-application confirmation and restores all documented defaults. It does not
reset assessment progress or results.

All rendered text uses the shared typography scale, all color presets provide the same semantic
tokens, selected choices include a non-color indicator, and interactive controls retain visible
keyboard focus. Layouts wrap for touch, large Greek labels, and Extra Large text without relying on
remote fonts. Bilingual manual testing covers wide desktop, laptop, tablet, and mobile widths with
Normal and Extra Large text, including keyboard and screen-reader labels.

### Soft Sage Forest theme

Forest Light uses warm cream and near-white surfaces with charcoal-green text, while Forest Dark
uses charcoal-sage surfaces rather than near-black green. Contrast-adjusted semantic text and
primary values preserve WCAG-readable normal text. Primary actions consistently use `primary` and
`onPrimary` in every theme; secondary actions use muted surfaces or subtle borders. The taupe
`accent` token is reserved for rare decoration and is not used for ordinary text, links, or buttons.

## Fixed footer, build information, and Feedback

The application shell owns one footer for every screen. It measures the rendered footer (including
its bottom safe-area inset) and reserves exactly that live height beneath the active screen. The
offset therefore updates when language, text scale, viewport width, zoom, or wrapping changes,
without feature screens carrying hard-coded footer margins.

The footer has exactly two semantic rows: a localized compact entertainment disclaimer, then
Privacy status, Feedback, Markellos Ecosystem, and the build identifier. It remains fixed to the
viewport, aligned to the same shared page-width container as the header and main content.

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
- `src/features/animals/` — the provisional 12-animal informational catalog.
- `src/features/information/` — the How It Works explanation.
- `src/features/assessment/` — existing questions and scoring flow.
- `src/features/results/` — existing primary and secondary result presentation.
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
