import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { SuntzuRange } from 'src/shared/ranges';
import { BROWSER } from 'src/shared/helpers';

export const useOption = (
  key?: SuntzuRange
): [string | null, Dispatch<SetStateAction<string | null>>] => {
  const [option, setOption] = useState<string | null>(null);
  const storageFetchResolved = useRef(false);

  useEffect(() => {
    if (!key) return;
    BROWSER.storage.local.get(key).then((setting) => {
      storageFetchResolved.current = true;
      const value =  setting[key];
      setOption(value);
    });
  }, [key]);

  useEffect(() => {
    if (!key) return;
    if (!storageFetchResolved.current) return;
    BROWSER.storage.local.set({ [key]: option });
  }, [option, key]);

  useEffect(() => {
    if (!key) return;
    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (key in changes) {
        setOption(changes[key].newValue);
      }
    };
    BROWSER.storage.local.onChanged.addListener(onChange);
    return () => {
      BROWSER.storage.onChanged.removeListener(onChange);
    };
  }, [key]);

  return [option, setOption];
};
