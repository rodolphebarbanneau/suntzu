/**
 * Convert a string to `camelCase`.
 * @param str - The string to convert.
 * @returns The `camelCase` representation of the string.
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/-([a-z])/g, g => g[1].toUpperCase())
    .replace(/_([a-z])/g, g => g[1].toUpperCase())
    .replace(/ +/g, '')
    .replace(/^([A-Z])/, g => g.toLowerCase());
}

/**
 * Convert a string to `kebab-case`.
 * @param str - The string to convert.
 * @returns The `kebab-case` representation of the string.
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_+/g, '-')
    .replace(/ +/g, '-')
    .toLowerCase();
}

/**
 * Convert a string to `PascalCase`.
 * @param str - The string to convert.
 * @returns The `PascalCase` representation of the string.
 */
export function toPascalCase(str: string): string {
  return toCamelCase(str).replace(/^([a-z])/, g => g.toUpperCase());
}

/**
 * Convert a string to `snake_case`.
 * @param str - The string to convert.
 * @returns The `snake_case` representation of the string.
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-+/g, '_')
    .replace(/ +/g, '_')
    .toLowerCase();
}
