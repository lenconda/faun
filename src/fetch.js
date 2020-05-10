import unfetch from 'unfetch';

export default async function(url) {
  const response = await unfetch(url);
  return response.text();
};
