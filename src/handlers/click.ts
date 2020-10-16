/**
 * @file /src/handlers/click.ts
 * @author lenconda<i@lenconda.top>
 */

/**
 * click mouse event handler
 * @param {MouseEvent} event
 * @param {Object} props
 * @param {History} history
 * @returns {boolean}
 */

import generateRandomString from '../utils/random';
import {
  FaunHistoryType,
} from '../interfaces';

export const handleClick = (event: MouseEvent, history: FaunHistoryType): boolean | void => {
  const eventTarget = event?.target as HTMLElement;
  // interceptor the a tags with attribute data-faun-link
  if (
    eventTarget instanceof HTMLAnchorElement
    && eventTarget?.hasAttribute('data-faun-link')
    && eventTarget?.host === window.location.host
  ) {
    const {
      pathname = '',
      search = '',
    } = eventTarget;
    history.push(`${pathname}${search}`, generateRandomString());
    event.preventDefault();
    return false;
  }
};
