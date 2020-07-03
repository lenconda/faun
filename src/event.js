/**
 * @file event.js
 * @author lenconda<i@lenconda.top>
 */

import { isFunction } from './utils/lodash';

/**
 * an event emitter based on publisher-subscriber pattern
 * @class
 * @constructor
 */
function Event() {
  const subscribers = {};

  /**
   * emit an event
   * @param {string} key
   * @param {*} data
   */
  this.emit = function(key, data) {
    const currentSubscribers = subscribers[key];
    if (!Array.isArray(currentSubscribers)) {
      return;
    }

    currentSubscribers.forEach(callback => isFunction(callback) && callback(data));
  };

  /**
   * register an event handler
   * @param {string} key
   * @param {function} callback
   * @returns {*}
   */
  this.on = function(key, callback) {
    if (!Array.isArray(subscribers[key])) {
      subscribers[key] = [];
    }

    isFunction(callback) && subscribers[key].push(callback);
    return callback;
  };

  /**
   * detach an event handler
   * @param {string} key
   * @param {function} callback
   */
  this.off = function(key, callback) {
    if (!Array.isArray(subscribers[key]) || !callback) {
      return;
    }

    subscribers[key] = subscribers[key].filter(currentCallback => currentCallback !== callback);
  };

  /**
   * check if there is the same handler in subscribers
   * @param {string} key
   * @returns {boolean}
   */
  this.has = function(key, callback) {
    const currentSubscribers = subscribers[key];
    if (callback) {
      return Array.isArray(currentSubscribers) && currentSubscribers.includes(callback);
    }
    return Array.isArray(currentSubscribers) && currentSubscribers.length > 0;
  };
}

export default Event;

