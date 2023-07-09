import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Configuration } from 'src/shared/features';

/* Features context */
export const FeaturesContext = createContext<Configuration | null>(null);

/* Features provider */
export const FeaturesProvider = <K extends keyof Configuration>(
  { children, feature }: {
    children: ReactNode | ReactNode[],
    feature: Configuration[K],
  },
) => {
  const

  return (
    <FeaturesContext.Provider value={}>
      {children}
    </FeaturesContext.Provider>
  );
}

export default FeaturesProvider;
