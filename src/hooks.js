/**
 * @file hooks.js
 * @author lenconda<i@lenconda.top>
 */

import { isFunction } from './utils/lodash';

/**
 * a Proxy-based hooks creator
 * @returns {Proxy}
 */
export default function() {
  const _HOOKS = ['loading', 'loaded', 'mounted', 'beforeUnmount', 'unmounted'];

  const hooks = {};

  return new Proxy(hooks, {
    // eslint-disable-next-line max-params
    set: function(target, property, value, receiver) {
      // check if the hook name is in _HOOKS
      if (_HOOKS.indexOf(property) === -1) {
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
