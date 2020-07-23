/**
 * @file register.js
 * @author lenconda<i@lenconda.top>
 */

import { cloneDeep } from './utils/lodash';

/**
 * register sub-applications, context is `props` in constructor
 * @param subApplicationConfigMap
 * @returns {"default"}
 */
export default function(subApplicationConfigMap) {
  // only accept Object and NOT Array
  if (
    typeof subApplicationConfigMap !== 'object'
    || Array.isArray(subApplicationConfigMap)
  ) {
    return this;
  }

  // assign sub-application configs to context
  Object.assign(this.registeredSubApplications, {
    ...cloneDeep(subApplicationConfigMap),
  });
}
