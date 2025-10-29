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

export interface FeatureFlags {
  /** Checklists (requires redmine_checklists plugin) */
  checklists: boolean;
  /** Issue Relations */
  relations: boolean;
  /** Time Entries */
  timeEntries: boolean;
  /** Project Versions */
  versions: boolean;
}

export interface ServerConfig {
  readOnlyMode: boolean;
  redmineUrl: string;
  redmineApiKey: string;
  features: FeatureFlags;
}

/**
 * Load feature flags from environment variables
 * Default: All features enabled unless explicitly disabled
 *
 * Environment Variables:
 * - REDMINE_MCP_DISABLE_CHECKLISTS=true  - Disable checklist tools (requires plugin)
 * - REDMINE_MCP_DISABLE_RELATIONS=true   - Disable issue relations tools
 * - REDMINE_MCP_DISABLE_TIME_ENTRIES=true - Disable time entry tools
 * - REDMINE_MCP_DISABLE_VERSIONS=true    - Disable version tools
 */
const loadFeatureFlags = (): FeatureFlags => {
  return {
    checklists: process.env.REDMINE_MCP_DISABLE_CHECKLISTS !== "true",
    relations: process.env.REDMINE_MCP_DISABLE_RELATIONS !== "true",
    timeEntries: process.env.REDMINE_MCP_DISABLE_TIME_ENTRIES !== "true",
    versions: process.env.REDMINE_MCP_DISABLE_VERSIONS !== "true",
  };
};

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
    features: loadFeatureFlags(),
  };
};

/**
 * Get current configuration
 */
export const config = loadConfig();
