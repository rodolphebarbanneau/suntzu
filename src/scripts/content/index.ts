import type { Feature } from 'src/shared/core';
import { Matchroom } from 'src/shared/core';

import { MapFeature } from './matchroom/map';
import { PlayerFeature } from './matchroom/player';
import { ToolbarFeature } from './matchroom/toolbar';

/* Declare globals */
const matchroom = Matchroom.initialize();
const features = new Set<Feature>();

/* Handle mutations */
const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // return if matchroom is invalid
  if (!await matchroom) return;

  // return if matchroom is not ready
  if (!matchroom.isReady()) return;

  // get feature flags
  const isMapFeatureEnabled = await getFeatureFlag(StorageFeature.map);
  const isPlayerFeatureEnabled = await getFeatureFlag(StorageFeature.player);

  // add toolbar
  if (isMapFeatureEnabled || isPlayerFeatureEnabled) {
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
