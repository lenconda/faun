/**
 * @file css.test.js
 * @author lenconda<i@lenconda.top>
 */

import css, { generateCSSPrefix } from '../css';

test('`css` should be a function', async () => {
  expect(css).toBeInstanceOf(Function);
});

test('`css` should add a prefix to css rules', async () => {
  expect(/^prefix/.test(css('.test { text-align: center; }', 'prefix')))
    .toBe(true);
});

test('`css` should not add prefix to `html` selector', async () => {
  expect(/^html/.test(css('html { color: #ccc; }', 'prefix'))).toBe(true);
});

test('`generateCSSPrefix` should return a specified string', async () => {
  expect(generateCSSPrefix('test-prefix', 'test-sandbox')).toEqual('data-f-test-prefix__test-sandbox');
});
