import { mountAssets, removeAssets } from './flow';
import createElement from './utils/create-element';

export default function() {
  document.body.appendChild(createElement('div', { id: this.mountPointID }));

  const _this = this;

  function createMountPoint() {
    return createElement('div', { id: _this.mountPointID });
  }

  createMountPoint();

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

  function handleRouteChange(location) {
    const prevPathname = (location.state && location.state.prev && location.state.prev.pathname) || '';
    const prevPathnameArray = prevPathname.split('/');
    const nextPathnameArray = location.pathname.split('/');

    prevPathnameArray.shift();
    nextPathnameArray.shift();

    if (
      location.pathname === '/'
      || !location.state
      || (location.state && prevPathnameArray[0] === nextPathnameArray[0])
    ) {
      return;
    }

    loadModule(`/${nextPathnameArray[0]}`);
  }

  function initializeRoute(location) {
    const currentPathnameArray = location.pathname.split('/');
    currentPathnameArray.shift();

    if (location.pathname === '/') {
      return;
    }

    loadModule(`/${currentPathnameArray}`);
  }

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
        removeAssets([
          ..._this.currentRouteScriptElements,
          ..._this.currentRouteStyleElements,
        ]);

        mountPointElement.remove();

        _this.history.push(`${currentRoutePathname}${currentRouteSearch}`, { prev: _this.history.location });
      } else {
        console.error('Cannot find current route resources');
      }

      event.preventDefault();
      return false;
    }
  });
}
