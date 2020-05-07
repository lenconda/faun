import createElement from './utils/create-element';
import { cloneDeep } from 'lodash';
import Sandbox from './sandbox';

export default function() {
  const _this = this;

  function createMountPoint() {
    return createElement('div', { id: _this.mountPointID });
  }

  function refreshLocation(location) {
    if (!location || !(typeof location === 'object')) {
      return;
    }

    Object.assign(_this.currentLocation, cloneDeep(location));
  }

  function initMountPoint() {
    if (!document.getElementById(_this.mountPointID)) {
      document.body.appendChild(createMountPoint());
    }
  }

  function initSandbox() {
    if (!_this.defaultSandbox) {
      _this.defaultSandbox = new Sandbox('default');
    }

    _this.defaultSandbox.takeDOMSnapshot();
    _this.defaultSandbox.takeWindowSnapshot();
  }

  async function loadModule(pathname) {
    const currentRouteResources = _this.registeredModules[pathname || ''];

    if (currentRouteResources) {
      if (!document.getElementById(_this.mountPointID)) {
        document.body.appendChild(createMountPoint());
      }

      if (!_this.sandboxes[pathname]) {
        const sandbox = new Sandbox(pathname);
        await sandbox.create(currentRouteResources);
        _this.sandboxes[pathname] = sandbox;
      }

      _this.sandboxes[pathname].mount();
    }
  }

  function unloadModule(pathname) {
    const currentSandbox = _this.sandboxes[pathname || ''];

    if (!currentSandbox || currentSandbox.running === false) {
      return;
    }

    currentSandbox.unmount();
    _this.defaultSandbox.restoreDOMSnapshot();
    _this.defaultSandbox.restoreWindowSnapshot();
  }

  function handleRouteChange(location) {
    const nextPathArray = location.pathname.split('/');
    const previousPath = _this.currentLocation.pathname || '';
    const previousPathArray = previousPath.split('/');

    previousPathArray.shift();
    nextPathArray.shift();

    if (previousPathArray[0] === nextPathArray[0]) {
      return;
    }

    const nextPathname = `/${nextPathArray[0]}`;
    const previousPathname = `/${previousPathArray[0]}`;

    refreshLocation(_this.history.location);

    if (_this.sandboxes[previousPathname] && !_this.sandboxes[previousPathname].running) {
      unloadModule(previousPathname);
    }

    loadModule(nextPathname);
  }

  function initRoute(location) {
    const currentPathnameArray = location.pathname.split('/');
    currentPathnameArray.shift();
    refreshLocation(location);
    loadModule(`/${currentPathnameArray[0]}`);
  }

  initMountPoint();
  initSandbox();

  initRoute(_this.history.location);
  _this.history.listen(handleRouteChange);

  window.addEventListener('click', function(event) {
    if (
      event.target.tagName.toLowerCase() === 'a'
      && event.target.hasAttribute('data-polyatomic')
      && event.target.host === window.location.host
    ) {
      const { pathname, search } = event.target;
      const currentRoutePathname = pathname || '';
      const currentRouteSearch = search || '';
      const currentRouteResources = _this.registeredModules[currentRoutePathname];

      if (currentRouteResources) {
        _this.history.push(`${currentRoutePathname}${currentRouteSearch}`);
      } else {
        console.error('Cannot find current route resources');
      }

      event.preventDefault();
      return false;
    }
  });
}
