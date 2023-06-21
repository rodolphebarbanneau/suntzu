import { BROWSER } from 'src/shared/browser';
import { FEATURE_DEFAULTS, RANGE_DEFAULTS } from 'src/shared/settings';

/* Add listener for runtime installation */
BROWSER.runtime.onInstalled.addListener(() => {
  // set default features
  FEATURE_DEFAULTS.forEach(async (value, feature) => {
    // get current feature option
    const option = (await BROWSER.storage.local.get(feature))[
      feature
    ];
    // if feature option exists do nothing
    if (option !== undefined) return;
    // if feature option doesnt exist set default
    BROWSER.storage.local.set({ [feature]: value });
  });

  // set default ranges
  RANGE_DEFAULTS.forEach(async (value, range) => {
    // get current range option
    const option = (await BROWSER.storage.local.get(range))[
      range
    ];
    // if range option exists do nothing
    if (option !== undefined) return;
    // if range option doesnt exist set default
    BROWSER.storage.local.set({ [range]: value });
  });
});
