import traverseProps from '../src/utils/traverse-props';
import axios from 'axios';
import { isFunction } from 'lodash';
import overwriteEventListeners from './overwrites/window-listeners';
import createElement from './utils/create-element';

function Sandbox(name) {
  this.domSnapshot = '';
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

Sandbox.prototype.takeDOMSnapshot = function() {
  this.domSnapshot = document.head.innerHTML;
};

Sandbox.prototype.restoreDOMSnapshot = function() {
  document.head.innerHTML = this.domSnapshot;
};

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

Sandbox.prototype.create = async function(module) {
  if (!module) {
    return;
  }

  if (module.scripts) {
    for (const bundleURL of module.scripts) {
      this.bundles.push(bundleURL);
      const { data } = await axios.get(bundleURL);
      if (data) {
        this.bundleExecutors.push(new Function(data));
      }
    }
  }

  if (module.styles) {
    for (const stylesURL of module.styles) {
      this.css.push(stylesURL);
      const { data } = await axios.get(stylesURL);
      if (data) {
        const currentStyleElement = createElement('style', { type: 'text/css' });
        currentStyleElement.innerHTML = data;
        this.styleElements.push(currentStyleElement);
      }
    }
  }
};

Sandbox.prototype.mount = function() {
  this.disableRewriteEventListeners = overwriteEventListeners();

  if (this.styleElements && Array.isArray(this.styleElements) && this.domSnapshot.length === 0) {
    this.styleElements.forEach(element => document.head.appendChild(element));
  }

  this.bundleExecutors && this.bundleExecutors.forEach(executor => {
    if (isFunction(executor)) {
      executor.call();
    }
  });

  !!this.windowSnapshot.length && this.restoreWindowSnapshot();
  !!this.domSnapshot.length && this.restoreDOMSnapshot();
};

Sandbox.prototype.unmount = function() {
  this.takeDOMSnapshot();
  this.takeWindowSnapshot();
  this.disableRewriteEventListeners && this.disableRewriteEventListeners();
};

export default Sandbox;
