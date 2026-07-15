# Discover Your True Nature

> Working title for an animal-archetype self-discovery experience.

## Working URL

**https://animalswithin.markellosecosystem.com**

## Working promise

**Discover Your Animal Archetype.**  
Greek: **Ανακάλυψε το ζωικό σου αρχέτυπο.**

## Current prototype

The repository now contains a runnable personal-validation prototype built with Expo, React Native, and TypeScript.

It currently provides:

- a Greek-language welcome screen,
- ten questions shown one at a time,
- five initial animal archetypes,
- deterministic local scoring,
- a primary and secondary archetype,
- strengths, watch-outs, and restart capability.

The first prototype intentionally does **not** use the OpenAI API, Google Play Billing, user accounts, a database, or analytics. This keeps personal testing free and isolates the product questions from the technical and commercial decisions.

## Run locally

Prerequisite: a Node.js LTS version compatible with Expo SDK 57.

```bash
npm install
npm run web
```

For Android development after the local environment is configured:

```bash
npm run android
```

Run the TypeScript validation with:

```bash
npm run typecheck
```

## Important documents

- `docs/requirements/MVP_SCOPE.md` — exact scope and validation questions.
- `docs/testing/MANUAL_TEST_PLAN.md` — step-by-step owner testing.
- `docs/decisions/ADR-0001-prototype-platform.md` — platform decision and deferred choices.
- `docs/development/GENERAL_SOFTWARE_PROJECT_GUIDE.md` — project-wide architecture and development principles.

## Repository structure

- `docs/` — requirements, architecture, decisions, development, and testing documentation.
- `src/features/` — assessment, onboarding, and result capabilities organised by feature.
- `src/shared/` — reusable styles and future shared components.
- `src/infrastructure/` — reserved for later external-service integrations.

## Development principle

Build the smallest coherent version first, using small modules, clear responsibilities, documented decisions, and controlled incremental changes.
