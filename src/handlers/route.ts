/**
 * @file /src/handlers/route.ts
 * @author lenconda<i@lenconda.top>
 */

import {
  IFaunInstanceProps,
  FaunLocationType,
  FaunRouteHandlerCallback,
} from '../interfaces';

/**
 * handle history change
 * @param {Object} props
 * @param {History<LocationState>} location
 * @param {function} callback
 */
export const handleRouteChange = (
  props: IFaunInstanceProps,
  location: FaunLocationType,
  callback: FaunRouteHandlerCallback,
) => {
  const nextPathArray = location.pathname.split('/');
  const previousPath = props?.currentLocation?.pathname || '';
  const previousPathArray = previousPath.split('/');

  previousPathArray.shift();
  nextPathArray.shift();

  if (previousPathArray[0] === nextPathArray[0]) {
    return;
  }

  const nextPathname = `/${nextPathArray[0]}`;
  const previousPathname = `/${previousPathArray[0]}`;

  try {
    callback && typeof callback === 'function' && callback(previousPathname, nextPathname);
  } catch(e) {
    console.error(e);
  }
};
