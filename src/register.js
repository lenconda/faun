/**
 * @file register.js
 * @author lenconda<i@lenconda.top>
 */

/**
 * register sub-applications, context is `props` in constructor
 * @param subApplicationConfigMap
 * @returns {"default"}
 */
export default function(subApplicationConfigMap) {
  // only accept Object and NOT Array
  if (!Array.isArray(subApplicationConfigMap)) {
    return this;
  }

  // assign sub-application configs to context
  this.registeredSubApplications = Array.from(subApplicationConfigMap || []);
}
