import type { ReactNode} from 'react';
import { createContext, useEffect, useState } from 'react';

import type { Configuration } from 'src/shared/features';
import { CONFIG } from 'src/shared/settings';

import { useStorage } from '../hooks/use-storage';

/* Features context */
export const FeaturesContext = createContext<boolean | undefined>(undefined);

/**
 * Features provider.
 * The custom features React provider deals with features configuration.
 *
 * @param configKey - The configuration key to be managed.
 * @param children - The React children to be rendered.
 * @returns A React provider that manages the features configuration.
 */
export const FeaturesProvider = <K extends keyof Configuration>(
  { configKey, hideOnFalse, children }: {
    configKey: K[];
    hideOnFalse?: boolean;
    children: ReactNode | ReactNode[],
  },
) => {
  const features = configKey.map((key) => {
    const [feature, _] = useStorage(CONFIG, key);
    return feature as unknown as boolean
  })

  const flag = features.reduce((acc, feature) => acc && feature, true);
  return (
    <FeaturesContext.Provider value={flag}>
      {!hideOnFalse || flag ? children : null}
    </FeaturesContext.Provider>
  );
};

export default FeaturesProvider;
