/* Declare global variable for browser support */
declare global {
  let browser: typeof chrome;
}

/* Retrieve browser API */
export const BROWSER: typeof chrome = (() => {
  // check if chrome is defined
  if (typeof chrome !== 'undefined') {
    return chrome;
  }
  // check if browser is defined
  if (typeof browser !== 'undefined') {
    return browser;
  }
  // throw if browser is not supported
  throw new Error('Unsupported browser...');
})();
