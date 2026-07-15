# Manual Test Plan — Animals Within Home Dashboard

## Setup

1. Run `npm install`.
2. Run `npm run typecheck` and `npm test`.
3. Run `npm run web` and open the local Expo URL.

## Responsive dashboard

- Desktop (at least 1080 px): verify three feature-card columns and a readable header/footer.
- Tablet (680–1079 px): verify two feature-card columns and wrapped navigation.
- Mobile (below 680 px): verify one card per row, readable hero copy, and reachable navigation.
- At every size, verify no horizontal scrolling or clipped text.
- Tab through active controls and verify visible focus/pressed behavior and meaningful labels.

## Navigation

- **Αρχική** opens Home from every internal view.
- **Ανακάλυψη**, the hero action, and both active discovery actions open the assessment.
- **Τα 12 Ζώα** opens the informational catalog.
- **Πώς Λειτουργεί** opens the scoring and disclaimer explanation.
- Header and footer ecosystem links open `https://markellosecosystem.com`.
- Feedback, Privacy, comparison, and sharing remain marked **Προσεχώς** and are not actionable.

## Assessment state and result

1. Start the assessment and answer at least two questions.
2. Open Home through the header.
3. Choose **Ανακάλυψη** and verify the same unfinished question is restored.
4. Complete all ten questions and verify a primary and secondary archetype appear.
5. Open Home from the result and verify the dashboard remains available.
6. Complete another run and choose restart; verify question 1 opens with clean scores.

## Twelve-animal catalog

- Verify all twelve required animals and provisional trait descriptions are present.
- Verify Wolf, Owl, Eagle, Dolphin, and Bear show **Διαθέσιμο στο prototype**.
- Verify the remaining seven show **Προσεχώς**.
- Verify no coming-soon animal can be selected or produced by the assessment.

## Content and safety

- Verify How It Works identifies the questions as experimental and scoring as deterministic.
- Verify the home/footer language describes the experience as recreational.
- Verify the footer says it is not a psychological diagnosis or scientific assessment.
- Verify there is no invented feedback or privacy destination.
