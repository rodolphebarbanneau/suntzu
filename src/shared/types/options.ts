/* eslint-disable @typescript-eslint/naming-convention */

/* Matches options */
export enum MatchesOption {
  Maximum10 = '10',
  Maximum20 = '20',
  Maximum50 = '50',
  Maximum100 = '100',
}

/* Players options */
export enum PlayersOption {
  Any = 'ANY',
  Minimum2 = 'MIN:2',
  Minimum3 = 'MIN:3',
  Minimum4 = 'MIN:4',
  All = 'ALL',
}

/* Time span options */
export enum TimeSpanOption {
  OneWeek = '1W',
  TwoWeeks = '2W',
  OneMonth = '1M',
  ThreeMonths = '3M',
  SixMonths = '6M',
}
