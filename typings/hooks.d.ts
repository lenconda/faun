import { Sandbox } from './sandbox';

export interface IHooks {
  loading: (pathname: string) => any;
  loaded: (pathname: string) => any;
  mounted: (pathname: string, sandbox: Sandbox) => any;
  beforeUnmount: (prev: string, next: string) => boolean;
  unmounted: (prev: string, next: string, sandbox: Sandbox) => any;
}
