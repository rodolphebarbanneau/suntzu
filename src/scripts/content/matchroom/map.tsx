import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Metrics } from 'src/app/components/metrics';
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

    // create components and actions for each map
    maps.forEach((map) => {
      // sidebar component
      feature.addComponent(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <div className={styles['sidebar']}></div>
        </ReactShadowRoot.Div>
      ).prependTo(map.container);

      // summary component
      feature.addComponent(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <div className={styles['kpi']}>
            <p style={{ color: foregroundColor(0.15) }}>+15%</p>
            <Tooltip message={'Relative win rate'} />
          </div>
        </ReactShadowRoot.Div>
      ).appendTo(map.container);

      // stats component
      feature.addComponent(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <Metrics
            feature="map"
            data={[]}
          />
        </ReactShadowRoot.Div>
      ).appendTo(map.container);

      // container
      feature.addAction({
        render: () => { map.container.style.backgroundColor = backgroundColor(1); },
        unmount: () => { map.container.style.backgroundColor = ''; },
      });
    });
  },
);
