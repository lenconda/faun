import { createBrowserHistory } from 'history';
import registerModules from './register';
import setMountPoint from './mountpoint';
import run from './run';
import Sandbox from './sandbox';

function Polyatomic() {
  this.registeredModules = {};
  this.history = createBrowserHistory();
  this.mountPointID = 'root';
  this.currentRouteScriptElements = [];
  this.currentRouteStyleElements = [];
  this.currentLocation = {};
  this.sandboxes = {};
  this.defaultSandbox = new Sandbox('default');
}

Polyatomic.prototype.registerModules = registerModules;
Polyatomic.prototype.setMountPoint = setMountPoint;
Polyatomic.prototype.run = run;
Polyatomic.push = function() {
  return this.history.push.call(this);
};
Polyatomic.prototype.push = function() {
  return this.history.push.call(this);
};

export default Polyatomic;
