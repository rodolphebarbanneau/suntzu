import type { MapCode, MapName } from './types/maps';
import type {
  MetricsRange,
  MetricsMatchRange,
  MetricsPeriodRange,
  MetricsPlayerRange,
} from './types/metrics-ranges';

export const EXTENSION_NAME = 'suntzu';

export const FACEIT_OPEN_API_KEY = 'cf4f0a93-1fcc-43b8-b77e-e1b3895ac70d';
export const FACEIT_OPEN_BASE_URL = 'https://open.faceit.com';
export const FACEIT_API_BASE_URL = 'https://api.faceit.com';
export const FACEIT_MATCHROOM_ROUTES = ['csgo', 'cs2'];

// slightly more than average game length (1000ms * 60 * 60 = 60 minutes)
export const CACHE_TIME = 1000 * 60 * 60;

//todo
export const MAP_POOL = new Map<MapCode, MapName>([
  ['de_ancient', 'Ancient'],
  ['de_anubis', 'Anubis'],
  ['de_cbble', 'Cbble'],
  ['de_dust2', 'Dust2'],
  ['de_inferno', 'Inferno'],
  ['de_mirage', 'Mirage'],
  ['de_nuke', 'Nuke'],
  ['de_overpass', 'Overpass'],
  ['de_train', 'Train'],
  ['de_vertigo', 'Vertigo'],
]);

export const METRICS_DEFAULT_RANGES: MetricsRange = {
  match: '20',
  period: '3M',
  player: 'ANY',
};

export const METRICS_MATCH_RANGES: MetricsMatchRange[] = [
  '10',
  '20',
  '50',
  '100',
];

export const METRICS_PERIOD_RANGES: MetricsPeriodRange[] = [
  '1W',
  '2W',
  '1M',
  '3M',
  '6M',
];

export const METRICS_PLAYER_RANGES: MetricsPlayerRange[] = [
  'ANY',
  'MIN:2',
  'MIN:3',
  'MIN:4',
  'ALL',
];
