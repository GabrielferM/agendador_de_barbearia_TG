import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // O Prisma agora espera informações de conexão das datasources no mapa `datasources`.
  // Mapear a datasource `db` declarada em schema.prisma para a URL do env.
  datasources: {
    db: {
      url: env("DATABASE_URL"),
    },
  },
});
