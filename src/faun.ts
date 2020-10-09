/**
 * @file faun.js
 * @author lenconda<i@lenconda.top>
 */

import { createBrowserHistory, History } from 'history';
import registerSubApplications from './register';
import run from './run';
import Sandbox from './sandbox';
import createHooks from './hooks';
import {
  IFaunAppProps,
  IFaunSubAppConfig,
  IFaunDependency,
  IPlugin,
  IHooks,
} from './interfaces';

// internal plugins
import Events from './plugins/events';
import Store from './plugins/store';

const history = createBrowserHistory();

class Faun {
  /**
   * call `history` with Faun.history or app.history or this.history
   * use browser history instead of hash history for sub-applications would be a hash-routed application
   * @type {History<LocationState>}
   */
  static history: History = history;
  /**
   * use a Faun plugin
   * the plugin should contain an `install` method
   * @param {IPlugin} plugin
   * @param {Object|null} options
   */
  static async use(plugin: IPlugin, options: Record<string, any> = {}) {
    if (!plugin) {
      return;
    }

    if (!plugin.install || typeof plugin.install !== 'function') {
      return console.error('[Faun] Plugin should have an `install` method, which is a instance of `Function`');
    }

    await plugin.install(Faun, options);
  }

  private props: IFaunAppProps;
  // global dependencies
  private deps: Array<IFaunDependency> = [];
  /**
   * call `history` with Faun.history or app.history or this.history
   * use browser history instead of hash history for sub-applications would be a hash-routed application
   * @type {History<LocationState>}
   */
  private history: History = history;

  constructor(appConfig: IFaunSubAppConfig = {}) {
    this.props = {
      // registered sub-applications information
      registeredSubApplications: [],
      // current location object
      currentLocation: {},
      // sandboxes stack
      routes: [{ sandboxes: [new Sandbox('@@default')] }],
      // stack top position
      position: 0,
      // stack cursor direction
      direction: 'forward',
      // lifecycle hooks
      hooks: createHooks() as any,
      // app config
      appConfig: {
        ...appConfig,
        // TODO: tmp set singular to true
        singular: true,
      },
    };
  }

  /**
   * `run` method, be called only when the app is prepared
   * @public
   * @returns {function}
   */
  public run() {
    run.call(this, this.props, this.deps);
  }

  /**
   * get remote sub-applications resources and call this method
   * @param {ISubApplicationConfigMap} subApplicationConfigMap
   * @param {IHooks} hooks
   * @returns {function}
   */
  public registerSubApplications(config: any, hooks: IHooks) {
    registerSubApplications.call(this.props, config, hooks);
  }

  /**
   * set global deps to window
   * @public
   * @param {string}
   * @param {any}
   */
  public addGlobalDependence(name: string, dep: any) {
    if (name && dep) {
      this.deps.push({ name, dep });
    }
  }
}

// install plugin `Events`
Faun.use(Events);
// install plugin `Store`
Faun.use(Store);

export default Faun;
