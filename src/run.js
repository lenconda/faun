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

export default function(props) {
  const _this = this;

  initMountPoint(props.mountPointID);
  initSandbox.call(props);

  initRoute(this.history.location, function(location, pathname) {
    refreshLocation.call(props, location);
    loadModule(props, pathname, _this);
  });

  this.history.listen(function(location) {
    handleRouteChange(props, location, function(prev, next) {
      refreshLocation.call(props, _this.history.location);
      if (unloadModule(props, prev, next, _this)) {
        loadModule(props, next, _this);
      }
    });
  });

  window.addEventListener('click', function(event) {
    handleClick(event, props, _this.history);
  });
}
