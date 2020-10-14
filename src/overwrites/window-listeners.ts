/**
 * @file /src/overwrites/window-listener.ts
 * @author lenconda<i@lenconda.top>
 * @author Kuitos
 */

import { noop } from '../utils/lodash';

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

/**
 * rewrite event listener functions on window
 * @returns {function(): (...args: any[]) => void}
 */
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

  /**
   * remove listeners and rewrites
   */
  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach(listener => window.removeEventListener(type, listener)),
    );
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;

    return noop;
  };
}
