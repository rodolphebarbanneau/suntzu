import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';

import type { Matchroom } from '../../shared/helpers/matchroom';
import {
  EXTENSION_NAME,
  METRICS_MATCH_RANGES,
  METRICS_PERIOD_RANGES,
  METRICS_PLAYER_RANGES,
} from '../../shared/consts';
import { hasExtension } from '../../shared/helpers/utils';
import { Selector } from './components/selector';
import { Toolbar } from './components/toolbar';

export default debounce(async (matchroom: Matchroom) => {
  // retrieve the matchroom information
  const info = matchroom.getInformation();
  // check if the extension is already injected
  if (!info || hasExtension(info)) return;

  // create container and inject the extension feature
  const container = document.createElement('div');
  container.id = `${EXTENSION_NAME}-metrics-ranges`;
  info.prepend(container)
  const root = createRoot(container);
  root.render(
    <Toolbar>
      <Selector title="Matches" options={METRICS_MATCH_RANGES} />
      <Selector title="Period" options={METRICS_PERIOD_RANGES} />
      <Selector title="Players" options={METRICS_PLAYER_RANGES} />
    </Toolbar>
  );
}, 300);
