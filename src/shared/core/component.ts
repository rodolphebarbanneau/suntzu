import type { ReactNode } from 'react';
import type { Root, RootOptions } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import type { Feature } from './feature';
import { EXTENSION_NAME } from '../settings';

/* Component State (bitwise flags) */
export enum ComponentState {
  INITIALIZED = 0,    // 0: initialized but not yet attached and mounted
  ATTACHED = 1 << 0,  // 1: attached to the document
  MOUNTED = 1 << 1,  // 2: mounted in react root
}

/**
 * A component.
 * It is a general abstraction for creating and handling the extension injected react components
 * into the document. Each component is attached to a container element in the document.
 */
export class Component {
  /* The component feature */
  private readonly _feature: Feature;

  /* The component id */
  private readonly _id: string

  /* The component name */
  private readonly _name: string

  /* The component container */
  private readonly _container: HTMLDivElement;

  /* The component react root */
  private readonly _root: Root;

  /* The component react node */
  private readonly _node: ReactNode;

  /* The component host */
  private _host: HTMLElement | null | undefined;

  /* The component state */
  private _state: ComponentState = ComponentState.INITIALIZED;

  /**
   * Create a component.
   * @param feature - The component feature.
   * @param name - The component name.
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   */
  constructor(
    { feature, name, node, options }: {
      feature: Feature;
      name: string;
      node: ReactNode;
      options?: RootOptions;
    },
  ) {
    // initialize feature
    this._feature = feature;
    // initialize id (extension name + random string) and name
    const random = Math.random().toString(36).substring(2, 15);
    this._id = `${EXTENSION_NAME.toLowerCase().trim().replace(/\s+/g, '-')}-${random}`;
    this._name = name;
    // initialize container
    this._container = document.createElement('div');
    this._container.setAttribute('id', this._id);
    this._container.setAttribute('name', this._name);
    // initialize react root and node
    this._root = createRoot(this._container, options);
    this._node = node;
    // add component to feature
    this._feature.extendComponents(this);
  }

  /* Get the component feature */
  get feature(): Feature {
    return this._feature;
  }

  /* Get the component id */
  get id(): string {
    return this._id;
  }

  /* Get the component name */
  get name(): string {
    return this._name;
  }

  /* Get the component container */
  get container(): HTMLDivElement {
    return this._container;
  }

  /* Get the component react root */
  get root(): Root {
    return this._root;
  }

  /* Get the component react node */
  get node(): ReactNode {
    return this._node;
  }

  /* Get the component host */
  get host(): HTMLElement | null | undefined {
    return this._host;
  }

  /* Get the component state */
  get state(): ComponentState {
    return this._state;
  }

  /**
   * Insert component container after the last child of element.
   * @param element - The element to append the component to.
   * @returns The component.
   */
  appendTo(element?: HTMLElement | null): Component {
    // retrieve target element
    if (!this._feature.host) throw new Error('Feature host does not exist');
    const target = element ?? this._feature.host;
    // append component to target element
    this._container.remove();
    target.append(this._container);
    this._host = target;
    this._state |= ComponentState.ATTACHED;
    // check component container
    this._checkContainer();
    return this;
  }

  /**
   * Insert component container before the first child of element.
   * @param element - The element to prepend the component to.
   * @returns The component.
   */
  prependTo(element?: HTMLElement | null): Component {
    // retrieve target element
    if (!this._feature.host) throw new Error('Feature host does not exist');
    const target = element ?? this._feature.host;
    // prepend component to target element
    this._container.remove();
    target.prepend(this._container);
    this._host = target;
    this._state |= ComponentState.ATTACHED;
    // check component container
    this._checkContainer();
    return this;
  }

  /**
   * Insert the component container before the element.
   * @param element - The element before which the component will be positioned.
   * @returns The component.
   */
  insertBefore(element?: HTMLElement | null): Component {
    // retrieve target element
    if (!this._feature.host) throw new Error('Feature host does not exist');
    const target = element ?? this._feature.host;
    // insert component before target element
    this._container.remove();
    target.parentElement?.insertBefore(this._container, target);
    this._host = target.parentElement;
    this._state |= ComponentState.ATTACHED;
    // check component container
    this._checkContainer();
    return this;
  }

  /**
   * Insert the component container after the element.
   * @param element - The element after which the component will be positioned.
   * @returns The component.
   */
  insertAfter(element?: HTMLElement | null): Component {
    // retrieve target element
    if (!this._feature.host) throw new Error('Feature host does not exist');
    const target = element ?? this._feature.host;
    // insert component after target element
    this._container.remove();
    if (target.nextSibling) {
      target.parentElement?.insertBefore(this._container, target.nextSibling);
    } else {
      target.parentElement?.appendChild(this._container);
    }
    this._host = target.parentElement;
    this._state |= ComponentState.ATTACHED;
    // check component container
    this._checkContainer();
    return this;
  }

  /**
   * Remove the component container.
   * @returns The component.
   */
  remove(): Component {
    this._container.remove();
    this._host = null;
    this._state &= ~ComponentState.ATTACHED;
    return this;
  }

  /**
   * Mount the component node into the root attached to the container.
   * @returns The component.
   */
  mount(): Component {
    this._root.render(this._node);
    this._state |= ComponentState.MOUNTED;
    return this;
  }

  /**
   * Unmount the component node from the root.
   * @returns The component.
   */
  unmount(): Component {
    this._root.unmount();
    this._state &= ~ComponentState.MOUNTED;
    return this;
  }

  /**
   * Check if the component is rendered in the document.
   * @returns True if the component is rendered in the document, false otherwise.
   */
  isRendered(): boolean {
    return document.contains(this._container);
  }

  /**
   * Check if the component container is a child of the feature container.
   * @throws An error if the component container is not a child of the feature container.
   */
  private _checkContainer(): void {
    if (!this._feature.host?.contains(this._container)) {
      this.remove();
      throw new Error('Component container is not a child of the feature host');
    }
  }
}
