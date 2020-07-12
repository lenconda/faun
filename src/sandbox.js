/**
 * @file sandbox.js
 * @author lenconda<i@lenconda.top>
 */

import traverseProps from '../src/utils/traverse-props';
import fetch from './fetch';
import { isFunction } from './utils/lodash';
import overwriteEventListeners from './overwrites/window-listeners';
import createElement from './utils/create-element';
import cssPrefix from './utils/css';
import random from './utils/random';

/**
 * sandbox constructor
 * @class
 * @param name
 * @constructor
 */
function Sandbox(name) {
  this.domSnapshot = [];
  this.mountPoint = null;
  this.mountPointID = '';
  this.windowSnapshot = {};
  this._modifyPropsMap = {};
  this.proxy = window;
  this.name = name || '';
  this.prefix = random();
  this.running = false;
  this.bundles = [];
  this.css = [];
  this.bundleExecutors = [];
  this.styleElements = [];
  this.disableRewriteEventListeners = null;
  this.rootElement = document.getElementsByTagName('html')[0];
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
 * create sandbox when passing a sub-application config
 * @public
 * @param {ISubApplicationConfig} subApplicationConfig
 * @param {string} key
 * @returns {Promise<void>}
 */
Sandbox.prototype.create = async function(subApplicationConfig) {
  const { mountPointID } = subApplicationConfig;
  if (!subApplicationConfig || !mountPointID || typeof mountPointID !== 'string') {
    return;
  }

  this.mountPointID = mountPointID;
  this.mountPoint = createElement('div', { id: this.mountPointID });

  if (subApplicationConfig.scripts && subApplicationConfig.scripts.length) {
    for (const bundleURL of subApplicationConfig.scripts) {
      this.bundles.push(bundleURL);
      // make an ajax to load the sub-application bundles
      const data = await fetch(bundleURL);
      if (data) {
        // wrap bundle code into a function
        // when mount method called, execute the functions
        this.bundleExecutors.push(new Function(data));
      }
    }
  }

  if (subApplicationConfig.styles && subApplicationConfig.styles.length) {
    for (const stylesURL of subApplicationConfig.styles) {
      this.css.push(stylesURL);
      // make an ajax to load styles
      const data = await fetch(stylesURL);
      if (data) {
        const prefixedData = cssPrefix(data, this.prefix);
        const currentStyleElement = createElement('style', { type: 'text/css' });
        currentStyleElement.innerHTML = prefixedData;
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
  this.rootElement.classList = [...this.rootElement.classList, this.prefix].join(' ');
  this.disableRewriteEventListeners = overwriteEventListeners();

  const checkExistElement = document.getElementById(this.mountPointID);
  if (checkExistElement) {
    checkExistElement.remove();
  }
  document.body.appendChild(Array.prototype.slice.call([this.mountPoint])[0]);

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
  const currentMountPointElement = document.getElementById(this.mountPointID);
  currentMountPointElement && currentMountPointElement.remove();
  this.rootElement.classList = Array.from(this.rootElement).filter(item => item !== this.prefix).join(' ');

  this.takeWindowSnapshot();
  this.disableRewriteEventListeners && this.disableRewriteEventListeners();
  document.head.childNodes.forEach(childNode => childNode.remove());
};

export default Sandbox;
