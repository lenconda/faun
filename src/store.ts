/**
 * @file store.js
 * @author lenconda<i@lenconda.top>
 */

import Event from './event';
import {
  StoreStateType,
} from './interfaces';

/**
 * simple key-value storage model
 * @class
 * @constructor
 */
class Store {
  private store: StoreStateType = {};
  private storeEvent: Event = new Event();

  /**
   * assign a new store
   * @param {string|Object} key
   * @param {*} value
   */
  public set(key: Record<string, any> | string, value: any) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      return console.error('[Faun] Param `key` must be a string or an object');
    }

    if (typeof key === 'string') {
      if (!value) {
        return console.error('[Faun] Param `value` is required');
      }
      Object.assign(this.store, { [key]: value });
      this.storeEvent.emit(key, value);
    } else {
      Object.keys(key).forEach(k => {
        const currentValue = key[k];

        if (!currentValue) {
          return console.error('[Faun] Param `value` is required');
        }

        Object.assign(this.store, { [k]: currentValue });
        this.storeEvent.emit(k, currentValue);
      });
    }
  }

  /**
   * get a key of value from store
   * @param {string} key
   */
  public get(key: string) {
    return this.store[key] || undefined;
  }

  /**
   * register a store event handler
   * @param {string} key
   * @param {function} callback
   * @returns {*}
   */
  public on = this.storeEvent.on;
}

export default Store;
