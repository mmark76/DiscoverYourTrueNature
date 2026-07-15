# Animals Within

**Animals Within** is a free Greek-language entertainment prototype for exploring provisional
animal archetypes. The public prototype is available at
**https://animalswithin.markellosecosystem.com**.

## Current experience

The responsive home dashboard provides:

- a clear path into the existing ten-question assessment;
- deterministic local scoring across five active archetypes;
- primary and secondary result presentation;
- an informational catalog of all 12 provisional animals;
- a transparent explanation of how the prototype works;
- desktop, tablet, and mobile layouts.

Comparison, result sharing, feedback, privacy content, and seven additional assessment outcomes
are clearly marked **Προσεχώς**. They are not active features and the seven future animals do not
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

## Assessment navigation

Opening Home during an unfinished assessment preserves the current question and accumulated
scores. Choosing **Ανακάλυψη** or a discovery call to action resumes that assessment. Restarting
from a completed result intentionally begins again from question 1 with clean scores.

## Repository structure

- `src/features/home/` — dashboard content and feature cards.
- `src/features/animals/` — the provisional 12-animal informational catalog.
- `src/features/information/` — the How It Works explanation.
- `src/features/assessment/` — existing questions and scoring flow.
- `src/features/results/` — existing primary and secondary result presentation.
- `src/shared/` — shared shell components and earthy theme tokens.
- `docs/` — requirements, architecture, decisions, development, and testing documentation.

## Entertainment disclaimer

Το Animals Within είναι ψυχαγωγική εμπειρία αυτογνωσίας. Δεν αποτελεί ψυχολογική διάγνωση,
επιστημονικά επικυρωμένο τεστ προσωπικότητας, ιατρική συμβουλή ή επαγγελματική αξιολόγηση.
