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
      target: "./src/__generated__/handlers.ts",
      schemas: "./src/__generated__/http-schemas",
    },
  },
});
