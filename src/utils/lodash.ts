/**
 * @file /src/utils/lodash.ts
 * @author lenconda<i@lenconda.top>
 */

import findLastIndex from 'lodash/findLastIndex';

export { findLastIndex };

/**
 * check if param is a function
 * @param {*} functionToCheck
 * @returns {boolean}
 */
export const isFunction = (functionToCheck: any) => {
  return Object.prototype.toString.call(functionToCheck) === '[object Function]';
};

/**
 * deep clone an object
 * @param {Object} target
 * @param {string} hash
 * @returns {RegExp|V|Date|*}
 */
export const cloneDeep = (target, hash = new WeakMap()) => {
  if (target === null ) return target;
  if (typeof target !== 'object') return target;
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  let value = hash.get(target);
  if (value) {
    return value;
  }

  let cloneObj = new target.constructor;

  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      cloneObj[key] = cloneDeep(target[key], hash);
      hash.set(target, cloneObj);
    }
  }

  return cloneObj;
};

export const noop: (...args: any[]) => void = () => {};
