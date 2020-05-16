/**
 * @file event.test.js
 * @author lenconda<i@lenconda.top>
 */

import Event from '../../utils/event';

const event = new Event();

test('Event.prototype.has should be a function', async () => {
  expect(event.has).toBeInstanceOf(Function);
});

test('Event.prototype.on should add a subscriber', async () => {
  const subscriber = function(data) { console.log(data); };
  event.on('test', subscriber);
  expect(event.has('test', subscriber)).toBe(true);
});

test('Event.prototype.off should remove the specified subscriber', async () => {
  const subscriber = function() {};
  event.on('test', subscriber);
  event.off('test', subscriber);
  expect(event.has('test', subscriber)).toBe(false);
});
