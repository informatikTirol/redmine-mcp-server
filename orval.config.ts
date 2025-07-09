import { defineConfig } from "orval";

export default defineConfig({
  redmine: {
    input: {
      target: "./redmine-openapi.yaml",
      filters: {
        mode: "exclude",
        tags: ["OrvalIgnore"],
      },
    },
    output: {
      mode: "single",
      client: "mcp",
      baseUrl: `$\{process.env.REDMINE_URL}`,
      target: "./src/__generated__/handlers.ts",
      schemas: "./src/__generated__/http-schemas",
    },
  },
});
