import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';

import { Component } from './component';

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature components */
  private readonly _components = new Map<string, Component>();

  /**
   * Create a feature.
   * @param name - The feature name.
   * @param initialize - The feature initialization function.
   */
  constructor(name: string, initialize: (feature: Feature) => void) {
    // initialize
    this._name = name;
    initialize(this);
  }

  /* Get the feature name */
  get name(): string {
    return this._name;
  }

  /* Get the feature components */
  get components(): Map<string, Component> {
    return new Map(this._components);
  }

  /**
   * Add a component to the feature.
   * @param name - The component name (must be unique within the feature).
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   * @returns The created component.
   */
  addComponent(
    { name, node, options }: {
      name: string;
      node: ReactNode;
      options?: RootOptions;
    },
  ): Component | null {
    if (this._components.has(name)) return null;
    const component = new Component({
      feature: this,
      name,
      node,
      options,
    }).mount();
    this._components.set(component.name, component);
    return component;
  }

  /**
   * Add multiple components to the feature.
   * @param components - The components to add.
   * @returns The feature.
   */
  extendComponents(...components: Component[]): Feature {
    components.forEach((component) => {
      if (component.feature !== this) {
        throw new Error('Cannot extend component from another feature');
      }
      if (this._components.has(component.name)) return;
      this._components.set(component.name, component);
    });
    return this;
  }

  /**
   * Remove multiple components from the feature.
   * @param components - The components to remove.
   * @returns The feature.
   */
  removeComponents(...components: Component[]): Feature {
    components.forEach((component) => {
      if (!this._components.has(component.name)) return;
      this._components.delete(component.name);
      component.remove();
    });
    return this;
  }

  /**
   * Mount the feature.
   * @returns The feature.
   */
  mount(): Feature {
    this._components.forEach((component) => {
      component.mount();
    });
    return this;
  }

  /**
   * Unmount the feature.
   * @returns The feature.
   */
  unmount(): Feature {
    this._components.forEach((component) => {
      component.unmount();
    });
    return this;
  }

  /**
   * Check if the feature is rendered in the document.
   * @returns True if the feature is rendered in the document, false otherwise.
   */
  isRendered(): boolean {
    // return false if there are no components
    if (this._components.size === 0) return false;
    // return true if every component is rendered, false otherwise
    return Array.from(this._components.values()).every((component) => component.isRendered());
  }
}
