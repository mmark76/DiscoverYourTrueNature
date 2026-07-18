import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { createFeedbackMailto } from '../src/config/feedback.ts';
import { animals } from '../src/features/animals/data/animals.ts';
import { formatTranslation, translations } from '../src/i18n/translations.ts';

const personalityCodePattern = /\b(?:INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/i;
const classificationTitlePattern = /(?:\b(?:Architect|Logician|Commander|Debater|Advocate|Mediator|Protagonist|Campaigner|Logistician|Defender|Executive|Consul|Virtuoso|Adventurer|Entrepreneur|Entertainer)\b|Αρχιτέκτονας|Ορθολογιστής|Διοικητής|Συζητητής|Συνήγορος|Διαμεσολαβητής|Πρωταγωνιστής|Ακτιβιστής|Λογιστικός|Υπερασπιστής|Διευθυντής|Πρόξενος|Βιρτουόζος|Τυχοδιώκτης|Επιχειρηματίας|Διασκεδαστής)/iu;
const brandedAssessmentPattern = /\bMBTI\b|Myers(?:\s|-)?Briggs|16\s*Personalities|official\s+(?:MBTI|personality)\s+assessment/i;

function stringLeaves(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringLeaves);
  return Object.values(value).flatMap(stringLeaves);
}

function assertAnimalFirstPublicText(text, context) {
  assert.doesNotMatch(text, personalityCodePattern, `${context} exposes an internal personality code`);
  assert.doesNotMatch(text, classificationTitlePattern, `${context} exposes a classification title`);
  assert.doesNotMatch(text, brandedAssessmentPattern, `${context} presents the experience as MBTI`);
}

test('every visible English and Greek translation is animal-first and classification-free', () => {
  for (const [language, content] of Object.entries(translations)) {
    const visibleText = stringLeaves(content).join('\n');
    assertAnimalFirstPublicText(visibleText, `${language} translations`);
    assert.doesNotMatch(
      visibleText,
      /differentiator|adaptive question|structured phase|psychometric|internal dimension|raw score|exact distance/i,
    );
  }
});

test('public animal data and localized animal records cannot carry codes or classification titles', () => {
  assert.equal(animals.length, 16);
  assert.ok(animals.every((animal) => Object.keys(animal).sort().join(',') === 'id,symbol'));

  const expectedCopyKeys = [
    'blindSpots', 'decisions', 'description', 'information', 'interaction',
    'metaphor', 'name', 'organization', 'strengths', 'tagline',
  ];
  for (const content of Object.values(translations)) {
    for (const animal of animals) {
      const copy = content.animals.records[animal.id];
      assert.deepEqual(Object.keys(copy).sort(), expectedCopyKeys);
      assertAnimalFirstPublicText(stringLeaves(copy).join('\n'), `${animal.id} public copy`);
    }
  }

  const translationTypes = readFileSync('src/i18n/translationTypes.ts', 'utf8');
  const animalCopy = translationTypes.match(/export interface AnimalCopy \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.doesNotMatch(animalCopy, /code|typeId|personalityTitle|classification/i);
});

test('result UI receives public animals and presents descriptions without technical scores', () => {
  const app = readFileSync('App.tsx', 'utf8');
  const resultScreen = readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8');
  const resultInvocation = app.match(/<ResultScreen[\s\S]*?\/>/)?.[0] ?? '';

  assert.match(app, /function toPublicAnimal\(typeId: PersonalityTypeId\): AnimalData/);
  assert.match(app, /const \{ animalId, symbol \} = getPersonalityAnimal\(typeId\)/);
  assert.match(app, /return \{ id: animalId as AnimalId, symbol \}/);
  assert.match(resultInvocation, /primaryAnimal=\{primaryAnimal\}/);
  assert.match(resultInvocation, /secondaryAnimal=\{secondaryAnimal\}/);
  assert.doesNotMatch(resultInvocation, /primaryTypeId|secondaryTypeId|profile|distance|score/i);

  assert.match(resultScreen, /primaryAnimal: AnimalData/);
  assert.match(resultScreen, /secondaryAnimal: AnimalData/);
  assert.doesNotMatch(resultScreen, /features\/personalities|AssessmentResult|PersonalityTypeId|primaryTypeId|secondaryTypeId/i);
  assert.doesNotMatch(resultScreen, /distance|poleTotals|matchPercentage|confidence|score\b|percentage|percent/i);
  assert.match(resultScreen, /primaryCopy\.description/);
  assert.match(resultScreen, /primaryCopy\.strengths/);
  assert.match(resultScreen, /primaryCopy\.blindSpots/);
  assert.match(resultScreen, /primaryCopy\.interaction/);
  assert.match(resultScreen, /primaryCopy\.information/);
  assert.match(resultScreen, /primaryCopy\.decisions/);
  assert.match(resultScreen, /primaryCopy\.organization/);
  assert.match(resultScreen, /secondaryCopy\.description/);
  assert.match(resultScreen, /relationshipDescription/);
  assert.match(resultScreen, /contextObservationText/);
  assert.match(resultScreen, /hasCloseMatch/);
  assert.doesNotMatch(resultScreen, /(?:primary|secondary)Copy\.metaphor|animalMetaphor/);
  assert.match(resultScreen, /primaryStrength: primaryCopy\.strengths\[0\]/);
  assert.match(resultScreen, /secondaryStrength: secondaryCopy\.strengths\[0\]/);

  const resultOrder = [
    'style={styles.primaryHero}',
    'style={styles.secondaryCard}',
    'style={styles.relationshipCard}',
    'style={styles.twoColumnGrid}',
    'style={styles.section}',
  ].map((token) => resultScreen.indexOf(token));
  assert.ok(resultOrder.every((index) => index >= 0));
  assert.deepEqual(resultOrder, [...resultOrder].sort((left, right) => left - right));
});

test('accessibility labels announce animal names and descriptions, never implementation identifiers', () => {
  const resultScreen = readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8');
  const animalCard = readFileSync('src/features/animals/components/AnimalCard.tsx', 'utf8');
  const assessmentScreen = readFileSync('src/features/assessment/components/AssessmentScreen.tsx', 'utf8');
  const binaryCard = readFileSync('src/features/assessment/components/BinaryOptionCard.tsx', 'utf8');
  const accessibilitySource = `${resultScreen}\n${animalCard}\n${assessmentScreen}\n${binaryCard}`;

  assert.match(resultScreen, /primary: primaryCopy\.name/);
  assert.match(resultScreen, /secondary: secondaryCopy\.name/);
  assert.match(animalCard, /name: copy\.name/);
  assert.match(animalCard, /description: copy\.description/);
  assert.match(animalCard, /indicator: indicators/);
  assert.match(binaryCard, /accessibilityRole="radio"/);
  assert.match(binaryCard, /accessibilityState=\{\{ checked: selected \}\}/);
  assert.doesNotMatch(accessibilitySource, /primaryTypeId|secondaryTypeId|PersonalityTypeId|\.code\b|personalityTitle/i);

  for (const content of Object.values(translations)) {
    const raven = content.animals.records.raven;
    const octopus = content.animals.records.octopus;
    const reveal = formatTranslation(content.results.revealAccessibilityLabel, {
      primary: raven.name,
      secondary: octopus.name,
    });
    const card = formatTranslation(content.animals.cardAccessibility, {
      name: raven.name,
      description: raven.description,
      indicator: content.animals.primaryIndicator,
    });
    assertAnimalFirstPublicText(`${reveal}\n${card}`, 'resolved accessibility copy');
    assert.match(reveal, new RegExp(raven.name, 'u'));
    assert.match(reveal, new RegExp(octopus.name, 'u'));
  }
});

test('page metadata, screen routes, and public navigation cannot reveal a personality code', () => {
  const appConfig = JSON.parse(readFileSync('app.json', 'utf8'));
  const navigation = readFileSync('src/app/navigation.ts', 'utf8');
  const app = readFileSync('App.tsx', 'utf8');
  const metadata = JSON.stringify({
    name: appConfig.expo.name,
    slug: appConfig.expo.slug,
    androidPackage: appConfig.expo.android?.package,
  });

  assert.equal(appConfig.expo.name, 'Animals Within');
  assertAnimalFirstPublicText(metadata, 'application metadata');
  assertAnimalFirstPublicText(navigation, 'screen routes');
  assert.doesNotMatch(`${navigation}\n${app}`, /URLSearchParams|pushState|replaceState|personality(?:Type)?(?:Id)?[=:]\s*['"`]/i);
  assert.doesNotMatch(app, /document\.title\s*=|<title[^>]*>/i);
});

test('Home, How It Works, catalogue, and result source never render classification labels', () => {
  const publicSources = [
    'src/features/home/components/HomeScreen.tsx',
    'src/features/home/components/HeroSection.tsx',
    'src/features/home/components/FeatureCard.tsx',
    'src/features/information/components/HowItWorksScreen.tsx',
    'src/features/animals/components/AnimalsScreen.tsx',
    'src/features/animals/components/AnimalCard.tsx',
    'src/features/results/components/ResultScreen.tsx',
    'src/shared/components/AppHeader.tsx',
    'src/shared/components/AppFooter.tsx',
  ].map((path) => readFileSync(path, 'utf8')).join('\n');

  assertAnimalFirstPublicText(publicSources, 'public component source');
  assert.doesNotMatch(publicSources, /personalityTitle|classificationTitle|typeCode|\.code\b/i);
});

test('feedback and any future share surface contain no assessment classification context', () => {
  const feedbackSource = readFileSync('src/config/feedback.ts', 'utf8');
  const publicSources = [
    readFileSync('App.tsx', 'utf8'),
    readFileSync('src/shared/components/AppHeader.tsx', 'utf8'),
    readFileSync('src/shared/components/AppFooter.tsx', 'utf8'),
    readFileSync('src/features/results/components/ResultScreen.tsx', 'utf8'),
  ].join('\n');
  const feedbackUrl = createFeedbackMailto({
    languageLabel: 'English',
    buildVersion: 'version_20260716_1200_abcdef0',
  });

  assertAnimalFirstPublicText(decodeURIComponent(feedbackUrl), 'feedback draft');
  assert.doesNotMatch(
    feedbackSource,
    /questionId|optionId|rankings|primaryTypeId|secondaryTypeId|animalId|score|distance|confidence/i,
  );
  assert.doesNotMatch(publicSources, /navigator\.share|Share\.share|react-native-share|expo-sharing/i);
});
