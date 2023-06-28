import type { Feature } from 'src/shared/core';
import { CONFIG } from 'src/shared/settings';
import { Matchroom } from 'src/shared/core';

import { MapFeature } from './matchroom/map';
import { PlayerFeature } from './matchroom/player';
import { ToolbarFeature } from './matchroom/toolbar';

/* Declare globals */
const matchroom = Matchroom.initialize();
const features: Record<string, Feature>() = {};

/* Handle mutations */
const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // return if config is invalid
  if (!(await CONFIG)) return;

  // return if matchroom is invalid
  if (!(await matchroom)) return;

  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // add features
  if (!features.size) {
    features.add(MapFeature(matchroom));
    features.add(PlayerFeature(matchroom));
    features.add(ToolbarFeature(matchroom));
  }

  // get feature flags
  const isMapFeatureEnabled = await getFeatureFlag(StorageFeature.map);
  const isPlayerFeatureEnabled = await getFeatureFlag(StorageFeature.player);

  // add toolbar
  if (CONFIG.showMap || CONFIG.showPlayer) {
    addToolbar(matchroom);
  }

  // add map feature
  if (isMapFeatureEnabled) {

    addMapFeature(matchroom);
  }







  // add player feature
  if (isPlayerFeatureEnabled) {
    addPlayerFeature(matchroom);
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
