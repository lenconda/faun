import traverseProps from '../src/utils/traverse-props';
import axios from 'axios';
import { appendCssLinks } from './flow';
import { isFunction } from 'lodash';
import overwriteEventListeners from './overwrites/window-listeners';

function Sandbox(name) {
  this.domSnapshot = [];
  this.windowSnapshot = {};
  this._modifyPropsMap = {};
  this.proxy = window;
  this.name = name || '';
  this.running = false;
  this.bundles = [];
  this.css = [];
  this.executors = [];
  this.disableRewriteEventListeners = null;
}

Sandbox.prototype.takeDOMSnapshot = function() {
  const _this = this;
  document.documentElement.childNodes.forEach(element => _this.domSnapshot.push(element));
};

Sandbox.prototype.restoreDOMSnapshot = function() {
  document.documentElement.remove();
  document.appendChild(document.createElement('html'));
  this.domSnapshot.forEach(element => document.documentElement.appendChild(element));
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
        this.executors.push(new Function(data));
      }
    }
  }

  module.styles && module.styles.forEach(href => this.css.push(href));
};

Sandbox.prototype.mount = function() {
  this.disableRewriteEventListeners = overwriteEventListeners();

  this.css && Array.isArray(this.css) && appendCssLinks(this.css, document.head);

  this.executors && this.executors.forEach(exector => {
    if (isFunction(exector)) {
      exector.call();
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
