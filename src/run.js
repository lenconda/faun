import { mountAssets, removeAssets } from './flow';
import createElement from './utils/create-element';

export default function() {
  document.body.appendChild(createElement('div', { id: this.mountPointID }));

  const _this = this;

  function createMountPoint() {
    return createElement('div', { id: _this.mountPointID });
  }

  createMountPoint();

  function reroute(location) {
    if (!location.key || location.pathname === '/') {
      return;
    }

    const currentRouteResources = _this.registeredModules[location.pathname || ''];

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

  reroute(this.history.location);
  this.history.listen(reroute);

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
        removeAssets({
          ..._this.currentRouteScriptElements,
          ..._this.currentRouteStyleElements,
        });

        mountPointElement.remove();

        _this.history.push(`${currentRoutePathname}${currentRouteSearch}`);
      } else {
        console.error('Cannot find current route resources');
      }

      event.preventDefault();
      return false;
    }
  });
}
