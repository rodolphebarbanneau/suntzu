import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { Cell, Column, Grid } from 'src/app/components/grid';
import { Tooltip } from 'src/app/components/tooltip';

import styles from './map.module.scss';
import stylesheet from './map.module.scss?inline';


// initialize background color scale
const backgroundColor = getColorScale(
  [-0.05, +0.05],
  {
    hue: [7, 113],
    saturation: [15, 15],
    lightness: [15, 15],
  },
);
// initialize foreground color scale
const foregroundColor = getColorScale(
  [-0.05, +0.05],
  {
    hue: [7, 113],
    saturation: [80, 80],
    lightness: [50, 50],
  },
);



export class MapFeature extends Feature {
  /* The background color scale. */
  private readonly _backgroundColor;

  /* The foreground color scale. */
  private readonly _foregroundColor;

  /**
   * Create a map feature.
   * @param matchroom - The matchroom instance.
   */
  constructor(matchroom: Matchroom) {
    super(matchroom, 'map');
  }

  /**
   * Render the feature.
   * @returns A promise that resolves when the feature is rendered.
   */
  render(): void {
    // retrieve matchroom maps
    const maps = this.matchroom.getMaps();
    const components = this.matchroom.components;
    // create container and inject the extension feature for each map
    maps.forEach((map) => {
      // check if extension is already injected
      if (hasExtension(map.container)) return;
      // create container and inject components
      const key = map.id;
      components.maps[key] = {
        // sidebar component
        sidebar: createComponent('sidebar').render(
          <div className={styles['sidebar']}></div>
        ),

        // summary component
        summary: createComponent('toolbar').render(
          <ReactShadowRoot.Div>
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
            <Cell>{'100'}</Cell>
            <Tooltip message={'Relative win rate'} />
          </ReactShadowRoot.Div>
        ),

        // stats component
        stats: createComponent('stats').render(
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
        ),
      };

      // attach components to the map container
      components.maps[key].sidebar.prependTo(map.container);
      components.maps[key].summary.appendTo(map.container);
      components.maps[key].stats.appendTo(map.container);
    });

//    //todo
//    map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
//    maps.forEach((map) => {
//      const mapContainer = document.createElement('div');
//      mapContainer.id = `${EXTENSION_NAME}-map-metrics`;
//      map.container.append(mapContainer)
//      const mapRoot = createRoot(mapContainer);
//      mapRoot.render(
//        <DropCell value={100} />
//      );
//      const h = 120, // Hue for green // 60 yellow, 0 red
//            s = 15, // Saturation
//            l = 15; // Lightness - reduce by darkness factor
//      map.container.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
//      //map.container.style.opacity = '0.1';
//
//    });
  }
}
