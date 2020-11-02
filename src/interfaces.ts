/**
 * @file /src/interfaces.ts
 * @author lenconda<i@lenconda.top>
 */
import { History, Location } from 'history';
import Faun from './faun';
import Sandbox from './sandbox';
import {
  FaunError,
} from './errors';

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

export type FaunErrorHandlerType = (error: FaunError) => void;

export interface IFaunSubApplicationConfig {
  singular?: boolean;
  onError?: FaunErrorHandlerType;
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
export interface ISubApplicationAssetsConfigMatcherItem {
  nodeName: string;
  attributes: Array<string>;
}
export type SubApplicationAssetMatchersType = Array<ISubApplicationAssetsConfigMatcherItem>;
export interface ISubApplicationEntry {
  scripts?: SubApplicationScriptConfigType;
  styles?: SubApplicationStyleConfigType;
}

export interface ISubApplicationConfig {
  name?: string;
  entry?: ISubApplicationEntry;
  activeWhen: SubApplicationActiveRuleType;
  container: SubApplicationContainerType;
  useCSSPrefix?: boolean;
  assetPublicPath?: SubApplicationAssetPublicPathType;
  assetMatchers?: SubApplicationAssetMatchersType;
  preserveChunks?: boolean;
  extra?: SubApplicationExtraType;
  cleanDOMWhenUnmounting?: boolean;
}

export interface IFaunRouteItem {
  pathname?: string;
  sandboxes: Array<Sandbox>;
}

export type SubApplicationsType = Array<ISubApplicationConfig>;

export interface IFaunInstanceProps {
  id: string;
  registeredSubApplications: Array<ISubApplicationConfig>;
  currentLocation?: Location<History.PoorMansUnknown>;
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
  install: (Faun: FaunType, props: IFaunInstanceProps, options?: Record<string, any>) => any;
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

export interface IChildOperate {
  intercept: (callback: Function) => void;
  stop: () => void;
}

export type SandboxScriptsType = SubApplicationScriptConfigType;
export type SandboxStylesType = Array<string>;
export type SandboxAssetPublicPathType = SubApplicationAssetPublicPathType;

export interface StoreStateType {
  [key: string]: any;
}
export type ChildNodeOperatorProcessorType = (element: Node) => Node;
export interface ChildNodeOperatorType {
  intercept: (callback: ChildNodeOperatorProcessorType) => void;
  stop: () => void;
}
export type EventListenerType = typeof window.addEventListener;
export type FaunRouteHandlerCallback = (previousPathname: string, nextPathname: string) => void;
