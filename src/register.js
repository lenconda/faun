/**
 * @file register.js
 * @author lenconda<i@lenconda.top>
 */

import { cloneDeep } from './utils/lodash';

/**
 * register sub-applications, context is `props` in constructor
 * @param subApplicationInfo
 * @returns {"default"}
 */
export default function(subApplicationInfo) {
  // only accept Object and NOT Array
  if (typeof subApplicationInfo !== 'object' || Array.isArray(subApplicationInfo)) {
    return this;
  }

  // assign sub-application configs to context
  Object.assign(this.registeredSubApplications, {
    ...cloneDeep(subApplicationInfo),
  });
}
