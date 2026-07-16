import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  ga4Configuration,
  ga4DisabledConsentConfig,
  ga4DisableProperty,
  ga4EnabledConsentConfig,
  ga4MeasurementId,
  ga4ScriptUrl,
} from '../src/features/analytics/config/analyticsConfig.ts';
import { createBrowserGa4Adapter } from '../src/features/analytics/ga4/ga4BrowserAdapter.ts';
import { createGa4Client } from '../src/features/analytics/ga4/ga4Client.ts';
import { persistAnalyticsConsent } from '../src/features/analytics/consent/analyticsConsentStorage.ts';

function createFakeBrowser({ cookies = ['session', '_ga', '_ga_QBR3YHHMWS'] } = {}) {
  const commands = [];
  const scriptRequests = [];
  const disableChanges = [];
  const expiredCookies = [];
  const page = {
    page_location: 'https://animalswithin.markellosecosystem.com/',
    page_title: 'Animals Within',
  };

  return {
    commands,
    scriptRequests,
    disableChanges,
    expiredCookies,
    adapter: {
      queue(command) {
        commands.push(command);
        return true;
      },
      loadScript(url, elementId, onReady, onFailure) {
        scriptRequests.push({ url, elementId, onReady, onFailure });
      },
      setAnalyticsDisabled(property, disabled) {
        disableChanges.push({ property, disabled });
      },
      getCurrentPage() {
        return page;
      },
      getCookieNames() {
        return cookies;
      },
      expireCookie(name) {
        expiredCookies.push(name);
      },
    },
    completeScriptLoad(index = 0) {
      scriptRequests[index]?.onReady();
    },
  };
}

function commandsNamed(commands, name) {
  return commands.filter(([commandName]) => commandName === name);
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

test('browser adapter queues arguments-like dataLayer entries in command order', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const browserWindow = {};
  const browserDocument = {};
  const commandDate = new Date('2026-07-16T12:00:00.000Z');
  const commands = [
    ['consent', 'default', ga4DisabledConsentConfig],
    ['consent', 'update', ga4EnabledConsentConfig],
    ['js', commandDate],
    ['config', ga4MeasurementId, ga4Configuration],
    ['event', 'page_view', {
      page_location: 'https://animalswithin.markellosecosystem.com/',
      page_title: 'Animals Within',
    }],
  ];

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: browserWindow,
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: browserDocument,
  });

  try {
    const adapter = createBrowserGa4Adapter();
    assert.ok(adapter);
    for (const command of commands) assert.equal(adapter.queue(command), true);

    assert.equal(browserWindow.dataLayer.length, commands.length);
    assert.ok(browserWindow.dataLayer.every((entry) => !Array.isArray(entry)));
    assert.deepEqual(browserWindow.dataLayer.map((entry) => Array.from(entry)), commands);
    assert.deepEqual(
      browserWindow.dataLayer.map((entry) => Array.from(entry)[0]),
      ['consent', 'consent', 'js', 'config', 'event'],
    );

    const adapterSource = readFileSync(
      'src/features/analytics/ga4/ga4BrowserAdapter.ts',
      'utf8',
    );
    assert.match(adapterSource, /function gtag\(\)[\s\S]*dataLayer\?\.push\(arguments/);
    assert.doesNotMatch(adapterSource, /dataLayer\?\.push\(command\)/);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      delete globalThis.window;
    }
    if (originalDocument) {
      Object.defineProperty(globalThis, 'document', originalDocument);
    } else {
      delete globalThis.document;
    }
  }
});

test('GA4 Measurement ID and exact script URL are centralized once in application source', () => {
  assert.equal(ga4MeasurementId, 'G-QBR3YHHMWS');
  assert.equal(ga4ScriptUrl, 'https://www.googletagmanager.com/gtag/js?id=G-QBR3YHHMWS');

  const analyticsSources = sourceFiles('src/features/analytics')
    .map((path) => readFileSync(path, 'utf8'));
  assert.equal(analyticsSources.filter((source) => source.includes('G-QBR3YHHMWS')).length, 1);
});

test('default consent queues all four storage and advertising values as denied', () => {
  const browser = createFakeBrowser();
  createGa4Client(browser.adapter).syncConsent('unknown');

  assert.deepEqual(browser.commands, [
    ['consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    }],
  ]);
  assert.deepEqual(ga4DisabledConsentConfig, browser.commands[0][2]);
});

test('unknown and rejected consent never load or initialize the Google tag', () => {
  for (const consentState of ['unknown', 'rejected']) {
    const browser = createFakeBrowser();
    createGa4Client(browser.adapter).syncConsent(consentState);

    assert.equal(browser.scriptRequests.length, 0);
    assert.equal(commandsNamed(browser.commands, 'config').length, 0);
    assert.equal(commandsNamed(browser.commands, 'event').length, 0);
    if (consentState === 'unknown') {
      assert.equal(browser.disableChanges.length, 0);
      assert.equal(browser.expiredCookies.length, 0);
    } else {
      assert.deepEqual(browser.disableChanges, [{
        property: ga4DisableProperty,
        disabled: true,
      }]);
      assert.deepEqual(browser.expiredCookies.sort(), ['_ga', '_ga_QBR3YHHMWS']);
    }
  }
});

test('accepted consent loads the exact script once and initializes privacy-first config', () => {
  const browser = createFakeBrowser();
  const client = createGa4Client(browser.adapter);

  client.syncConsent('accepted');
  client.syncConsent('accepted');
  assert.equal(browser.scriptRequests.length, 1);
  assert.equal(browser.scriptRequests[0].url, ga4ScriptUrl);
  assert.deepEqual(browser.commands.slice(0, 2), [
    ['consent', 'default', ga4DisabledConsentConfig],
    ['consent', 'update', ga4EnabledConsentConfig],
  ]);

  browser.completeScriptLoad();
  browser.completeScriptLoad();
  assert.deepEqual(
    browser.commands.map(([commandName]) => commandName),
    ['consent', 'consent', 'js', 'config', 'event'],
  );
  assert.deepEqual(commandsNamed(browser.commands, 'config'), [
    ['config', ga4MeasurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    }],
  ]);
  assert.deepEqual(ga4Configuration, commandsNamed(browser.commands, 'config')[0][2]);
});

test('accepted consent sends exactly one explicit initial page_view with page metadata only', () => {
  const browser = createFakeBrowser();
  const client = createGa4Client(browser.adapter);

  client.syncConsent('accepted');
  browser.completeScriptLoad();
  client.syncConsent('accepted');
  browser.completeScriptLoad();

  const events = commandsNamed(browser.commands, 'event');
  assert.deepEqual(events, [[
    'event',
    'page_view',
    {
      page_location: 'https://animalswithin.markellosecosystem.com/',
      page_title: 'Animals Within',
    },
  ]]);
  assert.deepEqual(Object.keys(events[0][2]).sort(), ['page_location', 'page_title']);
});

test('rejected to accepted initializes without reload and does not duplicate on re-renders', () => {
  const browser = createFakeBrowser();
  const client = createGa4Client(browser.adapter);

  client.syncConsent('rejected');
  assert.equal(browser.scriptRequests.length, 0);
  client.syncConsent('accepted');
  client.syncConsent('accepted');
  assert.equal(browser.scriptRequests.length, 1);
  browser.completeScriptLoad();

  assert.equal(commandsNamed(browser.commands, 'config').length, 1);
  assert.equal(commandsNamed(browser.commands, 'event').length, 1);
});

test('accepted to rejected denies consent, disables GA, and clears only _ga cookies', () => {
  const browser = createFakeBrowser({
    cookies: ['session', '_ga', '_ga_QBR3YHHMWS', 'preferences', '_gid'],
  });
  const client = createGa4Client(browser.adapter);

  client.syncConsent('accepted');
  browser.completeScriptLoad();
  client.syncConsent('rejected');

  assert.deepEqual(browser.commands.at(-1), ['consent', 'update', ga4DisabledConsentConfig]);
  assert.deepEqual(browser.disableChanges.at(-1), {
    property: ga4DisableProperty,
    disabled: true,
  });
  assert.deepEqual(browser.expiredCookies.sort(), ['_ga', '_ga_QBR3YHHMWS']);

  client.syncConsent('accepted');
  client.syncConsent('rejected');
  assert.equal(commandsNamed(browser.commands, 'config').length, 1);
  assert.equal(commandsNamed(browser.commands, 'event').length, 1);
  assert.equal(browser.scriptRequests.length, 1);
});

test('accepted to unknown fails closed and clears only _ga cookies', () => {
  const browser = createFakeBrowser({
    cookies: ['session', '_ga', '_ga_QBR3YHHMWS', 'preferences', '_gid'],
  });
  const client = createGa4Client(browser.adapter);

  client.syncConsent('accepted');
  browser.completeScriptLoad();
  client.syncConsent('unknown');

  assert.deepEqual(browser.commands.at(-1), ['consent', 'update', ga4DisabledConsentConfig]);
  assert.deepEqual(browser.disableChanges.at(-1), {
    property: ga4DisableProperty,
    disabled: true,
  });
  assert.deepEqual(browser.expiredCookies.sort(), ['_ga', '_ga_QBR3YHHMWS']);
  assert.equal(commandsNamed(browser.commands, 'event').length, 1);

  browser.completeScriptLoad();
  client.syncConsent('unknown');
  assert.equal(commandsNamed(browser.commands, 'event').length, 1);
});

test('failed rejection persistence becomes unknown and shuts down previously accepted GA4', () => {
  const browser = createFakeBrowser();
  const client = createGa4Client(browser.adapter);
  const unavailableStorage = {
    getItem: () => 'accepted',
    setItem: () => { throw new Error('blocked'); },
  };

  client.syncConsent('accepted');
  browser.completeScriptLoad();
  const nextConsent = persistAnalyticsConsent(unavailableStorage, 'rejected')
    ? 'rejected'
    : 'unknown';
  assert.equal(nextConsent, 'unknown');
  client.syncConsent(nextConsent);

  assert.deepEqual(browser.commands.at(-1), ['consent', 'update', ga4DisabledConsentConfig]);
  assert.deepEqual(browser.disableChanges.at(-1), {
    property: ga4DisableProperty,
    disabled: true,
  });
  assert.deepEqual(browser.expiredCookies.sort(), ['_ga', '_ga_QBR3YHHMWS']);
  assert.equal(commandsNamed(browser.commands, 'event').length, 1);
});

test('revoking while the Google tag is loading blocks late initialization and page views', () => {
  const browser = createFakeBrowser();
  const client = createGa4Client(browser.adapter);

  client.syncConsent('accepted');
  client.syncConsent('rejected');
  browser.completeScriptLoad();

  assert.equal(commandsNamed(browser.commands, 'config').length, 0);
  assert.equal(commandsNamed(browser.commands, 'event').length, 0);
  assert.deepEqual(browser.commands.at(-1), ['consent', 'update', ga4DisabledConsentConfig]);
  assert.deepEqual(browser.disableChanges.at(-1), {
    property: ga4DisableProperty,
    disabled: true,
  });
});

test('GA4 bootstrap exposes no custom events or restricted assessment payload data', () => {
  const ga4Source = sourceFiles('src/features/analytics/ga4')
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');

  assert.doesNotMatch(ga4Source, /assessment_start|assessment_complete|screen_view|feedback_click|language_change|theme_change/);
  assert.doesNotMatch(ga4Source, /questionId|DimensionScoreMap|AssessmentResult|primaryAnimal|secondaryAnimal|matchPercentage|buildVersion|feedbackRecipient/);
  assert.equal((ga4Source.match(/['"]page_view['"]/g) ?? []).length, 2);
});

test('non-browser execution and unavailable adapters fail safely', () => {
  assert.equal(createBrowserGa4Adapter(), null);
  const client = createGa4Client(null);
  assert.doesNotThrow(() => client.syncConsent('unknown'));
  assert.doesNotThrow(() => client.syncConsent('accepted'));
  assert.doesNotThrow(() => client.syncConsent('rejected'));
});

test('static application markup contains no Google tag before consent', () => {
  const staticSources = ['App.tsx', 'app.config.js', 'app.json']
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  assert.doesNotMatch(staticSources, /<script[^>]+googletagmanager|gtag\/js\?id=/i);
});
