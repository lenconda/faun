import { initMountPoint } from './initialization';
import Sandbox from './sandbox';

export const loadModule = async function(props, pathname) {
  const currentRouteResources = props.registeredModules[pathname || ''];

  if (currentRouteResources) {
    initMountPoint(props.mountPointID);

    if (!props.sandboxes[pathname]) {
      const sandbox = new Sandbox(pathname);
      await sandbox.create(currentRouteResources);
      props.sandboxes[pathname] = sandbox;
    }

    props.sandboxes[pathname].mount();
  }
};

export const unloadModule = function(props, pathname) {
  const currentSandbox = props.sandboxes[pathname || ''];

  if (!currentSandbox) {
    return;
  }

  currentSandbox.unmount();
  document.getElementById(props.mountPointID).remove();
  props.defaultSandbox.restoreDOMSnapshot();
  props.defaultSandbox.restoreWindowSnapshot();
};
