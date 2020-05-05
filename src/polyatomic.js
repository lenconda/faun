import { createBrowserHistory } from 'history';
import registerModules from './register';
import setMountPoint from './mountpoint';
import run from './run';

function Polyatomic() {
  this.registeredModules = {};
  this.history = createBrowserHistory();
  this.mountPointID = 'root';
  this.currentRouteScriptElements = [];
  this.currentRouteStyleElements = [];
  this.currentLocation = {};
}

Polyatomic.prototype.registerModules = registerModules;
Polyatomic.prototype.setMountPoint = setMountPoint;
Polyatomic.prototype.run = run;

export default Polyatomic;
