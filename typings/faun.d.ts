import { IEvent } from './event';
import { History, LocationState } from 'history';
import { IHooks } from './hooks';
import { IStore } from './store';
import { Sandbox } from './sandbox';

declare interface ISubApplicationConfig {
  scripts: Array<string>;
  styles: Array<string>;
  mountPointID: string;
  useCSSPrefix?: boolean;
  assetURLMapper?: (url: string) => string;
  prefixElementSelector?: () => Node;
}

declare interface IGlobalDependenceInfo {
  name: string;
  dep: any;
}

declare interface ISubApplications {
  [key: string]: Partial<ISubApplicationConfig>;
}

declare interface IPlugin {
  install: Function;
  [key: string]: any;
}

declare interface IFaunProps {
  readonly registeredSubApplications: ISubApplications;
  readonly currentLocation: LocationState;
  readonly sandboxes: Array<Sandbox>;
  readonly position: number;
  readonly direction: 'forward' | 'backward';
}

declare abstract class Faun {
  constructor();

  abstract run(): void;
  abstract registerSubApplications(config: ISubApplications): void;
  abstract addGlobalDependence<T extends Record<string, any>>(name: string, dep: T): void;

  public history: History<LocationState>;

  public hooks: IHooks;
  public store: IStore;
  public events: IEvent;

  static use<T extends Record<string, any>>(plugin: IPlugin, options: T): void;
}

export {
  Faun,
  IFaunProps,
  IPlugin,
  ISubApplicationConfig,
  ISubApplications,
  IGlobalDependenceInfo,
}
