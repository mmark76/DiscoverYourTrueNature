# ADR-0001: Use Expo React Native for the Validation Prototype

- **Status:** Proposed
- **Date:** 2026-07-15

## Context

The product is expected to target Android through Google Play, but the owner first needs a low-risk version that can be tested quickly without OpenAI API costs, payment integration, or app-store publication.

## Decision

Use Expo with React Native and TypeScript for the first prototype.

The same codebase can be tested in a web browser and can later target Android. The prototype will use local deterministic scoring. OpenAI integration will be added behind the owner's backend only after the experience has been validated.

## Consequences

### Positive

- Faster personal testing through the web target.
- A direct path toward Android.
- Shared TypeScript domain logic across platforms.
- No API usage costs during the validation phase.
- No exposed OpenAI API key in the frontend.

### Negative

- Google Play Billing will require a later native-capable build and dedicated integration.
- Some Android behaviour cannot be fully validated in a browser.
- The final backend and deployment platform remain undecided.

## Deferred decisions

- Backend hosting provider.
- OpenAI model and prompt design.
- Google Play Billing library and purchase validation.
- Database and user identity.
- Final number of animal archetypes.
