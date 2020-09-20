/**
 * click mouse event handler
 * @param {MouseEvent} event
 * @param {Object} props
 * @param {History} history
 * @returns {boolean}
 */

import generateRandomString from '../utils/random';

export const handleClick = function(event, props, history) {
  // interceptor the a tags with attribute data-faun-link
  if (
    event.target.tagName.toLowerCase() === 'a'
    && event.target.hasAttribute('data-faun-link')
    && event.target.host === window.location.host
  ) {
    const { pathname, search } = event.target;
    const currentRoutePathname = pathname || '';
    const currentRouteSearch = search || '';
    history.push(`${currentRoutePathname}${currentRouteSearch}`, generateRandomString());
    event.preventDefault();
    return false;
  }
};
