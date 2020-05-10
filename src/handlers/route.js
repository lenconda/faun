import { isFunction } from 'lodash';

export const handleRouteChange = function(properties, location, callback) {
  const nextPathArray = location.pathname.split('/');
  const previousPath = properties.currentLocation.pathname || '';
  const previousPathArray = previousPath.split('/');

  previousPathArray.shift();
  nextPathArray.shift();

  if (previousPathArray[0] === nextPathArray[0]) {
    return;
  }

  const nextPathname = `/${nextPathArray[0]}`;
  const previousPathname = `/${previousPathArray[0]}`;

  callback && isFunction(callback) && callback(previousPathname, nextPathname);
};
