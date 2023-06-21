import { isFeatureEnabled, SuntzuFeature } from 'src/shared/features';
import { Matchroom } from 'src/shared/helpers/matchroom';
import { hasRoot } from 'src/shared/helpers/utils';
import addMapFeature from './map-feature';
import addPlayerFeature from './player-feature';

//todo: retrieve/update metrics on range change

const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // return if root element does not exist
  if (!hasRoot()) return;

  // initialize matchroom
  const matchroom = await Matchroom.initialize();

  // return if matchroom is invalid
  if (!matchroom.isValid()) return;

  // return if matchroom is not fully loaded
  if (!matchroom.hasContainer()) return;

  // add map metrics
  if (await isFeatureEnabled(SuntzuFeature.PlayerFeature)) {
    addMapFeature(matchroom);
  }

  // add player metrics
  if (await isFeatureEnabled(SuntzuFeature.MapFeature)) {
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
