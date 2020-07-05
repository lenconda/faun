import { IEvent } from './event';
import { History, LocationState } from 'history';
import { IHooks } from './hooks';
import { IStore } from './store';

declare interface PolyatomicConstructor {}

declare interface ISubApplicationConfig {
  scripts: Array<string>;
  styles: Array<string>;
}

declare interface IDependenceInfo {
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

export interface Polyatomic {
  readonly events: IEvent;
  readonly history: History<LocationState>;
  readonly hooks: IHooks;
  readonly store: IStore;

  run: () => void;
  use: (plugin: IPlugin, options?: Record<string, any>) => void;
  registerModules: (modules: ISubApplications) => this | void;
  addGlobalDependence: (name: string, dep: any) => void;
}

export const Polyatomic: PolyatomicConstructor;
