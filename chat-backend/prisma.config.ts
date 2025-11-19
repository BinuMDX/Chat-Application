import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(__dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/chatapp",
  },
});
