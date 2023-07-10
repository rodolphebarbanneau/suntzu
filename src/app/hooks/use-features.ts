import { useContext } from 'react';

import { FeaturesContext } from '../providers/features';

/**
 * Use features.
 * The custom matchroom React hook function that deals with features configuration.
 *
 * @returns A React hook element that is the current value of the features configuration.
 */
export const useFeatures = (): boolean => {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('Features hook must be used within a features provider');
  }
  return context;
};

export default useFeatures;
