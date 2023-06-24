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

/**
 * Build a color scale function.
 *
 * It generates a function that maps a numerical value to a HSL color string. The color ranges are
 * determined by the hue values provided in the range object, divided into `buckets` based on the
 * provided thresholds. Each bucket represents a segment of the overall range,  and each has a
 * unique hue associated with it. The number of buckets equals to the length of the thresholds array
 * plus one.
 *
 * @param thresholds - An array of numbers representing thresholds for different color ranges. The
 * elements of this array must be in ascending order.
 * @param range - An object specifying the range of hues, saturation, and lightness for the color
 * scale. All values should fall within their corresponding valid ranges (hue: 0-360, saturation and
 * lightness: 0-100). If not provided, the default values are used.
 * @returns A function that takes a number as an argument and returns a HSL color string. The color
 * corresponds to the `bucket` in which the number falls, according to the thresholds.
 */
export function getColorScale(
  thresholds: number[] = [0],
  range?: {
    hue?: [number, number];
    saturation?: number;
    lightness?: number;
}): (value: number) => string {
  // check thresholds ordering
  thresholds.reduce((prev, curr) => {
    if (curr <= prev) {
      throw new Error('Threshold elements must be ordered ascendingely.');
    }
    return curr;
  });

  // retrieve color range
  const hue = range?.hue || [0, 120];
  const saturation = range?.saturation || 15;
  const lightness = range?.lightness || 15;
  // check color range
  if (hue[0] < 0 || hue[0] > 360 || hue[1] < 0 || hue[1] > 360) {
    throw new Error('Hue values must be between 0 and 360.');
  }
  if (saturation < 0 || saturation > 100) {
    throw new Error('Saturation must be between 0 and 100.');
  }
  if (lightness < 0 || lightness > 100) {
    throw new Error('Lightness must be between 0 and 100.');
  }

  // compute scale and bucket
  const scale = ((hue[1] + 360) - hue[0]) % 360;
  const bucket = scale / thresholds.length;
  // return color scale function
  return (value: number) => {
    // lookup buckets
    let i = 0;
    while (i < thresholds.length && value > thresholds[i]) {
      i += 1;
    }
    // return hsl color with commputed hue
    return `hsl(${(hue[0] + bucket * i) % 360},${saturation}%,${lightness}%)`;
  };
}
