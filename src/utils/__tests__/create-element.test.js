/**
 * @file create-element.test.js
 * @author lenconda<i@lenconda.top>
 */

import createElement from '../../utils/create-element';

test('createElement should return a HTML element', async () => {
  const element = createElement('div', { id: 'root' });
  expect(element).toBeInstanceOf(HTMLElement);
  expect(element.tagName.toLowerCase()).toEqual('div');
  expect(element.getAttribute('id')).toEqual('root');
});

test('createElement should return null if passing wrong params', async () => {
  const element = createElement(true, '');
  expect(element).toBeNull();
});
