/**
 * @file refresh-location.js
 * @author lenconda<i@lenconda.top>
 */

import { cloneDeep } from './lodash';

/**
 * refresh location on context when the route changes
 * @param {History<LocationState>>} location
 */
export default function(location) {
  if (!location || !(typeof location === 'object')) {
    return;
  }

  Object.assign(this.currentLocation, cloneDeep(location));
};
