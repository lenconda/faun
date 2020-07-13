/**
 * @file store.js
 * @author lenconda<i@lenconda.top>
 */

import isObject from 'lodash/isObject';
import Event from './event';

/**
 * simple key-value storage model
 * @class
 * @constructor
 */
function Store() {
  const store = {};
  const storeEvent = new Event();

  /**
   * assign a new store
   * @param {string|Object} key
   * @param {*} value
   */
  this.set = function(key, value) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      return console.error('[Destruction] Param `key` must be a string or an object');
    }

    if (isObject(key)) {
      Object.keys(key).forEach(k => {
        const currentValue = key[k];

        if (!currentValue) {
          return console.error('[Destruction] Param `value` is required');
        }

        Object.assign(store, { [k]: currentValue });
        storeEvent.emit(k, currentValue);
      });
    } else if (typeof key === 'string') {
      if (!value) {
        return console.error('[Destruction] Param `value` is required');
      }
      Object.assign(store, { [key]: value });
      storeEvent.emit(key, value);
    }
  };

  /**
   * get a key of value from store
   * @param {string} key
   */
  this.get = function(key) {
    return store[key] || undefined;
  };


  /**
   * register a store event handler
   * @param {string} key
   * @param {function} callback
   * @returns {*}
   */
  this.on = storeEvent.on;
}

export default Store;
