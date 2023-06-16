/* eslint-disable @typescript-eslint/naming-convention */

/* Metrics model (suntzu). */
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

/* Metrics map model (suntzu). */
export type MetricsMapModel = {
  [key: string]: {
    relative_win_rate?: number;
    teams: {
      [key: string]: MetricsModel;
    };
  };
};

/* Metrics player model (suntzu). */
export type MetricsPlayerModel = {
  [key: string]: {
    maps: {
      [key: string]: MetricsModel;
    };
  };
};
