/**
 * Sleeps for n number of seconds. Essentially a setTimeout wrapper
 *
 * @param {number} sec - Time in seconds
 * @returns {Promise}
 */
export async function sleep(sec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, sec * 1000);
  });
}

/**
 * Escapes regex special characters in a string
 *
 * @param {string} string String to process
 * @returns {string} New string with escaped characters
 *
 * @see https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
 */
export function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Generates a random number between 0 and the "max" number specified
 *
 * @param {int} max - The upper bound of the range required
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}