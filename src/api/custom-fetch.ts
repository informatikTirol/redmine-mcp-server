import { config } from "../config.js";

export const customFetch = async (url: string, options?: RequestInit) => {
  const headers: HeadersInit = {
    "X-Redmine-API-Key": config.redmineApiKey,
    ...options?.headers,
  };

  const fullUrl = new URL(url, config.redmineUrl).toString();

  console.error(`Fetching URL: ${fullUrl}`);

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.error(`Response status: ${res.status}`);

  return res;
};
