/* eslint-disable @typescript-eslint/naming-convention */

/* Metrics model (suntzu) */
export interface MetricsModel {
  matches?: number;
  win_rate?: number;
  avg_kills?: number;
  avg_deaths?: number;
  avg_headshots?: number;
  avg_kd?: number;
  avg_kr?: number;
  drop_rate?: number;
}

/* Map metrics model (suntzu) */
export type MapMetricsModel = {
  relative_win_rate?: number;
  teams: {
    [key: string]: MetricsModel;
  };
};

/* Player metrics model (suntzu) */
export type PlayerMetricsModel = {
  overall: MetricsModel;
  maps: {
    [key: string]: MetricsModel;
  };
};
