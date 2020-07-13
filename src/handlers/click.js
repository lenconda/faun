/**
 * click mouse event handler
 * @param {MouseEvent} event
 * @param {Object} props
 * @param {History} history
 * @returns {boolean}
 */

import generateRandomString from '../utils/random';

export const handleClick = function(event, props, history) {
  // interceptor the a tags with attribute data-p-link
  if (
    event.target.tagName.toLowerCase() === 'a'
    && event.target.hasAttribute('data-p-link')
    && event.target.host === window.location.host
  ) {
    const { pathname, search } = event.target;
    const currentRoutePathname = pathname || '';
    const currentRouteSearch = search || '';
    const currentRouteResources = props.registeredSubApplications[currentRoutePathname];

    if (currentRouteResources) {
      history.push(`${currentRoutePathname}${currentRouteSearch}`, generateRandomString());
    } else {
      throw new ReferenceError(`[Destruction] Cannot find current route resources: ${currentRoutePathname}`);
    }

    event.preventDefault();
    return false;
  }
};
