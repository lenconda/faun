/**
 * @file run.js
 * @author lenconda<i@lenconda.top>
 */

import {
  initMountPoint,
  initSandbox,
  initRoute,
  initGlobalDependencies,
} from './initialization';
import refreshLocation from './utils/refresh-location';
import {
  loadModule,
  unloadModule,
} from './loader';
import { handleRouteChange } from './handlers';
import { handleClick } from './listeners';

/**
 * essential method to start the application
 * contains the whole lifecycles, includes initialization
 * @param props
 */
export default function(props, deps) {
  const _this = this;

  window.__APPEND_CHILD__ = Element.prototype.appendChild;
  Element.prototype.appendChild = function(element) {
    const childNodes = Array.prototype.slice.call(this.children);
    if (childNodes.find(node => element.isEqualNode(node))) {
      return;
    };
    return window.__APPEND_CHILD__.call(this, element);
  };

  if (Array.isArray(deps) && deps.length) {
    initGlobalDependencies(deps);
  }

  initMountPoint(props.mountPointID);
  initSandbox.call(props);

  initRoute(this.history.location, function(location, pathname) {
    refreshLocation.call(props, location);
    loadModule(props, pathname, _this);
  });

  // listen history change to load and unload sandboxes
  this.history.listen(function(location) {
    handleRouteChange(props, location, function(prev, next) {
      refreshLocation.call(props, _this.history.location);
      if (!unloadModule(props, prev, next, _this)) {
        return;
      }
      loadModule(props, next, _this);
    });
  });

  // intercept all click events
  window.addEventListener('click', function(event) {
    handleClick(event, props, _this.history);
  });
}
