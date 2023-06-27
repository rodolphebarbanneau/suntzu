import { EXTENSION_NAME } from '../settings';

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
