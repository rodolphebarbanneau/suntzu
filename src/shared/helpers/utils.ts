import { EXTENSION_NAME } from '../settings';

/**
 * Get the document main content container.
 * @returns The document main content container.
 */
export function getMainContent(): HTMLDivElement | null {
  return document.querySelector('div#main-content');
}

/**
 * Check if the document main content container exists.
 * @returns True if the document main content container exists, false otherwise.
 */
export function hasMainContent(): boolean {
  return !!getMainContent();
}

/**
 * Check if a document element contains an extension child element.
 * @param element - The document element.
 * @param name - The extension element name to look for (optional).
 * @returns True if document element contains an extension child element, false otherwise.
 */
export function hasExtension(
  element: Element = document.body,
  name?: string,
): boolean {
  return !!element?.querySelector(`[name^="${EXTENSION_NAME}${name ? `-${name}` : ''}"]`);
}
