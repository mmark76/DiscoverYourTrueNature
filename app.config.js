const appJson = require('./app.json');
const { resolveBuildVersion } = require('./scripts/buildVersion.cjs');

module.exports = {
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    buildVersion: resolveBuildVersion(),
  },
};
