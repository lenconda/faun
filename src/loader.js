import { initMountPoint } from './initialization';
import Sandbox from './sandbox';

export const loadModule = async function(properties, pathname) {
  const currentRouteResources = properties.registeredModules[pathname || ''];

  if (currentRouteResources) {
    initMountPoint(properties.mountPointID);

    if (!properties.sandboxes[pathname]) {
      const sandbox = new Sandbox(pathname);
      await sandbox.create(currentRouteResources);
      properties.sandboxes[pathname] = sandbox;
    }

    properties.sandboxes[pathname].mount();
  }
};

export const unloadModule = function(properties, pathname) {
  const currentSandbox = properties.sandboxes[pathname || ''];

  if (!currentSandbox) {
    return;
  }

  currentSandbox.unmount();
  document.getElementById(properties.mountPointID).remove();
  properties.defaultSandbox.restoreDOMSnapshot();
  properties.defaultSandbox.restoreWindowSnapshot();
};
