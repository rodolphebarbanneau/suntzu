import type { Feature } from 'src/shared/core';
import { Matchroom } from 'src/shared/core';

import { InfoFeature } from './info';
import { MapFeature } from './map';
import { PlayerFeature } from './player';

/* Declare globals */
export const MATCHROOM = Matchroom.initialize();

/**
 * Handle matchroom features.
 * @param features - The features global.
 */
export const handleMatchroom = async (
  features: Map<string, Feature>,
) => {
  // await matchroom
  const matchroom = await MATCHROOM;

  // return if matchroom is invalid
  if (!matchroom) return;

  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // initialize features
  if (!features.has('info')) features.set('info', InfoFeature(matchroom));
  if (!features.has('map')) features.set('map', MapFeature(matchroom));
  if (!features.has('player')) features.set('player', PlayerFeature(matchroom));

  // update features
  features.get('info')?.update();
  features.get('map')?.update();
  features.get('player')?.update();

  // render features
  features.get('info')?.render();
  features.get('map')?.render();
  features.get('player')?.render();
};
