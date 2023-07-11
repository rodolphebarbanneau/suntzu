import { useEffect } from 'react';

/**
 * Use styles.
 * The custom matchroom React hook function that deals with HTML element styles.
 *
 * @param container The HTML element container.
 * @param styles The styles to apply to the HTML element container.
 */
export const useStyles = (
  container: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
): void => {
  const original: CSSStyleDeclaration = {...container.style};
  useEffect(() => {
    Object.entries(styles).forEach(([key, value]) => {
      (container.style as any)[key] = value;
    });
    return () => {
      Object.entries(original).forEach(([key, value]) => {
        (container.style as any)[key] = value;
      });
    }
  }, [container, styles]);
};

export default useStyles;
