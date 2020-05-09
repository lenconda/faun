import { createBrowserHistory } from 'history';
import registerModules from './register';
import run from './run';
import Sandbox from './sandbox';
import eventBus from './event-bus';

function Polyatomic(mountPointID) {
  const properties = {
    registeredModules: {},
    currentLocation: {},
    sandboxes: {},
    mountPointID: mountPointID || 'root',
    defaultSandbox: new Sandbox('default'),
  };

  this.run = () => run.call(this, properties);
  this.registerModules = modules => registerModules.call(properties, modules);
}

Polyatomic.prototype.bus = eventBus;
Polyatomic.bus = eventBus;
Polyatomic.prototype.history = Polyatomic.history = createBrowserHistory();

export default Polyatomic;
