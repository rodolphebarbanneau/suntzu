import type { ReactNode} from 'react';
import { createContext, useEffect, useState } from 'react';

import type { Matchroom, MetricsData } from 'src/shared/core';

/* Metrics context */
export const MetricsContext = createContext<MetricsData | undefined>(undefined);

/**
 * Metrics provider.
 * The custom metrics Reactg provider deals with matchroom metrics data.
 *
 * @param matchroom - The matchroom instance to be managed.
 * @param children - The React children to be rendered.
 * @returns A React provider that manages the matchroom metrics data.
 */
export const MetricsProvider = (
  { matchroom, children }: {
    matchroom: Matchroom,
    children: ReactNode | ReactNode[],
  },
) => {
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

  return (
    <MetricsContext.Provider value={metrics}>
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
