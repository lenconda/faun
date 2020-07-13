/**
 * @file global-namespace.js
 * @author lenconda<i@lenconda.top>
 */

const NAMESPACE = 'POLYATOMIC';

/**
 * set a global object with namespace
 * @param {string} key
 * @param {*} value
 */
export const setGlobalObject = (key, value) => {
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
export const getGlobalObject = key => {
  const destruction = window[NAMESPACE];
  return destruction && destruction[key] ? destruction[key] : null;
};
