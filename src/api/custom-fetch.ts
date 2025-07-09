export const customFetch = async (url: string, options?: RequestInit) => {
  if (!process.env.REDMINE_API_KEY) {
    throw new Error("REDMINE_API_KEY environment variable is not set");
  }

  const headers: HeadersInit = {
    "X-Redmine-API-Key": process.env.REDMINE_API_KEY!,
    ...options?.headers,
  };

  if (!process.env.REDMINE_URL) {
    throw new Error("REDMINE_URL environment variable is not set");
  }
  const fullUrl = new URL(url, process.env.REDMINE_URL).toString();

  console.error(`Fetching URL: ${fullUrl}`);

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.error(`Response status: ${res.status}`);

  return res;
};
