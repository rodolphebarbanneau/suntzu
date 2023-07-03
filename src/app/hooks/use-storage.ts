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
 * @template T - It extends the storage namespace.
 * @param namespace - The storage namespace to be managed, which can be a synchronous instance of
 * `T` or a Promise that resolves with an instance of `T`.
 * @param key - The key of the item within the storage instance to be managed.
 * @returns A React hook tuple where the first element is the current value of the storage item and
 * the second element is a function to update that value.
 */
export const useStorage = <T extends StorageNamespace, K extends keyof T>(
  namespace: T | Promise<T>,
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
    if (namespace instanceof Promise) {
      namespace.then((records) => {
        storage.current = true;
        setStorage(records[key]);
      });
    } else {
      storage.current = true;
      setStorage(namespace[key]);
    }
  }, [key, namespace]);

  /**
   * Effect to update the storage value when the local state updates.
   * If the namespace is a promise, it is resolved first before updating the storage value. It is
   * also skipped if the option is null or the storage hasn't been initialized.
   */
  useEffect(() => {
    if (!key) return;
    if (!storage.current) return;
    if (option === null) return;
    if (namespace instanceof Promise) {
      namespace.then((records) => {
        records[key] = option;
      });
    } else {
      namespace[key] = option;
    }
  }, [option, key, namespace]);

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
    Storage.addListener([namespace, onChange]);
    return () => {
      Storage.removeListener([namespace, onChange]);
    };
  }, [key, namespace]);

  return [option, setStorage];
};
