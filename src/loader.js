import { initMountPoint } from './initialization';
import Sandbox from './sandbox';

export const loadModule = async function(props, pathname, context) {
  const currentRouteResources = props.registeredModules[pathname || ''];
  const hooks = context && context.hooks || null;

  if (currentRouteResources) {
    initMountPoint(props.mountPointID);

    if (!props.sandboxes[pathname]) {
      const sandbox = new Sandbox(pathname);
      // loading
      hooks && hooks.loading && hooks.loading.call(context, pathname);
      await sandbox.create(currentRouteResources);
      props.sandboxes[pathname] = sandbox;
      // loaded
      hooks && hooks.loaded && hooks.loaded.call(context, pathname, sandbox);
    }

    props.sandboxes[pathname].mount();
    // mounted
    hooks && hooks.mounted && hooks.mounted.call(context, pathname, props.sandboxes[pathname]);
  }
};

// eslint-disable-next-line max-params
export const unloadModule = function(props, prev, next, context) {
  const currentSandbox = props.sandboxes[prev || ''];
  const hooks = context.hooks || null;

  if (!currentSandbox) {
    return;
  }

  // beforeUnmount
  if (hooks && hooks.beforeUnmount) {
    if (!hooks.beforeUnmount.call(context, prev, next)) {
      return false;
    }
  }

  currentSandbox.unmount();
  // unmounted
  hooks && hooks.unmounted && hooks.unmounted.call(context, prev, next, currentSandbox);

  document.getElementById(props.mountPointID).remove();
  props.defaultSandbox.restoreDOMSnapshot();
  props.defaultSandbox.restoreWindowSnapshot();

  return true;
};
