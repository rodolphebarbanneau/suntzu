import { BROWSER } from './browser';

/* Suntzu ranges */
export enum SuntzuRange {
  MatchRange = 'matchRange',
  PlayerRange = 'playerRange',
  TimeRange = 'timeRange',
}

/* Match range */
export enum MatchRange {
  Maximum10 = '10',
  Maximum20 = '20',
  Maximum50 = '50',
  Maximum100 = '100',
}

/* Player range */
export enum PlayerRange {
  Any = 'ANY',
  Minimum2 = 'MIN:2',
  Minimum3 = 'MIN:3',
  Minimum4 = 'MIN:4',
  All = 'ALL',
}

/* Time range */
export enum TimeRange {
  OneWeek = '1W',
  TwoWeeks = '2W',
  OneMonth = '1M',
  ThreeMonths = '3M',
  SixMonths = '6M',
}

/**
 * Check if the specified range is enabled.
 * @param range - The suntzu range.
 * @returns True if the range is enabled, false otherwise.
 */
export async function isRangeEnabled(range: SuntzuRange): Promise<boolean> {
  return new Promise((resolve, reject) => {
    BROWSER.storage.local.get(range, (result) => {
      if (BROWSER.runtime.lastError) {
        reject(BROWSER.runtime.lastError);
      } else {
        resolve(result[range] !== '');
      }
    });
  });
};
