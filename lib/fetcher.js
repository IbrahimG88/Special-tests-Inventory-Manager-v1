/* export const fetcher = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
};
*/

import fetch from "isomorphic-unfetch";

export const fetcher = async (url) => {
  const response = await fetch(url, {
    agent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });
  const data = await response.json();
  return data;
};
