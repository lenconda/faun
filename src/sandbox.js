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
import PolyfilledMutationObserver from 'mutation-observer';
import childNodeOperator from './overwrites/child-operate';

/**
 * restore snapshot to document.head
 * @param {ISandboxProps} props
 */
const restoreDOMSnapshot = function(props) {
  props.domSnapshot.forEach(node => node && node.remove());
  props.styleElements.forEach(element => element && element.remove());
};

/**
 * take window snapshot based on diff
 * @param {ISandboxProps} props
 */
const takeWindowSnapshot = function(props) {
  props.windowSnapshot = {};

  traverseProps(window, prop => {
    props.windowSnapshot[prop] = window[prop];
  });

  Object.keys(props.modifiedPropsMap).forEach(prop => {
    if (Object.getOwnPropertyDescriptor(window, prop).writable) {
      window[prop] = props.modifiedPropsMap[prop];
    }
  });
};

/**
 * restore window snapshot to window
 * @param {ISandboxProps} props
 */
const restoreWindowSnapshot = function(props) {
  props.modifiedPropsMap = {};

  traverseProps(window, prop => {
    if (
      window[prop] !== props.windowSnapshot[prop]
      && Object.getOwnPropertyDescriptor(window, prop).writable
    ) {
      props.modifiedPropsMap[prop] = window[prop];
      window[prop] = props.windowSnapshot[prop];
    }
  });
};

/**
 * create sandbox when passing a sub-application config
 * @param {ISubApplicationConfig} subApplicationConfig
 * @param {ISandboxProps} props
 * @returns {Promise<void>}
 */
const create = async function(subApplicationConfig, props) {
  const {
    mountPointID,
    assetURLMapper = null,
    prefixElementSelector = null,
  } = subApplicationConfig;
  if (!subApplicationConfig || !mountPointID || typeof mountPointID !== 'string') {
    return;
  }

  if (prefixElementSelector && typeof prefixElementSelector === 'function') {
    this.prefixElementSelector = prefixElementSelector;
  }

  if (assetURLMapper && typeof assetURLMapper === 'function') {
    this.assetURLMapper = assetURLMapper;
  }

  this.mountPointID = mountPointID;
  props.mountPointElement = createElement('div', { id: this.mountPointID });

  if (subApplicationConfig.scripts && subApplicationConfig.scripts.length) {
    for (const bundleURL of subApplicationConfig.scripts) {
      this.bundles.push(bundleURL);
      // make an ajax to load the sub-application bundles
      const data = await fetch(bundleURL);
      if (data) {
        // wrap bundle code into a function
        // when mount method called, execute the functions
        props.bundleExecutors.push(new Function(data));
      }
    }
  }

  if (subApplicationConfig.styles && subApplicationConfig.styles.length) {
    for (const stylesURL of subApplicationConfig.styles) {
      this.css.push(stylesURL);
      // make an ajax to load styles
      const data = await fetch(stylesURL);
      if (data) {
        const styleData = this.useCSSPrefix ? cssPrefix(data, props.prefix) : data;
        const currentStyleElement = createElement('style', { type: 'text/css' });
        currentStyleElement.innerHTML = styleData;
        props.styleElements.push(currentStyleElement);
      }
    }
  }
};

/**
 * mount the sandbox
 * @param {ISandboxProps} props
 */
const mount = function(props) {
  const _this = this;

  props.childNodeOperator.intercept(function(element) {
    const nodeName = element.nodeName && element.nodeName.toLowerCase() || '';
    switch(nodeName) {
    case 'script': {
      const src = element.getAttribute('src');
      if (src) {
        element.setAttribute('src', _this.assetURLMapper(src));
      }
      break;
    }
    case 'link': {
      const href = element.getAttribute('href');
      const rel = element.getAttribute('rel');
      if (href && rel === 'stylesheet') {
        element.setAttribute('href', _this.assetURLMapper(href));
      }
      break;
    }
    default:
      break;
    }
    return element;
  });

  props.observer && props.observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  props.disableRewriteEventListeners = overwriteEventListeners();

  const checkExistElement = document.getElementById(this.mountPointID);

  if (checkExistElement) {
    checkExistElement.remove();
  }

  document.body.appendChild(Array.prototype.slice.call([props.mountPointElement])[0]);

  const prefixElement = this.prefixElementSelector() || props.defaultPrefixElement;
  if (prefixElement && prefixElement instanceof Node && this.useCSSPrefix) {
    prefixElement.classList = [...prefixElement.classList, props.prefix].join(' ');
  }

  if (props.styleElements && Array.isArray(props.styleElements)) {
    props.styleElements.forEach(element => document.head.appendChild(element));
  }

  !!props.windowSnapshot.length && this.restoreWindowSnapshot();

  props.bundleExecutors && props.bundleExecutors.forEach(executor => {
    if (isFunction(executor)) {
      executor.call();
    }
  });
};

/**
 * unmount the sandbox
 * @param {ISandboxProps} props
 */
const unmount = function(props) {
  props.childNodeOperator.stop();
  const currentMountPointElement = document.getElementById(this.mountPointID);
  currentMountPointElement && currentMountPointElement.remove();
  const prefixElement = this.prefixElementSelector() || props.defaultPrefixElement;
  if (prefixElement && prefixElement instanceof Node && this.useCSSPrefix) {
    prefixElement.classList = Array.from(prefixElement.classList).filter(item => item !== props.prefix).join(' ');
  }
  this.takeWindowSnapshot();
  props.disableRewriteEventListeners && props.disableRewriteEventListeners();
  this.restoreDOMSnapshot();
  props.domSnapshot.splice(0, props.domSnapshot.length);
  props.observer && props.observer.disconnect && props.observer.disconnect();
};

/**
 * sandbox constructor
 * @class
 * @param {string} name
 * @param {boolean} useCSSPrefix
 * @constructor
 */
function Sandbox(name, useCSSPrefix = true) {
  const props = {
    domSnapshot: [],
    mountPointElement: null,
    windowSnapshot: {},
    prefix: random(),
    bundleExecutors: [],
    styleElements: [],
    disableRewriteEventListeners: null,
    modifiedPropsMap: {},
    observer: null,
    childNodeOperator: childNodeOperator(),
    defaultPrefixElement: document.documentElement,
  };

  this.mountPointID = '';
  this.name = name || '';
  this.bundles = [];
  this.css = [];
  this.useCSSPrefix = useCSSPrefix;
  this.assetURLMapper = url => url;
  this.prefixElementSelector = () => props.defaultPrefixElement;

  if (!props.observer) {
    props.observer = new PolyfilledMutationObserver(mutations => {
      mutations.forEach(mutation => {
        const currentAddedNodes = mutation.addedNodes;
        currentAddedNodes.forEach(node => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase() || '';
          if (node && /^style$|^script$|^link$/.test(nodeName)) {
            props.domSnapshot.push(node);

            if (nodeName === 'style' && this.useCSSPrefix) {
              node.innerHTML = cssPrefix(node.innerHTML, props.prefix);
            }
          }
        });
      });
    });
  }

  this.restoreDOMSnapshot = function() {
    restoreDOMSnapshot.call(this, props);
  };

  this.takeWindowSnapshot = function() {
    takeWindowSnapshot.call(this, props);
  };

  this.restoreWindowSnapshot = function() {
    restoreWindowSnapshot.call(this, props);
  };

  this.create = async function(subApplicationConfig) {
    await create.call(this, subApplicationConfig, props);
  };

  this.mount = function() {
    mount.call(this, props);
  };

  this.unmount = function() {
    unmount.call(this, props);
  };
}

export default Sandbox;
