import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Cell, Column, Grid } from 'src/app/components/grid';
import { Tooltip } from 'src/app/components/tooltip';

import styles from './map.module.scss';
import stylesheet from './map.module.scss?inline';

/* Background color scale */
const backgroundColor = getColorScale(
  [-0.05, +0.05],
  {
    hue: [7, 113],
    saturation: [15, 15],
    lightness: [15, 15],
  },
);

/* Foreground color scale */
const foregroundColor = getColorScale(
  [-0.05, +0.05],
  {
    hue: [7, 113],
    saturation: [80, 80],
    lightness: [50, 50],
  },
);

/* Map feature */
export const MapFeature = (matchroom: Matchroom) => new Feature('map',
  (feature) => {
    // retrieve matchroom maps
    const maps = matchroom.getMaps();

    // create components for each map
    maps.forEach((map) => {
      // sidebar component
      feature.add(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <div className={styles['sidebar']}></div>
        </ReactShadowRoot.Div>
      ).prependTo(map.container);

      // summary component
      feature.add(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Cell>{'100'}</Cell>
          <Tooltip message={'Relative win rate'} />
        </ReactShadowRoot.Div>
      ).appendTo(map.container);

      // stats component
      feature.add(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Grid>
            <Column width="">
              <Cell>{'->'}</Cell>
              <Cell/>
              <Cell>{'<-'}</Cell>
            </Column>
          </Grid>
        </ReactShadowRoot.Div>
      ).appendTo(map.container);
    });
  },
);


// //todo
// map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
// maps.forEach((map) => {
//   const mapContainer = document.createElement('div');
//   mapContainer.id = `${EXTENSION_NAME}-map-metrics`;
//   map.container.append(mapContainer)
//   const mapRoot = createRoot(mapContainer);
//   mapRoot.render(
//     <DropCell value={100} />
//   );
//   const h = 120, // Hue for green // 60 yellow, 0 red
//         s = 15, // Saturation
//         l = 15; // Lightness - reduce by darkness factor
//   map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
//   //map.container.style.opacity = '0.1';
//
// });
