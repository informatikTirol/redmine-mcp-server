export const customFetch = async (url: string, options?: RequestInit) => {
  const headers: HeadersInit = {
    "X-Redmine-API-Key": process.env.REDMINE_API_KEY!,
    ...options?.headers,
  };

  console.error(`Fetching URL: ${url}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  console.error(`Response status: ${res.status}`);

  return res;
};
