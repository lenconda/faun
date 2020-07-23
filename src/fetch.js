/**
 * @file fetch.js
 * @author lenconda<i@lenconda.top>
 */

import unfetch from 'unfetch';

/**
 * a polyfill for native fetch API
 * @param {string} url
 */
export default async function(url) {
  const response = await unfetch(url);
  return response.text();
};
