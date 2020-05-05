export default function(tagName, attributes) {
  if (typeof tagName !== 'string' || typeof attributes !== 'object') {
    return null;
  }

  const element = document.createElement(tagName);
  Object.keys(attributes).forEach(key => {
    element[key] = attributes[key];
  });

  return element;
}
