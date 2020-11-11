/**
 * @file global-namespace.test.js
 * @author lenconda<i@lenconda.top>
 */

import {
  setGlobalObject,
  getGlobalObject,
} from '../global-namespace';

test('`setGlobalObject` should add a namespace when current namespace does not exist, and add the value', async () => {
  setGlobalObject('test', 1);
  expect(window['__FAUN__']).not.toBe(null);
  expect(window['__FAUN__']['test']).toEqual(1);
});

test('`getGlobalObject` should fetch the value from global object', async () => {
  const value = getGlobalObject('test');
  expect(value).toEqual(1);
});
