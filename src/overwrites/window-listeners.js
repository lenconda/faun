import { noop } from 'lodash';

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

export default function rewriteEventListener() {
  const listenerMap = new Map();

  window.addEventListener = (type, listener, options) => {
    const listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [...listeners, listener]);
    return originalAddEventListener.call(window, type, listener, options);
  };

  window.removeEventListener = (type, listener, options) => {
    const storedTypeListeners = listenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return originalRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach(listener => window.removeEventListener(type, listener)),
    );
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;

    return noop;
  };
}