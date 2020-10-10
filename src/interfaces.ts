/**
 * @file interfaces.ts
 * @author lenconda<i@lenconda.top>
 */
import { History, Location } from 'history';
import Faun from './faun';
import { Sandbox } from '../typings/sandbox';

type ExtraType = Record<string, any>;
type ScriptConfigType = Array<string | IEntryCustomScriptConfig>;
type StyleConfigType = Array<string>;

export interface IStaticResourcesReplaceRule {
  nodeNames: Array<string>;
  attributes: Array<string>;
  replacer: (element: HTMLElement) => void;
}

export interface IFaunSubAppConfig {
  singular?: boolean;
}

export interface IEntryCustomScriptConfig {
  url: string;
  scriptExecutor: (data: string, defaultExecutor: Function, extra: ExtraType) => Function;
}

export interface ISubApplicationConfig {
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
  staticResourcesReplaceRule?: IStaticResourcesReplaceRule;
  cleanDOMWhenUnmounting?: boolean;
}

export interface IRouteItem {
  pathname?: string;
  // TODO:
  sandboxes: Array<any>;
}

export interface IFaunAppProps {
  registeredSubApplications: Array<ISubApplicationConfig>;
  currentLocation: Location<History.PoorMansUnknown> | {};
  routes: Array<IRouteItem>;
  position: number;
  direction: 'forward' | 'backward';
  hooks: IHooks;
  appConfig: IFaunSubAppConfig;
}

export interface IFaunDependency {
  name: string;
  dep: any;
}

type FaunType = typeof Faun;

export interface IPlugin {
  install: (Faun: FaunType, options: Record<string, any>) => any;
  [key: string]: any;
}

export interface IHooks {
  loading?: (pathname: string) => any;
  loaded?: (pathname: string) => any;
  mounted?: (pathname: string, sandbox: Sandbox) => any;
  beforeUnmount?: (prev: string, next: string) => boolean;
  unmounted?: (prev: string, next: string, sandbox: Sandbox) => any;
}
