/**
 * @file faun.js
 * @author lenconda<i@lenconda.top>
 */

import { createBrowserHistory } from 'history';
import registerSubApplications from './register';
import run from './run';
import Sandbox from './sandbox';
import createHooks from './hooks';

// internal plugins
import Events from './plugins/events';
import Store from './plugins/store';

/**
 * @class
 * @constructor
 * Constructor of Faun
 */
function Faun() {
  // defines the application properties
  // which will be passed when `run` and `registerSubApplications` is called
  const props = {
    // registered sub-applications information
    registeredSubApplications: {},
    // current location object
    currentLocation: {},
    // sandboxes stack
    sandboxes: [new Sandbox('@@default')],
    // stack top position
    position: 0,
    // stack cursor direction
    direction: 'forward',
    // lifecycle hooks
    hooks: createHooks(),
  };

  // global dependencies
  const deps = [];

  /**
   * `run` method, be called only when the app is prepared
   * @public
   * @returns {function}
   */
  this.run = () => run.call(this, props, deps);

  /**
   * get remote sub-applications resources and call this method
   * @param {ISubApplicationConfigMap} subApplicationConfigMap
   * @param {IHooks} hooks
   * @returns {function}
   */
  this.registerSubApplications = (config, hooks) => registerSubApplications.call(props, config, hooks);

  /**
   * set global deps to window
   * @public
   * @param {string}
   * @param {any}
   */
  this.addGlobalDependence = function(name, dep) {
    if (name && dep) {
      deps.push({ name, dep });
    }
  };
}

/**
 * use a Faun plugin
 * the plugin should contain an `install` method
 * @param {IPlugin} plugin
 * @param {Object|null} options
 */
Faun.use = async function(plugin, options) {
  if (!plugin) {
    return;
  }

  if (!plugin.install || typeof plugin.install !== 'function') {
    return console.error('[Faun] Plugin should have an `install` method, which is a instance of `Function`');
  }

  await plugin.install(Faun, options);
};

/**
 * call `history` with Faun.history or app.history or this.history
 * use browser history instead of hash history for sub-applications would be a hash-routed application
 * @type {History<LocationState>}
 */
Faun.prototype.history = Faun.history = createBrowserHistory();

// install plugin `Events`
Faun.use(Events);
// install plugin `Store`
Faun.use(Store);

export default Faun;
