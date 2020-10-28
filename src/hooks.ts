/**
 * @file /src/hooks.ts
 * @author lenconda<i@lenconda.top>
 */

import { isFunction } from './utils/lodash';
import {
  IFaunLifecycleHooks,
  FaunErrorHandlerType,
} from './interfaces';
import {
  FaunLifecycleError,
} from './errors';
import {
  emitError,
} from './utils/error';

/**
 * a Proxy-based hooks creator
 */
export default (errorHandler?: FaunErrorHandlerType): IFaunLifecycleHooks => {
  const _HOOK_NAMES = ['loading', 'loaded', 'mounted', 'beforeUnmount', 'unmounted'];
  const hooks = {};

  return new Proxy(hooks, {
    // eslint-disable-next-line max-params
    set: function(target: Object, property: string, value: Function) {
      // check if the hook name is in _HOOKS
      if (_HOOK_NAMES.indexOf(property) === -1) {
        emitError(`Hook with name \`${property}\` is not allowed`, FaunLifecycleError, errorHandler);
      }

      // check the value is a function or not
      if (!isFunction(value)) {
        emitError('A hook should be a function', FaunLifecycleError, errorHandler);
      }

      Reflect.set(target, property, value);

      return true;
    },
  });
};
