import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';
import { debounce } from 'lodash';

import { DEBOUNCE_DELAY } from '../settings';
import { Component } from './component';

/**
 * A feature action.
 * It is a general abstraction for creating and handling actions called by the feature rendering
 * and unmounting methods.
 */
export interface FeatureAction {
  render: () => void;
  unmount: () => void;
}

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature components */
  private readonly _components: Set<Component>;

  /* The feature rendering and unmounting actions */
  private readonly _actions: Set<FeatureAction>;

  /**
   * Create a feature.
   * @param name - The feature name.
   */
  constructor(name: string, callback: (feature: Feature) => void) {
    // initialize
    this._name = name;
    this._components = new Set();
    this._actions = new Set();
    // debounce rendering
    this.render = () => debounce(async () => { this.render(); }, DEBOUNCE_DELAY);
    this.unmount = () => debounce(async () => { this.unmount(); }, DEBOUNCE_DELAY);
    // callback
    callback(this);
  }

  /* Get the feature name */
  get name(): string {
    return this._name;
  }

  /* Get the feature components */
  get components(): Set<Component> {
    return this._components;
  }

  /* Get the feature rendering and unmounting actions */
  get actions(): Set<FeatureAction> {
    return this._actions;
  }

  /**
   * Add a component to the feature.
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   * @returns The created component.
   */
  addComponent(
    node: ReactNode,
    options?: RootOptions
  ): Component {
    const component = new Component(this, node, options);
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
      if (this._components.has(component)) return;
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
   * Add an action to the feature.
   * @param action - The action to add.
   * @returns The created action.
   */
  addAction(action: FeatureAction): FeatureAction {
    this._actions.add(action);
    return action;
  }

  /**
   * Add multiple actions to the feature.
   * @param actions - The actions to add.
   * @returns The feature.
   */
  extendActions(...actions: FeatureAction[]): Feature {
    actions.forEach((action) => {
      if (this._actions.has(action)) return;
      this._actions.add(action);
    });
    return this;
  }

  /**
   * Remove multiple actions from the feature.
   * @param actions - The actions to remove.
   * @returns The feature.
   */
  removeActions(...actions: FeatureAction[]): Feature {
    actions.forEach((action) => {
      if (!this._actions.has(action)) return;
      this._actions.delete(action);
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
    this._actions.forEach((action) => {
      action.render();
    });
  }

  /**
   * Unmount the feature.
   */
  unmount(): void {
    this._components.forEach((component) => {
      component.unmount();
    });
    this._actions.forEach((action) => {
      action.unmount();
    });
  }
}
