import assert from 'node:assert/strict';
import test from 'node:test';

import { provisionalAnimals } from '../src/features/animals/data/animals.ts';
import { homeFeatures } from '../src/features/home/data/features.ts';
import { translations } from '../src/i18n/translations.ts';

test('the informational catalog contains the required twelve animals', () => {
  assert.deepEqual(
    provisionalAnimals.map(({ id }) => translations.el.animals.records[id].name),
    [
      'Λύκος',
      'Κουκουβάγια',
      'Αετός',
      'Δελφίνι',
      'Αρκούδα',
      'Λιοντάρι',
      'Αλεπού',
      'Πάνθηρας',
      'Ελέφαντας',
      'Άλογο',
      'Χελώνα',
      'Χταπόδι',
    ],
  );
});

test('only the five existing archetypes are marked available', () => {
  const available = provisionalAnimals.filter(({ availability }) => availability === 'prototype');
  const comingSoon = provisionalAnimals.filter(({ availability }) => availability === 'coming-soon');

  assert.deepEqual(
    available.map(({ id }) => id),
    ['wolf', 'owl', 'eagle', 'dolphin', 'bear'],
  );
  assert.equal(comingSoon.length, 7);
});

test('coming-soon dashboard cards do not expose actions', () => {
  const activeCards = homeFeatures.filter(({ action }) => action !== undefined);
  const comingSoonCards = homeFeatures.filter(({ action }) => action === undefined);

  assert.equal(homeFeatures.length, 6);
  assert.deepEqual(
    activeCards.map(({ id }) => id),
    ['discovery', 'animals', 'how-it-works'],
  );
  assert.deepEqual(
    comingSoonCards.map(({ id }) => id),
    ['compare', 'share', 'feedback'],
  );
});
