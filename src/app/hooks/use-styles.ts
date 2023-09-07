import { useEffect, useRef } from 'react';

import { toKebabCase } from 'src/shared/helpers';

/* CSS string style declaration */
type CSSStringStyleDeclaration = {
  [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[K] extends string ? K : never]: string;
};

/**
 * Use styles.
 * The custom matchroom React hook function that deals with HTML element styles.
 *
 * @param container The HTML element container.
 * @param styles The styles to apply to the HTML element container.
 */
export const useStyles = (
  container: HTMLElement,
  styles: Partial<CSSStringStyleDeclaration>,
): void => {
  const original = useRef<Partial<CSSStringStyleDeclaration>>({});
  if (Object.keys(original.current).length === 0) {
    Object.entries(styles).forEach(([key, _]) => {
      const prop = key as keyof CSSStringStyleDeclaration;
      original.current[prop] = container.style[prop];
    });
  }

  /**
   * Effect to apply the styles to the HTML element container.
   * It returns also a cleanup function to remove the styles when the component unmounts or the
   * dependencies change.
   */
  useEffect(() => {
    Object.entries(styles).forEach(([key, value]) => {
      container.style.setProperty(toKebabCase(key), value ?? null);
    });
    return () => {
      Object.entries(original.current).forEach(([key, value]) => {
        container.style.setProperty(toKebabCase(key), value ?? null);
      });
    };
  }, [container, styles]);
};

export default useStyles;
