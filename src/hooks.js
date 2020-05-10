import { isFunction } from 'lodash';

export default function() {
  const _HOOKS = ['loading', 'loaded', 'mounted', 'beforeUnmount', 'unmounted'];

  const hooks = {};

  return new Proxy(hooks, {
    // eslint-disable-next-line max-params
    set: function(target, property, value, receiver) {
      if (_HOOKS.indexOf(property) === -1) {
        throw new ReferenceError(`[Polyatomic] Hook with name \`${property}\` is not allowed`);
      }

      if (!isFunction(value)) {
        throw new TypeError('[Polyatomic] A hook should be a function');
      }

      Reflect.set(target, property, value);

      return true;
    },
  });
};
