/**
 * @file /src/loader.ts
 * @author lenconda<i@lenconda.top>
 */

import Sandbox from './sandbox';
import { findLastIndex } from './utils/lodash';
import {
  IFaunInstanceProps,
  FaunType,
} from './interfaces';

/**
 * load sub-application from context
 * @param props
 * @param pathname
 * @param context
 * @param action
 * @returns {Promise<void>}
 */
export const loadSubApplication = async (
  props: IFaunInstanceProps,
  pathname: string,
  context: FaunType,
  action: 'PUSH' | 'POP' | 'REPLACE',
) => {
  const currentRouteResources = props.registeredSubApplications.filter(config => {
    const activeWhen = config.activeWhen;
    if (!activeWhen) {
      return false;
    }
    if (Array.isArray(activeWhen)) {
      return activeWhen.indexOf(pathname) !== -1;
    } else if (typeof activeWhen === 'function') {
      return activeWhen(props.currentLocation || {});
    } else if (typeof activeWhen === 'string') {
      return pathname === activeWhen;
    } else if (activeWhen instanceof RegExp) {
      return activeWhen.test(pathname);
    } else {
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
        sandbox: new Sandbox(resource.name || pathname.replace('/', ''), props.id, resource.useCSSPrefix, resource.assetMatchers),
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
      let routeIndex: number;
      if (props.direction === 'forward') {
        routeIndex = props.routes.findIndex((item, index) => {
          return item.pathname === pathname && index >= props.position;
        });
      } else if (props.direction === 'backward') {
        routeIndex = findLastIndex(props.routes.slice(0, props.position), (item, index) => {
          return item.pathname === pathname && index <= props.position;
        });
      } else {
        routeIndex = -1;
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
 * @param props
 * @param prev
 * @param next
 * @param context
 * @returns {boolean}
 */
// eslint-disable-next-line max-params
export const unloadSubApplication = (
  props: IFaunInstanceProps,
  prev: string,
  next: string,
  context: FaunType,
) => {
  const currentSandboxes = props.routes[props.position].sandboxes;
  const hooks = props.hooks || null;

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
  // call unmounted hook
  hooks && hooks.unmounted && hooks.unmounted.call(context, prev, next, currentSandboxes);

  const [defaultSandbox] = props.routes[0].sandboxes;
  defaultSandbox.restoreDOMSnapshot();
  defaultSandbox.restoreWindowSnapshot();

  return true;
};
