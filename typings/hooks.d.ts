import { ISandbox } from './sandbox';

export interface IHooks {
  loading: (pathname: string) => any;
  loaded: (pathname: string) => any;
  mounted: (pathname: string, sandbox: ISandbox) => any;
  beforeUnmount: (prev: string, next: string) => any;
  unmounted: (prev: string, next: string, sandbox: ISandbox) => any;
}
