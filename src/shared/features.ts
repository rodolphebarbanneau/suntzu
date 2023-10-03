import {
  StorageNamespace,
  storageOptions,
  storageRecord,
} from './core';

/**
 * The application features configuration.
 * It is used to set the application enabled features. It includes flags for the map and player
 * features. The user can enable or disable these features from the bowser extension popup.
 */
@storageOptions({ name: 'config', sync: true })
export class FeaturesConfiguration extends StorageNamespace {
  /* The map feature flag */
  @storageRecord showMap = true;
  /* The player feature flag */
  @storageRecord showPlayer = false;
}

export const FEATURES_CONFIG = FeaturesConfiguration.initialize();
