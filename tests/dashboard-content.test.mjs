import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { animals } from '../src/features/animals/data/animals.ts';
import { homeFeatures } from '../src/features/home/data/features.ts';
import { getHomeFeatureCardWidth } from '../src/features/home/layout.ts';
import { translations } from '../src/i18n/translations.ts';

const expectedAnimalIds = [
  'raven', 'octopus', 'lion', 'fox',
  'elephant', 'deer', 'dolphin', 'otter',
  'beaver', 'dog', 'wolf', 'penguin',
  'falcon', 'swan', 'cheetah', 'peacock',
];

test('catalogue exposes exactly the same sixteen public animal IDs in both languages', () => {
  assert.equal(animals.length, 16);
  assert.deepEqual(animals.map(({ id }) => id), expectedAnimalIds);
  assert.deepEqual(animals.map(({ id }) => id), Object.keys(translations.en.animals.records));
  assert.deepEqual(animals.map(({ id }) => id), Object.keys(translations.el.animals.records));
  assert.equal(new Set(animals.map(({ id }) => id)).size, 16);
  assert.ok(animals.every(({ symbol }) => symbol.length > 0));
  assert.ok(animals.every((animal) => Object.keys(animal).sort().join(',') === 'id,symbol'));
});

test('catalogue cards have no availability split, status badges, codes, or classification titles', () => {
  const animalCard = readFileSync('src/features/animals/components/AnimalCard.tsx', 'utf8');
  const animalData = readFileSync('src/features/animals/data/animals.ts', 'utf8');
  assert.doesNotMatch(animalCard, /availability|StatusBadge|informational|prototype/i);
  assert.doesNotMatch(animalData, /availability|informational|prototype/i);
  assert.doesNotMatch(animalCard, /personalityType|typeId|\.code\b|personalityTitle/i);
  assert.doesNotMatch(animalData, /PersonalityTypeId|primaryTypeId|secondaryTypeId|profile:/i);
});

test('catalogue distinguishes primary and secondary animals without relying only on color', () => {
  const animalCard = readFileSync('src/features/animals/components/AnimalCard.tsx', 'utf8');
  const animalScreen = readFileSync('src/features/animals/components/AnimalsScreen.tsx', 'utf8');
  assert.match(animalCard, /isPrimary/);
  assert.match(animalCard, /isSecondary/);
  assert.match(animalCard, /content\.animals\.primaryIndicator/);
  assert.match(animalCard, /content\.animals\.secondaryIndicator/);
  assert.match(animalCard, /styles\.indicatorSymbol/);
  assert.match(animalCard, /accessibilityLabel=\{accessibilityLabel\}/);
  assert.match(animalScreen, /primaryAnimalId/);
  assert.match(animalScreen, /secondaryAnimalId/);
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

test('three-card grid remains intentional at desktop, tablet, and mobile widths', () => {
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(1440, index)), ['32%', '32%', '32%']);
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(800, index)), ['48%', '48%', '100%']);
  assert.deepEqual([0, 1, 2].map((index) => getHomeFeatureCardWidth(390, index)), ['100%', '100%', '100%']);
});

test('Home hero presents sixteen symbolic animals in normal-flow layout areas', () => {
  const hero = readFileSync('src/features/home/components/HeroSection.tsx', 'utf8');
  assert.match(
    hero,
    /<View style=\{styles\.motifNumberArea\}>[\s\S]*?<AppText style=\{styles\.motifText\}>16<\/AppText>[\s\S]*?<\/View>/,
  );
  assert.match(
    hero,
    /<View style=\{styles\.motifCaptionArea\}>[\s\S]*?<AppText style=\{styles\.motifCaption\}>\{copy\.motifCaption\}<\/AppText>[\s\S]*?<\/View>/,
  );
  assert.doesNotMatch(hero.match(/motifNumberArea:\s*\{[^}]+\}/)?.[0] ?? '', /position:\s*'absolute'/);
  assert.doesNotMatch(hero.match(/motifCaptionArea:\s*\{[^}]+\}/)?.[0] ?? '', /position:\s*'absolute'/);
  assert.match(hero, /motifCaption:\s*\{\s*color:\s*colors\.text/);
});

test('Home explains the ranked 20 plus 5 animal-first experience without mathematical detail', () => {
  const english = JSON.stringify(translations.en.home);
  const greek = JSON.stringify(translations.el.home);
  assert.match(english, /25|twenty-five/i);
  assert.match(english, /20|twenty fixed/i);
  assert.match(english, /5|five adaptive/i);
  assert.match(english, /16|sixteen/i);
  assert.match(english, /rank/i);
  assert.match(english, /primary/i);
  assert.match(english, /secondary/i);
  assert.match(english, /local|device/i);
  assert.match(greek, /25|είκοσι πέντε/u);
  assert.match(greek, /20|είκοσι/u);
  assert.match(greek, /5|πέντε/u);
  assert.match(greek, /16|δεκαέξι/u);
  assert.doesNotMatch(`${english}\n${greek}`, /0\.75|distance|euclidean|root-mean-square|pole total|confidence percentage/i);
});

test('catalogue uses responsive wrapping and Extra Large text forces one card per row', () => {
  const screen = readFileSync('src/features/animals/components/AnimalsScreen.tsx', 'utf8');
  const card = readFileSync('src/features/animals/components/AnimalCard.tsx', 'utf8');
  assert.match(screen, /settings\.textSize === 'extra-large'/);
  assert.match(screen, /\? '100%'/);
  assert.match(screen, /flexWrap: 'wrap'/);
  assert.match(card, /minWidth: 0/);
  assert.doesNotMatch(`${screen}\n${card}`, /horizontal=\{true\}|numberOfLines/);
});
