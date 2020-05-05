import { cloneDeep } from 'lodash';

export default function(moduleInfo) {
  if (typeof moduleInfo !== 'object' || Array.isArray(moduleInfo)) {
    return this;
  }

  Object.assign(this.registeredModules, {
    ...cloneDeep(moduleInfo),
  });

  return this;
}
