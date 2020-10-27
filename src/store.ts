/**
 * @file /src/store.ts
 * @author lenconda<i@lenconda.top>
 */

import Event from './event';
import {
  StoreStateType,
  FaunErrorHandlerType,
} from './interfaces';
import {
  FaunStoreError,
} from './errors';
import {
  generateErrorHandler,
} from './utils/error';

/**
 * simple key-value storage model
 * @class
 * @constructor
 */
class Store {
  /**
   * register a store event handler
   * @param {string} key
   * @param {function} callback
   * @returns {*}
   */
  public on: Function;
  private store: StoreStateType;
  private storeEvent: Event;
  private errorHandler: FaunErrorHandlerType;

  constructor(errorHandler?: FaunErrorHandlerType) {
    this.store = {};
    this.storeEvent = new Event();
    this.on = this.storeEvent.on;
    this.errorHandler = generateErrorHandler(errorHandler);
  }

  /**
   * assign a new store
   * @param {string|Object} key
   * @param {*} value
   */
  public set(key: Record<string, any> | string, value: any) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      const errorMessage = 'Param `key` must be a string or an object';
      const error = new FaunStoreError(errorMessage);
      this.errorHandler(error);
    }

    if (typeof key === 'string') {
      if (!value) {
        const errorMessage = 'Param `value` is required';
        const error = new FaunStoreError(errorMessage);
        this.errorHandler(error);
      }
      Object.assign(this.store, { [key]: value });
      this.storeEvent.emit(key, value);
    } else {
      Object.keys(key).forEach(k => {
        const currentValue = key[k];

        if (!currentValue) {
          const errorMessage = 'Param `value` is required';
          const error = new FaunStoreError(errorMessage);
          this.errorHandler(error);
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
}

export default Store;
