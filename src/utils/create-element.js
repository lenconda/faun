/**
 * create an HTML element
 * @param {string} tagName
 * @param {Object} attributes
 * @returns {HTMLElement|null}
 */

export default function(tagName, attributes, children = []) {
  if (typeof tagName !== 'string' || typeof attributes !== 'object') {
    return null;
  }

  const element = document.createElement(tagName);
  Object.keys(attributes).forEach(key => {
    element[key] = attributes[key];
  });

  if (children.length > 0) {
    children.forEach(child => element.appendChild(child));
  }

  return element;
}
