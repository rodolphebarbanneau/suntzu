/* eslint-disable @typescript-eslint/naming-convention */

/* Metrics range options (suntzu). */
export interface MetricsRange {
  match: MetricsMatchRange;
  period: MetricsPeriodRange;
  player: MetricsPlayerRange;
}

/* Metrics match range (suntzu). */
export type MetricsMatchRange =
  | '10'
  | '20'
  | '50'
  | '100';

/* Metrics period range (suntzu). */
export type MetricsPeriodRange =
  | '1W'
  | '2W'
  | '1M'
  | '3M'
  | '6M';

/* Metrics player range (suntzu). */
export type MetricsPlayerRange =
  | 'ANY'
  | 'MIN:2'
  | 'MIN:3'
  | 'MIN:4'
  | 'ALL';
