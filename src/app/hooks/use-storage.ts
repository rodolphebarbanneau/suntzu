

// declare features
// initialize storage features

// hooks...

// add listeners


///* Storage features */
//@namespace('features', true)
//export class StorageFeatures {
//  @storage('features.showMap', true)
//  map: boolean = true;
//
//  @storage('features.showPlayer', true)
//  player: boolean = true;
//}

import {  storage } from './storage';

/* Storage features */
@storage('features', true)
export class Features {
  showMap: boolean = true;
  showPlayer: boolean = true;
}
