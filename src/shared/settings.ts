import { BROWSER } from './browser';

/* Suntzu features */
export enum SuntzuFeature {
  MapFeature = 'showMapMetrics',
  PlayerFeature = 'showPlayerMetrics',
}

/* Default settings */
export const DEFAULT_SETTINGS = new Map<SuntzuFeature, boolean>([
  [SuntzuFeature.MapFeature, true],
  [SuntzuFeature.PlayerFeature, true],
]);

/**
 * Check if the feature is enabled.
 * @param featureName - The name of the feature.
 * @returns True if the feature is enabled, false otherwise.
 */
export async function isFeatureEnabled(featureName: SuntzuFeature): Promise<boolean> {
  return new Promise((resolve, reject) => {
    BROWSER.storage.local.get(featureName, (result) => {
      if (BROWSER.runtime.lastError) {
        reject(BROWSER.runtime.lastError);
      } else {
        resolve(result[featureName]);
      }
    });
  });
};
