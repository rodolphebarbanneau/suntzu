import {
  StorageNamespace,
  storageOptions,
  storageRecord,
} from './core';

/**
 * The application configuration.
 * It is used to set the application enabled features. It includes flags for the map and player
 * features. The user can enable or disable these features from the bowser extension popup.
 */
@storageOptions({ name: 'config', sync: true })
export class Configuration extends StorageNamespace {
  /* The map feature flag */
  @storageRecord showMap = true;
  /* The player feature flag */
  @storageRecord showPlayer = true;
}
