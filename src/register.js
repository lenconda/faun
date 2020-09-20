/**
 * @file register.js
 * @author lenconda<i@lenconda.top>
 */

/**
 * register sub-applications, context is `props` in constructor
 * @param {ISubApplicationConfigMap} subApplicationConfigMap
 * @param {IHooks} hooks
 * @returns any
 */
export default function(subApplicationConfigMap, hooks) {
  // only accept Object and NOT Array
  if (!Array.isArray(subApplicationConfigMap)) {
    return this;
  }

  if (hooks && typeof hooks === 'object') {
    Object.keys(hooks).forEach(currentHookName => {
      this.hooks[currentHookName] = hooks[currentHookName];
    });
  }

  // assign sub-application configs to context
  this.registeredSubApplications = Array.from(subApplicationConfigMap || []);
}
