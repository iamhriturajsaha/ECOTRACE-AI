import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";
import { pathToFileURL } from "url";

const dbPath = path.join(process.cwd(), "dev.db");
const dbUrl = pathToFileURL(dbPath).href;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "file:./dev.db",
  },
});
