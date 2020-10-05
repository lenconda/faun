import { IEvent } from './event';
import { History, LocationState } from 'history';
import { IHooks } from './hooks';
import { IStore } from './store';
import { Sandbox } from './sandbox';

declare type ExtraType = Record<string, any>;
declare interface IEntryCustomScriptConfig {
  url: string;
  scriptExecutor: (data: string, defaultExecutor: Function, extra: ExtraType) => Function;
}
declare type ScriptConfigType = Array<string | IEntryCustomScriptConfig>;
declare type StyleConfigType = Array<string>;
declare type StaticResourcesReplaceRuleType = {
  tagNames: Array<string>;
  attributes: Array<string>;
  replacer: (element: HTMLElement) => void;
};

declare interface ISubApplicationConfig {
  name?: string;
  entry?: {
    scripts?: ScriptConfigType,
    styles?: StyleConfigType,
  };
  container: (extra: ExtraType) => HTMLElement | HTMLElement | string;
  useCSSPrefix?: boolean;
  assetPublicPath?: (url: string) => string | string;
  preserveChunks?: boolean;
  extra?: ExtraType;
  staticResourcesReplaceRule?: StaticResourcesReplaceRuleType;
  cleanDOMWhenUnmounting?: boolean;
}

declare interface IGlobalDependenceInfo {
  name: string;
  dep: any;
}

declare type ISubApplicationConfigMap = Array<Partial<ISubApplicationConfig>>;

declare interface IPlugin {
  install: (Faun: Faun) => any;
  [key: string]: any;
}

declare interface IFaunProps {
  readonly registeredSubApplications: ISubApplicationConfigMap;
  readonly currentLocation: LocationState;
  readonly sandboxes: Array<Sandbox>;
  readonly position: number;
  readonly direction: 'forward' | 'backward';
}

declare type FaunConfig = {
  singular?: boolean;
};

declare abstract class Faun {
  constructor(appConfig: FaunConfig);

  abstract run(): void;
  abstract registerSubApplications(config: ISubApplicationConfigMap, hooks: IHooks): void;
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
  ISubApplicationConfigMap,
  IGlobalDependenceInfo,
}
