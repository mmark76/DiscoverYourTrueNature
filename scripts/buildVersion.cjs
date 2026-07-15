const { execFileSync } = require('node:child_process');

const COMMIT_ENV_NAMES = [
  'CF_PAGES_COMMIT_SHA',
  'GITHUB_SHA',
  'CI_COMMIT_SHA',
  'VERCEL_GIT_COMMIT_SHA',
  'COMMIT_SHA',
  'SOURCE_VERSION',
];

function normalizeCommitSha(value) {
  const candidate = typeof value === 'string' ? value.trim() : '';
  return /^[0-9a-f]{7,40}$/i.test(candidate) ? candidate.slice(0, 7).toLowerCase() : null;
}

function formatUtcTimestamp(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('A valid build date is required.');
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}`;
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

  return shortSha ? `version_${formatUtcTimestamp(date)}_${shortSha}` : 'version_dev_local';
}

module.exports = {
  COMMIT_ENV_NAMES,
  formatUtcTimestamp,
  normalizeCommitSha,
  resolveBuildVersion,
};
