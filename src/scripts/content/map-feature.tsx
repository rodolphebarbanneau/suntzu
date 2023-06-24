import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';

import type { Matchroom } from 'src/shared/helpers/matchroom';
import { SuntzuRange } from 'src/shared/ranges';
import { EXTENSION_NAME } from 'src/shared/settings';
import { hasExtension } from 'src/shared/helpers/utils';
import { Selector } from 'src/app/components/selector';
import { Toolbar } from 'src/app/components/toolbar';

import { DropCell, Bar } from 'src/app/components/map';

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

  // test
  const maps = matchroom.getMaps();
  console.log(maps)
  maps.forEach((map) => {
    console.log(map)
    const mapContainer = document.createElement('div');
    mapContainer.id = `${EXTENSION_NAME}-map-metrics`;
    map.container.append(mapContainer)
    const mapRoot = createRoot(mapContainer);
    mapRoot.render(
      <DropCell value={100} />
    );
    const h = 120, // Hue for green // 60 yellow, 0 red
          s = 15, // Saturation
          l = 15; // Lightness - reduce by darkness factor
    map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
    //map.container.style.opacity = '0.1';


    const barContainer = document.createElement('div');
    barContainer.id = `${EXTENSION_NAME}-map-metrics`;
    map.container.prepend(barContainer)
    const barRoot = createRoot(barContainer);
    barRoot.render(
      <Bar value={100} />
    );

  });
}, 300);
