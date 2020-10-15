/**
 * @file random.js
 */

/**
 * generate a random string
 * @returns {string}
 */
const generateRandomString = (() => {
  const cache: { [key: string]: number } = {};

  return () => {
    const randomString = (Math.random() / Date.now()).toString(36).slice(-9, -1);
    if (!cache[randomString] && /^[a-zA-Z]/.test(randomString)) {
      cache[randomString] = 1;
      return randomString;
    } else {
      return generateRandomString();
    }
  };
})();

export default generateRandomString;
