export enum SuntzuFeature {
  MapMetrics = 'showMapMetrics',
  PlayerMetrics = 'showPlayerMetrics',
}

export const DEFAULT_SETTINGS = new Map<SuntzuFeature, boolean>([
  [SuntzuFeature.MapMetrics, true],
  [SuntzuFeature.PlayerMetrics, true],
]);

export const isFeatureEnabled = async (featureName: SuntzuFeature) => {
  const feature = await chrome.storage.local.get(featureName);
  return feature[featureName];
};
