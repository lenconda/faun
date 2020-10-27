/**
 * @file /src/faun.ts
 * @author lenconda<i@lenconda.top>
 */

import { createBrowserHistory } from 'history';
import registerSubApplications from './register';
import run from './run';
import Sandbox from './sandbox';
import createHooks from './hooks';
import {
  IFaunInstanceProps,
  IFaunSubApplicationConfig,
  IFaunDependency,
  IFaunPlugin,
  IFaunLifecycleHooks,
  FaunHistoryType,
  SubApplicationsType,
  FaunErrorHandlerType,
} from './interfaces';
import {
  FaunPluginError,
} from './errors';
import {
  generateErrorHandler,
} from './utils/error';

// internal plugins
import Events from './plugins/events';
import Store from './plugins/store';
import StoreType from './store';
import EventType from './event';

const history = createBrowserHistory();

class Faun {
  static history: FaunHistoryType = history;

  public store: StoreType;
  public events: EventType;

  private props: IFaunInstanceProps;
  // global dependencies
  private deps: Array<IFaunDependency> = [];
  private history: FaunHistoryType = history;
  private errorHandler: FaunErrorHandlerType;

  constructor(appConfig: IFaunSubApplicationConfig = {}) {
    this.props = {
      // registered sub-applications information
      registeredSubApplications: [],
      // current location object
      // currentLocation,
      // sandboxes stack
      routes: [{ sandboxes: [new Sandbox('@@default')] }],
      // stack top position
      position: 0,
      // stack cursor direction
      direction: 'forward',
      // lifecycle hooks
      hooks: createHooks(),
      // app config
      appConfig: {
        ...appConfig,
        // TODO: tmp set singular to true
        singular: true,
      },
    };
    this.use(Events, this.props);
    this.use(Store, this.props);
    this.errorHandler = generateErrorHandler(appConfig.onError);
  }

  public async use(plugin: IFaunPlugin, options: Record<string, any> = {}) {
    if (!plugin) {
      return;
    }

    if (!plugin.install || typeof plugin.install !== 'function') {
      const errorMessage = 'Plugin should have an `install` method, which is a instance of `Function`';
      const error = new FaunPluginError(errorMessage);
      this.errorHandler(error);
    }

    await plugin.install(Faun, this.props, options);
  }

  public run() {
    run.call(this, this.props, this.deps, this.history, this);
  }

  public registerSubApplications(
    config: SubApplicationsType,
    hooks: IFaunLifecycleHooks,
  ) {
    registerSubApplications.call(this, this.props, this, config, hooks);
  }

  public addGlobalDependence<T>(name: string, dep: T) {
    if (name && dep) {
      this.deps.push({ name, dep });
    }
  }
}

export const use = Faun.prototype.use;
export {
  history,
};
export default Faun;
