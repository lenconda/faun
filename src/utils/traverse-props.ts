/**
 * @file /src/utils/traverse-props.ts
 * @author lenconda<i@lenconda.top>
 */

/**
 * traverse props in an object
 * @param {Object} traversedObject
 * @param {function} callbackFunction
 */
export default function(traversedObject: Object, callbackFunction: (prop: string) => void) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in traversedObject) {
    if (traversedObject.hasOwnProperty(prop)) {
      callbackFunction(prop);
    }
  }
};
