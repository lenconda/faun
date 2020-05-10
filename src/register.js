/**
 * @file register.js
 * @author lenconda<i@lenconda.top>
 */

import { cloneDeep } from 'lodash';

/**
 * register modules, context is `props` in constructor
 * @param moduleInfo
 * @returns {"default"}
 */
export default function(moduleInfo) {
  // only accept Object and NOT Array
  if (typeof moduleInfo !== 'object' || Array.isArray(moduleInfo)) {
    return this;
  }

  // assign module configs to context
  Object.assign(this.registeredModules, {
    ...cloneDeep(moduleInfo),
  });
}
