/**
 * @file polyatomic.js
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
 * Constructor of Polyatomic
 */
function Polyatomic() {
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
   * @param config
   * @returns {function}
   */
  this.registerSubApplications = config => registerSubApplications.call(props, config);

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
 * use a Polyatomic plugin
 * the plugin should contain an `install` method
 * @param {Object} plugin
 * @param {Object|null} options
 */
Polyatomic.use = async function(plugin, options) {
  if (!plugin) {
    return;
  }

  if (!plugin.install || typeof plugin.install !== 'function') {
    return console.error('[Polyatomic] Plugin should have an `install` method, which is a instance of `Function`');
  }

  await plugin.install(Polyatomic, options);
};

/**
 * call `history` with Polyatomic.history or app.history or this.history
 * use browser history instead of hash history for sub-applications would be a hash-routed application
 * @type {History<LocationState>}
 */
Polyatomic.prototype.history = Polyatomic.history = createBrowserHistory();

/**
 * create the lifecycle hooks of the application
 * only hooks that in _HOOKS array would be added, or it will throw a ReferenceError
 * returns a Proxy-based object, check if the hook name is legal
 * @public
 * @type {Proxy}
 */
Polyatomic.prototype.hooks = createHooks();

// install plugin `Events`
Polyatomic.use(Events);
// install plugin `Store`
Polyatomic.use(Store);

export default Polyatomic;
