/**
 * @file store.js
 * @author lenconda<i@lenconda.top>
 */

import cloneDeep from 'lodash/cloneDeep';

/**
 * simple key-value storage model
 * @class
 * @constructor
 */
function Store() {
  const store = {};

  /**
   * assign a new store
   * @param {Object} newStore
   */
  this.set = function(newStore) {
    if (!store || typeof store !== 'object') {
      return;
    }

    Object.assign(store, cloneDeep(newStore));
  };

  /**
   * get the whole store
   * @returns {Object} store
   */
  this.get = function() {
    return cloneDeep(store);
  };

  /**
   * save a key-value pair to store
   * @param {string} key
   * @param {*} value
   */
  this.setItem = function(key, value) {
    if (!key || !value) {
      return;
    }

    Object.assign(store, { [key]: value });
  };

  /**
   * get a key of value from store
   * @param {string} key
   */
  this.getItem = function(key) {
    return store[key] || undefined;
  };
}

export default Store;
