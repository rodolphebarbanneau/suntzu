import {
  StorageNamespace,
  storageOptions,
  storageRecord,
} from './core';

/**
 * The features.
 * It is used to set the application features enabled by the user.
 * It includes flags for the map and player features.
 */
@storageOptions({ name: 'features', sync: true })
export class Features extends StorageNamespace {
  /* The map feature flag */
  @storageRecord showMap = true;
  /* The player feature flag */
  @storageRecord showPlayer = true;
}
