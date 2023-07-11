import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';
//todo import { debounce } from 'lodash';

//todo import { DEBOUNCE_DELAY } from '../settings';
import { Component } from './component';

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature update function */
  private readonly _update: () => Feature;

  /* The feature components */
  private readonly _components = new Set<Component>();

  /**
   * Create a feature.
   * @param name - The feature name.
   */
  constructor(name: string, update: (feature: Feature) => void) {
    // initialize
    this._name = name;
    this._update = () => { update(this); return this; }
    // debounce rendering
    //todo this.render = () => debounce(async () => { this.render(); }, DEBOUNCE_DELAY);
    //todo this.unmount = () => debounce(async () => { this.unmount(); }, DEBOUNCE_DELAY);
  }

  /* Get the feature name */
  get name(): string {
    return this._name;
  }

  /* Get the feature update function */
  get update(): () => Feature {
    return this._update;
  }

  /* Get the feature components */
  get components(): Set<Component> {
    return new Set(this._components);
  }

  /**
   * Add a component to the feature.
   * @param name - The component name (must be uniquer within the feature).
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   * @returns The created component.
   */
  addComponent(
    name: string,
    node: ReactNode,
    options?: RootOptions
  ): Component | null {
    if (Array.from(this._components).some((c) => c.name === name)) return null;
    const component = new Component(this, name, node, options);
    this._components.add(component);
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
      if (Array.from(this._components).some((c) => c.name === component.name)) return;
      this._components.add(component);
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
      if (!this._components.has(component)) return;
      this._components.delete(component);
      component.remove();
    });
    return this;
  }

  /**
   * Render the feature.
   * @returns The feature.
   */
  render(): Feature {
    this._components.forEach((component) => {
      component.render();
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
}
