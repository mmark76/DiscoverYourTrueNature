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
- persistent appearance controls available from every screen.
- complete Greek and English content, including questions, results, the animal catalog,
  accessibility labels, and disclaimers.

Comparison, result sharing, feedback, privacy content, and seven additional assessment outcomes
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

## Repository structure

- `src/features/home/` — dashboard content and feature cards.
- `src/features/animals/` — the provisional 12-animal informational catalog.
- `src/features/information/` — the How It Works explanation.
- `src/features/assessment/` — existing questions and scoring flow.
- `src/features/results/` — existing primary and secondary result presentation.
- `src/i18n/` — typed Greek and English dictionaries plus the translation hook.
- `src/shared/` — shared shell components and earthy theme tokens.
- `src/settings/` — appearance provider, presets, persistence, and Settings screen.
- `docs/` — requirements, architecture, decisions, development, and testing documentation.

## Entertainment disclaimer

Greek: **Ψυχαγωγική εμπειρία αυτογνωσίας. Δεν αποτελεί ψυχολογική διάγνωση ή επιστημονική
αξιολόγηση.**

English: **An entertainment self-discovery experience. It is not a psychological diagnosis or a
scientifically validated assessment.**
