/**
 * @file /src/hooks.ts
 * @author lenconda<i@lenconda.top>
 */

import { isFunction } from './utils/lodash';
import {
  IFaunLifecycleHooks,
} from './interfaces';

/**
 * a Proxy-based hooks creator
 */
export default (): IFaunLifecycleHooks => {
  const _HOOK_NAMES = ['loading', 'loaded', 'mounted', 'beforeUnmount', 'unmounted'];
  const hooks = {};

  return new Proxy(hooks, {
    // eslint-disable-next-line max-params
    set: function(target: Object, property: string, value: Function) {
      // check if the hook name is in _HOOKS
      if (_HOOK_NAMES.indexOf(property) === -1) {
        throw new ReferenceError(`[Faun] Hook with name \`${property}\` is not allowed`);
      }

      // check the value is a function or not
      if (!isFunction(value)) {
        throw new TypeError('[Faun] A hook should be a function');
      }

      Reflect.set(target, property, value);

      return true;
    },
  });
};
