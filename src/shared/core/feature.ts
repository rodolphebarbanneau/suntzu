import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';
import { debounce } from 'lodash';

import { Component } from './component';

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature components */
  private readonly _components: Set<Component>;

  /**
   * Create a feature.
   * @param name - The feature name.
   */
  constructor(name: string, callback: (feature: Feature) => void) {
    // initialize
    this._name = name;
    this._components = new Set();
    // debounce render
    this.render = () => debounce(async () => { this.render(); }, 250);
    // callback
    callback(this);
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
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   * @returns The created component.
   */
  add(
    node: ReactNode,
    options?: RootOptions
  ): Component {
    return new Component(this, node, options);
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
   */
  render(): void {
    this._components.forEach((component) => {
      component.render();
    });
  }
}
