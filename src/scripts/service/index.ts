import { BROWSER } from '../../shared/browser';
import { DEFAULT_SETTINGS } from '../../shared/settings';

/* Add listener for runtime installation */
BROWSER.runtime.onInstalled.addListener(() => {
  DEFAULT_SETTINGS.forEach(async (value, featureName) => {
    // get current feature setting
    const feature = (await BROWSER.storage.local.get(featureName))[
      featureName
    ];
    // if feature setting exists do nothing
    if (feature !== undefined) return;
    // if feature setting doesnt exist set default
    BROWSER.storage.local.set({ [featureName]: value });
  });
});
