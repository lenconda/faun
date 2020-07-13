import { noop } from 'lodash';
import { ISubApplicationConfig } from './destruction';

export interface ISandbox {
  readonly domSnapshot: string;
  readonly windowSnapshot: Partial<Window>;
  readonly _modifyPropsMap: Partial<Window>;
  readonly proxy: Window;
  readonly name: string;
  readonly running: boolean;
  readonly bundles: Array<string>;
  readonly css: Array<string>
  readonly bundleExecutors: Array<Function>;
  readonly styleElements: Array<HTMLElement>;
  readonly disableRewriteEventListeners: () => typeof noop;

  // takeDOMSnapshot: () => void;
  restoreDOMSnapshot: () => void;
  takeWindowSnapshot: () => void;
  restoreWindowSnapshot: () => void;
  create: (module: ISubApplicationConfig) => void | null;
  mount: () => void;
  unmount: () => void;
}
