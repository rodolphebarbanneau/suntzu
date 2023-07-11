/* Configuration */
export const DEBOUNCE_DELAY = 250;  // milliseconds

/* Extension */
export const EXTENSION_NAME = 'suntzu';
export const EXTENSION_VERSION = '0.1.0';

/* Faceit */
export const FACEIT_API_BASE_URL = 'https://api.faceit.com';
export const FACEIT_API_TOKEN = process.env.FACEIT_API_TOKEN ?? null;
export const FACEIT_OPEN_BASE_URL = 'https://open.faceit.com';
export const FACEIT_OPEN_TOKEN = process.env.FACEIT_OPEN_TOKEN ?? null;
export const FACEIT_MATCHROOM_ROUTES = ['cs2', 'csgo'];

/* Storage */
export const STORAGE_DEFAULTS = new Map<string, unknown>([
  ['settings.name', EXTENSION_NAME],
  ['settings.version', EXTENSION_VERSION],
]);
