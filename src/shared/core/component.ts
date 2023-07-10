import type { ReactNode } from 'react';
import type { Root, RootOptions } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import type { Feature } from './feature';
import { EXTENSION_NAME } from '../settings';

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

  /* The component container */
  private readonly _container: HTMLDivElement;

  /* The component react root */
  private readonly _root: Root;

  /* The component react node */
  private readonly _node: ReactNode;

  /* The component host container */
  private _host: HTMLElement | null = null;

  /**
   * Create a component.
   * @param feature - The component feature.
   * @param node - The component react node.
   * @param options - The component react root options (optional).
   */
  constructor(
    feature: Feature,
    node: ReactNode,
    options?: RootOptions,
  ) {
    // initialize feature
    this._feature = feature;
    // initialize id (extension name + random string)
    const random = Math.random().toString(36).substring(2, 15);
    this._id = `${EXTENSION_NAME.toLowerCase().trim().replace(/\s+/g, '-')}-${random}`;
    // initialize container
    this._container = document.createElement('div');
    this._container.setAttribute('id', this._id);
    this._container.setAttribute('name', this._id);
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

  /* Get the component host container */
  get host(): HTMLElement | null {
    return this._host;
  }

  /**
   * Append the component container.
   * @param element - The element to append the component to.
   * @returns The component.
   */
  appendTo(element: HTMLDivElement): Component {
    this._container.remove();
    element.append(this._container);
    this._host = element;
    return this;
  }

  /**
   * Prepend the component container.
   * @param element - The element to prepend the component to.
   * @returns The component.
   */
  prependTo(element: HTMLDivElement): Component {
    this._container.remove();
    element.prepend(this._container);
    this._host = element;
    return this;
  }

  /**
   * Remove the component container.
   * @returns The component.
   */
  remove(): Component {
    this._root.unmount();
    this._container.remove();
    this._host = null;
    return this;
  }

  /**
   * Render the component node into the root attached to the container.
   */
  render(): void {
    this._root.render(this._node);
  }

  /**
   * Unmount the component node from the root.
   */
  unmount(): void {
    this._root.unmount();
  }
}
