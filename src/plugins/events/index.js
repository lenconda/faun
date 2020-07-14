/**
 * @file index.js
 * @author lenconda<i@lenconda.top>
 */

import Event from '../../event';
import { setGlobalObject, getGlobalObject } from '../../utils/global-namespace';

const eventsNamespace = '@@__POLYATOMIC_EVENTS__';

let events = getGlobalObject(eventsNamespace);

if (!events) {
  events = new Event();
  setGlobalObject(eventsNamespace, events);
}

export const install = async function(Faun) {
  Faun.prototype.events = events;
};

export default {
  install,
};
