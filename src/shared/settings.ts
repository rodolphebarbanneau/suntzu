export enum SuntzuFeature {
  MapStats = "showMapStats",
  PlayerStats = "showPlayerStats",
}

export const DEFAULT_SETTINGS = new Map<SuntzuFeature, boolean>([
  [SuntzuFeature.MapStats, true],
  [SuntzuFeature.PlayerStats, true],
]);

export const isFeatureEnabled = async (featureName: SuntzuFeature) => {
  const feature = await chrome.storage.local.get(featureName);
  return feature[featureName];
};
