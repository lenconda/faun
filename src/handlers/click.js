/**
 * click mouse event handler
 * @param {MouseEvent} event
 * @param {Object} props
 * @param {History} history
 * @returns {boolean}
 */

export const handleClick = function(event, props, history) {
  // interceptor the a tags with attribute data-polyatomic
  if (
    event.target.tagName.toLowerCase() === 'a'
    && event.target.hasAttribute('data-polyatomic')
    && event.target.host === window.location.host
  ) {
    const { pathname, search } = event.target;
    const currentRoutePathname = pathname || '';
    const currentRouteSearch = search || '';
    const currentRouteResources = props.registeredModules[currentRoutePathname];

    if (currentRouteResources) {
      history.push(`${currentRoutePathname}${currentRouteSearch}`);
    } else {
      throw new ReferenceError(`[Polyatomic] Cannot find current route resources: ${currentRoutePathname}`);
    }

    event.preventDefault();
    return false;
  }
};
