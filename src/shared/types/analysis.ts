/* eslint-disable @typescript-eslint/naming-convention */
import type { MapCode } from './maps';

/* Analysis model (suntzu). */
export interface AnalysisModel {
  matches?: number;
  win_rate?: number;
  avg_kills?: number;
  avg_deaths?: number;
  avg_headshots?: number;
  avg_kd?: number;
  avg_kr?: number;
  drop_rate?: number;
}

/* Map analysis model (suntzu). */
export type MapAnalysisModel = {
  [map_id in MapCode | '']: {
    win_rate?: number;
    teams: {
      [key: string]: AnalysisModel;
    };
  };
};

/* Player analysis model (suntzu). */
export type PlayerAnalysisModel = {
  [player_id: string]: {
    [map_id in MapCode | '']: AnalysisModel;
  };
}
