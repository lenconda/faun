/**
 * @file hooks.test.js
 * @author lenconda<i@lenconda.top>
 */

import createHooks from '../hooks';
import Sandbox from '../sandbox';
const hooks = createHooks();

test('hooks should allow adding loading hook', async () => {
  function loading(pathname) { return pathname; }
  hooks.loading = loading;
  expect(hooks.loading).toEqual(loading);
  expect(hooks.loading('loading')).toEqual(loading('loading'));
});

test('hooks should allow adding loaded hook', async () => {
  const sandbox = new Sandbox('loaded');
  const loaded = (pathname, sandbox) => ({ pathname, sandbox });
  hooks.loaded = loaded;
  expect(hooks.loaded).toEqual(loaded);
  const hooksResult = hooks.loaded('loaded', sandbox);
  const result = loaded('loaded', sandbox);
  expect(hooksResult.pathname).toEqual(result.pathname);
  expect(hooksResult.sandbox.name).toEqual(result.sandbox.name);
});

test('hooks should allow adding mounted hook', async () => {
  const sandbox = new Sandbox('mounted');
  const mounted = (pathname, sandbox) => ({ pathname, sandbox });
  hooks.mounted = mounted;
  expect(hooks.mounted).toEqual(mounted);
  const hooksResult = hooks.mounted('mounted', sandbox);
  const result = mounted('mounted', sandbox);
  expect(hooksResult.pathname).toEqual(result.pathname);
  expect(hooksResult.sandbox.name).toEqual(result.sandbox.name);
});

test('hooks should allow adding beforeUnmount hook', async () => {
  const beforeUnmount = (prev, next) => ({ prev, next });
  hooks.beforeUnmount = beforeUnmount;
  expect(hooks.beforeUnmount).toEqual(beforeUnmount);
  const hooksResult = hooks.beforeUnmount('/prev', '/next');
  const result = beforeUnmount('/prev', '/next');
  expect(hooksResult.prev).toEqual(result.prev);
  expect(hooksResult.next).toEqual(result.next);
});

test('hooks should allow adding unmounted hook', async () => {
  const sandbox = new Sandbox('unmounted');
  const unmounted = (prev, next, sandbox) => ({ prev, next, sandbox });
  hooks.unmounted = unmounted;
  expect(hooks.unmounted).toEqual(unmounted);
  const hooksResult = hooks.unmounted('/prev', '/next', sandbox);
  const result = unmounted('/prev', '/next', sandbox);
  expect(hooksResult.prev).toEqual(result.prev);
  expect(hooksResult.next).toEqual(result.next);
  expect(hooksResult.sandbox.name).toEqual(result.sandbox.name);
});

test('hooks should not allow adding not-allowed hooks', async () => {
  expect(() => {
    hooks.notAllowedHook = function() {};
  }).toThrow(ReferenceError);
});

test('hooks should not allow adding a non-function value on hooks', async () => {
  expect(() => {
    hooks.loading = 1;
  }).toThrow(TypeError);
});
