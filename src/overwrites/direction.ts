/**
 * @file /src/overwrites/direction.ts
 * @author lenconda<i@lenconda.top>
 */

// Keep track of current position
let currentIndex = (history.state && history.state.index) || 0;

// Set initial index, before replacing setters
if (!history.state || !('index' in history.state)) {
  history.replaceState(
    { index: currentIndex, state: history.state },
    document.title,
  );
}

// Native functions
const getState = Object.getOwnPropertyDescriptor(History.prototype, 'state')?.get;
const { pushState, replaceState } = history;

// Detect forward and back changes
function onPopstate() {
  if (!getState) {
    return;
  }

  const state = getState.call(history);

  // State is unset when `location.hash` is set. Update with incremented index
  if (!state) {
    replaceState.call(history, { index: currentIndex + 1 }, document.title);
  }
  const index = state ? state.index : currentIndex + 1;

  const direction = index > currentIndex ? 'forward' : 'back';
  window.dispatchEvent(new Event(direction));

  currentIndex = index;
}

// Create functions which modify index
function modifyStateFunction(func: Function, n: number) {
  return (state: any, ...args: Array<any>) => {
    func.call(history, { index: currentIndex + n, state }, ...args);
    // Only update currentIndex if call succeeded
    currentIndex += n;
  };
}

// Override getter to only return the real state
function modifyStateGetter(cls: any) {
  const get = Object.getOwnPropertyDescriptor(cls.prototype, 'state')?.get;
  if (!get) {
    return;
  }

  Object.defineProperty(cls.prototype, 'state', {
    configurable: true,
    enumerable: true,
    get() {
      const _this = get.call(this);
      return _this && _this.state || '';
    },
    set: undefined,
  });
}

modifyStateGetter(History);
modifyStateGetter(PopStateEvent);
history.pushState = modifyStateFunction(pushState, 1);
history.replaceState = modifyStateFunction(replaceState, 0);
window.addEventListener('popstate', onPopstate);
