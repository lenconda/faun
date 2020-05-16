import { IEvent } from './event';
import { History, LocationState } from 'history';
import { IHooks } from './hooks';

declare interface PolyatomicConstructor {
  mountPointID: string;
}

declare interface IModuleInfo {
  scripts: Array<string>;
  styles: Array<string>;
}

declare interface IModules {
  [key: string]: Partial<IModuleInfo>
}

export interface Polyatomic {
  readonly bus: IEvent;
  readonly history: History<LocationState>;
  readonly hooks: IHooks;

  run: () => void;
  registerModules: (modules: IModules) => this | void;
}

export const Polyatomic: PolyatomicConstructor;
