import { createBrowserHistory } from 'history';
import registerModules from './register';
import setMountPoint from './mountpoint';
import run from './run';
import Sandbox from './sandbox';
import eventBus from './event-bus';

function Polyatomic() {
  this.registeredModules = {};
  this.currentLocation = {};
  this.sandboxes = {};
  this.defaultSandbox = new Sandbox('default');
}

Polyatomic.prototype.registerModules = registerModules;
Polyatomic.prototype.setMountPoint = setMountPoint;
Polyatomic.prototype.run = run;

Polyatomic.history = createBrowserHistory();
Polyatomic.prototype.history = Polyatomic.history;
Polyatomic.prototype.mountPointID = 'root';
Polyatomic.prototype.bus = eventBus;
Polyatomic.bus = eventBus;

export default Polyatomic;
