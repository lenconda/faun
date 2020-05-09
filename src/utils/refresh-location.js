import { cloneDeep } from 'lodash';

export default function(location) {
  if (!location || !(typeof location === 'object')) {
    return;
  }

  Object.assign(this.currentLocation, cloneDeep(location));
};
