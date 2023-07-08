/**
 * Convert a timestamp as a date string in the format `YYYY-MM-DD HH:MM:SS±HHMM`.
 * @param timestamp - The UNIX timestamp in seconds to convert.
 * @param encode - Whether to encode the date string (default: `true`).
 * @returns The timestamp as a date string.
 */
export function formatTimestamp(
  timestamp: number,
  encode = false,
) {
    // pad a number with a leading zero if it is less than 2 digits
  const padZero = (toBePadded: number) => {
    return toBePadded.toString().padStart(2, '0');
  };

  // format a timestamp as a date string
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const offsetHours = Math.floor(date.getTimezoneOffset() / 60);
  const offsetDirection = offsetHours < 0 ? '+' : '-';
  const offset = Math.abs(offsetHours)
    .toString()
    .padStart(2, '0')
    .padEnd(4, '0');

  // build the date string
  const datgeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    + `${offsetDirection}${offset}`;

  // encode the date string
  return encode ? encodeURIComponent(datgeString) : datgeString;
}

/**
 * Convert a date string in the format `YYYY-MM-DD HH:MM:SS±HHMM` to a timestamp.
 * @param dateString - The date string to convert.
 * @returns The date string as a timestamp.
 */
export function getTimestamp(dateString: string) {
  // decode the encoded date string
  const decodedDate = decodeURIComponent(dateString);
  // convert the date string to an ISO 8601 format
  const isoDateString = decodedDate.replace(/ /, 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  // create a date object from the ISO 8601 format
  const date = new Date(Date.parse(isoDateString));
  // get the timestamp and convert it to seconds from milliseconds
  const timestamp = Math.floor(date.getTime() / 1000);
  return timestamp;
}
