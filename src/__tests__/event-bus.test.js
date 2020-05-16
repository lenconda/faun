/**
 * @file event-bus.test.js
 * @author lenconda<i@lenconda.top>
 */

import bus from '../event-bus';
import Event from '../utils/event';

test('eventBus should be an instance of Event', async () => {
  expect(bus).toBeInstanceOf(Event);
});
