/**
 * Get a cookie value given a cookie name.
 *
 * It works by matching the cookie name (with `=`) within the `document.cookie` string.
 *
 * @param name - The name of the cookie to retrieve.
 * @returns If the cookie with the provided name exists, it returns the value of the cookie.
 * If the cookie does not exist, it returns null.
 */
export function getCookie(name: string): string | null {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};
