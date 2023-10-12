import type { ReactNode } from 'react';
import type { RootOptions } from 'react-dom/client';

import { Component, ComponentState } from './component';

/**
 * A feature.
 * It manages a collection of components that are added to the document.
 */
export class Feature {
  /* The feature name */
  private readonly _name: string;

  /* The feature host */
  private readonly _host: HTMLElement | null | undefined;

  /* The feature components */
  private readonly _components = new Map<string, Component>();

  /**
   * Create a feature.
   * @param name - The feature name.
   * @param host - The feature host.
   * @param initialize - The feature initialization function.
   * @param update - The feature update function (optional).
   */
  constructor(
    { name, host, initialize, update }: {
      name: string;
      host: HTMLElement | null | undefined;
      initialize: (feature: Feature) => void;
      update?: (feature: Feature, mutation?: MutationRecord) => void;
    },
  ) {
    // initialize
    this._name = name;
    if (host) {
      this._host = host;
      initialize(this);
    } else {
      return;
    }
    // initialize on change
    if (update) {
      // execute on change with no mutation
      update(this);
      // handle on change with mutation
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          update(this, mutation);
        });
      });
      observer.observe(host, { attributes: true, childList: true, subtree: true });
    }
  }

  /* Get the feature name */
  get name(): string {
    return this._name;
  }

  /* Get the feature host */
  get host(): HTMLElement | null | undefined {
    return this._host;
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
      // check if component is from this feature
      if (component.feature !== this) {
        throw new Error('Cannot extend component from another feature');
      }
      // check if component is attached to the feature host
      if (component.state & ComponentState.ATTACHED) {
        if (!this._host?.contains(component.container)) {
          throw new Error('Cannot extend component that is not attached to the feature host');
        }
      }
      // add component to feature
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
