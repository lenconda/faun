import { mountAssets, removeAssets } from './flow';
import createElement from './utils/create-element';
import { cloneDeep } from 'lodash';

export default function() {
  const _this = this;

  function createMountPoint() {
    return createElement('div', { id: _this.mountPointID });
  }

  function initLocation(location) {
    if (!location || !(typeof location === 'object')) {
      return;
    }

    Object.assign(_this.currentLocation, cloneDeep(location));
  }

  function loadModule(pathname) {
    const currentRouteResources = _this.registeredModules[pathname || ''];

    if (currentRouteResources) {
      if (!document.getElementById(_this.mountPointID)) {
        document.body.appendChild(createMountPoint());
      }

      _this.currentRouteScriptElements = currentRouteResources.scripts
        && currentRouteResources.scripts.map(src => createElement('script', { src }));
      _this.currentRouteStyleElements = currentRouteResources.styles
        && currentRouteResources.styles.map(href => createElement('link', { href, rel: 'stylesheet' }));

      mountAssets(_this.currentRouteStyleElements, document.head);
      mountAssets(_this.currentRouteScriptElements, document.body);
    }
  }

  function handleRouteChange(location, action) {
    const mountPointElement = document.getElementById(_this.mountPointID);

    const nextPathArray = location.pathname.split('/');
    const previousPath = _this.currentLocation.pathname || '';
    const previousPathArray = previousPath.split('/');

    previousPathArray.shift();
    nextPathArray.shift();

    if (previousPathArray[0] === nextPathArray[0]) {
      return;
    }

    initLocation(_this.history.location);

    removeAssets([
      ..._this.currentRouteScriptElements,
      ..._this.currentRouteStyleElements,
    ]);

    mountPointElement.remove();

    loadModule(`/${nextPathArray[0]}`);
  }

  function initializeRoute(location) {
    const currentPathnameArray = location.pathname.split('/');
    currentPathnameArray.shift();
    initLocation(location);
    loadModule(`/${currentPathnameArray}`);
  }

  document.body.appendChild(createMountPoint());

  initializeRoute(this.history.location);
  this.history.listen(handleRouteChange);

  window.addEventListener('click', function(event) {
    const mountPointElement = document.getElementById(_this.mountPointID);

    if (
      event.target.tagName.toLowerCase() === 'a'
      && (event.path && event.path.indexOf(mountPointElement) === -1)
      && event.target.host === window.location.host
    ) {
      const currentRoutePathname = event.target.pathname || '';
      const currentRouteSearch = event.target.search || '';
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
