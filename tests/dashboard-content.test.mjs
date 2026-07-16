import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { animals } from '../src/features/animals/data/animals.ts';
import { canonicalArchetypes } from '../src/features/archetypes/data/archetypes.ts';
import { homeFeatures } from '../src/features/home/data/features.ts';
import { getHomeFeatureCardWidth } from '../src/features/home/layout.ts';
import { translations } from '../src/i18n/translations.ts';

test('catalog and scoring consume the same twelve canonical archetypes', () => {
  assert.strictEqual(animals, canonicalArchetypes);
  assert.equal(animals.length, 12);
  assert.deepEqual(animals.map(({ id }) => id), Object.keys(translations.en.animals.records));
  assert.deepEqual(animals.map(({ id }) => id), Object.keys(translations.el.animals.records));
  assert.ok(animals.every(({ symbol }) => symbol.length > 0));
});
test('catalog has no availability split or status badges', () => {
  const animalCard = readFileSync('src/features/animals/components/AnimalCard.tsx', 'utf8');
  const animalData = readFileSync('src/features/animals/data/animals.ts', 'utf8');
  assert.doesNotMatch(animalCard, /availability|StatusBadge|informational|prototype/i);
  assert.doesNotMatch(animalData, /availability|informational|prototype/i);
});

test('Home exposes only its three functional feature cards', () => {
  assert.deepEqual(homeFeatures, [
    { id: 'discovery', screen: 'assessment' },
    { id: 'animals', screen: 'animals' },
    { id: 'how-it-works', screen: 'how-it-works' },
  ]);
  assert.ok(homeFeatures.every(({ screen }) => typeof screen === 'string'));
  assert.deepEqual(Object.keys(translations.en.home.features), homeFeatures.map(({ id }) => id));
  assert.deepEqual(Object.keys(translations.el.home.features), homeFeatures.map(({ id }) => id));
});

test('Home feature cards contain no disabled or future actions', () => {
  const featureCardSource = readFileSync('src/features/home/components/FeatureCard.tsx', 'utf8');
  const homeSource = readFileSync('src/features/home/components/HomeScreen.tsx', 'utf8');
  assert.doesNotMatch(featureCardSource, /disabled|StatusBadge|comingSoon/i);
  assert.doesNotMatch(homeSource, /disabled|comingSoon/i);
});

test('three-card grid is intentional at desktop, tablet, and mobile widths', () => {
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(1440, index)), ['32%', '32%', '32%']);
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(800, index)), ['48%', '48%', '100%']);
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(390, index)), ['100%', '100%', '100%']);
});

test('Home hero separates the archetype number and caption into normal-flow layout areas', () => {
  const hero = readFileSync('src/features/home/components/HeroSection.tsx', 'utf8');
  assert.match(hero, /<View style=\{styles\.motifNumberArea\}>[\s\S]*?<AppText style=\{styles\.motifText\}>12<\/AppText>[\s\S]*?<\/View>/);
  assert.match(hero, /<View style=\{styles\.motifCaptionArea\}>[\s\S]*?<AppText style=\{styles\.motifCaption\}>\{copy\.motifCaption\}<\/AppText>[\s\S]*?<\/View>/);
  assert.doesNotMatch(hero.match(/motifNumberArea:\s*\{[^}]+\}/)?.[0] ?? '', /position:\s*'absolute'/);
  assert.doesNotMatch(hero.match(/motifCaptionArea:\s*\{[^}]+\}/)?.[0] ?? '', /position:\s*'absolute'/);
  assert.match(hero, /motifCaption:\s*\{\s*color:\s*colors\.text/);
});
