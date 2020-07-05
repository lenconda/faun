/**
 * @file random.test.js
 * @author lenconda<i@lenconda.top>
 */

import random from '../random';

test('`random` should be a function', async () => {
  expect(random).toBeInstanceOf(Function);
});

test('`random` should return a string with length of 8', async () => {
  expect(random().length).toBe(8);
});
