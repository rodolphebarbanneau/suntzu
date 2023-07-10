import { useContext } from 'react';

import type { MetricsData } from 'src/shared/core';

import { MetricsContext } from '../providers/metrics';

/**
 * Use metrics.
 * The custom matchroom React hook function that deals with matchroom metrics data.
 *
 * @returns A React hook element that is the current value of the metrics data.
 */
export const useMetrics = (): MetricsData => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('Metrics hook must be used within a metrics provider');
  }
  return context;
};

export default useMetrics;
