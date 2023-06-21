import { EXTENSION_NAME } from '../settings';

/**
 * Get the document root container.
 * @returns The document root container.
 */
export function getRoot(): HTMLDivElement | null {
  return document.querySelector('div#main-content');
}

/**
 * Check if the document root container exists.
 * @returns True if the document root container exists, false otherwise.
 */
export function hasRoot(): boolean {
  return !!getRoot();
}

/**
 * Check if the target container has an extension element.
 * @param target - The target to check.
 * @param name - The extension element name to check for (optional).
 * @returns True if target contains an extension element, false otherwise.
 */
export function hasExtension(
  target: Element = document.body,
  name = '',
): boolean {
  return !!target?.querySelector(`[id^="${EXTENSION_NAME}${name ? `-${name}` : ''}"]`);
}
