export const handleClick = function(event, properties, history) {
  if (
    event.target.tagName.toLowerCase() === 'a'
    && event.target.hasAttribute('data-polyatomic')
    && event.target.host === window.location.host
  ) {
    const { pathname, search } = event.target;
    const currentRoutePathname = pathname || '';
    const currentRouteSearch = search || '';
    const currentRouteResources = properties.registeredModules[currentRoutePathname];

    if (currentRouteResources) {
      history.push(`${currentRoutePathname}${currentRouteSearch}`);
    } else {
      console.error('Cannot find current route resources');
    }

    event.preventDefault();
    return false;
  }
};
