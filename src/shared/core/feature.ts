import { debounce } from 'lodash';

import type { Component } from './component';

/**
 * A feature.
 */
export abstract class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature components */
  private readonly _components: Set<Component>;

  /**
   * Create a feature.
   * @param name - The feature name.
   */
  constructor(name: string) {
    // initialize
    this._name = name;
    this._components = new Set();
    // debounce render
    this.render = () => debounce(async () => { this.render(); }, 250);
  }

  /* Get the feature name. */
  get name(): string {
    return this._name;
  }

  /* Get the feature components. */
  get components(): Set<Component> {
    return this._components;
  }

  /**
   * Add a component to the feature.
   * @param component - The component to add.
   * @returns The feature.
   */
  add(component: Component): Component {
    // return if component already exists
    if (this._components.has(component)) return component;
    // add component
    this._components.add(component);
    return component;
  }

  /**
   * Add multiple components to the feature.
   * @param components - The components to add.
   * @returns The feature.
   */
  extend(...components: Component[]): Feature {
    components.forEach((component) => {
      if (this._components.has(component)) return;
      this._components.add(component);
    });
    return this;
  }

  /**
   * Remove multiple components from the feature.
   * @param components - The components to remove.
   */
  remove(...components: Component[]): Feature {
    components.forEach((component) => {
      if (!this._components.has(component)) return;
      this._components.delete(component);
      component.remove();
    });
    return this;
  }

  /**
   * Render the feature.
   * This method must be overridden.
   */
  abstract render(): void;
}
