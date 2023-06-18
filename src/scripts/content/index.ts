import { isFeatureEnabled, SuntzuFeature } from '../../shared/settings';
import { Matchroom } from '../../shared/helpers/matchroom';
import { hasRoot } from '../../shared/helpers/utils';
import addMapFeature from './map-metrics';
import addPlayerFeature from './player-metrics';

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
  if (await isFeatureEnabled(SuntzuFeature.PlayerMetrics)){
    addMapFeature(matchroom);
  }

  // add player metrics
  if (await isFeatureEnabled(SuntzuFeature.MapMetrics)) {
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
