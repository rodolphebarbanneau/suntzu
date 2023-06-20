import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { SuntzuFeature } from '../../shared/settings';

export const useOption = (
  key?: SuntzuFeature
): [boolean | null, Dispatch<SetStateAction<boolean | null>>] => {
  const [option, setOption] = useState<boolean | null>(null);
  const storageFetchResolved = useRef(false);

  useEffect(() => {
    if (!key) return;
    chrome.storage.local.get(key).then((optionSetting) => {
      storageFetchResolved.current = true;
      const optionValue =  optionSetting[key];
      setOption(optionValue);
    });
  }, [key]);

  useEffect(() => {
    if (!key) return;
    if (!storageFetchResolved.current) return;
    chrome.storage.local.set({ [key]: option });
  }, [option, key]);

  useEffect(() => {
    if (!key) return;
    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (key in changes) {
        setOption(changes[key].newValue);
      }
    };
    chrome.storage.local.onChanged.addListener(onChange);
    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, [key]);

  return [option, setOption];
};
