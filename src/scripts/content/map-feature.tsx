import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';

import type { Matchroom } from 'src/shared/helpers/matchroom';
import { SuntzuRange } from 'src/shared/ranges';
import { EXTENSION_NAME } from 'src/shared/settings';
import { hasExtension } from 'src/shared/helpers/utils';
import { Selector } from 'src/app/components/selector';
import { Toolbar } from 'src/app/components/toolbar';

export default debounce(async (matchroom: Matchroom) => {
  // retrieve the matchroom information
  const info = matchroom.getInformation();
  // check if the extension is already injected
  if (!info || hasExtension(info)) return;

  // create container and inject the extension feature
  const container = document.createElement('div');
  container.id = `${EXTENSION_NAME}-metrics-toolbar`;
  info.prepend(container)
  const root = createRoot(container);
  root.render(
    <Toolbar>
      <Selector title="Match" range={SuntzuRange.MatchRange} />
      <Selector title="Time" range={SuntzuRange.TimeRange} />
      <Selector title="Player" range={SuntzuRange.PlayerRange} />
    </Toolbar>
  );
}, 300);
