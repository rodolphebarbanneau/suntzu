import { Matchroom } from 'src/shared/core';
import { StorageFeature, getFeatureFlag } from 'src/shared/helpers';

import { MapFeature } from './matchroom/map';
import addPlayerFeature from './matchroom/player';
import addToolbar from './matchroom/toolbar';

//todo: retrieve/update metrics on range change

// declare matchroom
let matchroom: Matchroom | null = null;

const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // initialize matchroom
  matchroom = await Matchroom.initialize();

  // return if matchroom is invalid
  if (!matchroom) return;

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

const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
