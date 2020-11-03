/**
 * @file /src/sandbox.ts
 * @author lenconda<i@lenconda.top>
 */

import traverseProps from './utils/traverse-props';
import fetch from './fetch';
import { isFunction } from './utils/lodash';
import overwriteEventListeners from './overwrites/window-listeners';
import createElement from './utils/create-element';
import cssPrefix, { generateCSSPrefix } from './utils/css';
import random from './utils/random';
import PolyfilledMutationObserver from 'mutation-observer';
import childNodeOperator from './overwrites/child-operate';
import {
  SandboxScriptsType,
  SandboxStylesType,
  SandboxAssetPublicPathType,
  ISubApplicationConfig,
  IFaunInstanceConfig,
  IChildOperate,
  SubApplicationAssetMatchersType,
} from './interfaces';

const configMatchedNodeAssets = (
  element: HTMLElement,
  matchers: SubApplicationAssetMatchersType,
  assetPublicPath: string | SandboxAssetPublicPathType | undefined,
): HTMLElement => {
  const nodeName = element.nodeName.toLowerCase();
  const getAssetsPrefix = (value: string): string => {
    if (assetPublicPath) {
      if (typeof assetPublicPath === 'function') {
        return `${assetPublicPath(value)}${value}`;
      } else if (typeof assetPublicPath === 'string') {
        return `${assetPublicPath}${value}`;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const currentMatcher = matchers.find(matcher => matcher.nodeName === nodeName);
  if (currentMatcher) {
    currentMatcher.attributes.forEach(attribute => {
      const currentAttributeValue = element.getAttribute(attribute);
      if (currentAttributeValue) {
        element.setAttribute(attribute, getAssetsPrefix(currentAttributeValue));
      }
    });
  }

  return element;
};

/**
 * sandbox constructor
 * @class
 * @param {string} name
 * @param {boolean} useCSSPrefix
 * @constructor
 */
class Sandbox {
  public name = '';
  public scripts: SandboxScriptsType = [];
  public styles: SandboxStylesType = [];
  public useCSSPrefix = false;
  public preserveChunks = false;
  public assetPublicPath?: SandboxAssetPublicPathType;

  private cssPrefixString: string;
  private domSnapshot: Array<HTMLElement> = [];
  private windowSnapshot: Partial<Window> = {};
  private scriptExecutors: Array<Function> = [];
  private styleElements: Array<HTMLStyleElement> = [];
  private singular = true;
  private modifiedPropsMap: Record<string, any> = {};
  private observer?: PolyfilledMutationObserver;
  private childNodeOperator: IChildOperate = childNodeOperator();
  private sandboxWindow: Partial<Window> = {};
  private cleanDOMWhenUnmounting = false;
  private container: HTMLElement;
  private mountPointElement?: HTMLElement;
  private disableRewriteEventListeners?: Function;
  private assetMatchers: SubApplicationAssetMatchersType = [
    {
      nodeName: 'script',
      attributes: ['src'],
    },
    {
      nodeName: 'link',
      attributes: ['href'],
    },
  ];

  constructor(
    name: string,
    prefixName: string = random(),
    useCSSPrefix = false,
    customAssetMatchers: SubApplicationAssetMatchersType = [],
  ) {
    this.name = name;
    this.useCSSPrefix = useCSSPrefix;
    this.cssPrefixString = generateCSSPrefix(prefixName, name);

    if (!this.observer) {
      this.observer = new PolyfilledMutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach(mutation => {
          const currentAddedNodes = Array.from(mutation.addedNodes) as HTMLElement[];
          currentAddedNodes.forEach(node => {
            const nodeName = node.nodeName && node.nodeName.toLowerCase() || '';
            if (/^style$|^script$|^link$/.test(nodeName)) {
              this.domSnapshot.push(node);
              if (
                nodeName === 'style'
                && (this.useCSSPrefix || !this.singular)
                && node.innerHTML.indexOf('data-f-') === -1
              ) {
                node.innerHTML = cssPrefix(node.innerHTML, this.name);
              }
            }
            const currentCustomMatchers: SubApplicationAssetMatchersType = customAssetMatchers.map(matcher => ({
              nodeName: matcher.nodeName.toLowerCase(),
              attributes: matcher.attributes,
            }));
            configMatchedNodeAssets(node, currentCustomMatchers, this.assetPublicPath);
          });
        });
      });
    }
  }

  public takeDOMSnapshot() {
    this.childNodeOperator.intercept((element: HTMLElement) => {
      return configMatchedNodeAssets(element, this.assetMatchers, this.assetPublicPath);
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
    // eslint-disable-next-line no-unused-expressions
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
    appConfig: IFaunInstanceConfig,
  ) {
    const {
      container,
      assetPublicPath = '',
      preserveChunks,
      extra = {},
      name = random(),
      cleanDOMWhenUnmounting = false,
    } = subApplicationConfig;
    if (!subApplicationConfig || !container) {
      return;
    }

    this.name = name;
    this.singular = appConfig.singular || true;

    this.cleanDOMWhenUnmounting = cleanDOMWhenUnmounting;
    if (container instanceof HTMLElement) {
      this.container = container;
    } else {
      switch (typeof container) {
      case 'string': {
        const currentContainer = createElement<HTMLDivElement>('div', { id: container });
        if (currentContainer) {
          this.container = currentContainer;
        }
        break;
      }
      case 'function':
        this.container = container(extra);
        break;
      default:
        break;
      }
    }

    if (!document.getElementById(this.name)) {
      const mountPointElement = createElement<HTMLDivElement>('div', this.useCSSPrefix ? {
        [this.cssPrefixString]: true,
      } : {}, [this.container]);
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
          const styleData = (this.useCSSPrefix || !this.singular) ? cssPrefix(data, `div[${this.cssPrefixString}]`) : data;
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
        // @ts-ignore
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
