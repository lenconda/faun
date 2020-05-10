/**
 * @file initialization.js
 * @author lenconda<i@lenconda.top>
 */

import createElement from './utils/create-element';
import Sandbox from './sandbox';
import { isFunction } from './utils/lodash';

/**
 * initialize the mount point element
 * @param {string} mountPointID
 */
export const initMountPoint = function(mountPointID) {
  if (!mountPointID) return;

  // if there is not mount point element, create it
  if (!document.getElementById(mountPointID)) {
    const mountPointElement = createElement('div', { id: mountPointID });
    document.body.appendChild(mountPointElement);
  }
};

/**
 * initialize the default sandbox on context
 */
export const initSandbox = function() {
  if (!this.defaultSandbox) {
    this.defaultSandbox = new Sandbox('default');
  }

  this.defaultSandbox.takeDOMSnapshot();
  this.defaultSandbox.takeWindowSnapshot();
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
