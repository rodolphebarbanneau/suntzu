import { SuntzuFeature } from './features';
import { SuntzuRange } from './ranges';
import { MatchRange, TimeRange, PlayerRange } from './ranges';

/* Extension */
export const EXTENSION_NAME = 'suntzu';
export const CACHE_TIME = 3600000; // 60 minutes

/* Faceit */
export const FACEIT_OPEN_API_KEY = 'cf4f0a93-1fcc-43b8-b77e-e1b3895ac70d';
export const FACEIT_OPEN_BASE_URL = 'https://open.faceit.com';
export const FACEIT_API_BASE_URL = 'https://api.faceit.com';
export const FACEIT_MATCHROOM_ROUTES = ['csgo', 'cs2'];

/* Features */
export const FEATURE_DEFAULTS = new Map<SuntzuFeature, boolean>([
  [SuntzuFeature.MapFeature, true],
  [SuntzuFeature.PlayerFeature, true],
]);

/* Ranges */
//todo rename MATCHROOM_DEFAULTS
export const RANGE_DEFAULTS = new Map<SuntzuRange, string>([
  [SuntzuRange.MatchRange, MatchRange.Maximum20],
  [SuntzuRange.PlayerRange, PlayerRange.Any],
  [SuntzuRange.TimeRange, TimeRange.ThreeMonths],
]);
