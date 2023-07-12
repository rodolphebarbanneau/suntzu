import { useEffect, useState } from 'react';

import type { Matchroom, MetricsData } from 'src/shared/core';

/**
 * Use metrics.
 * The custom matchroom React hook function that deals with matchroom metrics data.
 *
 * @param matchroom - The matchroom instance to be managed.
 * @returns The current value of the metrics data item.
 */
export const useMetrics = (
  matchroom: Matchroom,
): MetricsData => {
  const [metrics, setMetrics] = useState(matchroom.metrics.data);

  /**
   * Effect to listen for matchroom metrics notifications and update the metrics data accordingly.
   * It returns also a cleanup function to remove the listener when the component unmounts or the
   * dependencies change.
   */
  useEffect(() => {
    const listener = (changes: MetricsData) => { setMetrics(changes); };
    matchroom.addListener(listener);
    return () => {
      matchroom.removeListener(listener);
    };
  }, [matchroom]);

  return metrics;
};
