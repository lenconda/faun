/**
 * @file sandbox.js
 * @author lenconda<i@lenconda.top>
 */

import traverseProps from './utils/traverse-props';
import fetch from './fetch';
import { isFunction } from './utils/lodash';
import overwriteEventListeners from './overwrites/window-listeners';
import createElement from './utils/create-element';
import cssPrefix from './utils/css';
import random from './utils/random';
import PolyfilledMutationObserver from 'mutation-observer';
import childNodeOperator from './overwrites/child-operate';
import {
  SandboxScriptsType,
  SandboxStylesType,
  SandboxAssetPublicPathType,
  ISubApplicationConfig,
  IFaunSubApplicationConfig,
  IChildOperate,
  IStaticResourcesReplaceRule,
} from './interfaces';

/**
 * sandbox constructor
 * @class
 * @param {string} name
 * @param {boolean} useCSSPrefix
 * @constructor
 */
class Sandbox {
  constructor(name: string, useCSSPrefix: boolean = true) {
    this.name = name;
    this.useCSSPrefix = useCSSPrefix;
    if (!this.observer) {
      this.observer = new PolyfilledMutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach(mutation => {
          const currentAddedNodes = Array.from(mutation.addedNodes) as HTMLElement[];
          currentAddedNodes.forEach(node => {
            const staticResourcesReplaceRule = this.staticResourcesReplaceRule;
            const nodeNames = staticResourcesReplaceRule?.nodeNames || [];
            const attributes = staticResourcesReplaceRule?.attributes || [];
            const replacer = staticResourcesReplaceRule?.replacer || null;
            const lowerCasedNodeNames = nodeNames.map((name: string) => name.toLowerCase());
            const nodeName = node.nodeName && node.nodeName.toLowerCase() || '';
            const nodeAttributes = node.attributes && Array.from(node.attributes).map(attribute => attribute.name) || [];
            if (
              lowerCasedNodeNames.indexOf(nodeName) !== -1
              && nodeAttributes.filter(attribute => attributes.indexOf(attribute) !== -1).length !== 0
              && replacer
            ) {
              replacer(node);
            }
            if (node && /^style$|^script$|^link$/.test(nodeName)) {
              this.domSnapshot.push(node);
              if (nodeName === 'style' && (this.useCSSPrefix || !this.singular)) {
                node.innerHTML = cssPrefix(node.innerHTML, this.name);
              }
            }
          });
        });
      });
    }
  }

  public name: string = '';
  public scripts: SandboxScriptsType = [];
  public styles: SandboxStylesType = [];
  public useCSSPrefix: boolean = false;
  public preserveChunks: boolean = false;
  public assetPublicPath?: SandboxAssetPublicPathType;

  private domSnapshot: Array<HTMLElement> = [];
  private windowSnapshot: Partial<Window> = {};
  private scriptExecutors: Array<Function> = [];
  private styleElements: Array<HTMLStyleElement> = [];
  private singular: boolean = true;
  private modifiedPropsMap: Record<string, any> = {};
  private observer?: PolyfilledMutationObserver;
  private childNodeOperator: IChildOperate = childNodeOperator();
  private sandboxWindow: Partial<Window> = {};
  private cleanDOMWhenUnmounting: boolean = false;
  private container: HTMLElement;
  private mountPointElement?: HTMLElement;
  private staticResourcesReplaceRule?: IStaticResourcesReplaceRule;
  private disableRewriteEventListeners?: Function;

  public takeDOMSnapshot() {
    const _this = this;

    this.childNodeOperator.intercept((element: HTMLElement) => {
      const nodeName = element.nodeName && element.nodeName.toLowerCase() || '';
      const getAssetsPrefix = (src: string): string => {
        const { assetPublicPath } = _this;
        if (assetPublicPath) {
          if (typeof assetPublicPath === 'function') {
            return `${assetPublicPath(src)}${src}`;
          } else if (typeof assetPublicPath === 'string') {
            return `${assetPublicPath}${src}`;
          } else {
            return src;
          }
        } else {
          return src;
        }
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

    this.observer && this.observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  public restoreDOMSnapshot() {
    const _this = this;

    function remove(node: HTMLElement) {
      if (node.remove && _this.preserveChunks !== true) {
        node && node.remove();
      }
    }

    this.domSnapshot.forEach(remove);
    this.styleElements.forEach(remove);
    this?.observer?.disconnect();
    this.childNodeOperator.stop();
  }

  public takeWindowSnapshot() {
    this.windowSnapshot = {};

    traverseProps(window, (prop: string) => {
      this.windowSnapshot[prop] = window[prop];
    });

    Object.keys(this.modifiedPropsMap).forEach(prop => {
      if (Object.getOwnPropertyDescriptor(window, prop)?.writable) {
        window[prop] = this.modifiedPropsMap[prop];
      }
    });
  }

  public restoreWindowSnapshot() {
    this.modifiedPropsMap = {};

    traverseProps(window, (prop: string) => {
      if (
        window[prop] !== this.windowSnapshot[prop]
        && Object.getOwnPropertyDescriptor(window, prop)?.writable
      ) {
        this.modifiedPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop];
      }
    });
  }

  public async create(
    subApplicationConfig: ISubApplicationConfig,
    appConfig: IFaunSubApplicationConfig,
  ) {
    const {
      container,
      assetPublicPath = '',
      preserveChunks,
      extra = {},
      useCSSPrefix,
      name = random(),
      staticResourcesReplaceRule = null,
      cleanDOMWhenUnmounting = false,
    } = subApplicationConfig;
    if (!subApplicationConfig || !container) {
      return;
    }

    this.name = name;
    this.singular = appConfig.singular || true;
    if (staticResourcesReplaceRule) {
      this.staticResourcesReplaceRule = staticResourcesReplaceRule;
    }
    this.cleanDOMWhenUnmounting = cleanDOMWhenUnmounting;
    if (container instanceof HTMLElement) {
      this.container = container;
    } else {
      switch (typeof container) {
      case 'string':
        const currentContainer = createElement('div', { id: container });
        if (currentContainer) {
          this.container = currentContainer;
        }
        break;
      case 'function':
        this.container = container(extra);
        break;
      default:
        break;
      }
    }

    if (!document.getElementById(this.name)) {
      const mountPointElement = createElement('div', {
        id: (useCSSPrefix || !this.singular) ? this.name : '',
      }, [this.container]);
      if (mountPointElement) {
        this.mountPointElement = mountPointElement;
      }
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
        let bundleURL: string;
        let executor: Function;
        if (typeof bundle === 'string') {
          bundleURL = bundle;
        } else if (bundle.url && bundle.scriptExecutor) {
          bundleURL = bundle.url;
        } else {
          bundleURL = '';
        }

        if (bundleURL !== '') {
          this.scripts.push(bundle);
          // make an ajax to load the sub-application bundles
          const data = await fetch(bundleURL);
          const defaultExecutor = new Function(data);

          if (typeof bundle === 'string') {
            executor = defaultExecutor;
          } else {
            executor = bundle.scriptExecutor(data, defaultExecutor, extra);
          }

          if (data) {
            // wrap bundle code into a function
            // when mount method called, execute the functions
            this.scriptExecutors.push(executor);
          }
        }
      }
    }

    if (entry.styles && entry.styles.length) {
      for (const stylesURL of entry.styles) {
        this.styles.push(stylesURL);
        // make an ajax to load styles
        const data = await fetch(stylesURL);
        if (data) {
          const styleData = (this.useCSSPrefix || !this.singular) ? cssPrefix(data, this.name) : data;
          const currentStyleElement = createElement('style', { type: 'text/css' }) as HTMLStyleElement;
          if (currentStyleElement) {
            currentStyleElement.innerHTML = styleData;
            this.styleElements.push(currentStyleElement);
          }
        }
      }
    }
  }

  public mount() {
    this.takeDOMSnapshot();
    this.disableRewriteEventListeners = overwriteEventListeners();

    const mountPointElement = Array.prototype.slice.call([this.mountPointElement])[0];
    document.body.appendChild(mountPointElement);

    if (this.styleElements && Array.isArray(this.styleElements)) {
      this.styleElements.forEach(element => document.head.appendChild(element));
    }

    !!this.windowSnapshot.length && this.restoreWindowSnapshot();

    this.scriptExecutors && this.scriptExecutors.forEach(executor => {
      if (executor && isFunction(executor)) {
        (function(window) {
          executor.call(this);
        })(new Proxy(this.sandboxWindow, {
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
            return Reflect.set(obj, prop, value);
          },
        }));
      }
    });
  }

  public unmount() {
    if (this.container && this.cleanDOMWhenUnmounting) {
      this.container.innerHTML = '';
    }
    this.mountPointElement && this.mountPointElement.remove();
    this.takeWindowSnapshot();
    this.disableRewriteEventListeners && this.disableRewriteEventListeners();
    this.restoreDOMSnapshot();
    this.domSnapshot.splice(0, this.domSnapshot.length);
  }
}

export default Sandbox;
