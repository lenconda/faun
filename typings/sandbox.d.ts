import { noop } from 'lodash';
import { ISubApplicationConfig } from './faun';

export interface IChildNodeOperator {
  intercept: (callback: (element: Element) => void) => void;
  stop: () => void;
}

export abstract class Sandbox {
  constructor(name: string, useCSSPrefix: boolean);

  container: string;
  name: string;
  bundles: Array<string>;
  css: Array<string>
  usePrefix: boolean;
  preserveChunks: boolean;

  abstract assetURLMapper(url: string): string;
  abstract prefixElementSelector(): Node;

  abstract takeDOMSnapshot(): void;
  abstract restoreDOMSnapshot(): void;
  abstract takeWindowSnapshot(): void;
  abstract restoreWindowSnapshot(): void;
  abstract create(subApplicationConfig: ISubApplicationConfig): Promise<void | null>;
  abstract mount(): void;
  abstract unmount(): void;
}

export interface ISandboxProps {
  readonly domSnapshot: Array<Node>;
  readonly mountPointElement: Element | null;
  readonly windowSnapshot: Partial<Window>;
  readonly prefix: string;
  readonly bundleExecutors: Array<Function>;
  readonly styleElements: Array<HTMLElement>;
  readonly disableRewriteEventListeners: () => typeof noop | null;
  readonly modifiedPropsMap: Partial<Window>;
  readonly observer: MutationObserver | null;
  readonly childNodeOperator: IChildNodeOperator;
  readonly defaultPrefixElement: HTMLHtmlElement;
}
