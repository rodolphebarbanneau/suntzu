import { BROWSER } from 'src/shared/helpers';
import { STORAGE_DEFAULTS } from 'src/shared/settings';

/* Add listener for runtime installation */
BROWSER.runtime.onInstalled.addListener(() => {
  // set default locals
  STORAGE_DEFAULTS.forEach(async (value, key) => {
    // get current local value
    const local = (await BROWSER.storage.local.get(key))[key];
    // if local value exists do nothing
    if (local !== undefined) return;
    // if local value doesnt exist set default
    BROWSER.storage.local.set({ [key]: value });
  });
});
