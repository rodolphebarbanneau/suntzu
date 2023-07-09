import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom, MetricsData } from 'src/shared/core';
import { Feature } from 'src/shared/core';
import { getColorScale } from 'src/shared/helpers';

import { MetricsProvider } from 'src/app/providers/metrics';
import { useMetrics } from 'src/app/hooks/use-metrics';
import { Metrics } from 'src/app/components/metrics';
import { Tooltip } from 'src/app/components/tooltip';

import stylesheetLink from 'src/app/components/link.module.scss?inline';
import stylesheetMetrics from 'src/app/components/metrics.module.scss?inline';
import stylesheetTooltip from 'src/app/components/tooltip.module.scss?inline';

import stylesheet from './map.module.scss?inline';
import styles from './map.module.scss';

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

/* Relative win rate */
const getRelativeWinRate = (metrics: MetricsData, teams: string[], map?: string): number => {
  const winRates = (map === undefined)
    ? teams.map((team) => metrics.teams[team].overall.winRate ?? 0)
    : teams.map((team) => metrics.teams[team].maps[map]?.winRate ?? 0);
  return winRates[0] - winRates[1];
}



/* Map feature */
export const MapFeature = (matchroom: Matchroom) => new Feature('map',
  (feature) => {
    // use matchroom metrics
    console.log('======beforeUseMatchroom============================================')
    console.log('======beforeUseMatchroom============================================')
    const metrics = matchroom.metrics.data;
    console.log('======afterUseMatchroom============================================')
    console.log('======afterUseMatchroom============================================')
    // retrieve matchroom teams
    const teams = matchroom.getTeams().map((team) => team.id);
    // retrieve matchroom maps
    const maps = matchroom.getMaps();

    // create components and actions for each map
    maps.forEach((map) => {
      // metrics
      const relativeWinRate = getRelativeWinRate(metrics, teams, map.id);

      // sidebar component
      feature.addComponent(
        <ReactShadowRoot.Div>
          <MetricsProvider metrics={metrics}>
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
            <div
              className={styles['sidebar']}
              style={{ backgroundColor: foregroundColor(relativeWinRate) }}
            ></div>
          </MetricsProvider>
        </ReactShadowRoot.Div>
      ).prependTo(map.container);

      // summary component
      feature.addComponent(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheetLink }} />
          <style dangerouslySetInnerHTML={{ __html: stylesheetMetrics }} />
          <style dangerouslySetInnerHTML={{ __html: stylesheetTooltip }} />
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <div className={styles['kpi']}>
            <p style={{ color: foregroundColor(relativeWinRate) }}>
              {relativeWinRate.toFixed(0) + '%'}
            </p>
            <Tooltip message={'Relative win rate'} />
          </div>
        </ReactShadowRoot.Div>
      ).appendTo(map.container);

      // stats component
      feature.addComponent(
        <ReactShadowRoot.Div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <style dangerouslySetInnerHTML={{ __html: stylesheetLink }} />
          <style dangerouslySetInnerHTML={{ __html: stylesheetMetrics }} />
          <style dangerouslySetInnerHTML={{ __html: stylesheetTooltip }} />
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

    // listen for metrics changes
    matchroom.addListener(feature.render);
  },
);
