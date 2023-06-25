import { SuntzuFeature, isFeatureEnabled } from 'src/shared/features';
import { Matchroom } from 'src/shared/helpers/matchroom';
import { hasMainContent } from 'src/shared/helpers/utils';
import { MapFeature } from './map';
import addPlayerFeature from './player';
import addToolbar from './toolbar';

//todo: retrieve/update metrics on range change

// declare matchroom
let matchroom: Matchroom;

const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // return if main content container does not exist
  if (!hasMainContent()) return;

  // initialize matchroom
  if (!matchroom) matchroom = await Matchroom.initialize();

  // return if matchroom is invalid
  if (!matchroom.isValid()) return;

  // return if matchroom is not fully loaded
  if (!matchroom.hasContainer()) return;

  // get feature flags
  const isMapFeatureEnabled = await isFeatureEnabled(SuntzuFeature.MapFeature);
  const isPlayerFeatureEnabled = await isFeatureEnabled(SuntzuFeature.PlayerFeature);

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
