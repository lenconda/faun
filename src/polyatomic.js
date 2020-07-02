/**
 * @file polyatomic.js
 * @author lenconda<i@lenconda.top>
 */

import { createBrowserHistory } from 'history';
import registerModules from './register';
import run from './run';
import Sandbox from './sandbox';
import createHooks from './hooks';

// internal plugins
import Events from './plugins/events';

/**
 * @class
 * @param {string} mountPointID
 * @constructor
 * Constructor of Polyatomic
 */
function Polyatomic(mountPointID) {
  // defines the application properties
  // which will be passed when `run` and `registerModules` is called
  const props = {
    // registered modules information
    registeredModules: {},
    // current location object
    currentLocation: {},
    // sandboxes stack
    sandboxes: [new Sandbox('@@default')],
    // stack top position
    position: 0,
    // mount point element id, default='root', the module will be mount to this element
    mountPointID: mountPointID || 'root',
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
   * get remote module resources and call this method
   * @param modules
   * @returns {function}
   */
  this.registerModules = modules => registerModules.call(props, modules);

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
 * use browser history instead of hash history for modules would be a hash-routed application
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

export default Polyatomic;

