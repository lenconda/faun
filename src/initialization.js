import createElement from './utils/create-element';
import Sandbox from './sandbox';
import { isFunction } from 'lodash';

export const initMountPoint = function(mountPointID) {
  if (!mountPointID) return;

  const mountPointElement = createElement('div', { id: mountPointID });

  if (!document.getElementById(mountPointID)) {
    document.body.appendChild(mountPointElement);
  }
};

export const initSandbox = function() {
  if (!this.defaultSandbox) {
    this.defaultSandbox = new Sandbox('default');
  }

  this.defaultSandbox.takeDOMSnapshot();
  this.defaultSandbox.takeWindowSnapshot();
};


export const initRoute = function(location, callback) {
  const currentPathnameArray = location.pathname.split('/');
  currentPathnameArray.shift();
  const pathname = `/${currentPathnameArray[0]}`;

  callback && isFunction(callback) && callback(location, pathname);
};
