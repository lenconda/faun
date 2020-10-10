/**
 * @file interfaces.ts
 * @author lenconda<i@lenconda.top>
 */
import { History, Location } from 'history';
import Faun from './faun';
import { Sandbox } from '../typings/sandbox';

type FaunType = typeof Faun;
type SubApplicationExtraType = Record<string, any>;
type SubApplicationScriptConfigType = Array<string | IEntryCustomScriptConfig>;
type SubApplicationStyleConfigType = Array<string>;

export interface IStaticResourcesReplaceRule {
  nodeNames: Array<string>;
  attributes: Array<string>;
  replacer: (element: HTMLElement) => void;
}

export interface IFaunSubApplicationConfig {
  singular?: boolean;
}

export interface IEntryCustomScriptConfig {
  url: string;
  scriptExecutor: (data: string, defaultExecutor: Function, extra: SubApplicationExtraType) => Function;
}

export interface ISubApplicationConfig {
  name?: string;
  entry?: {
    scripts?: SubApplicationScriptConfigType,
    styles?: SubApplicationStyleConfigType,
  };
  container: (extra: SubApplicationExtraType) => HTMLElement | HTMLElement | string;
  useCSSPrefix?: boolean;
  assetPublicPath?: (url: string) => string | string;
  preserveChunks?: boolean;
  extra?: SubApplicationExtraType;
  staticResourcesReplaceRule?: IStaticResourcesReplaceRule;
  cleanDOMWhenUnmounting?: boolean;
}

export interface IFaunRouteItem {
  pathname?: string;
  // TODO:
  sandboxes: Array<any>;
}

export interface IFaunInstanceProps {
  registeredSubApplications: Array<ISubApplicationConfig>;
  currentLocation: Location<History.PoorMansUnknown> | {};
  routes: Array<IFaunRouteItem>;
  position: number;
  direction: 'forward' | 'backward';
  hooks: IFaunLifecycleHooks;
  appConfig: IFaunSubApplicationConfig;
}

export interface IFaunDependency {
  name: string;
  dep: any;
}

export interface IFaunPlugin {
  install: (Faun: FaunType, options: Record<string, any>) => any;
  [key: string]: any;
}

export interface IFaunLifecycleHooks {
  loading?: (pathname: string) => any;
  loaded?: (pathname: string) => any;
  mounted?: (pathname: string, sandbox: Sandbox) => any;
  beforeUnmount?: (prev: string, next: string) => boolean;
  unmounted?: (prev: string, next: string, sandbox: Sandbox) => any;
}
