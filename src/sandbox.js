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
 * take DOM snapshot
 * @param {ISandboxProps} props
 */
const takeDOMSnapshot = function(props) {
  const _this = this;

  props.childNodeOperator.intercept(function(element) {
    const nodeName = element.nodeName && element.nodeName.toLowerCase() || '';
    const getAssetsPrefix = src => {
      const { assetPublicPath } = _this;
      return (isFunction(assetPublicPath) ? `${assetPublicPath(src)}${src}` : `${assetPublicPath}${src}`);
    };
    switch(nodeName) {
    case 'script': {
      const src = element.getAttribute('src');
      if (src) {
        element.setAttribute('src', getAssetsPrefix(src));
      }
      break;
    }
    case 'link': {
      const href = element.getAttribute('href');
      const rel = element.getAttribute('rel');
      if (href && rel === 'stylesheet') {
        element.setAttribute('href', getAssetsPrefix(href));
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
};

/**
 * restore snapshot from domSnapshot and styleElements
 * @param {ISandboxProps} props
 */
const restoreDOMSnapshot = function(props) {
  const _this = this;

  function remove(node) {
    if (node.remove && _this.preserveChunks !== true) {
      node && node.remove();
    }
  }

  props.domSnapshot.forEach(remove);
  props.styleElements.forEach(remove);
  props.observer && props.observer.disconnect && props.observer.disconnect();
  props.childNodeOperator.stop();
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
const create = async function(subApplicationConfig, props, appConfig) {
  const {
    container,
    assetPublicPath = '',
    preserveChunks,
    extra = {},
    useCSSPrefix,
    name = random(),
  } = subApplicationConfig;
  if (!subApplicationConfig || !container || typeof container !== 'string') {
    return;
  }

  props.name = name;
  props.singular = appConfig.singular || true;
  if (container instanceof HTMLElement) {
    this.container = container;
  } else if (typeof container === 'string') {
    this.container = createElement('div', { id: container });
  }
  this.container.remove();
  if (!document.getElementById(props.name)) {
    props.mountPointElement = createElement('div', {
      id: (useCSSPrefix || !props.singular) ? props.name : '',
    }, [this.container]);
  }

  if (preserveChunks === true) {
    this.preserveChunks = true;
  }

  if (assetPublicPath) {
    this.assetPublicPath = assetPublicPath;
  }

  const { entry = {} } = subApplicationConfig;
  if (entry.scripts && entry.scripts.length) {
    for (const bundle of entry.scripts) {
      let bundleURL;
      let executor;
      if (typeof bundle === 'string') {
        bundleURL = bundle;
      } else if (bundle.url && bundle.scriptExecutor) {
        bundleURL = bundle.url;
      }

      this.scripts.push(bundle);
      // make an ajax to load the sub-application bundles
      const data = await fetch(bundleURL);
      const defaultExecutor = new Function(data);

      if (bundle.scriptExecutor) {
        executor = bundle.scriptExecutor(data, defaultExecutor, extra);
      } else {
        executor = defaultExecutor;
      }

      if (data) {
        // wrap bundle code into a function
        // when mount method called, execute the functions
        props.scriptExecutors.push(executor);
      }
    }
  }

  if (entry.styles && entry.styles.length) {
    for (const stylesURL of entry.styles) {
      this.styles.push(stylesURL);
      // make an ajax to load styles
      const data = await fetch(stylesURL);
      if (data) {
        const styleData = (this.useCSSPrefix || !props.singular) ? cssPrefix(data, props.name) : data;
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
  this.takeDOMSnapshot();
  props.disableRewriteEventListeners = overwriteEventListeners();

  const checkExistElement = document.getElementById(this.container);

  if (checkExistElement) {
    checkExistElement.remove();
  }

  document.body.appendChild(Array.prototype.slice.call([props.mountPointElement])[0]);

  if (props.styleElements && Array.isArray(props.styleElements)) {
    props.styleElements.forEach(element => document.head.appendChild(element));
  }

  !!props.windowSnapshot.length && this.restoreWindowSnapshot();

  props.scriptExecutors && props.scriptExecutors.forEach(executor => {
    if (executor && isFunction(executor)) {
      (function(window) {
        executor.call();
      })(new Proxy(props.sandboxWindow, {
        get(obj, prop) {
          if (obj[prop]) {
            return Reflect.get(obj, prop);
          }
          if (window[prop]) {
            return Reflect.get(window, prop);
          }
          return null;
        },
        set(obj, prop, value) {
          Reflect.set(obj, prop, value);
        },
      }));
    }
  });
};

/**
 * unmount the sandbox
 * @param {ISandboxProps} props
 */
const unmount = function(props) {
  props.mountPointElement && props.mountPointElement.remove();
  this.takeWindowSnapshot();
  props.disableRewriteEventListeners && props.disableRewriteEventListeners();
  this.restoreDOMSnapshot();
  props.domSnapshot.splice(0, props.domSnapshot.length);
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
    name: '',
    domSnapshot: [],
    mountPointElement: null,
    windowSnapshot: {},
    scriptExecutors: [],
    singular: true,
    styleElements: [],
    disableRewriteEventListeners: null,
    modifiedPropsMap: {},
    observer: null,
    childNodeOperator: childNodeOperator(),
    sandboxWindow: {},
  };

  // this.container = '';
  this.name = name || '';
  this.scripts = [];
  this.styles = [];
  this.useCSSPrefix = useCSSPrefix;
  this.assetPublicPath = '';
  this.preserveChunks = false;

  if (!props.observer) {
    props.observer = new PolyfilledMutationObserver(mutations => {
      mutations.forEach(mutation => {
        const currentAddedNodes = mutation.addedNodes;
        currentAddedNodes.forEach(node => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase() || '';
          if (node && /^style$|^script$|^link$/.test(nodeName)) {
            props.domSnapshot.push(node);

            if (nodeName === 'style' && (this.useCSSPrefix || !props.singular)) {
              node.innerHTML = cssPrefix(node.innerHTML, props.name);
            }
          }
        });
      });
    });
  }

  this.takeDOMSnapshot = function() {
    takeDOMSnapshot.call(this, props);
  };

  this.restoreDOMSnapshot = function() {
    restoreDOMSnapshot.call(this, props);
  };

  this.takeWindowSnapshot = function() {
    takeWindowSnapshot.call(this, props);
  };

  this.restoreWindowSnapshot = function() {
    restoreWindowSnapshot.call(this, props);
  };

  this.create = async function(subApplicationConfig, appConfig) {
    await create.call(this, subApplicationConfig, props, appConfig);
  };

  this.mount = function() {
    mount.call(this, props);
  };

  this.unmount = function() {
    unmount.call(this, props);
  };
}

export default Sandbox;
