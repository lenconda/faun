/**
 * @file loader.js
 * @author lenconda<i@lenconda.top>
 */

import Sandbox from './sandbox';
import { findLastIndex } from './utils/lodash';

/**
 * load sub-application from context
 * @param {Object} props
 * @param {string} pathname
 * @param {Object} context
 * @param {string} action
 * @returns {Promise<void>}
 */
export const loadSubApplication = async function(props, pathname, context, action) {
  const currentRouteResources = props.registeredSubApplications[pathname || ''];
  const hooks = context && context.hooks || null;

  // only if the sub-application resources are found in context
  // the loadSubApplication method will work
  if (currentRouteResources) {
    const actionLowerCase = action && action.toLowerCase() || '';

    if (actionLowerCase === 'push') {
      const sandbox = new Sandbox(pathname, currentRouteResources.useCSSPrefix);
      // call loading hook
      hooks && hooks.loading && hooks.loading.call(context, pathname);
      await sandbox.create(currentRouteResources);
      props.sandboxes.splice(props.position + 1, props.sandboxes.length - props.position - 1);
      props.sandboxes.push(sandbox);
      props.position = props.sandboxes.length - 1;
    }

    if (actionLowerCase === 'pop') {
      let sandboxIndex;
      if (props.direction === 'forward') {
        sandboxIndex = props.sandboxes.findIndex((item, index) => {
          return item.name === pathname && index >= props.position;
        });
      }
      if (props.direction === 'backward') {
        sandboxIndex = findLastIndex(props.sandboxes.slice(0, props.position), (item, index) => {
          return item.name === pathname && index <= props.position;
        });
      }

      if (sandboxIndex && sandboxIndex !== -1) {
        const currentSandbox = props.sandboxes[sandboxIndex];

        if (!currentSandbox) {
          return;
        }

        props.position = sandboxIndex;
      }
    }

    const currentSandbox = props.sandboxes[props.position];

    // call loaded hook
    hooks && hooks.loaded && hooks.loaded.call(context, pathname, currentSandbox);
    currentSandbox.mount();
    // call mounted hook
    hooks && hooks.mounted && hooks.mounted.call(context, pathname, currentSandbox);
  }
};

/**
 * unload sub-application
 * @param {Object} props
 * @param {string} prev
 * @param {string} next
 * @param {Object} context
 * @returns {boolean}
 */
// eslint-disable-next-line max-params
export const unloadSubApplication = function(props, prev, next, context) {
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

  props.sandboxes[0].restoreDOMSnapshot();
  props.sandboxes[0].restoreWindowSnapshot();

  return true;
};
