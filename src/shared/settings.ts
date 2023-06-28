import { Features } from './features';

/* Extension */
export const EXTENSION_NAME = 'suntzu';
export const EXTENSION_VERSION = '0.1.0';
export const CACHE_TIME = 3600000; // 60 minutes

/* Faceit */
export const FACEIT_OPEN_API_KEY = 'cf4f0a93-1fcc-43b8-b77e-e1b3895ac70d';
export const FACEIT_OPEN_BASE_URL = 'https://open.faceit.com';
export const FACEIT_API_BASE_URL = 'https://api.faceit.com';
export const FACEIT_MATCHROOM_ROUTES = ['cs2', 'csgo'];

/* Features */
export const FEATURES = Features.initialize();

/* Storage */
export const STORAGE_DEFAULTS = new Map<string, unknown>([
  ['name', EXTENSION_NAME],
  ['version', EXTENSION_VERSION],
  ['cacheTime', CACHE_TIME],
]);
