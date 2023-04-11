export const fetcher = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
};
