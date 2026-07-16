const { execFileSync } = require('node:child_process');

const COMMIT_ENV_NAMES = [
  'CF_PAGES_COMMIT_SHA',
  'GITHUB_SHA',
  'CI_COMMIT_SHA',
  'VERCEL_GIT_COMMIT_SHA',
  'COMMIT_SHA',
  'SOURCE_VERSION',
];
const BUILD_TIME_ZONE = 'Europe/Nicosia';

function normalizeCommitSha(value) {
  const candidate = typeof value === 'string' ? value.trim() : '';
  return /^[0-9a-f]{7,40}$/i.test(candidate) ? candidate.slice(0, 7).toLowerCase() : null;
}

function formatCyprusTimestamp(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('A valid build date is required.');
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUILD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}${values.month}${values.day}_${values.hour}${values.minute}`;
}

function readLocalGitSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
  } catch {
    return null;
  }
}

function resolveBuildVersion({ env = process.env, date = new Date(), resolveLocalSha = readLocalGitSha } = {}) {
  const environmentSha = COMMIT_ENV_NAMES
    .map((name) => normalizeCommitSha(env[name]))
    .find(Boolean);
  const shortSha = environmentSha || normalizeCommitSha(resolveLocalSha());

  return shortSha ? `version_${formatCyprusTimestamp(date)}_${shortSha}` : 'version_dev_local';
}

module.exports = {
  COMMIT_ENV_NAMES,
  BUILD_TIME_ZONE,
  formatCyprusTimestamp,
  normalizeCommitSha,
  resolveBuildVersion,
};
