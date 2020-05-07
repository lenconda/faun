import traverseProps from '../src/utils/traverse-props';
import axios from 'axios';
import { mountAssets } from './flow';
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
    window[prop] = this._modifyPropsMap[prop];
  });

  this.running = true;
};

Sandbox.prototype.restoreWindowSnapshot = function() {
  this._modifyPropsMap = {};

  traverseProps(window, prop => {
    if (window[prop] !== this.windowSnapshot[prop]) {
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
      const { data: bundle } = await axios.get(bundleURL);
      if (bundle) {
        this.executors.push(new Function(bundle));
      }
    }
  }

  module.styles && module.styles.forEach(href => this.css.push(href));
};

Sandbox.prototype.mount = function() {
  this.windowSnapshot && this.restoreWindowSnapshot();
  this.domSnapshot && this.restoreDOMSnapshot();

  this.disableRewriteEventListeners = overwriteEventListeners();

  this.css && mountAssets(this.css, document.head);
  this.executors && this.executors.forEach(exector => {
    if (isFunction(exector)) {
      exector.call();
    }
  });
};

Sandbox.prototype.unmount = function() {
  this.takeDOMSnapshot();
  this.takeWindowSnapshot();
  this.disableRewriteEventListeners && this.disableRewriteEventListeners();
};

export default Sandbox;
