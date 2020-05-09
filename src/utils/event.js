import { isFunction } from 'lodash';

function Event() {
  const subscribers = {};

  this.emit = function(key, data) {
    const currentSubscribers = subscribers[key];
    if (!Array.isArray(currentSubscribers)) {
      return;
    }

    currentSubscribers.forEach(callback => isFunction(callback) && callback(data));
  };

  this.on = function(key, callback) {
    if (!Array.isArray(subscribers[key])) {
      subscribers[key] = [];
    }

    isFunction(callback) && subscribers[key].push(callback);
    return callback;
  };

  this.off = function(key, callback) {
    if (!Array.isArray(subscribers[key]) || !callback) {
      return;
    }

    subscribers[key] = subscribers[key].filter(currentCallback => currentCallback !== callback);
  };

  this.has = function(key) {
    const currentSubscribers = subscribers[key];
    return Array.isArray(currentSubscribers) && currentSubscribers.length > 0;
  };
}

export default Event;
