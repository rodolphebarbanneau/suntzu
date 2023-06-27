import 'reflect-metadata';

import { BROWSER } from '../helpers';

/* Storage symbols */
const OPTIONS_KEY = Symbol('options');  // eslint-disable-line @typescript-eslint/naming-convention
const RECORDS_KEY = Symbol('records');  // eslint-disable-line @typescript-eslint/naming-convention

/* Storage types */
type StorageChanges = { [key: string]: chrome.storage.StorageChange };
type StorageRecords = { [key: string]: unknown };

/**
 * A listener for a storage namespace.
 * It is used to listen to changes in the storage namespace.
 */
interface StorageListener {
  /* The storage namespace to listen for changes. */
  namespace: StorageNamespace;
  /* The callback to execute when a change occurs in the storage. */
  callback: (changes: StorageChanges) => void;
};

/**
 * Options for a storage namespace.
 * It is used to define the storage namespace and synchroneous flag. If the storage is synchroneous,
 * the records will be updated automatically when the browser local storage changes.
 */
interface StorageOptions {
  /* The storage namespace (defaults to an empty string) */
  name?: string;
  /* The storage synchroneous flag with the browser locals (defaults to false) */
  sync?: boolean;
}

/**
 * Handle the browser's local storage.
 * Contains static methods for setting and getting data, and adding and removing listeners.
 */
export class Storage {
  /* The storage namespace listeners */
  private static _listeners: Map<
    StorageListener,
    (changes: StorageChanges, areaName: string) => void
  > = new Map();

  /* Static class */
  private constructor() { /* noop */ }

  /**
   * Load the given namespace with the local storage.
   * @param namespace - The namespace containing the records to be updated.
   * @returns A promise that resolves when the namespace records are updated.
   */
  static async load<T extends StorageNamespace>(namespace: T): Promise<void> {
    // get storage namespace record keys
    const keys: string[] = Reflect.getMetadata(
      RECORDS_KEY,
      namespace.constructor.prototype,
    ) || [];

    // update storage namespace records
    return new Promise((resolve, reject) => {
      BROWSER.storage.local.get(keys, (result) => {
        if (BROWSER.runtime.lastError) {
          reject(BROWSER.runtime.lastError);
        } else {
          keys.forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
            (namespace as any)[key] = result[key];
          });
          resolve();
        }
      });
    });
  }

  /**
   * Save the given namespace in the local storage.
   * @param namespace - The namespace containing the records to be save.
   * @returns A Promise that resolves when the namespace records are save.
   */
  static async save<T extends StorageNamespace>(namespace: T): Promise<void> {
    // get storage namespace records keys
    const keys: string[] = Reflect.getMetadata(
      RECORDS_KEY,
      namespace.constructor.prototype,
    ) || [];

    // retrieve storage namespace records data
    const data = keys.reduce((obj: StorageRecords, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj[key] = (namespace as any)[key];
      return obj;
    }, {});

    // save storage namespace records
    return new Promise((resolve, reject) => {
      BROWSER.storage.local.set(data, () => {
        if (BROWSER.runtime.lastError) {
          reject(BROWSER.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Add a listener to a storage namespace.
   * @param listener - The listener to be added.
   */
  static addListener(listener: StorageListener): void {
    // do nothing if the listener is already registered
    if (this._listeners.has(listener)) return;

    // helper function
    const helper = (changes: StorageChanges, areaName: string) => {
      // do nothing if the area name is not local
      if (areaName !== 'local') return;
      // get storage namespace records keys
      const keys: string[] = Reflect.getMetadata(
        RECORDS_KEY,
        listener.namespace.constructor.prototype,
      ) || [];
      // filter storage namespace records changes
      const result = Object.keys(changes).reduce((obj: StorageChanges, key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (key in keys && (listener.namespace as any)[key] !== changes[key].newValue) {
          obj[key] = changes[key];
        }
        return obj;
      }, {});
      // execute callback if namespace records changes
      if (Object.keys(result).length !== 0) listener.callback(result);
    };

    // register the listener
    BROWSER.storage.onChanged.addListener(helper);
    this._listeners.set(listener, helper);
  }

  /**
   * Remove a listener from a storage namespace.
   * @param listener - The listener to be removed.
   */
  static removeListener(listener: StorageListener): void {
    // helper function
    const helper = this._listeners.get(listener);

    // unregister the listener
    if (helper) {
      BROWSER.storage.onChanged.removeListener(helper);
      this._listeners.delete(listener);
    }
  }
}

/**
 * Abstract class that represents a namespace in the local storage.
 * It is used to persist data in the local storage. It needs to be extended to create a namespace
 * that contains data to be loaded and saved in the local storage. The namespace is initialized with
 * the static `initialize` method.
 * It can be loaded and saved using the storage class `load` and `save` methods.
 */
export abstract class StorageNamespace {
  /* Async initialization */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  public constructor() { /* do not use, use initialize instead */ }

  /**
   * A factory method for creating and initializing an instance of a storage namespace subclass.
   * @returns A Promise that resolves with the initialized instance.
   */
  static async initialize<T extends StorageNamespace>(this: new () => T): Promise<T> {
    // create instance
    const instance = new this();

    // fetch storage namespace options
    const metadata: StorageOptions = Reflect.getMetadata(
      OPTIONS_KEY,
      instance.constructor,
    ) || {};
    const name = metadata.name ?? '';
    const sync = metadata.sync ?? false;

    // fetch storage namespace records
    const records: string[] = Reflect.getMetadata(
      RECORDS_KEY,
      instance.constructor.prototype,
    ) || [];

    // initialize storage namespace records
    for (const key of records) {
      // initialize data
      const data = {
        key: `${name ? `${name}.` : ''}${key}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: (instance as any)[key],
      };
      // update getter and setter
      const getter = () => { return data.value; };
      const setter = (next: unknown) => {
        if (data.value === next) return;
        data.value = next;
        Storage.save(instance);
      };
      // define record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (delete (instance as any)[key]) {
        Object.defineProperty(instance, key, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true,
        });
      }
      // handle storage changes if sync
      if (sync) {
        Storage.addListener({
          namespace: instance,
          callback: (changes: StorageChanges) => setter(changes[data.key].newValue),
        });
      }
    }

    // load storage namespace records from the local storage
    await Storage.load(instance);
    return instance;
  }
}

/**
 * A decorator for marking a property as a storage record.
 * @param target - The namespace class.
 * @param propertyKey - The namespace record key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function storageRecord(target: any, propertyKey: string): void {
  // get existing decorated properties
  const properties: string[] = Reflect.getMetadata(RECORDS_KEY, target) || [];
  // add new decorated property
  Reflect.defineMetadata(RECORDS_KEY, [...properties, propertyKey], target);
}

/**
 * A decorator for providing options to a storage namespace.
 * @param metadata - The metadata options for the storage namespace.
 */
export function storageOptions(metadata: StorageOptions = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any) {
    Reflect.defineMetadata(OPTIONS_KEY, metadata, target);
  };
}
