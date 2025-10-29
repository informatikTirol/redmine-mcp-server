/**
 * Configuration management for Redmine MCP Server
 */

// Load .env file in development mode (only if not in production)
if (process.env.NODE_ENV !== "production") {
  try {
    const dotenv = await import("dotenv");
    dotenv.config();
  } catch (error) {
    // dotenv is optional, ignore if not available
  }
}

export interface ServerConfig {
  readOnlyMode: boolean;
  redmineUrl: string;
  redmineApiKey: string;
}

/**
 * Load configuration from environment variables
 */
const loadConfig = (): ServerConfig => {
  const readOnlyMode = process.env.REDMINE_MCP_READ_ONLY === "true";

  const redmineUrl = process.env.REDMINE_URL;
  if (!redmineUrl) {
    throw new Error("REDMINE_URL environment variable is not set");
  }

  const redmineApiKey = process.env.REDMINE_API_KEY;
  if (!redmineApiKey) {
    throw new Error("REDMINE_API_KEY environment variable is not set");
  }

  return {
    readOnlyMode,
    redmineUrl,
    redmineApiKey,
  };
};

/**
 * Get current configuration
 */
export const config = loadConfig();
