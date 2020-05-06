export default function(traversedObject, callbackFunction) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in traversedObject) {
    if (traversedObject.hasOwnProperty(prop)) {
      callbackFunction(prop);
    }
  }
};
