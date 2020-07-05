/**
 * @file run.js
 * @author lenconda<i@lenconda.top>
 */

import {
  initSandbox,
  initRoute,
  initGlobalDependencies,
} from './initialization';
import refreshLocation from './utils/refresh-location';
import {
  loadSubApplication,
  unloadSubApplication,
} from './loader';
import { handleRouteChange, handleClick } from './handlers';
import overwriteAppendChild from './overwrites/append-child';

/**
 * essential method to start the application
 * contains the whole lifecycles, includes initialization
 * @param props
 */
export default function(props, deps) {
  const _this = this;

  overwriteAppendChild();

  if (Array.isArray(deps) && deps.length) {
    initGlobalDependencies(deps);
  }

  initSandbox.call(props);

  initRoute(this.history.location, function(location, pathname) {
    refreshLocation.call(props, location);
    loadSubApplication(props, pathname, _this, 'PUSH', _this.history.location);
  });

  // listen history change to load and unload sandboxes
  this.history.listen(function(location, action) {
    if (!location.state) {
      const { pathname = '', search = '', hash = '' } = location;
      _this.history.replace(`${pathname}${search}${hash}`, Date.now());
    }

    handleRouteChange(props, location, function(prev, next) {
      refreshLocation.call(props, _this.history.location);
      if (!unloadSubApplication(props, prev, next, _this)) {
        return;
      }
      loadSubApplication(props, next, _this, action, _this.history.location);
    });
  });

  // intercept all click events
  window.addEventListener('click', function(event) {
    handleClick(event, props, _this.history);
  });
}
