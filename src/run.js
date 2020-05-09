import {
  initMountPoint,
  initSandbox,
  initRoute,
} from './initialization';
import refreshLocation from './utils/refresh-location';
import {
  loadModule,
  unloadModule,
} from './loader';
import { handleRouteChange } from './handlers';
import { handleClick } from './listeners';

export default function(properties) {
  const _this = this;

  initMountPoint(properties.mountPointID);
  initSandbox.call(properties);

  initRoute(this.history.location, function(location, pathname) {
    refreshLocation.call(properties, location);
    loadModule(properties, pathname);
  });

  this.history.listen(location => handleRouteChange.call(properties, location, function(prev, next) {
    unloadModule.call(properties, prev);
    loadModule(properties, next);
  }));

  window.addEventListener('click', function(event) {
    handleClick(event, properties, _this.history);
  });
}
