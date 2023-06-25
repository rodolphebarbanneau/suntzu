import type { ReactNode } from 'react';
import type { Root, RootOptions } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { EXTENSION_NAME } from '../settings';

/**
 * A component.
 * It is a general abstraction for creating and handling the extension injected react components
 * into the document. Each component is attached to a container element in the document.
 */
export class Component {
  /* The component id. */
  private readonly _id: string

  /* The component name. */
  private readonly _name: string

  /* The component container. */
  private readonly _container: HTMLDivElement;

  /* The component root. */
  private readonly _root: Root;

  /**
   * Create a component.
   * @param name - The extension component name.
   * @param options - The extension component root options (optional).
   */
  constructor(name: string, options?: RootOptions) {
    // initialize id (random string)
    this._id =(
      Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15)
    );
    // initialize name (extension name + component name)
    this._name = `${EXTENSION_NAME.toLowerCase().trim().replace(/\s+/g, '-')}-${name}`;
    // initialize container and root
    this._container = document.createElement('div');
    this._container.setAttribute('id', this._id);
    this._container.setAttribute('name', this._name);
    this._root = createRoot(this._container, options);
  }

  /* Get the component id. */
  get id(): string {
    return this._id;
  }

  /* Get the component name. */
  get name(): string {
    return this._name;
  }

  /* Get the component container. */
  get container(): HTMLDivElement {
    return this._container;
  }

  /* Get the component root. */
  get root(): Root {
    return this._root;
  }

  /**
   * Append the component.
   * @param element - The element to append the component to.
   * @returns The component.
   */
  appendTo(element: HTMLDivElement): Component {
    element.append(this._container);
    return this;
  }

  /**
   * Prepend the component.
   * @param element - The element to prepend the component to.
   * @returns The component.
   */
  prependTo(element: HTMLDivElement): Component {
    element.prepend(this._container);
    return this;
  }

  /**
   * Mount the component.
   * @param children - The component react children.
   * @returns The component.
   */
  render(children: ReactNode): Component {
    this._root.render(children);
    return this;
  }

  /**
   * Unmount the component.
   * @returns The component.
   */
  unmount(): Component {
    this._root.unmount();
    return this;
  }
}

/**
 * Create a component.
 * @param name - The extension component name.
 * @param options - The extension component root options (optional).
 * @returns The created extension component.
 */
export function createComponent(
  name: string,
  options?: RootOptions,
): Component {
  return new Component(name, options);
}
