/**
 * @file /src/fetch.ts
 * @author lenconda<i@lenconda.top>
 */

import unfetch from 'unfetch';

/**
 * a polyfill for native fetch API
 * @param url
 */
export default async (url: string): Promise<string> => {
  const response = await unfetch(url);
  return response.text();
};
