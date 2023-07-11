import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';
import { debounce } from 'lodash';

import { DEBOUNCE_DELAY } from '../settings';
import { Component } from './component';

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature update function */
  private readonly _update: () => void;

  /* The feature components */
  private readonly _components = new Map<string, Component>();

  /**
   * Create a feature.
   * @param name - The feature name.
   */
  constructor(name: string, update: (feature: Feature) => void) {
    // initialize
    this._name = name;
    this._update = () => update(this);
    // debounce feature update
    const originalUpdate = this.update.bind(this);
    const debounceUpdate = debounce(originalUpdate, DEBOUNCE_DELAY, { leading: true, trailing: false });
    this.update = () => { debounceUpdate(); return this; }
    // debounce feature rendering
    const originalRender = this.render.bind(this);
    const debounceRender = debounce(originalRender, DEBOUNCE_DELAY, { leading: true, trailing: false });
    this.render = () => { debounceRender(); return this; }
    // debounce feature unmounting
    const originalUnmount = this.unmount.bind(this);
    const debounceUnmount = debounce(originalUnmount, DEBOUNCE_DELAY, { leading: true, trailing: false });
    this.unmount = () => { debounceUnmount(); return this; }
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
    if (this._components.has(name)) return null;
    const component = new Component(this, name, node, options);
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
   * Update the feature.
   * @returns The feature.
   * @remarks This method is debounced.
   */
  update(): Feature {
    this._update();
    return this;
  }

  /**
   * Render the feature.
   * @returns The feature.
   * @remarks This method is debounced.
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
   * @remarks This method is debounced.
   */
  unmount(): Feature {
    this._components.forEach((component) => {
      component.unmount();
    });
    return this;
  }
}
