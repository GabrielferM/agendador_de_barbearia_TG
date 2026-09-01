import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "ts-node --esm prisma/seed/index.ts",
    path: "prisma/migrations",
  },
  // A URL é usada pelos comandos Prisma Migrate, não pelo schema.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
