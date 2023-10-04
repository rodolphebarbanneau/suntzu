import type { ReactNode } from 'react';
import { default as ReactShadowRoot } from 'react-shadow';

import type { Matchroom, MatchroomMap, MatchroomTeam, MetricsData } from 'src/shared/core';
import { FEATURES_CONFIG } from 'src/shared/features';
import { Feature } from 'src/shared/core';

import type { MetricStyle } from 'src/app/components/metrics';
import { useMetrics } from 'src/app/hooks/use-metrics';
import { useStorage } from 'src/app/hooks/use-storage';
import { useStyles } from 'src/app/hooks/use-styles';
import { Metrics, getMetricStyle } from 'src/app/components/metrics';
import { Tooltip } from 'src/app/components/tooltip';

import stylesheetIcon from 'src/app/components/icon.module.scss?inline';
import stylesheetMetrics from 'src/app/components/metrics.module.scss?inline';
import stylesheetTooltip from 'src/app/components/tooltip.module.scss?inline';

import stylesheet from './map.module.scss?inline';
import styles from './map.module.scss';
import { get } from 'lodash';

/* Delta win rate */
const getDeltaWinRate = (
  teams: MatchroomTeam[],
  map?: MatchroomMap,
  metrics?: MetricsData,
): MetricStyle | undefined => {
  if (metrics === undefined) return undefined;
  const winRates = (map === undefined)
    ? teams.map((team) => metrics.teams[team.id].overall.winRate ?? 0)
    : teams.map((team) => metrics.teams[team.id].maps[map.id]?.winRate ?? 0);
  return getMetricStyle(winRates, 'difference');
}

/* Map component */
const MapComponent = (
  { stylesheet, children }: {
    stylesheet: string[];
    children: ReactNode | ReactNode[],
  },
) => {
  return (
    <ReactShadowRoot.Div>
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      {
        stylesheet.map((style, index) =>
          <style key={index} dangerouslySetInnerHTML={{ __html: style }} />
        )
      }
      {children}
    </ReactShadowRoot.Div>
  );
};

/* Layout component */
const LayoutComponent = (
  { matchroom, teams, map }: {
    matchroom: Matchroom;
    teams: MatchroomTeam[];
    map: MatchroomMap;
  },
) => {
  // retrieve features
  const [showMap] = useStorage(FEATURES_CONFIG, 'showMap');
  // retrieve metrics
  const metrics = useMetrics(matchroom);
  const deltaWinRate = getDeltaWinRate(teams, map, metrics);
  // retrieve styles
  useStyles(map.container, {
    display: showMap ? 'block' : undefined,
    position: showMap ? 'relative' : undefined,
    backgroundColor: showMap ? deltaWinRate?.colors?.[0] : undefined,
  });
  // render
  if (!showMap) return null;
  return (
    <MapComponent stylesheet={[stylesheet]}>
      <div
        className={styles['layout-sidebar']}
        style={{ backgroundColor: deltaWinRate?.colors?.[1] }}
      ></div>
    </MapComponent>
  );
};

/* Metrics component */
const MetricsComponent = (
  { matchroom, teams, map }: {
    matchroom: Matchroom;
    teams: MatchroomTeam[];
    map: MatchroomMap;
  },
) => {
  // retrieve features
  const [showMap] = useStorage(FEATURES_CONFIG, 'showMap');
  // retrieve metrics
  const metrics = useMetrics(matchroom);
  // render
  if (!showMap) return null;
  const matches = teams.map((team) => metrics.teams[team.id].maps[map.id]?.matches ?? 0);
  const winRates = teams.map((team) => metrics.teams[team.id].maps[map.id]?.winRate ?? 0);
  const avgKills = teams.map((team) => metrics.teams[team.id].maps[map.id]?.avgKills ?? 0);
  const avgHeadshots = teams.map((team) => metrics.teams[team.id].maps[map.id]?.avgHeadshots ?? 0);
  const avgKds = teams.map((team) => metrics.teams[team.id].maps[map.id]?.avgKd ?? 0);
  const avgKrs = teams.map((team) => metrics.teams[team.id].maps[map.id]?.avgKr ?? 0);
  return (
    <MapComponent stylesheet={[stylesheetIcon, stylesheetMetrics, stylesheet]}>
      <div className={styles['layout-metrics']}>
        <Metrics
          feature="map"
          records={[
            {
              title: 'Matches',
              main: { text: matches[0].toFixed(1), style: { group: 'left', showIcon: true } },
              sub: { text: matches[1].toFixed(1), style: { group: 'right', showIcon: true } },
            },
            {
              title: 'Win rate',
              main: {
                text: (100 * winRates[0]).toFixed(0) + '%',
                style: getMetricStyle(winRates, 'difference', { showColors: true, showIcon: true}),
              },
              sub: { text: (100 * winRates[1]).toFixed(0) + '%' },
            },
            {
              title: 'Avg. Kills | HS',
              main: {
                text: `${avgKills[0].toFixed(0)} | ${avgHeadshots[0].toFixed(0)}%`,
                style: getMetricStyle(avgKills, 'ratio', { showColors: true, showIcon: true}),
              },
              sub: { text: `${avgKills[1].toFixed(0)} | ${avgHeadshots[1].toFixed(0)}%` },
            },
            {
              title: 'Avg. K/D | K/R',
              main: {
                text: `${avgKds[0].toFixed(2)} | ${avgKrs[0].toFixed(2)}`,
                style: getMetricStyle(avgKds, 'ratio', { showColors: true, showIcon: true}),
              },
              sub: { text: `${avgKds[1].toFixed(2)} | ${avgKrs[1].toFixed(2)}` },
            },
          ]}
        />
      </div>
    </MapComponent>
  );
}

/* Summary component */
const SummaryComponent = (
  { matchroom, teams, map }: {
    matchroom: Matchroom;
    teams: MatchroomTeam[];
    map: MatchroomMap;
  },
) => {
  // retrieve features
  const [showMap] = useStorage(FEATURES_CONFIG, 'showMap');
  // retrieve metrics
  const metrics = useMetrics(matchroom);
  const deltaWinRate = getDeltaWinRate(teams, map, metrics);
  // render
  if (!showMap) return null;
  return (
    <MapComponent stylesheet={[stylesheetTooltip, stylesheet]}>
      <div className={styles['kpi']}>
        <p style={{ color: deltaWinRate?.colors?.[1] }}>
          {deltaWinRate ? (100 * (deltaWinRate?.spread ?? 0)).toFixed(0) + '%' : 'NA'}
        </p>
        <Tooltip
          message={'Relative win rate between the two teams'}
          position='left'
        />
      </div>
    </MapComponent>
  );
}

/* Map feature */
export const MapFeature = (matchroom: Matchroom) => new Feature('map',
  (feature) => {
    // retrieve matchroom teams
    const teams = matchroom.getTeams();
    // retrieve matchroom maps
    const maps = matchroom.getMaps();

    // create components and actions for each map
    maps.forEach((map) => {
      // summary component
      feature.addComponent({
        name: `summary-${map.id}`,
        node: <SummaryComponent matchroom={matchroom} teams={teams} map={map} />,
      })?.appendTo(map.container.children[0] as HTMLDivElement);

      // metrics component
      feature.addComponent({
        name: `metrics-${map.id}`,
        node: <MetricsComponent matchroom={matchroom} teams={teams} map={map} />,
      })?.appendTo(map.container);

      // layout component
      feature.addComponent({
        name: `layout-${map.id}`,
        node: <LayoutComponent matchroom={matchroom} teams={teams} map={map} />,
      })?.prependTo(map.container);
    });
  },
);
