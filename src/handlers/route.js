/**
 * @file route.js
 * @author lenconda<i@lenconda.top>
 */

import { isFunction } from '../utils/lodash';

/**
 * handle history change
 * @param {Object} props
 * @param {History<LocationState>} location
 * @param {function} callback
 */
export const handleRouteChange = function(props, location, callback) {
  const nextPathArray = location.pathname.split('/');
  const previousPath = props.currentLocation.pathname || '';
  const previousPathArray = previousPath.split('/');

  previousPathArray.shift();
  nextPathArray.shift();

  if (previousPathArray[0] === nextPathArray[0]) {
    return;
  }

  const nextPathname = `/${nextPathArray[0]}`;
  const previousPathname = `/${previousPathArray[0]}`;

  try {
    callback && isFunction(callback) && callback(previousPathname, nextPathname);
  } catch(e) {
    console.error(e);
  }
};
