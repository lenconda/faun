/**
 * @file fetch.js
 * @author lenconda<i@lenconda.top>
 */

import unfetch from 'unfetch';

export default async function(url) {
  const response = await unfetch(url);
  return response.text();
};
