/**
 * @file /src/utils/global-namespace.ts
 * @author lenconda<i@lenconda.top>
 */

const NAMESPACE = '__FAUN__';

/**
 * set a global object with namespace
 * @param {string} key
 * @param {*} value
 */
export const setGlobalObject = <T>(key: string, value: T) => {
  if (!window[NAMESPACE]) {
    window[NAMESPACE] = {};
  }

  window[NAMESPACE][key] = value;
};

/**
 * get a global object with namespace
 * @param key
 * @returns {*}
 */
export const getGlobalObject = (key: string) => {
  const faun = window[NAMESPACE];
  return faun && faun[key] ? faun[key] : null;
};
