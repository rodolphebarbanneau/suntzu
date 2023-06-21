import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { SuntzuFeature } from 'src/shared/features';
import { BROWSER } from 'src/shared/browser';

export const useFeature = (
  feature?: SuntzuFeature
): [boolean | null, Dispatch<SetStateAction<boolean | null>>] => {
  const [option, setFeature] = useState<boolean | null>(null);
  const storageFetchResolved = useRef(false);

  useEffect(() => {
    if (!feature) return;
    BROWSER.storage.local.get(feature).then((setting) => {
      storageFetchResolved.current = true;
      const value =  setting[feature];
      setFeature(value);
    });
  }, [feature]);

  useEffect(() => {
    if (!feature) return;
    if (!storageFetchResolved.current) return;
    BROWSER.storage.local.set({ [feature]: option });
  }, [option, feature]);

  useEffect(() => {
    if (!feature) return;
    const onChange = (changes: { [feature: string]: chrome.storage.StorageChange }) => {
      if (feature in changes) {
        setFeature(changes[feature].newValue);
      }
    };
    BROWSER.storage.local.onChanged.addListener(onChange);
    return () => {
      BROWSER.storage.onChanged.removeListener(onChange);
    };
  }, [feature]);

  return [option, setFeature];
};
