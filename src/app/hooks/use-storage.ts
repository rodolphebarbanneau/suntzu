import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

import type {
  StorageNamespace,
  StorageChanges,
  StorageListener,
} from 'src/shared/core';
import { Storage } from 'src/shared/core';

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
): [T[K] | undefined, Dispatch<SetStateAction<T[K] | undefined>>] => {
  const [storage, setStorage] = useState<T | undefined>(undefined);
  const [option, setOption] = useState<T[K] | undefined>(undefined);

  /**
   * Effect to initialize the storage with the provided namespace.
   * If instance is a promise, it is resolved first before setting the storage.
   */
  useEffect(() => {
    if (namespace instanceof Promise) {
      namespace.then(setStorage);
    } else {
      setStorage(namespace);
    }
  }, [namespace]);

  /**
   * Effect to initialize the option with the provided storage key value.
   */
  useEffect(() => {
    if (!storage || !key) return;
    setOption(storage[key]);
  }, [key, storage]);

  /**
   * Effect to update the storage value when the local state updates.
   */
  useEffect(() => {
    if (!storage || !key || option === undefined) return;
    storage[key] = option;
  }, [option, key, storage]);

  /**
   * Effect to listen for storage changes and update the local state accordingly.
   * It returns also a cleanup function to remove the listener when the component unmounts or the
   * dependencies change.
   */
  useEffect(() => {
    if (!storage || !key) return;
    const onChange = (changes: StorageChanges) => {
      if (key in changes) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOption(changes[key as any].newValue);
      }
    };
    const listener: StorageListener = [storage, onChange];
    Storage.addListener(listener);
    return () => {
      Storage.removeListener(listener);
    };
  }, [key, storage]);

  return [option, setOption];
};

export default useStorage;
