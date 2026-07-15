import Constants from 'expo-constants';

const BUILD_VERSION_PATTERN = /^version_(?:\d{8}_\d{4}_[0-9a-f]{7}|dev_local)$/;
const configuredBuildVersion = Constants.expoConfig?.extra?.buildVersion;

export const buildVersion =
  typeof configuredBuildVersion === 'string' && BUILD_VERSION_PATTERN.test(configuredBuildVersion)
    ? configuredBuildVersion
    : 'version_dev_local';
