import type { Feature } from 'src/shared/core';
import { Matchroom } from 'src/shared/core';

import { InfoFeature } from './matchroom/info';
import { MapFeature } from './matchroom/map';
import { PlayerFeature } from './matchroom/player';

/* Declare globals */
export const MATCHROOM = Matchroom.initialize();
export const FEATURES: Record<string, Feature> = {};

/* Handle mutations */
const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // await matchroom
  const matchroom = await MATCHROOM;

  // return if matchroom is invalid
  if (!matchroom) return;

  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // initialize features
  if (Object.keys(FEATURES).length === 0) {
    FEATURES['info'] = InfoFeature(matchroom);
    FEATURES['map'] = MapFeature(matchroom);
    FEATURES['player'] = PlayerFeature(matchroom);

    //todo
    FEATURES['info'].render();
    FEATURES['map'].render();
    FEATURES['player'].render();
  }

  mutations.forEach((mutation) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation.addedNodes.forEach((addedNode: any) => {
      if (addedNode.shadowRoot) {
        observer.observe(addedNode.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    });
  });
};

/* Observe mutations */
const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
