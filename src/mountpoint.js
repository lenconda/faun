export default function(elementID) {
  if (!elementID || typeof elementID !== 'string') {
    return this;
  }

  this.mountPointID = elementID;
  return this;
}
