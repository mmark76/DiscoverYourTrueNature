# MVP Scope — Personal Validation Prototype

## Goal

Maintain the smallest usable public experience that lets the owner evaluate the core self-discovery
flow before adding OpenAI interpretation, payments, accounts, or app-store distribution.

## Included

- Bilingual Greek and English home dashboard.
- Exactly 25 answers per run: 18 everyday-behavior questions, 5 lighter preferences, and 2
  sequential adaptive differentiators selected from a 10-question bank.
- Twelve active animal archetypes: wolf, owl, eagle, dolphin, bear, lion, fox,
  panther, elephant, horse, turtle, and octopus.
- Deterministic and inspectable scoring.
- Primary and secondary animal archetype.
- A minimal result containing only the primary animal, secondary animal, and restart action.
- Restart and repeat capability.
- Web and Android-compatible React Native foundation through Expo.

## Explicitly excluded from this prototype

- OpenAI API integration.
- Google Play Billing.
- User accounts.
- Database or long-term storage.
- Email collection.
- Custom assessment analytics or any analytics payload containing answers, traits, or animal results.
- Claims of psychological or scientific validation.

## Product constraints

- The standard experience should remain short.
- The current entertainment model uses 23 fixed questions followed by 2 adaptive questions.
- Hidden scoring uses five primary dimensions and six complementary behavioral signals.
- Preference and adaptive questions must not outweigh the fixed everyday-behavior pattern.
- Future question-count changes require a documented product decision and a new model version.
- The result is presented as entertainment and self-reflection, not diagnosis.

## Validation questions

The owner should assess:

1. Was the experience enjoyable?
2. Did it feel too short, too long, or appropriate?
3. Did any option feel artificial or obvious?
4. Did the primary animal feel accurate?
5. Did the secondary animal add value?
6. Which result text felt generic or inaccurate?
7. Would AI interpretation materially improve the experience?

## Exit criterion

OpenAI API integration should begin only after the basic flow, questions, archetypes, and result presentation are considered worth continuing.
