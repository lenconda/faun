import Event from './utils/event';
import { setGlobalObject, getGlobalObject } from './utils/global-namespace';

const eventBusNamespace = 'EVENTBUS';

let eventBus = getGlobalObject(eventBusNamespace);

if (!eventBus) {
  eventBus = new Event();
  setGlobalObject(eventBusNamespace, eventBus);
}

export default eventBus;
