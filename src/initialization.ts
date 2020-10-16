/**
 * @file /src/initialization.ts
 * @author lenconda<i@lenconda.top>
 */

import Sandbox from './sandbox';
import { isFunction } from './utils/lodash';
import {
  IFaunInstanceProps,
  FaunLocationType,
  IFaunDependency,
} from './interfaces';

/**
 * initialize the default sandbox on context
 * @param props
 */
export const initSandbox = (props: IFaunInstanceProps) => {
  if (!props.routes[0]) {
    props.routes.push({
      sandboxes: [new Sandbox('@@default')],
    });
  }
  const [defaultSandbox] = props.routes[0].sandboxes;
  defaultSandbox.takeWindowSnapshot();
};

/**
 * initialize the route
 * @param location
 * @param callback
 */
export const initRoute = (
  location: FaunLocationType,
  callback: (location: FaunLocationType, pathname: string) => void,
) => {
  const currentPathnameArray = location.pathname.split('/');
  currentPathnameArray.shift();
  const pathname = `/${currentPathnameArray[0]}`;

  callback && isFunction(callback) && callback(location, pathname);
};

/**
 * initialize the global dependencies
 * @param deps
 */
export const initGlobalDependencies = (deps: Array<IFaunDependency>) => {
  if (!Array.isArray) {
    throw new TypeError('[Faun] Param `deps` should be an array');
  }

  const globalDeps = deps.reduce((current, next) => {
    const { name, dep } = next;

    if (!name || !dep || typeof name !== 'string') {
      throw new TypeError('[Faun] Params is in a wrong type');
    }

    if (window[name]) {
      throw new ReferenceError(`[Faun] Dependence \`${name}\` already exist on \`window\``);
    }

    current[name] = dep;

    return current;
  }, {});

  Object.assign(window, globalDeps);
  return globalDeps;
};
