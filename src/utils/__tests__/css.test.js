/**
 * @file css.test.js
 * @author lenconda<i@lenconda.top>
 */

import css from '../css';

test('`css` should be a function', async () => {
  expect(css).toBeInstanceOf(Function);
});

test('`css` should add a prefix to css rules', async () => {
  expect(css('.test {}', 'prefix')).toEqual('.prefix .test {}');
});

test('`css` should not add prefix to `html` selector', async () => {
  expect(css('html {}', 'prefix')).toEqual('html {}');
});
