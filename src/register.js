export default function(moduleInfo) {
  if (typeof moduleInfo !== 'object' || Array.isArray(moduleInfo)) {
    return this;
  }

  this.registeredModules = moduleInfo;
  return this;
}
