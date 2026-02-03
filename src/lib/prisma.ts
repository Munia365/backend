import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const requiredEnvVars = ["DATABASE_URL", "BETTER_AUTH_URL"] as const;

const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "APP_EMAIL",
  "APP_PASS",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      ` Missing required environment variable: ${envVar}\n` +
        `Please add ${envVar} to your .env file`,
    );
  }
}

for (const envVar of optionalEnvVars) {
  if (!process.env[envVar]) {
    console.warn(
      `  Optional environment variable ${envVar} is not set. Some features may be disabled.`,
    );
  }
}


const connectionString = process.env.DATABASE_URL!;

if (
  !connectionString.startsWith("postgresql://") &&
  !connectionString.startsWith("postgres://")
) {
  throw new Error(
    " DATABASE_URL must be a valid PostgreSQL connection string\n" +
      "Expected format: postgresql://user:password@host:port/database",
  );
}


const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});


prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error(" Database connection failed:", error.message);
    process.exit(1);
  });

process.on("beforeExit", async () => {
  console.log("🔌 Disconnecting from database...");
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  console.log("\n🔌 Received SIGINT. Disconnecting from database...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🔌 Received SIGTERM. Disconnecting from database...");
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
