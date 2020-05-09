import { isFunction } from 'lodash';

export const handleRouteChange = function(location, callback) {
  console.log(this);
  const nextPathArray = location.pathname.split('/');
  const previousPath = this.currentLocation.pathname || '';
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
