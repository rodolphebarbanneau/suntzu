import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { SuntzuRange } from 'src/shared/ranges';
import { BROWSER } from 'src/shared/browser';

export const useRange = (
  range?: SuntzuRange
): [string | null, Dispatch<SetStateAction<string | null>>] => {
  const [option, setRange] = useState<string | null>(null);
  const storageFetchResolved = useRef(false);

  useEffect(() => {
    if (!range) return;
    BROWSER.storage.local.get(range).then((setting) => {
      storageFetchResolved.current = true;
      const value =  setting[range];
      setRange(value);
    });
  }, [range]);

  useEffect(() => {
    if (!range) return;
    if (!storageFetchResolved.current) return;
    BROWSER.storage.local.set({ [range]: option });
  }, [option, range]);

  useEffect(() => {
    if (!range) return;
    const onChange = (changes: { [range: string]: chrome.storage.StorageChange }) => {
      if (range in changes) {
        setRange(changes[range].newValue);
      }
    };
    BROWSER.storage.local.onChanged.addListener(onChange);
    return () => {
      BROWSER.storage.onChanged.removeListener(onChange);
    };
  }, [range]);

  return [option, setRange];
};
