/**
 * @file lodash.test.js
 * @author lenconda<i@lenconda.top>
 */

import { isFunction, cloneDeep } from '../../utils/lodash';

test('isFunction should only return true when passing a function', async () => {
  expect(isFunction(function() {})).toBe(true);
  expect(isFunction(1)).toBe(false);
});

test('cloneDeep should clone a new object from source object', async () => {
  const former = { a: 1, b: 2 };
  const current = cloneDeep(former);
  expect(former === current).toBe(false);
  expect(former.a).toEqual(current.a);
  expect(former.b).toEqual(current.b);
});
