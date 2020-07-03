/**
 * @file store.test.js
 * @author lenconda<i@lenconda.top>
 */

import Store from '../store';

const store = new Store();

test('Store.prototype.get should be a function', async () => {
  expect(store.get).toBeInstanceOf(Function);
});

test('Store.prototype.set should be a function', async () => {
  expect(store.set).toBeInstanceOf(Function);
});

test('Store.prototype.set should set values to store properly', async () => {
  store.set('a', 1);
  store.set({ b: 2, c: 3 });
  expect(store.get('a')).toEqual(1);
  expect(store.get('b')).toEqual(2);
  expect(store.get('c')).toEqual(3);
});

