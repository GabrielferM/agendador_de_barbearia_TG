import { defineConfig } from "orval";

const swaggerUrl = process.env.ORVAL_SWAGGER_URL ?? "http://localhost:3000/api-json";

export default defineConfig({
  api: {
    input: {
      // NestJS expõe o documento OpenAPI nesta rota ao iniciar fora de produção.
      target: swaggerUrl,
    },
    output: {
      target: "./src/api/generated.ts",
      schemas: "./src/api/models",
      client: "react-query",
      httpClient: "fetch",
      mode: "tags-split",
    },
  },
});
