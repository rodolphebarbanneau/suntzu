import { EXTENSION_NAME } from '../consts';

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
 * Check if element has an extension feature.
 * @param element - The element to check.
 * @param feature - The extension feature to check (optional).
 * @returns True if element has an extension feature, false otherwise.
 */
export function hasExtension(
  target: Element = document.body,
  feature = '',
): boolean {
  return !!target?.querySelector(`[id^="${EXTENSION_NAME}${feature ? `-${feature}` : ''}"]`);
}
