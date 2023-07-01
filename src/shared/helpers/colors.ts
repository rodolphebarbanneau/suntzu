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
    saturation?: [number, number];
    lightness?: [number, number];
}): (value: number) => string {
  // check thresholds ordering
  thresholds.reduce((prev, curr) => {
    if (curr <= prev) {
      throw new Error('Threshold elements must be ordered ascendingely');
    }
    return curr;
  });

  // retrieve color range
  const hue = range?.hue || [0, 120];
  const saturation = range?.saturation || [15, 15];
  const lightness = range?.lightness || [15, 15];
  // check color range
  if (hue.some((h) => h < 0 || h > 360)) {
    throw new Error('Hue values must be between 0 and 360');
  }
  if (saturation.some((s) => s < 0 || s > 100)) {
    throw new Error('Saturation must be between 0 and 100');
  }
  if (lightness.some((l) => l < 0 || l > 100)) {
    throw new Error('Lightness must be between 0 and 100');
  }

  // compute gradient
  const gradient = {
    h: (((hue[1] + 360) - hue[0]) % 360) / thresholds.length,
    s: (saturation[1] - saturation[0]) / thresholds.length,
    l: (lightness[1] - lightness[0]) / thresholds.length,
  }

  // return color scale function
  return (value: number) => {
    // lookup gradient steps
    let i = 0;
    while (i < thresholds.length && value > thresholds[i]) {
      i += 1;
    }
    // compute hsl color
    const hsl = {
      h: (hue[0] + gradient.h * i) % 360,
      s: saturation[0] + gradient.s * i,
      l: lightness[0] + gradient.l * i,
    }
    // return hsl color with commputed hue
    return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
  };
}
