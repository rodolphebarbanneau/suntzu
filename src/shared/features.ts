import { BROWSER } from './browser';

/* Suntzu features */
export enum SuntzuFeature {
  MapFeature = 'showMapMetrics',
  PlayerFeature = 'showPlayerMetrics',
}

/**
 * Check if the specified feature is enabled.
 * @param feature - The suntzu feature.
 * @returns True if the feature is enabled, false otherwise.
 */
export async function isFeatureEnabled(feature: SuntzuFeature): Promise<boolean> {
  return new Promise((resolve, reject) => {
    BROWSER.storage.local.get(feature, (result) => {
      if (BROWSER.runtime.lastError) {
        reject(BROWSER.runtime.lastError);
      } else {
        resolve(result[feature]);
      }
    });
  });
};
