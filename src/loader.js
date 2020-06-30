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
export const loadModule = async function(props, pathname, context, action) {
  const currentRouteResources = props.registeredModules[pathname || ''];
  const hooks = context && context.hooks || null;

  // only if the module resources are found in context
  // the loadModule method will work
  if (currentRouteResources) {
    // check if the mount point exists
    // if not exists, then create it
    initMountPoint(props.mountPointID);

    const actionLowerCase = action && action.toLowerCase() || '';
    let sandbox;

    if (actionLowerCase === 'push') {
      sandbox = new Sandbox(pathname);
      // call loading hook
      hooks && hooks.loading && hooks.loading.call(context, pathname);
      await sandbox.create(currentRouteResources);
      props.sandboxes.splice(props.position + 1, props.sandboxes.length - props.position - 1);
      props.sandboxes.push(sandbox);
      props.position = props.sandboxes.length - 1;
    }

    if (actionLowerCase === 'pop') {
      const sandboxIndex = props.sandboxes.length - props.sandboxes.reverse().findIndex(item => item.name === pathname) - 1;
      props.sandboxes.reverse();

      if (sandboxIndex && sandboxIndex !== -1) {
        const currentSandbox = props.sandboxes[sandboxIndex];

        if (!currentSandbox) {
          return;
        }

        props.position = sandboxIndex;
        sandbox = currentSandbox;
      }
    }

    // call loaded hook
    hooks && hooks.loaded && hooks.loaded.call(context, pathname, sandbox);

    sandbox.mount();
    // call mounted hook
    hooks && hooks.mounted && hooks.mounted.call(context, pathname, sandbox);
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
  const currentSandbox = props.sandboxes[props.position];
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
  props.sandboxes[0].restoreDOMSnapshot();
  props.sandboxes[0].restoreWindowSnapshot();

  return true;
};
