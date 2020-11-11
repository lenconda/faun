/**
 * @file /src/__tests__/faun.test.js
 * @author lenconda<i@lenconda.top>
 */

import Faun from '..';

test('`new Faun()` should create a new instance of Faun', async () => {
  const faun = new Faun();
  expect(faun).toBeInstanceOf(Faun);
});

test('`Faun.prototype.registerSubApplications` should be a function', async () => {
  const faun = new Faun();
  expect(faun.registerSubApplications).toBeInstanceOf(Function);
});

test('`Faun.prototype.run` should be a function', async () => {
  const faun = new Faun();
  expect(faun.run).toBeInstanceOf(Function);
});

test('`Faun.prototype.addGlobalDependence` should be a function', async () => {
  const faun = new Faun();
  expect(faun.addGlobalDependence).toBeInstanceOf(Function);
});
