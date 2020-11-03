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
  FaunErrorHandlerType,
} from './interfaces';
import {
  emitError,
} from './utils/error';
import {
  FaunDependencyError,
} from './errors';

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
export const initGlobalDependencies = (
  deps: Array<IFaunDependency>,
  errorHandler?: FaunErrorHandlerType,
) => {
  if (!Array.isArray) {
    emitError('Param `deps` should be an array', FaunDependencyError, errorHandler);
  }

  const globalDeps = deps.reduce((current, next) => {
    const { name, dep } = next;

    if (!name || !dep || typeof name !== 'string') {
      emitError('Params is in a wrong type', FaunDependencyError, errorHandler);
    }

    if (window[name]) {
      emitError(`Dependence \`${name}\` already exist on \`window\``, FaunDependencyError, errorHandler);
    }

    current[name] = dep;

    return current;
  }, {});

  Object.assign(window, globalDeps);
  return globalDeps;
};
