import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  BUILD_TIME_ZONE,
  formatCyprusTimestamp,
  normalizeCommitSha,
  resolveBuildVersion,
} = require('../scripts/buildVersion.cjs');

test('winter builds use Europe/Nicosia standard time at UTC+2', () => {
  assert.equal(BUILD_TIME_ZONE, 'Europe/Nicosia');
  assert.equal(formatCyprusTimestamp(new Date('2026-01-15T18:34:59Z')), '20260115_2034');
});

test('summer builds use Europe/Nicosia daylight time at UTC+3', () => {
  assert.equal(formatCyprusTimestamp(new Date('2026-07-15T18:34:59Z')), '20260715_2134');
});

test('Cyprus daylight-saving transition skips from 02:59 to 04:00', () => {
  assert.equal(formatCyprusTimestamp(new Date('2026-03-29T00:59:00Z')), '20260329_0259');
  assert.equal(formatCyprusTimestamp(new Date('2026-03-29T01:00:00Z')), '20260329_0400');
});

test('Cloudflare deployment SHA produces a seven-character build version', () => {
  const fullSha = '2ED6B36F83463E7D8E3CDED0FF6D886D02C9F918';
  const version = resolveBuildVersion({
    env: { CF_PAGES_COMMIT_SHA: fullSha },
    date: new Date('2026-07-15T18:34:00Z'),
    resolveLocalSha: () => 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  });
  assert.equal(version, 'version_20260715_2134_2ed6b36');
  assert.doesNotMatch(version, /f83463e7/i);
});

test('invalid metadata falls back to local Git and then development fallback', () => {
  assert.equal(normalizeCommitSha('not-a-sha'), null);
  assert.equal(
    resolveBuildVersion({
      env: { CF_PAGES_COMMIT_SHA: 'invalid' },
      date: new Date('2026-07-15T18:34:00Z'),
      resolveLocalSha: () => 'abcdef0123456789abcdef0123456789abcdef01',
    }),
    'version_20260715_2134_abcdef0',
  );
  assert.equal(resolveBuildVersion({ env: {}, resolveLocalSha: () => null }), 'version_dev_local');
});

test('Expo config injects the prepared build value and runtime only reads it', () => {
  const config = readFileSync('app.config.js', 'utf8');
  const runtime = readFileSync('src/config/buildInfo.ts', 'utf8');
  const footer = readFileSync('src/shared/components/AppFooter.tsx', 'utf8');
  assert.match(config, /buildVersion:\s*resolveBuildVersion\(\)/);
  assert.match(runtime, /Constants\.expoConfig\?\.extra\?\.buildVersion/);
  assert.doesNotMatch(runtime, /process\.env|execFile|git\s/);
  assert.match(footer, /\{buildVersion\}/);
  assert.doesNotMatch(footer, /process\.env|execFile|CF_PAGES|GITHUB_SHA/);
});
