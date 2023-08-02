import 'reflect-metadata';
import browser from 'webextension-polyfill';

/* Storage symbols */
const OPTIONS_KEY = Symbol('options');  // eslint-disable-line @typescript-eslint/naming-convention
const RECORDS_KEY = Symbol('records');  // eslint-disable-line @typescript-eslint/naming-convention

/* Storage types */
export type StorageChanges = { [key: string]: browser.Storage.StorageChange };
export type StorageRecords = { [key: string]: unknown };
export type StorageListener = [
  StorageNamespace,
  (changes: StorageChanges) => void,
];

/**
 * Options for a storage namespace.
 * It is used to define the storage namespace and synchroneous flag. If the storage is synchroneous,
 * the records will be updated automatically when the browser local storage changes.
 */
export interface StorageOptions {
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
  private static _listeners: Set<StorageListener> = new Set();

  /* The loading storage namespaces */
  private static _loading: Set<StorageNamespace> = new Set();

  /* Static class */
  private constructor() { /* noop */ }

  /* Get the loading storage namespaces */
  static get loading(): Set<StorageNamespace> {
    // eslint-disable-next-line no-underscore-dangle
    return new Set(Storage._loading);
  }

  /**
   * Load the given namespace with the local storage.
   * @param namespace - The namespace containing the records to be updated.
   * @param namespaceKeys - The namespace keys to be updated (optional).
   * @returns A promise that resolves when the namespace records are updated.
   */
  static async load<T extends StorageNamespace, K extends keyof T>(
    namespace: T,
    namespaceKeys?: K[],
  ): Promise<void> {
    // add namespace to loading namespaces
    this._loading.add(namespace);
    // get storage namespace options and record keys metadata
    const [metadata, keys]: [StorageOptions, string[]] = Storage.getMetadata(namespace);

    // filter namespace keys
    const filteredKeys = keys.filter(
      (key) => namespaceKeys ? namespaceKeys.includes(key as K) : true
    );
    // retrieve storage namespace keys
    const storageKeys = filteredKeys.map(
      (key) => Storage.generateKey(key, metadata.name)
    );

    // update storage namespace records
    return new Promise((resolve, reject) => {
      browser.storage.local.get(storageKeys).then((records) => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          // keep track of changes
          const changes: StorageChanges = {};
          filteredKeys.forEach((key) => {
            const storageKey = Storage.generateKey(key, metadata.name);
            if (records[storageKey] !== undefined) {
              /* eslint-disable @typescript-eslint/no-explicit-any, no-param-reassign */
              changes[key] = {
                oldValue: (namespace as any)[key],
                newValue: records[storageKey],
              };
              (namespace as any)[key] = records[storageKey];
              /* eslint-enable @typescript-eslint/no-explicit-any, no-param-reassign */
            }
          });
          // notify listeners
          Storage.notifyListeners(namespace, changes)
          // remove namespace from loading namespaces
          this._loading.delete(namespace);
          resolve();
        }
      });
    });
  }

  /**
   * Save the given namespace in the local storage.
   * @param namespace - The namespace containing the records to be save.
   * @param namespaceKeys - The namespace keys to be saved (optional).
   * @returns A Promise that resolves when the namespace records are save.
   */
  static async save<T extends StorageNamespace, K extends keyof T>(
    namespace: T,
    namespaceKeys?: K[],
  ): Promise<void> {
    // get storage namespace options and record keys metadata
    const [metadata, keys]: [StorageOptions, string[]] = Storage.getMetadata(namespace);

    // filter namespace keys
    const filteredKeys = keys.filter(
      (key) => namespaceKeys ? namespaceKeys.includes(key as K) : true
    );
    // retrieve storage namespace records
    const records = filteredKeys.reduce((obj: StorageRecords, key) => {
      const storageKey = Storage.generateKey(key, metadata.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj[storageKey] = (namespace as any)[key];
      return obj;
    }, {});

    // save storage namespace records
    return new Promise((resolve, reject) => {
      browser.storage.local.set(records).then(() => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
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
    if (this._listeners.has(listener)) return;
    this._listeners.add(listener);
  }

  /**
   * Remove a listener from a storage namespace.
   * @param listener - The listener to be removed.
   */
  static removeListener(listener: StorageListener): void {
    this._listeners.delete(listener);
  }

  /**
   * Notify the listeners of a storage namespace with the given changes.
   * @param namespace - The storage namespace.
   * @param changes - The storage changes.
   */
  static notifyListeners<T extends StorageNamespace>(
    namespace: T,
    changes: StorageChanges,
  ): void {
    this._listeners.forEach(([ns, callback]) => {
      if (ns === namespace) callback(changes);
    });
  }

  /**
   * Get the storage namespace metadata and records keys.
   * @param namespace - The storage namespace.
   * @returns The storage namespace metadata and records keys.
   */
  static getMetadata(
    namespace: StorageNamespace,
  ): [StorageOptions, string[]] {
    // get storage namespace options metadata
    const metadata: StorageOptions = Reflect.getMetadata(
      OPTIONS_KEY,
      namespace.constructor,
    ) || {};
    // get storage namespace records keys
    const keys: string[] = Reflect.getMetadata(
      RECORDS_KEY,
      namespace.constructor.prototype,
    ) || [];
    // return metadata and keys
    return [metadata, keys];
  }

  /**
   * Generate a storage namespace record key.
   * @param key - The storage record key.
   * @param name - The storage namespace name.
   * @returns The storage namespace record key.
   */
  static generateKey(key: string, name?: string): string {
    return `${name ? `${name}.` : ''}${key}`;
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
  /* The local storage listener for synchronizing changes */
  private _listener?: (changes: StorageChanges, areaName: string) => void;

  /* Async initialization */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  public constructor() { /* do not call, use initialize instead */ }

  /**
   * A factory method for creating and initializing an instance of a storage namespace subclass.
   * @returns A Promise that resolves with the initialized instance.
   */
  static async initialize<T extends StorageNamespace>(this: new () => T): Promise<T> {
    // create instance
    const instance = new this();

    // get storage namespace options and record keys metadata
    const [metadata, keys]: [StorageOptions, string[]] = Storage.getMetadata(instance);

    // initialize storage namespace records
    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value = (instance as any)[key];
      // update getter and setter
      const getter = () => { return value; };
      const setter = (next: unknown) => {
        if (value === next) return;
        const changes = { [key]: { oldValue: value, newValue: next } };
        value = next;
        // save and notify listeners
        if (!Storage.loading.has(instance)) {
          Storage.save(instance);
          Storage.notifyListeners(instance, changes);
        }
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
    }

    // handle storage changes if sync
    if (metadata.sync) instance.sync();

    // load storage namespace records from the local storage
    await Storage.load(instance);
    return instance;
  }

  /**
   * Sync the storage namespace records with the local storage.
   * It adds a listener to the local storage changes and updates the records accordingly.
   */
  sync(): void {
    // get storage namespace options and record keys metadata
    const [metadata, keys]: [StorageOptions, string[]] = Storage.getMetadata(this);

    // listener callback
    const listener = (changes: StorageChanges, areaName: string) => {
      // do nothing if the area name is not local
      if (areaName !== 'local') return;
      // apply changes
      for (const key of keys) {
        const storageKey = Storage.generateKey(key, metadata.name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (storageKey in changes && (this as any)[key] !== changes[storageKey].newValue) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[key] = changes[storageKey].newValue;
        }
      }
    };

    // register the listener
    browser.storage.onChanged.addListener(listener);
    // eslint-disable-next-line no-underscore-dangle
    this._listener = listener;
  }

  /**
   * Unsync the storage namespace.
   * It removes the local storage listener for synchronizing changes if it exists.
   */
  unsync(): void {
    if (this._listener) {
      browser.storage.onChanged.removeListener(this._listener);
      this._listener = undefined;
    }
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
