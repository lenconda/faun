/**
 * @file fetch.test.js
 * @author lenconda<i@lenconda.top>
 */

import fetch from '../fetch';

jest.setTimeout(60000);

test('`fetch` should be a function', async () => {
  expect(fetch).toBeInstanceOf(Function);
});

test('`fetch` should request a API and return the response', async () => {
  const result = await fetch('https://api.github.com');
  expect(result).not.toBe('');
  expect(result).not.toBe(null);
});
