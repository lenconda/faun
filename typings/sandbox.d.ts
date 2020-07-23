import { noop } from 'lodash';
import { ISubApplicationConfig } from './faun';

interface IChildNodeOperator {
  intercept: (callback: (element: Element) => void) => void;
  stop: () => void;
}

export interface ISandbox {
  readonly domSnapshot: string;
  readonly mountPoint: Element;
  readonly mountPointID: string;
  readonly windowSnapshot: Partial<Window>;
  readonly name: string;
  readonly prefix: string;
  readonly bundles: Array<string>;
  readonly css: Array<string>
  readonly bundleExecutors: Array<Function>;
  readonly styleElements: Array<HTMLElement>;
  readonly disableRewriteEventListeners: () => typeof noop;
  readonly rootElement: HTMLDocument;
  readonly usePrefix: boolean;
  readonly assetURLMapper: (url: string) => string;
  readonly _modifyPropsMap: Partial<Window>;
  readonly _observer: MutationObserver;
  readonly _childNodeOperator: IChildNodeOperator;

  restoreDOMSnapshot: () => void;
  takeWindowSnapshot: () => void;
  restoreWindowSnapshot: () => void;
  create: (module: ISubApplicationConfig) => void | null;
  mount: () => void;
  unmount: () => void;
}
