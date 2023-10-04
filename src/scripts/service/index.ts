import browser from 'webextension-polyfill';
import pRetry from 'p-retry';

import type { ApiRequest, ApiResponse } from 'src/shared/core';
import { STORAGE_DEFAULTS } from 'src/shared/settings';

/* Add listener for runtime installation */
browser.runtime.onInstalled.addListener(() => {
  // set default locals
  STORAGE_DEFAULTS.forEach(async (value, key) => {
    // get current local value
    const local = (await browser.storage.local.get(key))[key];
    // if local value exists do nothing
    if (local !== undefined) return;
    // if local value doesnt exist set default
    browser.storage.local.set({ [key]: value });
  });
});

/* Add listener for message from content script */
browser.runtime.onMessage.addListener(
  (message: ApiRequest, _, sendResponse: (response: ApiResponse<unknown>) => void) => {
    // if message is empty do nothing
    if (!message) return;
    // handle fetch requests
    pRetry(
      async () => {
        const { method, endpoint, headers } = message;
        const response = await fetch(endpoint, { method, headers });
        return response;
      },
      { retries: 3 }
    ).then(async (response) => {
      // handle response
      if (response.status === 404) {
        // abort error
        sendResponse({
          status: response.status,
          error: 'Abort error',
        });
      } else if (response.status === 429) {
        // abort error
        sendResponse({
          status: response.status,
          error: 'Too many requests error',
        });
      } else if (!response.ok) {
        // other error
        sendResponse({
          status: response.status,
          error: response.statusText,
        });
      } else {
        // success
        const data = await response.json();
        sendResponse({
          status: response.status,
          data: data,
        });
      }
    }).catch((error) => {
      // internal error
      sendResponse({
        status: 500,
        error: error.toString(),
      });
    });
    // indicate that response will be sent asynchronously
    return true;
  }
);
