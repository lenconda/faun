/**
 * @file random.js
 */

/**
 * generate a random string
 * @returns {string}
 */
const generateRandomString = (() => {
  const cache = {};

  return () => {
    const randomString = Math.random().toString(36).slice(-9, -1);
    if (!cache[randomString] && /^[a-z]/.test(randomString)) {
      cache[randomString] = 1;
      return randomString;
    } else {
      return generateRandomString();
    }
  };
})();

export default generateRandomString;
