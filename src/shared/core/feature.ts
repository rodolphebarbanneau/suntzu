import { debounce } from 'lodash';

import type { Component } from './component';
import type { Matchroom } from './matchroom';

/**
 * A feature.
 */
export abstract class Feature {
  /* The feature matchroom. */
  private readonly _matchroom: Matchroom;

  /* The feature name. */
  private readonly _name: string;

  /* The feature components. */
  private readonly _components: { [key: string]: Component } = {};

  /**
   * Create a feature.
   * @param matchroom - The feature matchroom.
   * @param name - The feature name.
   */
  constructor(matchroom: Matchroom, name: string) {
    // initialize
    this._matchroom = matchroom;
    this._name = name;
    // debounce render
    this.render = () => debounce(async () => { this.render(); }, 250);
  }

  /* Get the feature matchroom. */
  get matchroom(): Matchroom {
    return this._matchroom;
  }

  /* Get the feature name. */
  get name(): string {
    return this._name;
  }

  /* Get the feature components. */
  get components(): { [key: string]: Component } {
    return this._components;
  }

  /**
   * Add a component to the feature.
   * @param component - The component to add.
   */
  addComponent(component: Component): void {
    this._components[component.name] = component;
  }

  /* The render method. */
  abstract render(): void;
}
