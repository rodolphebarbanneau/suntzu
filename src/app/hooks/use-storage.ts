import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  Storage,
  StorageNamespace,
  StorageChanges,
} from 'src/shared/core';

/**
 * Use storage.
 * The custom storage React hook function deals with storage values. It handles both synchronous and
 * asynchronous (promise-based) storage instances.
 *
 * @template T - This extends the storage namespace (i.e. the type of the storage instance).
 * @param instance - The storage instance to be managed, which can be a synchronous instance of `T`
 * or a Promise that resolves with an instance of `T`.
 * @param key - (optional) The key of the item within the storage instance to be managed.
 * @returns A React hook tuple where the first element is the current value of the storage item and
 * the second element is a function to update that value.
 */
export const useStorage = <T extends StorageNamespace, K extends keyof T>(
  instance: T | Promise<T>,
  key?: K,
): [T[K] | null, Dispatch<SetStateAction<T[K] | null>>] => {
  const [option, setStorage] = useState<T[K] | null>(null);
  const storage = useRef(false);

  /**
   * Initialize the state and ref with the provided storage value.
   * If instance is a promise, it is resolved first before setting the value.
   */
  useEffect(() => {
    if (!key) return;
    if (instance instanceof Promise) {
      instance.then((records) => {
        storage.current = true;
        setStorage(records[key]);
      });
    } else {
      storage.current = true;
      setStorage(instance[key]);
    }
  }, [key, instance]);

  /**
   * Effect to update the storage value when the local state updates.
   * If instance is a promise, it is resolved first before updating the storage value. It is also
   * skipped if the option is null, the key is undefined or the storage hasn't been initialized.
   */
  useEffect(() => {
    if (!key) return;
    if (!storage.current) return;
    if (option === null) return;
    if (instance instanceof Promise) {
      instance.then((records) => {
        records[key] = option;
      });
    } else {
      instance[key] = option;
    }
  }, [option, key, instance]);

  /**
   * Effect to listen for storage changes and update the local state accordingly.
   * It returns also a cleanup function to remove the listener when the component unmounts or the
   * dependencies change.
   */
  useEffect(() => {
    if (!key) return;
    const onChange = (changes: StorageChanges) => {
      if (key in changes) {
        setStorage(changes[key as string].newValue);
      }
    };
    Storage.addListener([instance, onChange]);
    return () => {
      Storage.removeListener([instance, onChange]);
    };
  }, [key, instance]);

  return [option, setStorage];
};
