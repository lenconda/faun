/**
 * @file initialization.js
 * @author lenconda<i@lenconda.top>
 */

import Sandbox from './sandbox';
import { isFunction } from './utils/lodash';

/**
 * initialize the default sandbox on context
 */
export const initSandbox = function() {
  if (!this.sandboxes[0]) {
    this.sandboxes.push(new Sandbox('@@default'));
  }
  const defaultSandbox = this.sandboxes[0];
  defaultSandbox.takeWindowSnapshot();
};

/**
 * initialize the route
 * @param {History<LocationState>} location
 * @param callback
 */
export const initRoute = function(location, callback) {
  const currentPathnameArray = location.pathname.split('/');
  currentPathnameArray.shift();
  const pathname = `/${currentPathnameArray[0]}`;

  callback && isFunction(callback) && callback(location, pathname);
};

/**
 * initialize the global dependencies
 * @param {object[]} deps
 */
export const initGlobalDependencies = function(deps) {
  if (!Array.isArray) {
    throw new TypeError('[Faun] Param `deps` should be an array');
  }

  const globalDeps = deps.reduce((current, next) => {
    const { name, dep } = next;

    if (!name || !dep || typeof name !== 'string') {
      throw new TypeError('[Faun] Params is in a wrong type');
    }

    if (window[name]) {
      throw new ReferenceError(`[Faun] Dependence \`${name}\` already exist on \`window\``);
    }

    current[name] = dep;

    return current;
  }, {});

  Object.assign(window, globalDeps);
  return globalDeps;
};
