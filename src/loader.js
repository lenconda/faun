/**
 * @file loader.js
 * @author lenconda<i@lenconda.top>
 */

import { initMountPoint } from './initialization';
import Sandbox from './sandbox';

/**
 * load module from context
 * @param {Object} props
 * @param {string} pathname
 * @param {Object} context
 * @returns {Promise<void>}
 */
export const loadModule = async function(props, pathname, context) {
  const currentRouteResources = props.registeredModules[pathname || ''];
  const hooks = context && context.hooks || null;

  // only if the module resources are found in context
  // the loadModule method will work
  if (currentRouteResources) {
    // check if the mount point exists
    // if not exists, then create it
    initMountPoint(props.mountPointID);

    // if there are no sandbox matches current pathname
    // which means the module is first loaded
    // and it will create a new sandbox to load current module
    if (!props.sandboxes[pathname]) {
      const sandbox = new Sandbox(pathname);
      // call loading hook
      hooks && hooks.loading && hooks.loading.call(context, pathname);
      await sandbox.create(currentRouteResources);
      props.sandboxes[pathname] = sandbox;
      // call loaded hook
      hooks && hooks.loaded && hooks.loaded.call(context, pathname, sandbox);
    }

    props.sandboxes[pathname].mount();
    // call mounted hook
    hooks && hooks.mounted && hooks.mounted.call(context, pathname, props.sandboxes[pathname]);
  }
};

/**
 * unload module
 * @param {Object} props
 * @param {string} prev
 * @param {string} next
 * @param {Object} context
 * @returns {boolean}
 */
// eslint-disable-next-line max-params
export const unloadModule = function(props, prev, next, context) {
  const currentSandbox = props.sandboxes[prev || ''];
  const hooks = context.hooks || null;

  if (!currentSandbox) {
    return true;
  }

  // call beforeUnmount hook
  if (hooks && hooks.beforeUnmount) {
    if (!hooks.beforeUnmount.call(context, prev, next)) {
      return false;
    }
  }

  currentSandbox.unmount();
  // call unmounted hook
  hooks && hooks.unmounted && hooks.unmounted.call(context, prev, next, currentSandbox);

  // restore window and dom
  document.getElementById(props.mountPointID).remove();
  props.defaultSandbox.restoreDOMSnapshot();
  props.defaultSandbox.restoreWindowSnapshot();

  return true;
};
