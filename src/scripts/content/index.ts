import type { Feature } from 'src/shared/core';
import { CONFIG } from 'src/shared/settings';
import { Storage, Matchroom } from 'src/shared/core';

import { InfoFeature } from './matchroom/info';
import { MapFeature } from './matchroom/map';
import { PlayerFeature } from './matchroom/player';

/* Declare globals */
export const MATCHROOM = Matchroom.initialize();
export const FEATURES: Record<string, Feature> = {};

const render = async (config: any) => {

  if (config.showMap || config.showPlayer) {
    FEATURES['info'].render();
  } else {
    FEATURES['info'].unmount();
  }

  if (config.showMap) {
    FEATURES['map'].render();
  }

  if (config.showPlayer) {
    FEATURES['player'].render();
  }
};

/* Handle mutations */
const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  const config = await CONFIG;
  // return if config is invalid
  if (!config) return;

  const matchroom = await MATCHROOM;

  // return if matchroom is invalid
  if (!matchroom) return;
  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // initialize features
  if (Object.keys(FEATURES).length === 0) {
    FEATURES['map'] = MapFeature(matchroom);
    FEATURES['player'] = PlayerFeature(matchroom);
    FEATURES['info'] = InfoFeature(matchroom);
    render(config);


    Storage.addListener([config, async () => {
      render(config);
    }]);
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
