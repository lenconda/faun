import traverseProps from '../src/utils/traverse-props';

function Sandbox(name) {
  this.domSnapshot = [];
  this.windowSnapshot = {};
  this._modifyPropsMap = {};
  this.proxy = window;
  this.name = name || '';
  this.running = false;
}

Sandbox.prototype.takeDOMSnapshot = function() {
  const _this = this;
  document.documentElement.childNodes.forEach(element => _this.domSnapshot.push(element));
};

Sandbox.prototype.restoreSnapshotToDOM = function() {
  document.documentElement.remove();
  document.appendChild(document.createElement('html'));
  this.domSnapshot.forEach(element => document.documentElement.appendChild(element));
};

Sandbox.prototype.takeWindowSnapshot = function() {
  this.windowSnapshot = {};

  traverseProps(window, prop => {
    this.windowSnapshot[prop] = window[prop];
  });

  Object.keys(this._modifyPropsMap).forEach(prop => {
    window[prop] = this._modifyPropsMap[prop];
  });

  this.running = true;
};

Sandbox.prototype.restoreSnapshotToWindow = function() {
  this._modifyPropsMap = {};

  traverseProps(window, prop => {
    if (window[prop] !== this.windowSnapshot[prop]) {
      this._modifyPropsMap[prop] = window[prop];
      window[prop] = this.windowSnapshot[prop];
    }
  });

  this.running = false;
};

export default Sandbox;
