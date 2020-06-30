/**
 * @file sandbox.js
 * @author lenconda<i@lenconda.top>
 */

import traverseProps from '../src/utils/traverse-props';
import fetch from './fetch';
import { isFunction } from './utils/lodash';
import overwriteEventListeners from './overwrites/window-listeners';
import createElement from './utils/create-element';

/**
 * sandbox constructor
 * @class
 * @param name
 * @constructor
 */
function Sandbox(name) {
  this.domSnapshot = [];
  this.windowSnapshot = {};
  this._modifyPropsMap = {};
  this.proxy = window;
  this.name = name || '';
  this.running = false;
  this.bundles = [];
  this.css = [];
  this.bundleExecutors = [];
  this.styleElements = [];
  this.disableRewriteEventListeners = null;
}

/**
 * take a snapshot for document.head
 * @public
 */
Sandbox.prototype.takeDOMSnapshot = function() {
  this.domSnapshot = Array.prototype.slice.call(document.head.childNodes);
};

/**
 * restore snapshot to document.head
 * @public
 */
Sandbox.prototype.restoreDOMSnapshot = function() {
  document.head.childNodes.forEach(childNode => childNode.remove());
  this.domSnapshot.forEach(node => document.head.appendChild(node));
};

/**
 * take window snapshot based on diff
 * @public
 */
Sandbox.prototype.takeWindowSnapshot = function() {
  this.windowSnapshot = {};

  traverseProps(window, prop => {
    this.windowSnapshot[prop] = window[prop];
  });

  Object.keys(this._modifyPropsMap).forEach(prop => {
    if (Object.getOwnPropertyDescriptor(window, prop).writable) {
      window[prop] = this._modifyPropsMap[prop];
    }
  });

  this.running = true;
};

/**
 * restore window snapshot to window
 * @public
 */
Sandbox.prototype.restoreWindowSnapshot = function() {
  this._modifyPropsMap = {};

  traverseProps(window, prop => {
    if (
      window[prop] !== this.windowSnapshot[prop]
      && Object.getOwnPropertyDescriptor(window, prop).writable) {
      this._modifyPropsMap[prop] = window[prop];
      window[prop] = this.windowSnapshot[prop];
    }
  });

  this.running = false;
};

/**
 * create sandbox when passing a module config
 * @public
 * @param module
 * @returns {Promise<void>}
 */
Sandbox.prototype.create = async function(module) {
  if (!module) {
    return;
  }

  if (module.scripts) {
    for (const bundleURL of module.scripts) {
      this.bundles.push(bundleURL);
      // make an ajax to load the module bundles
      const data = await fetch(bundleURL);
      if (data) {
        // wrap bundle code into a function
        // when mount method called, execute the functions
        this.bundleExecutors.push(new Function(data));
      }
    }
  }

  if (module.styles) {
    for (const stylesURL of module.styles) {
      this.css.push(stylesURL);
      // make an ajax to load styles
      const data = await fetch(stylesURL);
      if (data) {
        const currentStyleElement = createElement('style', { type: 'text/css' });
        currentStyleElement.innerHTML = data;
        this.styleElements.push(currentStyleElement);
      }
    }
  }
};

/**
 * mount the sandbox
 * @public
 */
Sandbox.prototype.mount = function() {
  this.disableRewriteEventListeners = overwriteEventListeners();

  if (this.styleElements && Array.isArray(this.styleElements)) {
    this.styleElements.forEach(element => document.head.appendChild(element));
  }

  !!this.windowSnapshot.length && this.restoreWindowSnapshot();
  if (this.domSnapshot.length) {
    this.restoreDOMSnapshot();
  }

  this.takeDOMSnapshot();

  this.bundleExecutors && this.bundleExecutors.forEach(executor => {
    if (isFunction(executor)) {
      executor.call();
    }
  });
};

/**
 * unmount the sandbox
 * @public
 */
Sandbox.prototype.unmount = function() {
  this.takeWindowSnapshot();
  this.disableRewriteEventListeners && this.disableRewriteEventListeners();
  document.head.childNodes.forEach(childNode => childNode.remove());
};

export default Sandbox;
