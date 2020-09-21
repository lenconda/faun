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
  const currentRouteResources = props.registeredSubApplications.filter(config => {
    const activeWhen = config.activeWhen;
    if (!activeWhen) {
      return false;
    }
    const activeWhenType = Object.prototype.toString.call(activeWhen);
    switch (activeWhenType) {
    case '[object Array]': {
      return activeWhen.indexOf(pathname) !== -1;
    }
    case '[object Function]': {
      return activeWhen(props.currentLocation);
    }
    case '[object String]': {
      return pathname === activeWhen;
    }
    default:
      return false;
    }
  });

  const hooks = props && props.hooks || null;

  // only if the sub-application resources are found in context
  // the loadSubApplication method will work
  if (currentRouteResources) {
    const actionLowerCase = action && action.toLowerCase() || '';

    if (actionLowerCase === 'push') {
      const sandboxesList = currentRouteResources.map(resource => ({
        sandbox: new Sandbox(pathname, resource.useCSSPrefix),
        resource,
      }));

      // call loading hook
      hooks && hooks.loading && hooks.loading.call(context, pathname);
      await Promise.all(sandboxesList.map(item => (async () => {
        await item.sandbox.create(item.resource, props.appConfig);
      })()));
      props.routes.splice(props.position + 1, props.routes.length - props.position - 1);
      const routeInfo = {
        pathname,
        sandboxes: sandboxesList.map(item => item.sandbox),
      };
      if (routeInfo.sandboxes.length > 0 && props.appConfig.singular === true) {
        routeInfo.sandboxes = [routeInfo.sandboxes[0]];
      }
      props.routes.push(routeInfo);
      props.position = props.routes.length - 1;
    }

    if (actionLowerCase === 'pop') {
      let routeIndex;
      if (props.direction === 'forward') {
        routeIndex = props.routes.findIndex((item, index) => {
          return item.pathname === pathname && index >= props.position;
        });
      }
      if (props.direction === 'backward') {
        routeIndex = findLastIndex(props.routes.slice(0, props.position), (item, index) => {
          return item.pathname === pathname && index <= props.position;
        });
      }

      if (routeIndex && routeIndex !== -1) {
        const currentSandboxes = props.routes[routeIndex].sandboxes;

        if (!currentSandboxes || currentSandboxes.length === 0) {
          return;
        }

        props.position = routeIndex;
      }
    }

    const currentSandboxes = props.routes[props.position].sandboxes;

    // call loaded hook
    hooks && hooks.loaded && hooks.loaded.call(context, pathname, currentSandboxes);
    await Promise.all(currentSandboxes.map(sandbox => sandbox.mount()));
    // call mounted hook
    hooks && hooks.mounted && hooks.mounted.call(context, pathname, currentSandboxes);
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
  const currentSandboxes = props.routes[props.position].sandboxes;
  const hooks = context.hooks || null;

  if (!currentSandboxes || currentSandboxes.length === 0) {
    return true;
  }

  // call beforeUnmount hook
  if (hooks && hooks.beforeUnmount) {
    if (!hooks.beforeUnmount.call(context, prev, next)) {
      return false;
    }
  }

  currentSandboxes.forEach(sandbox => sandbox.unmount());
  // await PromisecurrentSandbox.unmount();
  // call unmounted hook
  hooks && hooks.unmounted && hooks.unmounted.call(context, prev, next, currentSandboxes);

  const [defaultSandbox] = props.routes[0].sandboxes;
  defaultSandbox.restoreDOMSnapshot();
  defaultSandbox.restoreWindowSnapshot();

  return true;
};
