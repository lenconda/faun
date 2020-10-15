/**
 * @file /src/run.ts
 * @author lenconda<i@lenconda.top>
 */

import {
  initSandbox,
  initRoute,
  initGlobalDependencies,
} from './initialization';
import refreshLocation from './utils/refresh-location';
import {
  loadSubApplication,
  unloadSubApplication,
} from './loader';
import { handleRouteChange, handleClick } from './handlers';
import './overwrites/direction';
import {
  IFaunInstanceProps,
  IFaunDependency,
  FaunType,
  FaunHistoryType,
  FaunLocationType,
} from './interfaces';

/**
 * essential method to start the application
 * contains the whole lifecycles, includes initialization
 * @param props
 * @param deps
 */
const run = (
  props: IFaunInstanceProps,
  deps: Array<IFaunDependency>,
  history: FaunHistoryType,
  context: FaunType,
) => {
  if (Array.isArray(deps) && deps.length) {
    initGlobalDependencies(deps);
  }

  initSandbox(props);

  initRoute(history.location, function(location: FaunLocationType, pathname: string) {
    refreshLocation.call(props, location);
    loadSubApplication(props, pathname, context, 'PUSH');
  });

  // listen history change to load and unload sandboxes
  history.listen((location, action) => {
    handleRouteChange(props, location, function(prev: string, next: string) {
      refreshLocation.call(props, history.location);
      if (!unloadSubApplication(props, prev, next, context)) {
        return;
      }
      loadSubApplication(props, next, context, action);
    });
  });

  // intercept all click events
  window.addEventListener('click', function(event) {
    handleClick(event, props, history);
  });
  window.addEventListener('forward', () => {
    props.direction = 'forward';
  });
  window.addEventListener('back', () => {
    props.direction = 'backward';
  });
};

export default run;
