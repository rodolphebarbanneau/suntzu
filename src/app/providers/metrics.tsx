import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { MetricsData } from 'src/shared/core';

/* Metrics context */
export const MetricsContext = createContext<MetricsData | null>(null);

/* Metrics provider */
export const MetricsProvider = (
  { children, metrics }: {
    children: ReactNode | ReactNode[],
    metrics: MetricsData,
  },
) => {
  return (
    <MetricsContext.Provider value={metrics}>
      {children}
    </MetricsContext.Provider>
  );
}

export default MetricsProvider;
