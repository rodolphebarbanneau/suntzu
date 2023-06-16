/* eslint-disable @typescript-eslint/naming-convention */

/* Metrics range options (suntzu). */
export interface MetricsRange {
  match: MetricsMatchRange;
  player: MetricsPlayerRange;
  time: MetricsTimeRange;
}

/* Metrics match range (suntzu). */
export type MetricsMatchRange =
  | '10'
  | '20'
  | '50'
  | '100';

/* Metrics player range (suntzu). */
export type MetricsPlayerRange =
  | 'ANY'
  | 'MIN-2'
  | 'MIN-3'
  | 'MIN-4'
  | 'ALL';

/* Metrics time range (suntzu). */
export type MetricsTimeRange =
  | '1W'
  | '2W'
  | '1M'
  | '3M'
  | '6M';
