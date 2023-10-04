import { debounce } from 'lodash';

import type { Feature } from 'src/shared/core';
import { DEBOUNCE_DELAY } from 'src/shared/settings';
import { Matchroom } from 'src/shared/core';

import { InfoFeature } from './info';
import { MapFeature } from './map';
import { PlayerFeature } from './player';

/* Declare globals */
const IMPLEMENTATION: Map<string, Feature> = new Map();
let CURRENT_URL: string;
let CURRENT_MATCHROOM: Promise<Matchroom | null>;

/* Handle matchroom features */
const _handleMatchroom = async () => {
  // check for url change
  if (CURRENT_URL !== window.location.href) {
    // update url
    CURRENT_URL = window.location.href;
    // update matchroom
    CURRENT_MATCHROOM = Matchroom.initialize();
  }

  // await matchroom
  const matchroom = await CURRENT_MATCHROOM;

  // return if matchroom is invalid
  if (!matchroom) return;
  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // retrieve matchroom maps
  const maps = matchroom.getMaps();
  // retrieve matchroom teams
  const players = matchroom.getPlayers();

  // declare features
  const features = new Map<string, () => Feature>();
  // initialize info feature
  features.set('info', () => InfoFeature(matchroom));
  // initialize maps feature
  maps.forEach((map) => {
    features.set(`map-${map.id}`, () => MapFeature(matchroom, map));
  });
  // initialize players feature
  players.forEach((player) => {
    features.set(`player-${player.id}`, () => PlayerFeature(matchroom, player));
  });

  // add features
  features.forEach((feature, key) => {
    const current = IMPLEMENTATION.get(key);
    if (!current || !current.isRendered()) {
      current?.unmount();
      IMPLEMENTATION.set(key, feature());
    };
  });
};

/* Debounced handle matchroom features */
export const handleMatchroom = debounce(_handleMatchroom, DEBOUNCE_DELAY);
