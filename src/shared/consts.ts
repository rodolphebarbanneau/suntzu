import type { MapCode, MapName } from './types';

export const EXTENSION_NAME = 'suntzu';

export const FACEIT_OPEN_BASE_URL = 'https://open.faceit.com';
export const FACEIT_API_BASE_URL = 'https://api.faceit.com';
export const FACEIT_GAME = 'csgo';

// slightly more than average game length (1000ms * 60 * 60 = 60 minutes)
export const CACHE_TIME = 1000 * 60 * 60;

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
