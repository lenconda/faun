import { createBrowserHistory } from 'history';
import registerModules from './register';
import run from './run';
import Sandbox from './sandbox';
import eventBus from './event-bus';
import createHooks from './hooks';

function Polyatomic(mountPointID) {
  const props = {
    registeredModules: {},
    currentLocation: {},
    sandboxes: {},
    mountPointID: mountPointID || 'root',
    defaultSandbox: new Sandbox('default'),
  };

  this.run = () => run.call(this, props);
  this.registerModules = modules => registerModules.call(props, modules);
}

Polyatomic.prototype.bus = eventBus;
Polyatomic.bus = eventBus;
Polyatomic.prototype.history = Polyatomic.history = createBrowserHistory();
Polyatomic.prototype.hooks = createHooks();

export default Polyatomic;
