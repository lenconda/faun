/**
 * create an HTML element
 * @param {string} tagName
 * @param {Object} attributes
 * @returns {HTMLElement|null}
 */

const createElement = <T extends HTMLElement>(
  tagName: string,
  attributes: Array<string>, children: Array<Node> = []
): T | null => {
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

  return element as T;
}

export default createElement;
