/**
 * @file /src/interfaces.ts
 * @author lenconda<i@lenconda.top>
 */
import { History, Location } from 'history';
import Faun from './faun';
import { Sandbox } from '../typings/sandbox';

export type FaunType = typeof Faun;
type SubApplicationExtraType = Record<string, any>;
type SubApplicationScriptConfigType = Array<string | IEntryCustomScriptConfig>;
type SubApplicationStyleConfigType = Array<string>;

type SubApplicationActiveRuleFunctionType = (location: Location<History.PoorMansUnknown> | {}) => boolean;
type SubApplicationActiveRuleRegExpType = RegExp;
type SubApplicationActiveRuleArrayType = Array<string>;
type SubApplicationActiveRuleStringType = string;

export type SubApplicationActiveRuleType =
  SubApplicationActiveRuleFunctionType
  | SubApplicationActiveRuleRegExpType
  | SubApplicationActiveRuleArrayType
  | SubApplicationActiveRuleStringType;

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

export type SubApplicationContainerFunctionType = (extra: SubApplicationExtraType) => HTMLElement;
export type SubApplicationContainerHTMLElementType = HTMLElement;
export type SubApplicationContainerStringType = string;
export type SubApplicationContainerType =
  SubApplicationContainerFunctionType
  | SubApplicationContainerHTMLElementType
  | SubApplicationContainerStringType;

export type SubApplicationAssetPublicPathFunctionType = (url: string) => string;
export type SubApplicationAssetPublicPathStringType = string;
export type SubApplicationAssetPublicPathType =
  SubApplicationAssetPublicPathFunctionType
  | SubApplicationAssetPublicPathStringType;

export interface ISubApplicationConfig {
  name?: string;
  entry?: {
    scripts?: SubApplicationScriptConfigType,
    styles?: SubApplicationStyleConfigType,
  };
  activeWhen: SubApplicationActiveRuleType;
  container: SubApplicationContainerType;
  useCSSPrefix?: boolean;
  assetPublicPath?: SubApplicationAssetPublicPathType;
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

export type SubApplicationsType = Array<ISubApplicationConfig>;

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
  loaded?: (pathname: string, sandbox?: Sandbox) => any;
  mounted?: (pathname: string, sandbox?: Sandbox) => any;
  beforeUnmount?: (prev: string, next: string) => boolean;
  unmounted?: (prev: string, next: string, sandbox?: Sandbox) => any;
}

export type EventSubscriberCallbackType = (data: any) => any;
export type EventSubscribersType = Record<string, Array<EventSubscriberCallbackType>>;
export type FaunHistoryType = History;
export type FaunLocationType = Location;

export type IChildOperate = {
  intercept(callback: Function): void;
  stop(): void;
};

export type SandboxScriptsType = SubApplicationScriptConfigType;
export type SandboxStylesType = Array<string>;
export type SandboxAssetPublicPathType = SubApplicationAssetPublicPathType;
