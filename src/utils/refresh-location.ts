/**
 * @file /src/utils/refresh-location.ts
 * @author lenconda<i@lenconda.top>
 */

import { cloneDeep } from './lodash';
import {
  IFaunInstanceProps,
  FaunLocationType,
} from '../interfaces';

/**
 * refresh location on context when the route changes
 * @param {History<LocationState>>} location
 */
const refreshLocation = (
  props: IFaunInstanceProps,
  location: FaunLocationType,
) => {
  if (!location || !(typeof location === 'object')) {
    return;
  }

  props.currentLocation = cloneDeep(location);
};

export default refreshLocation;
